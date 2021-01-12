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
import CountDown from 'react-native-countdown-component';


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
import { postLogin, postRegister, checkfull_names, postAuthInit, postConfirmOtp } from "../../lib/api/url";
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { withNavigationFocus } from 'react-navigation';
import { formStyles } from "../../../assets/styles/styles";
import { HeaderText } from "../../components/HeaderText/HeaderText";
import { showToast, hideToast } from "../../components/Toast/actions/toastActions";
import { scale } from "../../lib/utils/scaleUtils";
import { resetCache } from "./action/auth_actions";
import * as WebBrowser from "expo-web-browser";
import { Colors } from "../../lib/constants/Colors";
import { LoaderText } from "../../components/Loader/Loader";
import TouchItem from "../../components/TouchItem/_TouchItem";


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
            otp: '',
            resendOtp: false,
            until:60,
            id:1
        }
    }


    componentDidMount() {
    }


    onResendOtp = () => {
        Keyboard.dismiss();
        let {email, password, full_name} = this.state;
        let phone = this.props.navigation.getParam('phone', '')


        // if (this.validate()) return;


        this.setState({
            loading: 'Sending OTP...',
            modalLoader: true,
            formError: ''
        }, () => {
            axiosInstance
                .post(postAuthInit, {
                        "phone_number": phone
                    }, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    console.log(res)
                    this.setState({
                        loading: false
                    }, () => {

                        if (res.data.status === 'success') {
                            this.setState({
                                resendOtp:false,
                                id:++this.state.id
                            })
                            this.props.showToast('OTP has been sent successfully', 'success');
                        } else {
                            this.setState({
                                formError: res.data.message
                            })

                        }
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

    onhandleRegister = () => {
        Keyboard.dismiss();
        let {otp} = this.state;
        let phone = this.props.navigation.getParam('phone', '')

        if (this.validate()) return;


        this.setState({
            loading: 'Verifying OTP...',
            modalLoader: true
        }, () => {
            axiosInstance
                .post(postConfirmOtp, {
                        // "phone_number": phone,
                        "phone_number": phone,
                        "otp": otp
                    }, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    this.setState({
                        loading: false
                    }, () => {
                        console.log(res.data.data)
                        if (res.data.status === 'success') {
                            this.props.navigation.navigate('EnterPassword', {
                                phone,
                                comfirmation_id: res.data.data.comfirmation_id
                            })
                        } else {
                            this.setState({
                                formError: res.data.message
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
                {!loading && (<ButtonWithBackgroundText>{'Next'}</ButtonWithBackgroundText>)}
            </ButtonWithBackgroundBottom>
        );
    };

    onChangePassword = (otp) => {
        this.setState({
            otp,
            phone_error: '',
            formError: ''
        }, () => {
            if (this.state.otp.length === 6) {
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
                    <LoaderText visible={this.state.loading} desciption={this.state.loading}/>
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
                            <Text style={styles.title}>Please enter the OTP that was sent to your number</Text>
                            <Text style={[formStyles.formError]}>{this.state.formError}</Text>
                            <View style={{marginTop: scale(0)}}>

                                <View style={{marginTop: scale(30), width: '100%', alignItems: 'center'}}>
                                    <SmoothPinCodeInput
                                        cellStyle={{
                                            borderBottomWidth: 2,
                                            borderColor: this.state.formError || this.state.phone_error ? "#CA5C55" : 'gray',
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
                                        // onFulfill={this.onhandleLogin}
                                        cellStyleFocused={{
                                            borderColor: 'black',
                                        }}
                                        value={this.state.otp}
                                        // password={true}
                                        autoFocus={true}
                                        onTextChange={password => this.onChangePassword(password)}
                                    />
                                    <Text style={[formStyles.error, {
                                        width: '100%',
                                        textAlign: 'center'
                                    }]}>{this.state.phone_error}</Text>
                                </View>

                            </View>
                            <TouchItem disabled={!this.state.resendOtp} style={{
                                width: '100%',
                                alignItems: 'center',
                                marginTop: scale(20),
                                // flexDirection: 'row',
                                // justifyContent: 'center'
                            }} onPress={this.onResendOtp}>
                                <Text style={styles.resend(this.state.resendOtp)}>Resend OTP</Text>
                                {!this.state.resendOtp && (  <CountDown
                                    until={this.state.until}
                                    id={this.state.id}
                                    onFinish={() => {
                                        this.setState({
                                            resendOtp: true
                                        })
                                        // alert('finished')
                                    }}
                                    // onPress={() => alert('hello')}
                                    size={10}
                                    digitStyle={{backgroundColor: '#FFF', padding:0}}
                                    digitTxtStyle={[styles.resend(this.state.resendOtp),{margin:0}]}
                                    timeToShow={['M', 'S']}
                                    timeLabels={{m: null, s: null}}
                                    showSeparator separatorStyle={styles.resend(this.state.resendOtp)}
                                />)}

                            </TouchItem>
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

        let error = false;
        if (this.state.otp.length < 6) {
            this.setState({
                phone_error: "Please enter a valid OTP",
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

const styles = StyleSheet.create({
        title: {
            fontSize: scale(24),
            color: Colors.greyText,
            // textAlign: 'center',
            fontFamily: "graphik-medium",
            lineHeight: scale(32)
            // marginTop: scale(24),
        },
        resend: (resend) => {
            return {
                fontSize: scale(14),
                color: resend?Colors.tintColor:'#bbb',
                // textAlign: 'center',
                fontFamily: "graphik-medium",
                // marginTop: scale(24),
            }
        }
    }
)