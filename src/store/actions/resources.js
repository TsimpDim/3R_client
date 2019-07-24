import * as actionTypes from './actionTypes'
import axios from 'axios'

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
        return axios.post('http://localhost:8000/api/resources/', {
            title:title,
            url:url,
            note:(!note ? undefined : note), // Do not send if empty
            tags:(tags ? tags.split(',') : undefined), // Split into array first (see model)
        },{
            headers:{
                "Authorization": "Token " + localStorage.getItem('token'),
            }
        }).then(res=> {
            dispatch(resAddSuccess());

            // Update resources
            // ...

            
        }).catch(err => {
            dispatch(resAddFail(err));
        })
    }
}