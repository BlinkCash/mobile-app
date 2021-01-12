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
    Modal, TouchableWithoutFeedback, Image, StyleSheet, ScrollView
} from 'react-native';
import { connect } from 'react-redux';
import NavigationService from "../../../NavigationService";
import { FloatingLabelInput } from "../../components/Input/FloatingLabelInput";
import Header from '../../components/Header/OtherHeader';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import {loginUserSuccess} from "../Auth/action/auth_actions";


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
    postChangePassword, postPinReset
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
            otp: ''
        }
    }


    componentDidMount() {
    }



    onhandleRegister = () => {
        Keyboard.dismiss();
        let {otp} = this.state;
        let phone = this.props.navigation.getParam('phone', '')

        if (this.validate()) return;


        this.setState({
            loading: true,
            modalLoader: true
        }, () => {
            apiRequest(postPinReset, 'post', {
                "old_password": old_password,
                "new_password": password
            })
                .then(res => {
                    this.setState({
                        loading: false
                    }, () => {
                        console.log(res.data.data)
                        if(res.data.status ==='success'){
                            this.props.navigation.navigate('EnterPassword',{
                                phone,
                                comfirmation_id:res.data.data.comfirmation_id
                            })
                        }else{
                            this.props.showToast(res.data.message, 'error')
                        }

                        // this.props.navigation.navigate('Login')
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
                onPress={() => this.onhandleRegister()}
                style={{alignSelf: 'flex-end', width: '100%'}}

            >
                {loading && (<ActivityIndicator size="large" color="#fff"/>)}
                {!loading && (<ButtonWithBackgroundText>{'Next'}</ButtonWithBackgroundText>)}
            </ButtonWithBackgroundBottom>
        );
    };

    onChangePassword = (otp) => {
        this.setState({
            otp,
            phone_error:''
        }, () => {
            if (this.state.otp.length === 6) {
                this.props.navigation.navigate('EnterNewPIN',{
                    otp:this.state.otp
                })
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
                    <LoaderText visible={this.state.loading} desciption={'Verifying OTP, Please wait'}/>
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
                        <Header title={"Forgot Authorization PIN"} leftIcon={"ios-arrow-back"}
                                onPressLeftIcon={() => this.props.navigation.goBack()}/>

                        <View style={[formStyles.auth_form, {flex: 1}]}>
                            <Text style={styles.title}>Please enter the OTP that was sent to your number</Text>
                            <View style={{marginTop: scale(0)}}>

                                <View style={{marginTop: scale(70), width: '100%', alignItems: 'center'}}>
                                    <SmoothPinCodeInput
                                        cellStyle={{
                                            borderBottomWidth: 2,
                                            borderColor: 'gray',
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
                                        codeLength={6}
                                        // onFulfill={() => }
                                        cellStyleFocused={{
                                            borderColor: 'black',
                                        }}
                                        value={this.state.otp}
                                        // password={true}
                                        autoFocus={true}
                                        onTextChange={password => this.onChangePassword(password)}
                                    />
                                    <Text style={[formStyles.error,{width:'100%', textAlign:'center'}]}>{this.state.phone_error}</Text>
                                </View>

                            </View>
                            {/*<View style={{flex: 1, flexDirection: 'row', marginBottom: scale(10)}}>*/}
                                {/*{this.renderButton()}*/}
                            {/*</View>*/}
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </View>
        );
    }

    validate = () => {

        let error = false;
        if (this.state.otp.length < 6) {
            this.setState({
                phone_error: "Please enter a valid otp",
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
        fontSize: scale(20),
        color: Colors.greyText,
        // textAlign: 'center',
        fontFamily: "graphik-regular",
        lineHeight: scale(32),
        textAlign: 'center'
        // marginTop: scale(24),
    },
})