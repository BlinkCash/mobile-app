import BILLS__TYPES from '../action/bills_types';

const initialState = {
    fetchingDataPlans:false,
    dataPlans:{}
};

/**
 * authentication reducer
 */
export default (state = initialState, action) => {

    switch (action.type) {
        case BILLS__TYPES.DATA_PLANS_REQUEST_START:
            return {
                ...state,
                fetchingDataPlans: action.isRequest
            }
        case BILLS__TYPES.DATA_PLANS_REQUEST_END:
            return {
                ...state,
                fetchingDataPlans: action.isRequest
            }

        case BILLS__TYPES.SAVE_DATA_PLANS:
            let dataPlans = {...state.dataPlans}
            dataPlans[action.provider] = action.dataPlans
            return {
                ...state,
                dataPlans: {...dataPlans}
            }
        default:
            return state
    }
};
