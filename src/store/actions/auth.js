import * as actionTypes from './actionTypes';
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

export const authLogin = (username, password) => {
    return dispatch => {
        dispatch(authStart());
        return axios.post('http://127.0.0.1:8000/api/auth/login/', {
            username: username,
            password: password
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




    export const resAddStart = () => {
        return {
            type: actionTypes.RES_ADD_START
        }
    }

    export const resAddSuccess = () => {
        return {
            type: actionTypes.RES_ADD_SUCCESS
        }
    }

    export const resAddFail = error => {
        return {
            type: actionTypes.RES_ADD_FAIL,
            error: error
        }
    }


    export const addRes = (title, url, note, tags) => {
        return dispatch => {
            dispatch(resAddStart());
            return axios.post('http://127.0.0.1:8000/api/res/add', {
                title:title,
                url:url,
                note:note,
                tags:tags
            })
            .then(res => {
                dispatch(resAddSuccess());
            })
            .catch(err => {
                dispatch(resAddFail());
            })
        }
    }