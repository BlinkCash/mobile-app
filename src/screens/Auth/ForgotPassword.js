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
import { connect } from 'react-redux';
import NavigationService from "../../../NavigationService";
import { FloatingLabelInput } from "../../components/Input/FloatingLabelInput";
import Header from '../../components/Header/Header';


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
import { postForgotPassword, postRegister, checkUsernames } from "../../lib/api/url";
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { withNavigationFocus } from 'react-navigation';
import { formStyles } from "../../../assets/styles/styles";
import { HeaderText } from "../../components/HeaderText/HeaderText";
import { showToast, hideToast } from "../../components/Toast/actions/toastActions";
import { scale } from "../../lib/utils/scaleUtils";
import { resetCache } from "./action/auth_actions";


const ACCESS_TOKEN = 'access_token';

class ForgotPassword extends React.Component {
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
            username: '',
            referral: '',
            phone: '',
            page: 1,
            loading: false,
            referredBy: '',
            referralId: '',
            referralCode: '',
        }
    }


    componentDidMount() {
    }


    onSubmit = () => {
        Keyboard.dismiss();
        let {email} = this.state;

        if (this.validate()) return;

        this.setState({
            loading: true,
            modalLoader: true
        }, () => {
            axiosInstance
                .post(postForgotPassword, {
                        "email": email.toLowerCase()
                    }
                )
                .then(res => {
                    console.log(res.data)
                    this.setState({
                        loading: false,
                        modalLoader: false
                    })


                    if (res.data.status) {
                        this.props.navigation.navigate('Login')
                        this.props.showToast(res.data.message?res.data.message:"Server error", 'success')
                    } else {
                        this.props.showToast(res.data.message?res.data.message:"Server error", 'error')

                    }
                })
                .catch(error => {
                    console.log(error)

                    if (error.response) {
                        this.props.showToast(error, 'error')
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
                onPress={() => this.onSubmit(false)}
                style={{marginTop: 15}}

            >
                {loading && (<ActivityIndicator size="large" color="#fff"/>)}
                {!loading && (<ButtonWithBackgroundText>{'Forgot Password'}</ButtonWithBackgroundText>)}
            </ButtonWithBackgroundBottom>
        );
    };

    render() {
        const {navigate} = this.props.navigation;
        const {email, password, username, phone, confirm_password} = this.state;
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
                        <Header title={"Forgot Password"} leftIcon={"md-arrow-back"}
                                onPressLeftIcon={() => this.props.navigation.goBack()}/>

                        <View style={formStyles.auth_form}>
                            <View style={{marginTop: scale(0)}}>
                                <View>
                                    <FloatingLabelInput
                                        label="Email"
                                        value={email}
                                        underlineColorAndroid={'transparent'}
                                        keyboardType={'email-address'}
                                        multiline={false}
                                        onBlur={this.checkUsername}
                                        autoCorrect={false}
                                        onChangeText={text => this.setState({email: text, email_error: ''})}
                                    />
                                    <Text style={formStyles.error}>{this.state.email_error}</Text>
                                </View>

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
                                Remember PIN now?
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
                                    Sign in.
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
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withNavigationFocus(ForgotPassword));
