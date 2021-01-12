// action creators
import {
    END_LOAD_LOANS, LOAD_LOAN_DETAILS, LOAD_LOAN_OPTIONS,
    LOAD_LOANS, CLEAR_LOAN_DETAILS,
    START_LOAD_LOANS, UPDATE_USER_LOAN_DETAILS, LOAD_RUNNING_LOAN
} from './types'

import {
    getAllUserCards,
    getBankList,
    getLoanOptions,
    getLoans, getPreferences,
    getRunningLoan,
    getUserLoanDetails
} from "../../../lib/api/url";
import { apiRequest } from "../../../lib/api/api";
import moment from "moment";


export const getAllLoans = () => {
    return dispatch => {
        dispatch({type: START_LOAD_LOANS})
        apiRequest(getLoans, 'get')
            .then(function (response) {
                console.log(response)
                let data = response.data || []

                if(response.status === 'success'){
                    dispatch({
                        type: LOAD_LOANS,
                        loans: data
                        // loans: []
                    })
                    // if(data.length){
                    //    dispatch(getLoanDetails(data[0].id))
                    // }
                }

            }).catch(function (error) {
            dispatch({type: END_LOAD_LOANS})
            console.log(error.response)
        });
    }
}

export const getTheRunningLoan = () => {
    return dispatch => {
        dispatch({type: START_LOAD_LOANS})
        apiRequest(getRunningLoan, 'get')
            .then(function (response) {
                console.log(response)

                if(response.status === 'success'){
                    dispatch({
                        type: LOAD_RUNNING_LOAN,
                        runningLoan: response.data
                    })

                    let profile = response.data.loan_profile || {}
                    // profile.work_start_date = moment(profile.work_start_date).format('DD/MM/YYYY'),
                    dispatch(updateUserLoanDetails({
                        ...profile
                    }))

                    dispatch({
                        type: LOAD_LOAN_DETAILS,
                        loanDetails: response.data
                    })

                }

            }).catch(function (error) {
            // dispatch({type: END_LOAD_LOANS})
            if(error.response.status === 404){
                dispatch({
                    type: LOAD_LOAN_DETAILS,
                    loanDetails: {}
                })
            }
            console.log(error.response)
        });
    }
}


export const getLoanDetails = (id) => {
    console.log(id)
    return dispatch => {
        // dispatch({type: START_LOAD_LOANS})
        apiRequest(getUserLoanDetails(id), 'get')
            .then(function (response) {

                if(response.status === 'success'){
                    if(response.data.loan_profile){
                        // dispatch(updateUserLoanDetails({
                        //     ...response.data.loan_profile
                        // }))

                        let profile = response.data.loan_profile || {}
                        // profile.work_start_date = moment(profile.work_start_date).format('DD/MM/YYYY'),
                            dispatch(updateUserLoanDetails({
                                ...profile
                            }))
                    }
                    dispatch({
                        type: LOAD_LOAN_DETAILS,
                        loanDetails: response.data
                    })
                }

            }).catch(function (error) {
            // dispatch({type: END_LOAD_LOANS})
            console.log(error.response)
        });
    }
}
export const getAllLoanOptions = () => {
    return dispatch => {
        // dispatch({type: START_LOAD_LOANS})
        apiRequest(getLoanOptions, 'get')
            .then(function (response) {
                console.log(response)

                if(response.status === 'success'){
                    dispatch({
                        type: LOAD_LOAN_OPTIONS,
                        loanOptions: response.data
                    })
                }

            }).catch(function (error) {
            // dispatch({type: END_LOAD_LOANS})
            console.log(error.response)
        });
    }
}

export const updateUserLoanDetails = (userLoanDetails) => {
    return {
        type:UPDATE_USER_LOAN_DETAILS,
        userLoanDetails
    }
}

export const clearLoanDetails = () => {
    return {
        type:CLEAR_LOAN_DETAILS
    }
}