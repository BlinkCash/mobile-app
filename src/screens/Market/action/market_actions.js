// action creators
import {
    START_LOAD_MARKET, LOAD_MARKET, END_LOAD_MARKET
} from './types'

import {
    getMarketData
} from "../../../lib/api/url";
import { apiRequest } from "../../../lib/api/api";


export const getMarket = (userId) => {

    return dispatch => {
        dispatch({type: START_LOAD_MARKET})
        apiRequest(getMarketData, 'get', {
            params: {
                USER_ID: userId
            }
        })
            .then(function (response) {
                console.log(response)
                if (response.status) {
                    dispatch({
                        type: LOAD_MARKET,
                        marketData: response.data,
                        wallet_balance:response.wallet_balance
                    })
                }

            }).catch(function (error) {
            dispatch({type: END_LOAD_MARKET})
            console.log(error)
        });
    }
}
