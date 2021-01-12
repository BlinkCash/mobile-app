import {
    LOAD_BANKS, LOAD_CARDS, END_LOAD_BANKS, END_LOAD_CARDS, START_LOAD_BANKS, START_LOAD_CARDS, RESET_ACCOUNT_DATA
} from '../action/types';
const initialState = {
    "loadingCards": false,
    "loadingBanks": false,
    cards:[],
    banks:[],
};

/**
 * authentication reducer
 */
export default (state = initialState, action) => {
    switch (action.type) {
        case START_LOAD_CARDS:
            return {
                ...state,
                loadingCards: true
            }
        case END_LOAD_CARDS:
            return {
                ...state,
                cards:[],
                loadingCards: false
            }
        case LOAD_CARDS:
            return {
                ...state,
                cards:[ ...action.cards],
                loadingCards: false
            }

        case START_LOAD_BANKS:
            return {
                ...state,
                loadingBanks: true
            }
        case END_LOAD_BANKS:
            return {
                ...state,
                loadingBanks: false
            }
        case LOAD_BANKS:
            return {
                ...state,
                banks:[...action.banks],
                loadingBanks: false
            }
        case RESET_ACCOUNT_DATA:
            return {
                ...initialState
            }
        default:
            return state
    }
};
