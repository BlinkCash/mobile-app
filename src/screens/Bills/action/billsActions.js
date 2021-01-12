import * as requestUI from "./billsUIActions"

//TODO: refresh dashboard action
import { apiRequest } from "../../../lib/api/api";
import { postTransferFunds, postAddBeneficiary } from "../../../lib/api/url";
import NavigationService from '../../../../NavigationService';
import BILLSTYPES from './bills_types';

import { showToast } from "../../../components/Toast/actions/toastActions";
// import { validateCustomerOnCheckout } from "../../Bills/action/billActions";
// import { getMyECashBalance } from '../../Ecash/action/eCashActions';
import Constants from 'expo-constants';
// import {saveActiveBillerService, saveActiveBillerOptions, getCustomerIds} from "../../Bills/action/billActions";
import {getDataPlansByAirtime} from "../../../lib/api/url";

export const fetchDataPlanOptions = (provider) => {
    return dispatch => {

        dispatch(requestUI.dataPlansRequestStart());
        apiRequest(getDataPlansByAirtime(provider), 'get')
            .then(function (response) {
                dispatch(requestUI.dataPlansRequestEnd());


                console.log(response)
                if (response.Status === "error") {
                    dispatch(showToast(response.Message, 'error'))
                } else {
                  dispatch(saveDataPlans(provider,response.Data))
                }

            }).catch(function (error) {
                console.log(error.response)
            dispatch(showToast('Unable to process your request at the moment, please try again.', 'error'))
            dispatch(requestUI.dataPlansRequestEnd());
            // if (error.response.status === 500) {
            //     dispatch(showToast('Unable to process your request at the moment, please try again.', 'error'))
            // } else {
            //     if (error.response && error.response.data.description) {
            //         dispatch(showToast(error.response.data.description, 'error'))
            //     }
            //     else {
            //         dispatch(showToast('Unable to process your request at the moment, please try again.', 'error'))
            //     }
            // }
        });
    }
}



export const saveDataPlans = (provider, plans) => {
    return {
        type: BILLSTYPES.SAVE_DATA_PLANS,
        dataPlans: plans,
        provider,
    }
}
