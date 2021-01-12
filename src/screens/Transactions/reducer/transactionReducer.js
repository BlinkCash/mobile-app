import {
    END_LOAD_TRANSACTIONS, LOAD_TRANSACTIONS, START_LOAD_TRANSACTIONS
} from '../action/types';
const initialState = {
    loading:false,
    transactions:[]
};

/**
 * authentication reducer
 */
export default (state = initialState, action) => {
    switch (action.type) {
        case START_LOAD_TRANSACTIONS:
            return {
                ...state,
                loading: true
            }
        case END_LOAD_TRANSACTIONS:
            return {
                ...state,
                transactions:[],
                loading: false
            }
        case LOAD_TRANSACTIONS:
            return {
                ...state,
                transactions:[ ...action.transactions],
                loading: false
            }
        default:
            return state
    }
};
