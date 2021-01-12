import BILLSUI from './bills_types';

export const dataPlansRequestStart = () => {
    return  {
        type: BILLSUI.DATA_PLANS_REQUEST_START,
        isRequest: true,

    };
}

export const dataPlansRequestEnd = () => {
    return {
        type: BILLSUI.DATA_PLANS_REQUEST_END,
        isRequest: false,
    };
}

