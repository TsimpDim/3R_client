import * as actionTypes from './actionTypes'
import axios from 'axios'

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
}

export const authSuccess = token => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        token: token,
    }
}

export const authFail = error => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    }
}

export const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('expirationDate');
    return {
        type: actionTypes.AUTH_LOGOUT
    }
}


export const checkAuthTimeout = expirationTime => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime * 1000)
    }
}

export const authLogin = (username, password, cancelToken) => {
    return dispatch => {
        dispatch(authStart());
        return axios.post('http://127.0.0.1:8000/api/auth/login/', {
            username: username,
            password: password,
        },{
            cancelToken: cancelToken
        })
        .then(res =>{
            const token = res.data.key;
            const expirationDate = new Date(new Date().getTime() + 3600 * 1000)
            localStorage.setItem('token', token);
            localStorage.setItem('expirationDate',expirationDate);
            dispatch(authSuccess(token));
            dispatch(checkAuthTimeout(3600));
        })
        .catch(err => {
            if(axios.isCancel(err))
                console.log('Call aborted');
            else
                dispatch(authFail(err));
        })
    }

}

    export const authSignup = (username, email, password1, password2) => {
        return dispatch => {
            dispatch(authStart());
            return axios.post('http://127.0.0.1:8000/api/auth/registration/', {
                username: username,
                email: email,
                password1: password1,
                password2: password2
            })
            .then(res =>{
                const token = res.data.key;
                const expirationDate = new Date(new Date().getTime() + 3600 * 1000)
                localStorage.setItem('token', token);
                localStorage.setItem('expirationDate',expirationDate);
                dispatch(authSuccess(token));
                dispatch(checkAuthTimeout(3600));
    
            })
            .catch(err => {
                dispatch(authFail(err));
            })
        }
    }


    export const authCheckState = () => {
        return dispatch => {
            const token = localStorage.getItem('token');
            if (token === undefined){
                dispatch(logout());
            } else {
                const expirationDate = new Date(localStorage.getItem('expirationDate'));
                if (expirationDate <= new Date() ){
                    dispatch(logout());
                } else {
                    dispatch(authSuccess(token));
                    dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000))
                }
             }
        }
    }