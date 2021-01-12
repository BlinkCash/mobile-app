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
    Modal, TouchableWithoutFeedback, Image, StyleSheet, ScrollView, TextInput
} from 'react-native';
import { connect } from 'react-redux';
import NavigationService from "../../../NavigationService";
import { FloatingLabelInput } from "../../components/Input/FloatingLabelInput";
import Header from '../../components/Header/OtherHeader';
import TouchItem from '../../components/TouchItem/_TouchItem'

import { loginUserSuccess } from "../Auth/action/auth_actions";
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
    postCreatePassword,
    postAddEmail, postChangePassword, postPinChange
} from "../../lib/api/url";
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { withNavigationFocus } from 'react-navigation';
import { formStyles } from "../../../assets/styles/styles";
import { HeaderText } from "../../components/HeaderText/HeaderText";
import { showToast, hideToast } from "../../components/Toast/actions/toastActions";
import { scale } from "../../lib/utils/scaleUtils";
// import { resetCache } from "./action/auth_actions";
import * as WebBrowser from "expo-web-browser";
import { Colors } from "../../lib/constants/Colors";
import { LoaderText } from "../../components/Loader/Loader";
import * as Icon from "@expo/vector-icons";
import { apiRequest } from "../../lib/api/api";


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
            password: '',
            isFourError: true,
            isUppercaseError: true,
            isLowercaseError: true,
            isSymbolError: true,
            old_password: ''
        }
    }


    _handleOpenLink = async (url) => {
        let result = await WebBrowser.openBrowserAsync(url);
        this.setState({result});
    };

    submit = () => {
        let {email, password, old_password} = this.state;
        if (!old_password) {
            this.setState({
                old_password_error:'Please enter your old PIN'
            })
            return
        }

        if (old_password === password) {
            this.props.showToast("Your current and new PIN should not be the same.", 'error')
            return
        }

        let {isFourError, isLowercaseError, isUppercaseError, isSymbolError} = this.state
        if (isFourError) {
            // this.props.showToast("Please enter your old passord", 'error')
            return
        }
        Keyboard.dismiss();



        this.setState({
            loading: true,
            modalLoader: true
        }, () => {
            apiRequest(postPinChange, 'post', {
                "old_pin": old_password,
                "new_pin": password
            })
                .then(res => {
                    console.log(res)
                    this.setState({
                        loading: false
                    }, () => {

                        if (res.status === 'success') {
                            this.props.loginUserSuccess({
                                pin:password
                            });
                            this.props.navigation.goBack()
                            this.props.showToast(res.message, 'success')

                        } else {
                            this.props.showToast(res.message, 'error')
                        }
                        // this.props.navigation.navigate('EnterOtp', {
                        //     phone
                        // })
                        // this.props.showToast('Registration Complete. Please check your email for a confirmation link', 'success')
                    })
                })
                .catch(error => {
                    console.log(error.response)
                    //
                    if (error.response) {
                        this.props.showToast(error.response.data.message, 'error')
                    } else {
                        this.props.showToast(error.message, 'error')
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
                onPress={() => this.submit()}
                style={{width: '100%'}}

            >
                {loading && (<ActivityIndicator size="large" color="#fff"/>)}
                {!loading && (<ButtonWithBackgroundText>{'Change PIN'}</ButtonWithBackgroundText>)}
            </ButtonWithBackgroundBottom>
        );
    };

    onChange = (text) => {
        this.setState({
            password: text
        }, () => {
            this.validate()
        })
    }
    onChangeOldPassword = (text) => {
        this.setState({
            old_password: text,
            old_password_error:''
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
                    <LoaderText visible={this.state.loading} desciption={'Changing PIN, please wait'}/>
                    <KeyboardAwareScrollView
                        style={{backgroundColor: 'transparent', flex: 1}}
                        // resetScrollToCoords={{x: 0, y: 0}}
                        contentContainerStyle={formStyles.container}
                        scrollEnabled={true}
                        keyboardShouldPersistTaps={'handled'}
                        enableOnAndroid={true}
                        alwaysBounceVertical={false}
                        bounces={false}
                    >
                        <Header title={"Change Authorization PIN"} leftIcon={"ios-arrow-back"}
                                onPressLeftIcon={() => this.props.navigation.goBack()}/>

                        <View style={[formStyles.auth_form, {flex: 1}]}>
                            <Text style={styles.title}>Set a PIN you won’t easily forget</Text>
                            {/*<Text style={[formStyles.formError]}>{this.state.formError}</Text>*/}
                            <View style={{marginTop: scale(0)}}>

                                <View style={{marginTop: scale(20)}}>
                                    <FloatingLabelInput
                                        label="Old PIN"
                                        value={this.state.old_password}
                                        underlineColorAndroid={'transparent'}
                                        secureTextEntry
                                        keyboardType={'numeric'}
                                        multiline={false}
                                        maxLength={4}
                                        autoCorrect={false}
                                        onChangeText={text => this.onChangeOldPassword(text)}
                                    />
                                    {/*{*/}
                                    {/*this.state.password !== '' && (*/}
                                    {/*<TouchableOpacity onPress={this.showPassword}*/}
                                    {/*style={formStyles.showpassword}>*/}
                                    {/*<Icon.Ionicons*/}
                                    {/*name={!this.state.passwordShow ? 'md-eye' : 'md-eye-off'}*/}
                                    {/*size={scale(25)}*/}
                                    {/*color={Colors.tintColor}*/}
                                    {/*/>*/}
                                    {/*</TouchableOpacity>)*/}
                                    {/*}*/}
                                    <Text style={formStyles.error}>{this.state.old_password_error}</Text>
                                </View>

                                <View style={{marginTop: scale(10)}}>
                                    <FloatingLabelInput
                                        label="New PIN"
                                        value={password}
                                        maxLength={4}
                                        keyboardType={'numeric'}
                                        underlineColorAndroid={'transparent'}
                                        secureTextEntry={!this.state.passwordShow}
                                        multiline={false}
                                        autoCorrect={false}
                                        onChangeText={text => this.onChange(text)}
                                    />
                                    {
                                        this.state.password !== '' && (
                                            <TouchableOpacity onPress={this.showPassword}
                                                              style={formStyles.showpassword}>
                                                <Icon.Ionicons
                                                    name={!this.state.passwordShow ? 'md-eye' : 'md-eye-off'}
                                                    size={scale(25)}
                                                    color={Colors.tintColor}
                                                />
                                            </TouchableOpacity>)
                                    }
                                    <Text style={formStyles.error}>{this.state.password_error}</Text>
                                </View>

                                <View style={{marginBottom: scale(40)}}>
                                    <View style={styles.passwordCheckArea}>
                                        <Text style={styles.passwordCheck}>4 characters</Text>
                                        <Icon.Ionicons
                                            name={'ios-checkmark-circle'}
                                            size={scale(15)}
                                            color={this.state.isFourError ? Colors.red : Colors.green}
                                        />
                                    </View>
                                    {/*<View style={styles.passwordCheckArea}>*/}
                                        {/*<Text style={styles.passwordCheck}>An uppercase letter</Text>*/}
                                        {/*<Icon.Ionicons*/}
                                            {/*name={'ios-checkmark-circle'}*/}
                                            {/*size={scale(15)}*/}
                                            {/*color={this.state.isUppercaseError ? Colors.red : Colors.green}*/}
                                        {/*/>*/}
                                    {/*</View>*/}
                                    {/*<View style={styles.passwordCheckArea}>*/}
                                        {/*<Text style={styles.passwordCheck}>A lowercase letter</Text>*/}
                                        {/*<Icon.Ionicons*/}
                                            {/*name={'ios-checkmark-circle'}*/}
                                            {/*size={scale(15)}*/}
                                            {/*color={this.state.isLowercaseError ? Colors.red : Colors.green}*/}
                                        {/*/>*/}
                                    {/*</View>*/}
                                    {/*<View style={styles.passwordCheckArea}>*/}
                                        {/*<Text style={styles.passwordCheck}>A symbol (=!@#&$%)</Text>*/}
                                        {/*<Icon.Ionicons*/}
                                            {/*name={'ios-checkmark-circle'}*/}
                                            {/*size={scale(15)}*/}
                                            {/*color={this.state.isSymbolError ? Colors.red : Colors.green}*/}
                                        {/*/>*/}
                                    {/*</View>*/}
                                </View>

                            </View>
                            <View style={{marginBottom: scale(10)}}>
                            {this.renderButton()}
                            </View>
                        </View>
                    </KeyboardAwareScrollView>
                </View>
            </View>
        );
    }

    validate = () => {
        if (this.state.password.length !== 4) {
            this.setState({
                isFourError: true,
            })
        } else {
            this.setState({
                isFourError: false,
            })
        }

        // let capitalReg = /[A-Z]/
        // if (!capitalReg.test(this.state.password)) {
        //     this.setState({
        //         isUppercaseError: true,
        //     })
        // } else {
        //     this.setState({
        //         isUppercaseError: false,
        //     })
        // }
        //
        // let lowerReg = /[a-z]/
        // if (!lowerReg.test(this.state.password)) {
        //     this.setState({
        //         isLowercaseError: true,
        //     })
        // } else {
        //     this.setState({
        //         isLowercaseError: false,
        //     })
        // }

        // let specialReg = /[!@#$%^&*(),.?":{}|<>=&]/
        // if (!specialReg.test(this.state.password)) {
        //     this.setState({
        //         isSymbolError: true,
        //     })
        // } else {
        //     this.setState({
        //         isSymbolError: false,
        //     })
        // }
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
    // handleForgotPassword,
    // resetAuthData,
    showToast,
    // getExtraDetails,
    // resetCache,
    hideToast,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withNavigationFocus(Login));

const styles = StyleSheet.create({
    title: {
        fontSize: scale(12),
        color: Colors.greyText,
        // textAlign: 'center',
        fontFamily: "graphik-medium",
        // lineHeight: scale(32),
        opacity: 0.5
        // marginTop: scale(24),
    },
    passwordCheck: {
        fontSize: scale(12),
        color: '#3C5066',
        marginRight: scale(15),
        // textAlign: 'center',
        fontFamily: "graphik-regular",
        lineHeight: scale(13)
        // marginTop: scale(24),
    },
    passwordCheckArea: {flexDirection: 'row', alignItems: 'center', width: scale(145), justifyContent: 'space-between'}
})