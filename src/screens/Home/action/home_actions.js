// action creators
import {
    LOAD_HISTORY,
    START_LOAD_HISTORY,
    END_LOAD_HISTORY,
    SET_SEARCH_STATE,
    SAVE_SEARCH_PROPERTIES,
    LOAD_ACTIVE_CURRENT_LOAN,
    LOAD_SERVICE_PROVIDERS,
    LOAD_SERVICE_OPTIONS,
    START_LOAD_CURRENT_LOAN,
    END_LOAD_CURRENT_LOAN,
    START_TRANSACTION_LOAD_HISTORY,
    END_TRANSACTION_LOAD_HISTORY,
    LOAD_WALLET,
    LOAD_TRANSACTION_HISTORY,
    CHANGE_USER_TYPE,
    LOAD_AGENT_DASHBOARD,
    CLEAR_USER_DATA,
    END_GET_REFEREES,
    START_GET_REFEREES,
    LOAD_REFEREES,
    START_LOAD_DASHBOARD, END_LOAD_DASHBOARD,
    LOAD_DASHBOARD
} from './types'

import {
    getLoanHistory,
    getActiveCurrentLoan,
    getWallet, getUserProfile, getTransactHistory, getTheAgentDashboard, getAllRefereesData,
    getSavingsWallet,
    getDasboardData, getAllBanks
} from "../../../lib/api/url";
import { apiRequest } from "../../../lib/api/api";
import { updateUserData } from "../../Auth/action/auth_actions";
import { LOAD_BANKS } from "../../Wallet/action/types";



export const getAllLoanHistory = (username) => {

    return dispatch => {
        dispatch({type: START_LOAD_HISTORY})
        apiRequest(getLoanHistory(username), 'get')
            .then(function (response) {
                dispatch({
                    type: LOAD_HISTORY,
                    loanHistory: response
                })

            }).catch(function (error) {
            dispatch({type: END_LOAD_HISTORY})

            console.log(error)
        });
    }
}



export const getTransactionHistory = (username) => {
    return dispatch => {
        dispatch({type: START_TRANSACTION_LOAD_HISTORY})
        apiRequest(getTransactHistory(username), 'get')
            .then(function (response) {
                console.log(response)
                dispatch({
                    type: LOAD_TRANSACTION_HISTORY,
                    transactionHistory: response.data
                })

            }).catch(function (error) {
            dispatch({type: END_TRANSACTION_LOAD_HISTORY})
            console.log(error)
        });
    }
}


export const getReferees = (agent_code) => {
    return dispatch => {
        dispatch({type: START_GET_REFEREES})
        apiRequest(getAllRefereesData(agent_code), 'get')
            .then(function (response) {
                console.log(response)
                dispatch({
                    type: LOAD_REFEREES,
                    referees: response
                })

            }).catch(function (error) {
            dispatch({type: END_GET_REFEREES})
            console.log(error)
        });
    }
}
export const getCurrentActiveLoan = (username) => {
    return dispatch => {

        dispatch({type: START_LOAD_CURRENT_LOAN})
        apiRequest(getActiveCurrentLoan(username), 'get')
            .then(function (response) {
                dispatch({
                    type: LOAD_ACTIVE_CURRENT_LOAN,
                    activeLoan: response
                })

            }).catch(function (error) {
            dispatch({type: END_LOAD_CURRENT_LOAN})
        });
    }
}


export const clearUserData = () => {
    return {
        type: CLEAR_USER_DATA,
    }
}

export const changeUserType = (user) => {
    return {
        type: CHANGE_USER_TYPE,
        payload: user
    }
}


export const getUser = () => {

    return dispatch => {
        apiRequest(getUserProfile, 'get')
            .then(function (response) {

                let completed = 0;

                if (response.first_name) {
                    completed = completed + 0.25
                }

                if (response.avatar !== 'https://quickcredit.com.ng/app/assets/img/profile.png') {
                    completed = completed + 0.25
                }

                if (response.card_verification_status === 'VERIFIED') {
                    completed = completed + 0.25
                }

                if (response.name_of_company) {
                    completed = completed + 0.25
                }

                response.completed = completed;
                console.log(response)
                dispatch(updateUserData(response))

            }).catch(function (error) {
            console.log(error)
        });
    }
}