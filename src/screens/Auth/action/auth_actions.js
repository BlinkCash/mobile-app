// action creators
import {
    USER_LOGIN_SUCCESS,
    USER_LOGOUT,
    FORGOT_PW_START,
    FORGOT_PW_ERROR,
    UPDATE_USER_DATA,
    RESET_AUTH_DATA
} from './types'

import {RESET_ACCOUNT_DATA} from "../../Account/action/types";
import { axiosInstance } from "../../../lib/api/axiosClient";


export const handleForgotPassword = userDetails => {
    return dispatch => {
        dispatch({type: FORGOT_PW_START});
        axiosInstance
            .post('/users/forgot', {email: userDetails.email})
            .then(response => forgotPasswordSuccess(dispatch, response))
            .catch(err => dispatch({type: FORGOT_PW_ERROR, payload: err}));
    };
};

const forgotPasswordSuccess = (dispatch, response) => {
    dispatch({
        type: FORGOT_PW_SUCCESS,
        payload: response.data.message
    });
};


export const loginUserSuccess = (data) => {

    return dispatch => {
        // dispatch(resetCache())
        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data
        })
    }
};


export const resetCache = () => {
    return dispatch => {
        dispatch({type: RESET_AUTH_DATA})
        dispatch({type: RESET_ACCOUNT_DATA})
    }
};





export const logoutUserSuccess = () => {
    return {
        type: USER_LOGOUT
    };
};

export const updateUserData = (data) => {
    return {
        type: UPDATE_USER_DATA,
        payload: data
    };
};
