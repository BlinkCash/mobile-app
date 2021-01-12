import {
    END_LOAD_LOANS,
    LOAD_LOAN_DETAILS,
    LOAD_LOAN_OPTIONS,
    LOAD_LOANS,
    START_LOAD_LOANS,
    UPDATE_USER_LOAN_DETAILS,
    CLEAR_LOAN_DETAILS,
    LOAD_RUNNING_LOAN
} from '../action/types';
import { CLEAR_USER_DATA } from "../../Home/action/types";
const initialState = {
    loading:false,
    loans:[],
    loanOptions:[],
    userLoanDetails:{},
    loanDetails:{},
};

/**
 * authentication reducer
 */
export default (state = initialState, action) => {
    switch (action.type) {
        case START_LOAD_LOANS:
            return {
                ...state,
                loading: true
            }
        case END_LOAD_LOANS:
            return {
                ...state,
                // loans:[],
                loading: false
            }
        case LOAD_LOANS:
            let loans = [...action.loans]
            console.log(loans)

            return {
                ...state,
                loans,
                loading: false
            }
        case LOAD_RUNNING_LOAN:
            return {
                ...state,
                runningLoan:{...action.runningLoan},
                loading: false
            }
        case LOAD_LOAN_DETAILS:
            return {
                ...state,
                loanDetails:{
                    // ...state.loanDetails,
                    ...action.loanDetails
                },
                loading: false
            }
        case LOAD_LOAN_OPTIONS:
            return {
                ...state,
                loanOptions:[ ...action.loanOptions],
                loading: false
            }
        case UPDATE_USER_LOAN_DETAILS:
            return {
                ...state,
                userLoanDetails:{
                    ...state.userLoanDetails,
                    ...action.userLoanDetails
                },
                loading: false
            }
        case CLEAR_LOAN_DETAILS:
            let st = {...state}
            st.userLoanDetails = {}
            return {
                ...st
            }
        default:
            return state
    }
};
