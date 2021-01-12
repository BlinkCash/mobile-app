import {
    END_LOAD_WALLET,
    LOAD_SYSTEM_BANKS, LOAD_SYSTEM_LOAN_PURPOSES, LOAD_WALLET, LOAD_WALLET_TRANSACTIONS, START_LOAD_WALLET
} from '../action/types';

const initialState = {
    banks: [],
    loan_purposes: [],
    loading:false,
    transactions:[]
};

/**
 * authentication reducer
 */
export default (state = initialState, action) => {
    switch (action.type) {

        case LOAD_SYSTEM_BANKS:
            return {
                ...state,
                banks: action.banks,
            }
        case LOAD_SYSTEM_LOAN_PURPOSES:
            return {
                ...state,
                loan_purposes: action.loan_purposes
            }
        case START_LOAD_WALLET:
            return {
                ...state,
                loading: true
            }
        case END_LOAD_WALLET:
            return {
                ...state,
                loading: false
            }
        case LOAD_WALLET:
            return {
                ...state,
                ...action.wallet,
                loading: false
            }
        case LOAD_WALLET_TRANSACTIONS:
            let transactions = [...action.transactions]
            return {
                ...state,
                transactions,
                loading: false
            }
        default:
            return state
    }
};
