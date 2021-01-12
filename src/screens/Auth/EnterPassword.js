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
import { postLogin, postRegister, checkfull_names, postAuthInit, postCreatePassword } from "../../lib/api/url";
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
import * as Icon from "@expo/vector-icons";


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
            isEightError: true,
            isUppercaseError: true,
            isLowercaseError: true,
            isSymbolError: true,
        }
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

    _handleOpenLink = async (url) => {
        let result = await WebBrowser.openBrowserAsync(url);
        this.setState({result});
    };

    submit = () => {
        let {isEightError, isLowercaseError, isUppercaseError,isSymbolError} = this.state
       if(isEightError || isLowercaseError || isUppercaseError || isSymbolError){
           return
       }
        Keyboard.dismiss();
        let {email, password, full_name} = this.state;

        let phone = this.props.navigation.getParam('phone', '')
        let comfirmation_id = this.props.navigation.getParam('comfirmation_id', '')


        this.setState({
            loading: true,
            modalLoader: true
        }, () => {
            axiosInstance
                .post(postCreatePassword, {
                        "phone_number": phone,
                        "password": password,
                        "confirmation_id": String(comfirmation_id)
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

                        if(res.data.status ==='success'){
                            this.storeToken(res.data.data.token);

                            let userData = {};
                            userData.access_token = res.data.data.token;
                            userData.stage_id = res.data.data.stage_id;
                            userData.phone = phone;

                            this.props.loginUserSuccess(userData);
                            this.props.navigation.navigate('EnterBVN')

                        }else{
                            this.setState({
                                formError:res.data.message
                            })
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
                        this.setState({
                            formError:error.response.data.message
                        })
                    } else {
                        this.setState({
                            formError:error.message
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
                onPress={() => this.submit()}
                style={{width: '100%'}}

            >
                {loading && (<ActivityIndicator size="large" color="#fff"/>)}
                {!loading && (<ButtonWithBackgroundText>{'Next'}</ButtonWithBackgroundText>)}
            </ButtonWithBackgroundBottom>
        );
    };

    onChange = (text) => {
        this.setState({
            password: text,
            formError:''
        }, () => {
            this.validate()
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
                    <LoaderText visible={this.state.loading} desciption={'Saving your password...'}/>
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
                        <Header leftIcon={"ios-arrow-back"}
                                onPressLeftIcon={() => this.props.navigation.navigate('EnterNumber')}/>

                        <View style={[formStyles.auth_form, {flex: 1}]}>
                            <Text style={styles.title}>Let’s create a password to secure your account</Text>
                            <Text style={[formStyles.formError]}>{this.state.formError}</Text>

                            <View style={{marginTop: scale(0)}}>

                                <View style={{marginTop: scale(70)}}>
                                    <FloatingLabelInput
                                        label="Password"
                                        value={password}
                                        underlineColorAndroid={'transparent'}
                                        secureTextEntry={!this.state.passwordShow}
                                        style={(this.state.formError)?{  borderBottomColor: '#CA5C55'}:{}}
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

                                <View style={{marginBottom:scale(40)}}>
                                    <View style={styles.passwordCheckArea}>
                                        <Text style={styles.passwordCheck}>8 or more characters</Text>
                                        <Icon.Ionicons
                                            name={'ios-checkmark-circle'}
                                            size={scale(15)}
                                            color={this.state.isEightError ? Colors.red : Colors.green}
                                        />
                                    </View>
                                    <View style={styles.passwordCheckArea}>
                                        <Text style={styles.passwordCheck}>An uppercase letter</Text>
                                        <Icon.Ionicons
                                            name={'ios-checkmark-circle'}
                                            size={scale(15)}
                                            color={this.state.isUppercaseError ? Colors.red : Colors.green}
                                        />
                                    </View>
                                    <View style={styles.passwordCheckArea}>
                                        <Text style={styles.passwordCheck}>A lowercase letter</Text>
                                        <Icon.Ionicons
                                            name={'ios-checkmark-circle'}
                                            size={scale(15)}
                                            color={this.state.isLowercaseError ? Colors.red : Colors.green}
                                        />
                                    </View>
                                    <View style={styles.passwordCheckArea}>
                                        <Text style={styles.passwordCheck}>A symbol (=!@#&$%)</Text>
                                        <Icon.Ionicons
                                            name={'ios-checkmark-circle'}
                                            size={scale(15)}
                                            color={this.state.isSymbolError ? Colors.red : Colors.green}
                                        />
                                    </View>
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
        if (this.state.password.length < 8) {
            this.setState({
                isEightError: true,
            })
        } else {
            this.setState({
                isEightError: false,
            })
        }

        let capitalReg = /[A-Z]/
        if (!capitalReg.test(this.state.password)) {
            this.setState({
                isUppercaseError: true,
            })
        } else {
            this.setState({
                isUppercaseError: false,
            })
        }

        let lowerReg = /[a-z]/
        if (!lowerReg.test(this.state.password)) {
            this.setState({
                isLowercaseError: true,
            })
        } else {
            this.setState({
                isLowercaseError: false,
            })
        }

        let specialReg = /[!@#$%^&*(),.?":{}|<>=&]/
        if (!specialReg.test(this.state.password)) {
            this.setState({
                isSymbolError: true,
            })
        } else {
            this.setState({
                isSymbolError: false,
            })
        }
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