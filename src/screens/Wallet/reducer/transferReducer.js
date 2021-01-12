import TRANSFER_TYPES from '../action/transfer_types';

const initialState = {
    transferBanks: [],
    isRequest:false,
    eCashAccounts:{},
    transferAccounts:[]
};

/**
 * authentication reducer
 */
export default (state = initialState, action) => {

    switch (action.type) {
        case TRANSFER_TYPES.REQUEST_START:
            return {
                ...state,
                isRequest: action.isRequest
            }
        case TRANSFER_TYPES.REQUEST_END:
            return {
                ...state,
                isRequest: action.isRequest
            }
        case TRANSFER_TYPES.ECASH_REQUEST_START:
            return {
                ...state,
                isEcashRequest: action.isRequest
            }
        case TRANSFER_TYPES.ECASH_REQUEST_END:
            return {
                ...state,
                isEcashRequest: action.isRequest
            }
        case TRANSFER_TYPES.TRANSFER_ECASH_ACCOUNTS_SAVE:
            let accounts = {...state.eCashAccounts}
            accounts[action.payload.country] = action.payload.accounts
            return {
                ...state,
                eCashAccounts: {...accounts}
            }
        case TRANSFER_TYPES.LOAD_TRANSFER_BANKS:
            return {
                ...state,
                transferBanks: action.transferBanks
            }
        case TRANSFER_TYPES.RESET_TRANSFER_DATA:
            return {
                ...initialState
            }
        case TRANSFER_TYPES.SAVE_BENEFICIARY_ACCOUNTS:
            return {
                ...state,
                transferAccounts: action.transferAccounts
            }
        default:
            return state
    }
};
