import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    AsyncStorage, Platform,
    TextInput,
    Dimensions,
    ImageBackground,
    Keyboard,
    Modal, TouchableWithoutFeedback, Image
} from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

import { connect } from 'react-redux';
import NavigationService from "../../../NavigationService";
import { FloatingLabelInput } from "../../components/Input/FloatingLabelInput";
import Header from '../../components/Header/Header';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import { clearUserData } from "../Home/action/home_actions";


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
import { postLogin, getUserProfile } from "../../lib/api/url";
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { withNavigationFocus } from 'react-navigation';
import { formStyles } from "../../../assets/styles/styles";
import { HeaderText } from "../../components/HeaderText/HeaderText";
import { showToast, hideToast } from "../../components/Toast/actions/toastActions";
import { scale, verticalScale } from "../../lib/utils/scaleUtils";
import { resetCache } from "./action/auth_actions";
import { Colors } from "../../lib/constants/Colors";
import { LoaderText } from "../../components/Loader/Loader";


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
            modalLoader: false,
            passwordShow: false,
            email,
            password: '',
            registerModalVisible: false,
            forgotPasswordModalVisible: false,
            loading: false,
            showSuccessModal: false,
            fingerprintEnabled: false,
            rememberMeChecked: true,
            location: {
                coords: {}
            }
        }
    }


    async componentDidMount() {
        let {status} = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({
                errorMessage: 'Permission to access location was denied',
            });
            Alert.alert('Permissions', `You'll need to provide permissions to login`);
            return
            // Alert.alert('', `Permissions were denied`);
        }
        let location = await Location.getCurrentPositionAsync({});
        this.setState({
            location
        })
    }


    async storeToken(accessToken) {
        try {
            await AsyncStorage.setItem(ACCESS_TOKEN, accessToken);
            this.getToken();
        } catch (error) {
            console.log('while storing token something went wrong');
        }
    }

    async getToken() {
        try {
            let token = await AsyncStorage.getItem(ACCESS_TOKEN);
            console.log(`token for the app is is is ${token}`);
        } catch (error) {
            console.log('something went wrong');
        }
    }

    renderButton = () => {
        const {loading} = this.state;
        return (
            <ButtonWithBackgroundBottom
                disabled={loading}
                onPress={() => this.onhandleLogin(false)}
                style={{marginTop: scale(30), width: '100%'}}

            >
                {loading && (<ActivityIndicator size="large" color="#fff"/>)}
                {!loading && (<ButtonWithBackgroundText>{'Login'}</ButtonWithBackgroundText>)}
            </ButtonWithBackgroundBottom>
        );
    };

    onChangePassword = (password) => {
        this.setState({
            password
        }, () => {
            if (this.state.password.length === 4) {
                this.onhandleLogin();
            }
        })
    }
    onhandleLogin = async () => {
        const email = this.props.navigation.getParam('email', '');


        Keyboard.dismiss();
        let {password} = this.state;

        // if (this.validate()) return;

        console.log(this.state.location)
        let token = ''
        this.setState({
            loading: true,
            modalLoader: true
        }, () => {
            axiosInstance
                .post(postLogin, {
                        "username": this.props.auth.username,
                        // "username": email,
                        "password": password,
                        longitude: Number(this.state.location.coords.longitude.toFixed(6)),
                        latitude: Number(this.state.location.coords.latitude.toFixed(6))
                    }, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                )
                .then(res => {

                    this.props.clearUserData();
                    if (res.status !== 200) {
                        this.setState({
                            loading: false,
                        })
                        this.props.showToast(res.data.message, 'error')
                    } else {

                        token = res.data.token;
                        console.log(token)
                        return axiosInstance.get(getUserProfile, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        })
                    }

                })
                .then(response => {
                    this.setState({
                        loading: false
                    })
                    this.storeToken(token);
                    let userData = response.data;
                    userData.access_token = token;

                    this.props.loginUserSuccess(userData);
                    this.props.navigation.navigate('Home')
                    // NavigationService.reset('Main')
                })
                .catch(error => {
                    console.log(error)
                    if (error.response) {
                        this.props.showToast(error.response.data[Object.keys(error.response.data)[0]], 'error')
                        console.log(error.response)
                    } else {
                        this.props.showToast(error.message, 'error')
                    }
                    this.setState({
                        loading: false,
                        modalLoader: false
                    })
                });
        })
    };


    render() {
        const {navigate} = this.props.navigation;
        const {email, password} = this.state;
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center'
            }}
            >
                {!!this.state.loading && (
                    <LoaderText desciption={"Verifying Pin..."} visible={this.state.loading}/>
                )}
                <KeyboardAwareScrollView
                    style={{backgroundColor: 'transparent'}}
                    resetScrollToCoords={{x: 0, y: 0}}
                    contentContainerStyle={formStyles.container}
                    scrollEnabled={true}
                    keyboardShouldPersistTaps={'handled'}
                    enableOnAndroid={true}
                    alwaysBounceVertical={false}
                >
                    {/*<Header title={" "} leftIcon={"ios-arrow-back"}*/}
                    {/*onPressLeftIcon={() => this.props.navigation.goBack()}/>*/}
                    <View style={{width: '100%', flex: 1, marginTop: scale(50)}}>
                        <View style={{width: '100%', minHeight: '40%', justifyContent: 'center', alignItems: 'center'}}>
                            <Text
                                style={{
                                    fontSize: scale(15),
                                    fontFamily: 'AvenirLTStd-Light',
                                    // paddingLeft: scale(19),
                                    color: Colors.greyText,
                                    marginBottom: scale(15)
                                }}
                            >Welcome back, {this.props.auth.username}</Text>
                            <Text
                                style={{
                                    fontSize: scale(20),
                                    fontFamily: 'graphik-medium',
                                    // paddingLeft: scale(19),
                                    color: Colors.darkBlue,
                                    marginBottom: scale(30)
                                }}
                            >Enter your PIN to continue</Text>
                            <SmoothPinCodeInput
                                cellStyle={{
                                    borderBottomWidth: 2,
                                    borderColor: 'gray',
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
                                value={password}
                                // password={true}
                                autoFocus={true}
                                onTextChange={password => this.onChangePassword(password)}
                            />
                            <View style={{paddingHorizontal: scale(20), width: '100%'}}>
                                {this.renderButton()}
                            </View>

                            {/*{this.renderButton()}*/}
                        </View>

                        {/*<ImageBackground*/}
                        {/*style={{*/}
                        {/*flex: 1,*/}
                        {/*width: '100%'*/}
                        {/*}}*/}
                        {/*resizeMode={'cover'}*/}
                        {/*source={require('../../../assets/images/Login/login_background_2.png')}*/}
                        {/*>*/}
                        {/*</ImageBackground>*/}
                    </View>
                </KeyboardAwareScrollView>
            </View>
        );
    }

    validate = () => {

        let error = false;
        let emailRegex = /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/;

        if (this.state.email === '') {
            this.setState({
                email_error: "Please enter your email",
            })
            error = true;
        }
        if (/[a-zA-Z]/.test(this.state.email)) {
            if (!emailRegex.test(this.state.email)) {
                this.setState({
                    email_error: "Please enter a valid email",
                })
                error = true;
            }
        }

        if (this.state.password === '') {
            this.setState({
                password_error: "Please enter your password",
            })
            error = true;
        }
        return error
    }


    showPassword = () => {
        this.setState({
            passwordShow: !this.state.passwordShow
        })
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
    clearUserData
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withNavigationFocus(Login));
