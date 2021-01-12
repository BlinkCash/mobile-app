import axios from 'axios';
import { AsyncStorage } from "react-native";
import { USER_LOGOUT } from "../../screens/Auth/action/types";
import { store } from "../../../App";
import NavigationService from '../../../NavigationService';
import env from '../../../env.js'

import { showToast } from "../../components/Toast/actions/toastActions";

const ACCESS_TOKEN = 'access_token';


// const CancelToken = axios.CancelToken;
// const source = CancelToken.source();


const baseApiCall = async attrs => {
    let headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };
    // some comment


    let token = await AsyncStorage.getItem(ACCESS_TOKEN);
    let utility_service_header = await AsyncStorage.getItem('utility_service_header');


    if (utility_service_header) {
        headers['accessToken'] = utility_service_header;
    }
    const accessToken = store.getState().authentication.access_token;
    //TODO: remove and replace with correct value above
    // if (token) {
    headers['Authorization'] = `Bearer ${token}`
    console.log(accessToken)
    // }

    const axiosInstance = axios.create({
        headers,
        // cancelToken: source.token
    });

    return axiosInstance;
};

export const cancelRequest = () => {
    source.cancel('Operation canceled due to new request.')

}

const apiCall = async (url, httpMethod, body, additionalParams) => {
    const axiosInstance = await baseApiCall();
    switch (httpMethod) {
        case 'post':
        case 'put':
        case 'patch':
            return axiosInstance[httpMethod](url, body, additionalParams);
        case 'get':
            return axiosInstance[httpMethod](url, body);
        case 'delete':
            return axiosInstance[httpMethod](url);
        default:
            return axiosInstance[httpMethod](url);
    }
};

const apiRequest = async (url, httpMethod, body = {}, additionalParams = {}) => {
    return new Promise(function (resolve, reject) {
        apiCall(url, httpMethod, body, additionalParams)
            .then(response => {
                if (response.data.status === 401) {
                    // store.dispatch({type: USER_LOGOUT, removeAccessToken: true})
                    AsyncStorage.removeItem('access_token');
                    NavigationService.navigate('Login');
                    return
                }
                if (response.status < 400) {
                    if (response.data.status >= 400) {
                        // not really success so we reject
                        reject(response.data);
                    } else {
                        // not an error so respond
                        resolve(response.data);
                    }
                } else {
                    // we reject for now
                    reject(response.data);
                }
            })
            .catch(err => {
                if (axios.isCancel(err)) {
                    console.log('Request canceled', err);
                }
                // console.log(err.request)
                if (err.message) {
                    // store.dispatch(showToast(err.message, 'error'))
                }
                console.log(err.response)
                if (err.response) {
                    if (err.response.status === 401) {
                        // store.dispatch({type: USER_LOGOUT, removeAccessToken: true})
                        AsyncStorage.removeItem('access_token');
                        NavigationService.navigate('Login');
                    }
                    reject(err);
                }
                reject(err);
            });
    });
};

export { apiRequest };

