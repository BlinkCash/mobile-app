// action creators
import {
    LOAD_SYSTEM_BANKS,
    LOAD_SYSTEM_LOAN_PURPOSES,
    START_LOAD_WALLET,
    END_LOAD_WALLET,
    LOAD_WALLET,
    LOAD_WALLET_TRANSACTIONS
} from './types'

import { getAllBanks, getAllLoanPurposes, getBankList, getWallet, getWalletTransactions } from "../../../lib/api/url";
import { apiRequest } from "../../../lib/api/api";



export const getWalletBalance= () => {

    return dispatch => {
        dispatch({type:START_LOAD_WALLET})
        apiRequest(getWallet, 'get')
            .then(function (response) {
                console.log(response)
                if(response.status === 'success'){
                    dispatch({
                        type: LOAD_WALLET,
                        wallet: response.data
                    })
                }


            }).catch(function (error) {
                console.log(error.response)
            dispatch({type: END_LOAD_WALLET})
        });
    }
}

export const getAllWalletTransactions= () => {

    return dispatch => {
        // dispatch({type:START_LOAD_WALLET})
        apiRequest(getWalletTransactions, 'get')
            .then(function (response) {
                console.log(response)
                if(response.status === 'success'){
                    dispatch({
                        type: LOAD_WALLET_TRANSACTIONS,
                        transactions: response.data || []
                    })
                }


            }).catch(function (error) {
            console.log(error.response)
            // dispatch({type: END_LOAD_WALLET})
        });
    }
}

export const getBanks= () => {

    return dispatch => {
        // dispatch({type: START_LOAD_HISTORY})
        apiRequest(getAllBanks, 'get')
            .then(function (response) {
                console.log(response)
                if(response.success){
                    dispatch({
                        type: LOAD_SYSTEM_BANKS,
                        banks: response.data
                    })
                }else{
                    dispatch({
                        type: LOAD_SYSTEM_BANKS,
                        banks:[]
                    })
                }


            }).catch(function (error) {
            console.log(error.response)
            // dispatch({type: END_LOAD_HISTORY})
        });
    }
}



export const getPurposes= () => {

    return dispatch => {
        // dispatch({type: START_LOAD_HISTORY})
        apiRequest(getAllLoanPurposes, 'get')
            .then(function (response) {
                console.log(response)
                if(response.success){
                    dispatch({
                        type: LOAD_SYSTEM_LOAN_PURPOSES,
                        loan_purposes: response.data
                    })
                }else{
                    dispatch({
                        type: LOAD_SYSTEM_LOAN_PURPOSES,
                        loan_purposes:[]
                    })
                }


            }).catch(function (error) {
            console.log(error.response)
            // dispatch({type: END_LOAD_HISTORY})
        });
    }
}

