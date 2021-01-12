import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    AsyncStorage, Platform,
    Switch,
    Dimensions,
    KeyboardAvoidingView,
    Keyboard,
    Modal, TouchableWithoutFeedback, Image, StyleSheet
} from 'react-native';
import { connect } from 'react-redux';
import NavigationService from "../../../NavigationService";
import { FloatingLabelInput } from "../../components/Input/FloatingLabelInput";
import Header from '../../components/Header/Header';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import {resetCache} from "./action/auth_actions";


import {
    handleForgotPassword,
    resetAuthData, loginUserSuccess, getExtraDetails,
} from './action/auth_actions';
import {
    ButtonWithBackgroundText,
    ButtonWithBackgroundBottom
} from '../../components/Button/Buttons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { axiosInstance } from "../../lib/api/axiosClient";
import {
    postLogin,
    postRegister,
    checkfull_names,
    postAuthInit,
    postConfirmOtp,
    postAddPin,
    postBankDetails
} from "../../lib/api/url";
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { withNavigationFocus } from 'react-navigation';
import { formStyles } from "../../../assets/styles/styles";
import { HeaderText } from "../../components/HeaderText/HeaderText";
import { showToast, hideToast } from "../../components/Toast/actions/toastActions";
import { scale } from "../../lib/utils/scaleUtils";
import * as WebBrowser from "expo-web-browser";
import { Colors } from "../../lib/constants/Colors";
import { LoaderText } from "../../components/Loader/Loader";
import { apiRequest } from "../../lib/api/api";
import {clearLoanDetails} from "../Loan/action/loan_actions";


const ACCESS_TOKEN = 'access_token';

