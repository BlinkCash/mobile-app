import {
    LOAD_HISTORY,
    START_LOAD_HISTORY,
    END_LOAD_HISTORY,
    LOAD_ACTIVE_CURRENT_LOAN,
    START_LOAD_CURRENT_LOAN,
    END_LOAD_CURRENT_LOAN,
    LOAD_WALLET,
    LOAD_SAVINGS_WALLET,
    START_TRANSACTION_LOAD_HISTORY,
    END_TRANSACTION_LOAD_HISTORY,
    LOAD_TRANSACTION_HISTORY,
    CHANGE_USER_TYPE,
    LOAD_AGENT_DASHBOARD,
    CLEAR_USER_DATA,
    END_GET_REFEREES,
    START_GET_REFEREES,
    LOAD_REFEREES, LOAD_AGENT_WALLET, START_LOAD_DASHBOARD, END_LOAD_DASHBOARD, LOAD_DASHBOARD
} from '../action/types';
const initialState = {
    "loading": false
};

/**
 * authentication reducer
 */
export default (state = initialState, action) => {
    switch (action.type) {
        case START_LOAD_DASHBOARD:
            return {
                ...state,
                loading: true
            }
        case END_LOAD_DASHBOARD:
            return {
                ...state,
                loading: false
            }
        case LOAD_DASHBOARD:
            return {
                ...state,
                ...action.dashBoardData,
                loading: false
            }

        case CLEAR_USER_DATA:
            return {
                ...initialState,
            }

        case LOAD_TRANSACTION_HISTORY:
            return {
                ...state,
                transactionHistory:action.transactionHistory,
                loadingTransactionHistory: false
            }
        default:
            return state
    }
};
