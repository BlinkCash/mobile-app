import { Platform } from 'react-native';

let environment = 'prod';

const generateEnvVariables = () => {
    if (environment === 'dev'){
        return {
            baseUrl:'https://blinkcashapi.herokuapp.com/api/v1',
            utilityBaseUrl:'https://v2-test.lendsqr.com/api/v1',
            walletBaseUrl:'https://baines-wallet.herokuapp.com/api/v1',
            frontendUrl:'https://quickcredit.com.ng/test',
            _payStackApiKeys: 'pk_test_36fc18e976546bd2549c78c2dc7e97d8ee014144',
        }
    } else {
        return {
            baseUrl:'https://app.blinkcash.ng/api/v1',
            utilityBaseUrl:'https://v2-test.lendsqr.com/api/v1',
            walletBaseUrl:'https://app.blinkcash.ng/api/v1',
            frontendUrl:'https://quickcredit.com.ng/app',
            _payStackApiKeys: 'pk_live_95eada85a938a45d55dc008bd487df713ff2f009'
        }
    }
}

export default  generateEnvVariables;

