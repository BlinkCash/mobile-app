import {
    LOAD_SAVINGS_PRODUCTS,
    UPDATE_SAVINGS_DETAILS,
    LOAD_SAVINGS_COLLECTIONS,
    LOAD_SAVINGS_FREQUENCIES,
    LOAD_SAVINGS_REPAYMENT_METHODS,
    LOAD_SAVINGS,
    RESET_SAVINGS_DETAILS, START_LOAD_SAVINGS, END_LOAD_SAVINGS
} from '../action/types';
import { CLEAR_USER_DATA } from "../../Home/action/types";
const initialState = {
    loading:false,
    savingsProducts:[],
    savingsDetails:{},
    savingsCollectionMethods:[],
    savingsFrequencies:[],
    savingsRepaymentMethods:[],
    savings:[]
};

/**
 * authentication reducer
 */
export default (state = initialState, action) => {
    switch (action.type) {
        case LOAD_SAVINGS_PRODUCTS:
            let savingsProducts = [...action.savingsProducts]

            return {
                ...state,
                savingsProducts,
                loading: false
            }
        case LOAD_SAVINGS_COLLECTIONS:
            let savingsCollectionMethods = [...action.savingsCollectionMethods]

            return {
                ...state,
                savingsCollectionMethods,
                loading: false
            }
        case LOAD_SAVINGS:
            let savings = [...action.savings]

            return {
                ...state,
                savings,
                loading: false
            }
        case START_LOAD_SAVINGS:
            return {
                ...state,
                loading: true
            }
        case END_LOAD_SAVINGS:
            return {
                ...state,
                loading: false
            }
        case LOAD_SAVINGS_FREQUENCIES:
            let savingsFrequencies = [...action.savingsFrequencies]

            return {
                ...state,
                savingsFrequencies,
                loading: false
            }
        case RESET_SAVINGS_DETAILS:
            return {
                ...state,
                savingsDetails:{},
                loading: false
            }
        case LOAD_SAVINGS_REPAYMENT_METHODS:
            let savingsRepaymentMethods = [...action.savingsRepaymentMethods]

            return {
                ...state,
                savingsRepaymentMethods,
                loading: false
            }
        case UPDATE_SAVINGS_DETAILS:
            return {
                ...state,
                savingsDetails:{
                    ...state.savingsDetails,
                    ...action.savingsDetails
                },
                loading: false
            }

        default:
            return state
    }
};
