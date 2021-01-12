import {
    START_LOAD_MARKET,
    END_LOAD_MARKET, LOAD_MARKET
} from '../action/types';
const initialState = {
    "loading": false,
    marketData:[],
    wallet_balance:0
};

/**
 * authentication reducer
 */
export default (state = initialState, action) => {
    switch (action.type) {
        case START_LOAD_MARKET:
            return {
                ...state,
                loading: true
            }
        case END_LOAD_MARKET:
            return {
                ...state,
                loading: false
            }
        case LOAD_MARKET:
            return {
                ...state,
                marketData:[...action.marketData],
                wallet_balance:action.wallet_balance || 0,
                loading: false
            }
        default:
            return state
    }
};
