// action creators
import {

    LOAD_SAVINGS_PRODUCTS,
    LOAD_SAVINGS_COLLECTIONS,
    UPDATE_SAVINGS_DETAILS,
    LOAD_SAVINGS_FREQUENCIES,
    LOAD_SAVINGS_REPAYMENT_METHODS, LOAD_SAVINGS, START_LOAD_SAVINGS, END_LOAD_SAVINGS, RESET_SAVINGS_DETAILS
} from './types'

import {
    getAllUserCards,
    getBankList, getFrequencies,
    getLoanOptions,
    getLoans, getMethods,
    getRepaymentMethods, getSavings,
    getUserLoanDetails
} from "../../../lib/api/url";
import { apiRequest } from "../../../lib/api/api";
import {getProducts} from "../../../lib/api/url";
import { UPDATE_USER_LOAN_DETAILS } from "../../Loan/action/types";


export const getSavingsProducts = () => {
    return dispatch => {
        // dispatch({type: START_LOAD_LOANS})
        apiRequest(getProducts, 'get')
            .then(function (response) {
                console.log(response)
                let data = response.data || []

                if(response.status === 'success'){
                    dispatch({
                        type: LOAD_SAVINGS_PRODUCTS,
                        savingsProducts: data
                        // loans: []
                    })
                }

            }).catch(function (error) {
            // dispatch({type: END_LOAD_LOANS})
            console.log(error.response)
        });
    }
}

export const getSavingsCollections = () => {
    return dispatch => {
        // dispatch({type: START_LOAD_LOANS})
        apiRequest(getMethods, 'get')
            .then(function (response) {
                console.log(response)
                let data = response.data || []

                if(response.status === 'success'){
                    dispatch({
                        type: LOAD_SAVINGS_COLLECTIONS,
                        savingsCollectionMethods: data
                        // loans: []
                    })
                }

            }).catch(function (error) {
            // dispatch({type: END_LOAD_LOANS})
            console.log(error.response)
        });
    }
}


export const getSavingsFrequencies= () => {
    return dispatch => {
        // dispatch({type: START_LOAD_LOANS})
        apiRequest(getFrequencies, 'get')
            .then(function (response) {
                console.log(response, '========>>>>>>>>>>>>>')
                let data = response.data || []

                if(response.status === 'success'){
                    dispatch({
                        type: LOAD_SAVINGS_FREQUENCIES,
                        savingsFrequencies: data
                        // loans: []
                    })
                }

            }).catch(function (error) {
            // dispatch({type: END_LOAD_LOANS})
            console.log(error.response)
        });
    }
}

export const getSavingsRepaymentMethods= () => {
    return dispatch => {
        // dispatch({type: START_LOAD_LOANS})
        apiRequest(getRepaymentMethods, 'get')
            .then(function (response) {
                console.log(response)
                let data = response.data || []

                if(response.status === 'success'){
                    dispatch({
                        type: LOAD_SAVINGS_REPAYMENT_METHODS,
                        savingsRepaymentMethods: data
                        // loans: []
                    })
                }

            }).catch(function (error) {
            // dispatch({type: END_LOAD_LOANS})
            console.log(error.response)
        });
    }
}


export const getMySavings= () => {
    return dispatch => {
        dispatch({type: START_LOAD_SAVINGS})
        apiRequest(getSavings, 'get')
            .then(function (response) {
                console.log(response)
                let data = response.data || []

                if(response.status === 'success'){
                    dispatch({
                        type: LOAD_SAVINGS,
                        savings: data
                        // loans: []
                    })
                }

            }).catch(function (error) {
            dispatch({type: END_LOAD_SAVINGS})
            console.log(error.response)
        });
    }
}


export const updateSavingsDetails = (savingsDetails) => {
    return {
        type:UPDATE_SAVINGS_DETAILS,
        savingsDetails
    }
}

export const resetSavingsDetails = () => {
    return {
        type:RESET_SAVINGS_DETAILS
    }
}