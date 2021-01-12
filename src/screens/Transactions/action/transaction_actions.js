// action creators
import {
    START_LOAD_TRANSACTIONS, END_LOAD_TRANSACTIONS, LOAD_TRANSACTIONS
} from './types'

import { getAllUserCards, getBankList, getLoanOptions, getTransactions, getUserLoanDetails } from "../../../lib/api/url";
import { apiRequest } from "../../../lib/api/api";


export const getAllTransactions = () => {
    return dispatch => {
        dispatch({type: START_LOAD_TRANSACTIONS})
        apiRequest(getTransactions, 'get')
            .then(function (response) {
                console.log(response)

                if(response.status === 'success'){
                    dispatch({
                        type: LOAD_TRANSACTIONS,
                        transactions: response.data
                    })
                }

            }).catch(function (error) {
            dispatch({type: END_LOAD_TRANSACTIONS})
            console.log(error.response)
        });
    }
}