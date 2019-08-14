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
    return {
        type: actionTypes.AUTH_LOGOUT
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
            localStorage.setItem('token', token);
            dispatch(authSuccess(token));
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
                localStorage.setItem('token', token);
                dispatch(authSuccess(token));    
            })
            .catch(err => {
                dispatch(authFail(err));
            })
        }
    }


    export const authCheckState = () => {
        return dispatch => {
            const token = localStorage.getItem('token');
            if (token === undefined)
                dispatch(logout());
            else
                dispatch(authSuccess(token));
        }
    }
    