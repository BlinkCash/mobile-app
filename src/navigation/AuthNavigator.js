import React from 'react';
import { createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Signup from '../screens/Auth/Signup';
import Login from '../screens/Auth/Login';
import LoginPinPad from '../screens/Auth/LoginPinPad';
import ForgotPassword from '../screens/Auth/ForgotPassword'


import IntroScreen from '../screens/Auth/Intro';
import ChangePin from "../screens/Home/ChangePin";
import EnterNumber from "../screens/Auth/EnterNumber";
import EnterOtp from "../screens/Auth/EnterOtp";
import EnterPassword from "../screens/Auth/EnterPassword";
import EnterBVN from "../screens/Auth/EnterBVN";
import EnterBvnDetails from "../screens/Auth/EnterBvnDetails";
import EnterEmail from "../screens/Auth/EnterEmail";
import EnterPicture from "../screens/Auth/EnterPicture";
import EnterBankDetails from "../screens/Auth/EnterBankDetails";
import LoginBiometric from "../screens/Auth/LoginBiometric";
import ConfirmBankDetails from "../screens/Auth/ConfirmBankDetails";
import EnterPin from "../screens/Auth/EnterPin";
import OnboardingSuccess from "../screens/Auth/OnboardingSuccess";
import EnterNumberForgotPassword from "../screens/ForgotPassword/EnterNumber";
import EnterOtpForgotPassword from "../screens/ForgotPassword/EnterOtp";
import EnterForgotPassword from "../screens/ForgotPassword/EnterPassword";
import ConfirmPin from "../screens/Auth/ConfirmPin";
import Success from "../screens/Loan/Success";
// import IntroStartScreen from '../screens/Auth/IntroStart';




export const IntroStack = createSwitchNavigator({
    // IntroStart: {screen: IntroStartScreen},
    IntroScreen: {screen: IntroScreen},
}, {
    navigationOptions: {
        header: null
    }
})
export default createStackNavigator({
    Intro: {screen: IntroStack},
    EnterNumber: {screen: EnterNumber},
    EnterOtp: {screen: EnterOtp},
    EnterPassword: {screen: EnterPassword},
    EnterBVN: {screen: EnterBVN},
    EnterBvnDetails: {screen: EnterBvnDetails},
    EnterEmail: {screen: EnterEmail},
    EnterPicture: {screen: EnterPicture},
    EnterBankDetails: {screen: EnterBankDetails},
    Login: {screen: Login},
    LoginBiometric: {screen: LoginBiometric},
    ConfirmBankDetails: {screen: ConfirmBankDetails},
    EnterPin: {screen: EnterPin},
    ConfirmPin: {screen: ConfirmPin},
    OnboardingSuccess: {screen: OnboardingSuccess},
    EnterNumberForgotPassword: {screen: EnterNumberForgotPassword},
    EnterOtpForgotPassword: {screen: EnterOtpForgotPassword},
    EnterForgotPassword: {screen: EnterForgotPassword},
    SuccessForgot: Success,

    // LoginPinPad: {screen: LoginPinPad},
    // Signup: {screen: Signup},
    // ChangePin: ChangePin,
    // ForgotPassword: {screen: ForgotPassword},
}, {
    navigationOptions: {
        header: null
    }
});
