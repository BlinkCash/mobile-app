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
    ImageBackground,
    Keyboard,
    Modal, TouchableWithoutFeedback, Image
} from 'react-native';
import { connect } from 'react-redux';
import NavigationService from "../../../NavigationService";
import { FloatingLabelInput } from "../../components/Input/FloatingLabelInput";
import Header from '../../components/Header/Header';
import TouchItem from '../../components/TouchItem/_TouchItem'


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
import { postLogin, postRegister, checkfull_names } from "../../lib/api/url";
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { withNavigationFocus } from 'react-navigation';
import { formStyles } from "../../../assets/styles/styles";
import { HeaderText } from "../../components/HeaderText/HeaderText";
import { showToast, hideToast } from "../../components/Toast/actions/toastActions";
import { scale } from "../../lib/utils/scaleUtils";
import { resetCache } from "./action/auth_actions";
import * as WebBrowser from "expo-web-browser";
import { Colors } from "../../lib/constants/Colors";


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
            email: '',
            password: '',
            confirm_password: '',
            full_name: '',
            referral: '',
            phone: '',
            page: 1,
            loading: false,
            referredBy: '',
            referralId: '',
            referralCode: '',
            isBusiness:false
        }
    }


    componentDidMount() {
    }


    async storeToken(accessToken, email) {
        try {
            await AsyncStorage.setItem(ACCESS_TOKEN, accessToken);
            this.getToken(email);
        } catch (error) {
            console.log('while storing token something went wrong');
        }
    }

    _handleOpenLink = async (url) => {
        let result = await WebBrowser.openBrowserAsync(url);
        this.setState({ result });
    };

    async getToken(email) {
        try {
            let token = await AsyncStorage.getItem(ACCESS_TOKEN);
            this.props.getExtraDetails(email);
            console.log(`token for the app is is is ${token}`);
        } catch (error) {
            console.log('something went wrong');
        }
    }

    checkfull_name = () => {

        let emailRegex = /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/;

        if (this.state.email === '' || !emailRegex.test(this.state.email)) {
            return
        }

        axiosInstance
            .get(checkfull_names(this.state.email.toLowerCase()), {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
            .then(res => {
                this.setState({
                    loading: false,
                }, () => {

                    if (res.data.data) {
                        this.setState({
                            email_error: "full_name has already been taken",
                        })
                    } else {
                        this.setState({
                            email_error: "",
                        })
                    }
                })
            })
            .catch(error => {

            });
    }
    onhandleRegister = () => {
        Keyboard.dismiss();
        let {email, password, phone, full_name} = this.state;

        if (this.validate()) return;

        this.props.navigation.navigate('SelectUserType',{
            signUpDetails: {
                "name": full_name,
                "email": email.toLowerCase(),
                "password": password,
                "is_individual":this.state.isBusiness? 0:1
            }
        })
        return;

        this.setState({
            loading: true,
            modalLoader: true
        }, () => {
            axiosInstance
                .post(postRegister, {
                        "name": full_name,
                        "email": email.toLowerCase(),
                        "password": password
                    }, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    console.log(res)
                    this.setState({
                        loading: false,
                        modalLoader: false
                    }, () => {
                        this.props.navigation.navigate('Login')
                        this.props.showToast('Registration Complete. Please check your email for a confirmation link', 'success')
                    })
                })
                .catch(error => {
                    console.log(error)
                    //
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

    renderButton = () => {
        const {loading} = this.state;
        return (
            <ButtonWithBackgroundBottom
                disabled={loading}
                onPress={() => this.onhandleRegister()}
                style={{marginTop: 15}}

            >
                {loading && (<ActivityIndicator size="large" color="#fff"/>)}
                {!loading && (<ButtonWithBackgroundText>{'Create Account'}</ButtonWithBackgroundText>)}
            </ButtonWithBackgroundBottom>
        );
    };

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
                    <KeyboardAwareScrollView
                        style={{backgroundColor: 'transparent', flex: 1}}
                        resetScrollToCoords={{x: 0, y: 0}}
                        contentContainerStyle={formStyles.container}
                        scrollEnabled={true}
                        keyboardShouldPersistTaps={'handled'}
                        enableOnAndroid={true}
                        alwaysBounceVertical={false}
                        bounces={false}
                    >
                        <Header leftIcon={"md-arrow-back"}
                                onPressLeftIcon={() => this.props.navigation.goBack()} image={<Image
                            style={{
                                // height: scale(30),
                                width: scale(150),
                                alignSelf:'center',
                            }} resizeMode={'contain'}
                            source={require('../../../assets/logo.png')}
                        />}/>

                        <View style={formStyles.auth_form}>
                            <View style={{marginTop: scale(0)}}>

                                <View>
                                    <FloatingLabelInput
                                        label={this.state.isBusiness?"Company Name":"Full Name"}
                                        value={full_name}
                                        underlineColorAndroid={'transparent'}
                                        keyboardType={'email-address'}
                                        multiline={false}
                                        // onBlur={this.checkfull_name}
                                        autoCorrect={false}
                                        onChangeText={text => this.setState({full_name: text, full_name_error: ''})}
                                    />
                                    <Text style={formStyles.error}>{this.state.full_name_error}</Text>
                                </View>
                                <View>
                                    <FloatingLabelInput
                                        label="Email"
                                        value={email}
                                        underlineColorAndroid={'transparent'}
                                        keyboardType={'email-address'}
                                        multiline={false}
                                        // onBlur={this.checkfull_name}
                                        autoCorrect={false}
                                        onChangeText={text => this.setState({email: text, email_error: ''})}
                                    />
                                    <Text style={formStyles.error}>{this.state.email_error}</Text>
                                </View>

                                {/*<View>*/}
                                    {/*<FloatingLabelInput*/}
                                        {/*label="Phone Number"*/}
                                        {/*value={phone}*/}
                                        {/*underlineColorAndroid={'transparent'}*/}
                                        {/*keyboardType={'numeric'}*/}
                                        {/*maxLength={15}*/}
                                        {/*multiline={false}*/}
                                        {/*autoCorrect={false}*/}
                                        {/*onChangeText={text => this.setState({phone: text, phone_error: ''})}*/}
                                    {/*/>*/}
                                    {/*<Text style={formStyles.error}>{this.state.phone_error}</Text>*/}
                                {/*</View>*/}

                                <View>
                                    <View>
                                        <FloatingLabelInput
                                            label="Password"
                                            value={password}
                                            secureTextEntry={!this.state.passwordShow}
                                            underlineColorAndroid={'transparent'}
                                            // keyboardType={'numeric'}
                                            // maxLength={4}
                                            multiline={false}
                                            style={{paddingRight: scale(50)}}
                                            autoCorrect={false}
                                            onChangeText={text => this.setState({password: text, password_error: ''})}
                                        />

                                        {/*<TextInput*/}
                                        {/*underlineColorAndroid={'transparent'}*/}
                                        {/*// placeholder={'Password'}*/}
                                        {/*style={[formStyles.textInput, {paddingRight: scale(30)}]}*/}
                                        {/*secureTextEntry={!this.state.passwordShow}*/}
                                        {/*onChangeText={text => this.setState({password: text, password_error: ''})}*/}
                                        {/*value={password}*/}
                                        {/*autoCorrect={false}*/}
                                        {/*>*/}
                                        {/*</TextInput>*/}
                                        {
                                            this.state.password !== '' && (
                                                <TouchableOpacity onPress={this.showPassword}
                                                                  style={formStyles.showpassword}>
                                                    <Text style={{
                                                        color: Colors.tintColor,
                                                        fontFamily: 'AvenirLTStd-Heavy',
                                                        fontSize: scale(12)
                                                    }}>{!this.state.passwordShow ? 'Show' : 'Hide'}
                                                    </Text>
                                                </TouchableOpacity>)
                                        }
                                        <Text style={formStyles.error}>{this.state.password_error}</Text>
                                    </View>

                                </View>
                                <View>
                                    <View>
                                        <FloatingLabelInput
                                            label="Confirm Password"
                                            value={confirm_password}
                                            secureTextEntry={!this.state.confirm_passwordShow}
                                            underlineColorAndroid={'transparent'}
                                            // keyboardType={'numeric'}
                                            multiline={false}
                                            // maxLength={4}
                                            style={{paddingRight: scale(50)}}
                                            autoCorrect={false}
                                            onChangeText={text => this.setState({
                                                confirm_password: text,
                                                confirm_password_error: ''
                                            })}
                                        />

                                        {/*<TextInput*/}
                                        {/*underlineColorAndroid={'transparent'}*/}
                                        {/*// placeholder={'Password'}*/}
                                        {/*style={[formStyles.textInput, {paddingRight: scale(30)}]}*/}
                                        {/*secureTextEntry={!this.state.passwordShow}*/}
                                        {/*onChangeText={text => this.setState({password: text, password_error: ''})}*/}
                                        {/*value={password}*/}
                                        {/*autoCorrect={false}*/}
                                        {/*>*/}
                                        {/*</TextInput>*/}
                                        {
                                            this.state.confirm_password !== '' && (
                                                <TouchableOpacity onPress={this.showConfirmPassword}
                                                                  style={formStyles.showpassword}>
                                                    <Text style={{
                                                        color: Colors.tintColor,
                                                        fontFamily: 'AvenirLTStd-Heavy',
                                                        fontSize: scale(12)
                                                    }}>{!this.state.confirm_passwordShow ? 'Show' : 'Hide'}
                                                    </Text>
                                                </TouchableOpacity>)
                                        }
                                        <Text style={formStyles.error}>{this.state.confirm_password_error}</Text>
                                    </View>

                                </View>

                                {/*<View>*/}
                                    {/*<CheckBox*/}
                                        {/*title='I accept th Here'*/}
                                        {/*checked={this.state.checked}*/}
                                        {/*containerStyle={{*/}
                                            {/*backgroundColor:'white',*/}
                                            {/*borderWidth:0,*/}
                                            {/*marginHorizontal:0,*/}
                                        {/*}}*/}
                                        {/*textStyle={{*/}
                                            {/*color: '#444',*/}
                                            {/*fontFamily: 'graphik-regular',*/}
                                            {/*letterSpacing: scale(-.3),*/}
                                            {/*marginTop:scale(2)*/}
                                        {/*}}*/}
                                    {/*/>*/}
                                {/*</View>*/}
                                <View style={{flexDirection:'row',marginBottom: scale(10)}}>
                                    <Text style={[formStyles.otherText,{fontSize:scale(11)}]}>
                                        By clicking on Create Account, you accept our
                                    </Text>
                                    <TouchItem onPress={() => this._handleOpenLink('https://www.fundcolony.com/invest/disclosure')}>
                                        <Text style={[formStyles.otherText,{fontSize:scale(11),color:Colors.tintColor}]}>
                                            {` T and Cs`}
                                        </Text>
                                    </TouchItem>
                                </View>

                            </View>

                            <View style={{flexDirection:'row', justifyContent:'flex-end', alignItems:'center', marginTop:scale(28)}}>
                                <Text
                                    style={[formStyles.otherText, {
                                        marginRight: scale(17),
                                        fontFamily: 'graphik-medium',
                                    }]}
                                >
                                    Registering as a business?
                                </Text>
                                <Switch
                                    value = {this.state.isBusiness}
                                    onValueChange={(isBusiness) => this.setState({isBusiness})}
                                    ios_backgroundColor={Colors.tintColor}
                                    // thumbColor={Colors.secondaryColor}
                                />
                            </View>
                            {this.renderButton()}
                        </View>
                        {/*<View style={formStyles.forgotPasswordText}>*/}
                        {/*<TouchableOpacity onPress={() => this.props.navigation.navigate('ForgotPassword')}>*/}
                        {/*<View style={{*/}
                        {/*borderBottomColor: '#ccc',*/}
                        {/*borderBottomWidth: 1, paddingBottom: 10*/}
                        {/*}}>*/}
                        {/*<Text*/}
                        {/*style={[formStyles.otherText, {textAlign: 'center', alignSelf:'center'}]}*/}
                        {/*>*/}
                        {/*Forgot Password?*/}
                        {/*</Text>*/}
                        {/*</View>*/}

                        {/*</TouchableOpacity>*/}
                        {/*</View>*/}
                        <View style={{flexDirection: 'row', justifyContent: 'flex-start', marginTop: 0}}>
                            <Text style={[formStyles.otherText]}>
                                Already have an account?
                            </Text>
                            <TouchableOpacity onPress={() => {
                                NavigationService.navigate('Login')
                            }}
                            >
                                <Text
                                    style={[formStyles.otherText, {
                                        marginLeft: 5,
                                        fontFamily: 'AvenirLTStd-Heavy',
                                        textDecorationLine: 'underline'
                                    }]}
                                >
                                    Log in.
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAwareScrollView>
                </View>
            </View>
        );
    }

    validate = () => {

        let error = false;
        let emailRegex = /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/;

        if (this.state.email === '' || !emailRegex.test(this.state.email)) {
            this.setState({
                email_error: "Please enter a valid email",
            })
            error = true;
        }
        if (this.state.password === '') {
            this.setState({
                password_error: "Please enter a Password",
            })
            error = true;
        }
        if (this.state.full_name === '') {
            this.setState({
                full_name_error: "Please enter a valid name",
            })
            error = true;
        }
        if (this.state.confirm_password === '') {
            this.setState({
                confirm_password_error: "Please confirm your Password",
            })
            error = true;
        }
        if (this.state.confirm_password !== this.state.password) {
            this.setState({
                confirm_password_error: "Please ensure Passwords match",
            })
            error = true;
        }
        // if (this.state.phone === '') {
        //     this.setState({
        //         phone_error: "Please enter your phone number",
        //     })
        //     error = true;
        // }
        return error
    }


    showPassword = () => {
        this.setState({
            passwordShow: !this.state.passwordShow
        })
    }
    showConfirmPassword = () => {
        this.setState({
            confirm_passwordShow: !this.state.confirm_passwordShow
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
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withNavigationFocus(Login));
