// action creators
import {
   LOAD_BANKS,LOAD_CARDS,END_LOAD_BANKS,END_LOAD_CARDS,START_LOAD_BANKS,START_LOAD_CARDS,LOAD_PREFERENCES
} from './types'

import {
    getAllUserBanks, getAllUserCards, getPreferences
} from "../../../lib/api/url";
import { apiRequest } from "../../../lib/api/api";
import { LOAD_LOANS } from "../../Loan/action/types";



export const getAllBanks = () => {

    return dispatch => {
        dispatch({type: START_LOAD_BANKS})
        apiRequest(getAllUserBanks, 'get')
            .then(function (response) {
                console.log(response)
                if(response.status === 'success'){
                    dispatch({
                        type: LOAD_BANKS,
                        banks: response.data
                    })
                }


            }).catch(function (error) {
            dispatch({type: END_LOAD_BANKS})

            console.log(error)
        });
    }
}


export const getTheWhatsappNumber = () => {

    return dispatch => {
        apiRequest(getPreferences, 'get',{
            params:{
                type:"whatsapp_number"
            }
        })
            .then(function (response) {
                console.log(response)
                console.log('whatsapp')

                if(response.status === 'success'){
                    dispatch({
                        type: LOAD_PREFERENCES,
                        whatsapp_number: response.data.value
                    })
                    // if(data.length){
                    //    dispatch(getLoanDetails(data[0].id))
                    // }
                }

            }).catch(function (error) {
            console.log(error.response)
        });
    }
}


export const getAllCards = () => {
    return dispatch => {
        dispatch({type: START_LOAD_CARDS})
        apiRequest(getAllUserCards, 'get')
            .then(function (response) {
                console.log(response)

                if(response.status === 'success'){
                    dispatch({
                        type: LOAD_CARDS,
                        cards: response.data
                    })
                }

            }).catch(function (error) {
            dispatch({type: END_LOAD_CARDS})
            console.log(error.response)
        });
    }
}