class Login extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);

        const {navigation} = this.props;
        const email = navigation.getParam('email', this.props.auth.email);

        this.state = {
            pin: ''
        }
    }


    componentDidMount() {
    }


    async storeToken(accessToken) {
        try {
            await AsyncStorage.setItem(ACCESS_TOKEN, accessToken);
            this.getToken();
        } catch (error) {
            console.log('while storing token something went wrong');
        }
    }

    getToken = async () => {
        try {
            let token = await AsyncStorage.getItem(ACCESS_TOKEN);
            console.log(`token for the app is is is ${token}`);
        } catch (error) {
            console.log('something went wrong');
        }
    }

    onhandleRegister = () => {
        Keyboard.dismiss();
        let {pin} = this.state;

        if (this.validate()) return;


        this.setState({
            loading: true,
            modalLoader: true
        }, () => {
            apiRequest(postAddPin, 'post', {
                "pin": pin
            })

                .then(res => {
                    this.setState({
                        loading: false
                    }, () => {
                        console.log(res)
                        if(res.status ==='success'){
                            this.storeToken(res.data.token);
                            this.props.clearLoanDetails()
                            this.props.resetCache()
                            this.props.loginUserSuccess({
                                ...res.data,
                                access_token:res.data.token,
                                phone:res.data.phone_number,
                                stage_id:res.data.stage_id,
                                activated:res.data.activated
                            })
                            this.props.navigation.navigate('OnboardingSuccess')
                        }else{
                            this.setState({
                                formError: res.message
                            })
                        }
                        // this.props.navigation.navigate('Login')
                        // this.props.showToast('Registration Complete. Please check your email for a confirmation link', 'success')
                    })
                })
                .catch(error => {
                    console.log(error.response)
                    //
                    if (error.response) {
                        this.setState({
                            formError: error.response.data.message
                        })
                    } else {
                        this.setState({
                            formError: error.message
                        })
                    }
                    this.setState({
                        loading: false
                    })
                });
        })
    };

    renderButton = () => {
        const {loading} = this.state;
        return (
            <ButtonWithBackgroundBottom
                disabled={loading}
                onPress={() => this.onhandleRegister()}
                style={{alignSelf: 'flex-end', width: '100%'}}

            >
                {loading && (<ActivityIndicator size="large" color="#fff"/>)}
                {!loading && (<ButtonWithBackgroundText>{'Confirm PIN'}</ButtonWithBackgroundText>)}
            </ButtonWithBackgroundBottom>
        );
    };

    onChangePassword = (pin) => {
        this.setState({
            pin,
            pin_error:'',
            formError: ''
        }, () => {
            if (this.state.pin.length === 4) {
                this.onhandleRegister();
            }
        })
    }

    render() {
        const {navigate} = this.props.navigation;
        const {email, password, full_name, phone, confirm_password} = this.state;
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center'
            }}
            >
                <View
                    style={{
                        flex: 1
                    }}
                >
                    <LoaderText visible={this.state.loading} desciption={'Creating your PIN...'}/>
                    <KeyboardAvoidingView
                        style={{backgroundColor: 'transparent', flex: 1}}
                        // resetScrollToCoords={{x: 0, y: 0}}
                        contentContainerStyle={formStyles.container}
                        // scrollEnabled={true}
                        // keyboardShouldPersistTaps={'handled'}
                        // enableOnAndroid={true}
                        // alwaysBounceVertical={false}
                        // bounces={false}
                        behavior="padding" enabled
                    >
                        <Header leftIcon={"ios-arrow-back"}
                                onPressLeftIcon={() => this.props.navigation.goBack()}/>

                        <View style={[formStyles.auth_form, {flex: 1}]}>
                            <Text style={styles.title}>Confirm  Authorization PIN for your transactions</Text>
                            <Text style={[formStyles.formError]}>{this.state.formError}</Text>
                            <View style={{marginTop: scale(0)}}>

                                <View style={{marginTop: scale(70), width: '100%', alignItems: 'center'}}>
                                    <SmoothPinCodeInput
                                        cellStyle={{
                                            borderBottomWidth: 2,
                                            borderColor: this.state.formError || this.state.pin_error?"#CA5C55":'gray',
                                            marginBottom: scale(50)
                                        }}
                                        password
                                        // mask="﹡"
                                        mask={<View style={{
                                            width: 10,
                                            height: 10,
                                            borderRadius: 25,
                                            backgroundColor: 'black',
                                        }}/>}
                                        codeLength={4}
                                        // onFulfill={this.onhandleLogin}
                                        cellStyleFocused={{
                                            borderColor: 'black',
                                        }}
                                        value={this.state.pin}
                                        // password={true}
                                        autoFocus={true}
                                        onTextChange={password => this.onChangePassword(password)}
                                    />
                                    <Text style={[formStyles.error,{width:'100%', textAlign:'center'}]}>{this.state.pin_error}</Text>
                                </View>

                            </View>
                            <View style={{flex: 1, flexDirection: 'row', marginBottom: scale(10)}}>
                                {this.renderButton()}
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </View>
        );
    }

    validate = () => {

        let pin_from_last_page = this.props.navigation.getParam('pin', '')

        let error = false;
        if (this.state.pin.length < 4) {
            this.setState({
                pin_error: "Please enter a 4-digit PIN",
            })
            error = true;
        }
        if (this.state.pin !== pin_from_last_page) {
            this.setState({
                pin_error: "Your PINs do not match",
            })
            error = true;
        }
        return error
    }


}

const mapStateToProps = (state, ownProps) => {
    return {
        auth: state.authentication
    };
};

const mapDispatchToProps = {
    loginUserSuccess,
    handleForgotPassword,
    resetAuthData,
    showToast,
    getExtraDetails,
    resetCache,
    hideToast,
    clearLoanDetails
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withNavigationFocus(Login));

const styles = StyleSheet.create({
    title: {
        fontSize: scale(24),
        color: Colors.greyText,
        // textAlign: 'center',
        fontFamily: "graphik-medium",
        lineHeight: scale(32)
        // marginTop: scale(24),
    },
})