import constants from './constants';
import { Alert } from 'react-native'
import creators from './creators';
// import { USER_PROFILE, retrieveItem, USER_TOKEN, storeItem ,USER_PASSWORD,  YOUR_SECRET_KEY_HERE, alertCTRL } from '../../../utils/helpers';
import RNFetchBlob from 'rn-fetch-blob'
// import { getUserProfile, checkProfile } from '../../home/_duck/actions';

//
// export function updateProfile(profile, navigation, callBack) {
//     console.warn(profile)
//     return (dispatch) => {
//         creators.updatePersonalDetails(profile)
//         .then(data => {
//             alertCTRL('Profile  Update', 'Profile has been updated successfully')
//             dispatch(checkProfile(true))
//             dispatch({ type: constants.user.SET_DATA, data })
//             dispatch(getUserProfile(callBack))
//             navigation.navigate('employmentInfo', {navigation: navigation})
//         })
//         .catch(error => {
//              if(error === 'Network Error'){
//                 callBack()
//                 alertCTRL('Profile  Error', error)
//                 return;
//             }
//             console.warn(error)
//             alertCTRL('Profile  Error', 'All fields are required. Make sure you have completed all fields')
//             dispatch({ type: constants.user.SET_ERROR, error })
//             callBack()
//         });
//     };
// }
//
//
// export function updateBank(bank, callBack) {
//     return (dispatch) => {
//         creators.updateBankDetails(bank)
//         .then(data => {
//             console.warn(data)
//             dispatch(checkProfile(true))
//             dispatch({ type: constants.user.SET_DATA, data })
//             dispatch(getUserProfile(callBack))
//             alertCTRL('Bank  Update', 'Bank details has been updated successfully')
//         })
//         .catch(error => {
//             console.warn(error)
//             if(error === 'Network Error'){
//                 callBack()
//                 alertCTRL('Bank Update Error', error)
//                 return;
//             }
//             alertCTRL('Bank Update  Error', 'All fields are required. Make sure you have completed all fields')
//
//             dispatch({ type: constants.user.SET_ERROR, error })
//             callBack()
//         });
//     };
// }
//
//
// export function updateAvatar(img, callBack) {
//     return (dispatch) => {
//
//
//
//     retrieveItem(USER_TOKEN).then(data => {
//
//     const path = img.replace("file://", "");
//
//     const uploadData = [];
//
//     RNFetchBlob.fetch(
//       "PUT",
//       "https://quickcredit.com.ng/app/api/me/avatar",
//       {
//         'Content-Type': 'image/jpeg',
//         Authorization: `Bearer ${JSON.parse(data).token}`
//       },
//       RNFetchBlob.wrap(path)
//     ).then(response => {
//         dispatch(checkProfile(true))
//         console.log(response.data)
//         if(response.data){
//             dispatch(getUserProfile(callBack))
//             alertCTRL('Passport Upload', 'Passport upload successful')
//         }else{
//             callBack(error)
//             alertCTRL('Passport Upload', 'Ooops!, Something went wrong, please try again')
//         }
//     })
// })}
//
//
// }
//
//
//
//
// export function updateEmployment(employment, navigation, callBack) {
//     console.warn(navigation)
//     return (dispatch) => {
//         creators.updateEmploymentDetails(employment)
//         .then(data => {
//             dispatch(checkProfile(true))
//             navigation.navigate('bankInfo')
//             dispatch({ type: constants.employment.SET_DATA, data })
//             alertCTRL('Profile  Update', 'Employement details has been updated successfully')
//             dispatch(getUserProfile(callBack))
//             navigation.navigate('bankInfo')
//         })
//         .catch(error => {
//             if(error === 'Network Error'){
//                 alertCTRL('Employment Update  Error', 'Network Error')
//             }else if(error.line){
//                 dispatch(getUserProfile(callBack))
//                 alertCTRL('Profile  Update', 'Employement details has been updated successfully')
//             }else{
//                 alertCTRL('Profile  Error', 'All fields are required. Make sure you have completed all fields')
//             }
//             dispatch({ type: constants.user.SET_ERROR, error })
//             callBack()
//         });
//     };
// }
//
//
// export function updatePin(pin, callBack) {
//     return (dispatch) => {
//         creators.updatePinDetails(pin)
//         .then(data => {
//
//             console.warn(pin)
//             if(data.success){
//                 storeItem(USER_PASSWORD, JSON.stringify(pin.password))
//             alertCTRL('Pin Update', 'Pin update was successfull')
//             } else{
//                 alertCTRL('Pin Error', data)
//             }
//             // console.warn(JSON.stringify(data).success)
//             // console.warn(JSON.stringify(data))
//
//
//             callBack()
//         })
//         .catch(error => {
//             if(error === 'Network Error'){
//                 callBack()
//                 alertCTRL('Pin  Error', error)
//                 return;
//             }
//             console.warn(pin.password)
//             console.warn(error)
//             callBack()
//             if(!error.line){
//                 alertCTRL('Pin  Error', 'Pin update was not successfull')
//             }else{
//                 storeItem(USER_PASSWORD, JSON.stringify(pin))
//                 console.warn(pin.password)
//                 alertCTRL('Pin Update', 'Pin update was successfull')
//             }
//
//         });
//     };
// }
//
//
// export function getBank(callback) {
//     return (dispatch) => {
//         creators.getAllBanks()
//         .then(data => {
//             console.log(data)
//             dispatch({ type: constants.bank.SET_DATA, data })
//             callback()
//         })
//         .catch(error => {
//             console.log(error)
//             dispatch({ type: constants.bank.SET_ERROR, error })
//             callback()
//
//         });
//     };
// }
//
//
// export function checkBvn(bvn, firstName, lastName, phone, clearBvn, callback) {
//     return (dispatch) => {
//         creators.verifyBvn(bvn)
//         .then(data => {
//
//             if(!lastName && !phone){
//                 clearBvn()
//                 alertCTRL('BVN Verification Error', 'Please go back and fill Personal Details first before Bank Details')
//             }else{
//              if(JSON.parse(JSON.parse(data.bvn_details).message  === 'Unable to resolve BVN')){
//                 clearBvn()
//                 alertCTRL('BVN Verification Error', 'Unable to resolve BVN. Please check your details and try again')
//             }else{
//
//
//                 if(JSON.parse(data.bvn_details).last_name.toLowerCase() === lastName.toLowerCase() && JSON.parse(data.bvn_details).first_name.toLowerCase() === firstName.toLowerCase()){
//
//                     console.warn(JSON.parse(data.bvn_details).message)
//                     if(JSON.parse(data.bvn_details).message === 'BVN resolved'){
//                         alertCTRL('BVN Verification',   `${JSON.parse(data.bvn_details).first_name} ${JSON.parse(data.bvn_details).last_name}` )
//                     }
//
//
//                     if(JSON.parse(data.bvn_details).mobile.toString() === phone.toString()){
//                           dispatch({ type: constants.bvn.SET_DATA, data: JSON.parse(data.bvn_details) })
//                     }else{
//                           clearBvn()
//                           alertCTRL('BVN Verification Error', 'The phone number on your BVN does not match the phone number you have provided')
//                     }
//                 }else{
//                     clearBvn()
//                     alertCTRL('BVN Verification Error', 'The name on your BVN does not match the name you have provided')
//                 }
//             }
//
//             }
//             callback()
//
//         })
//         .catch(error => {
//             if(error === 'Network Error'){
//                 callBack()
//                 alertCTRL('BVN  Error', error)
//                 return;
//             }
//             callback()
//             console.warn(JSON.stringify(error))
//             clearBvn()
//             alertCTRL('BVN Error', error)
//         });
//
//     };
// }
//
//
//
// export function checkAccount(params, clearAccount, callback) {
//     return (dispatch) => {
//         creators.verifyAccount(params)
//         .then(data => {
//             console.warn(data)
//             callback()
//
//             if(data === `Account Number Couldn't be resolved`){
//                 callback()
//                 clearAccount()
//                 alertCTRL('Account Number Verification Error', data)
//             }else{
//
//                 alertCTRL('Account Number Verification', `${data}`)
//             }
//         })
//         .catch(error => {
//             callback()
//             console.warn(error)
//             if(error === 'Network Error'){
//                 callBack()
//                 alertCTRL('Account Number Error', error)
//                 return;
//             }
//             alertCTRL('Account Number Error', error)
//         });
//
//     };
// }




// export function storeCardOneResponse(data) {
//     return (dispatch) => {
//             dispatch({ type: constants.paystack1.SET_DATA, data })
//     };
// }
//
//
//
// export function storeCardTwoResponse(data) {
//     return (dispatch) => {
//             dispatch({ type: constants.paystack2.SET_DATA, data })
//     };
// }
//









