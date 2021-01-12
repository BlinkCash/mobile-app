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
    Modal, TouchableWithoutFeedback, Image, StyleSheet, ImageBackground
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
import { postLogin, postRegister, checkfull_names, postAuthInit, confirmBVN, postAddEmail } from "../../lib/api/url";
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
import { apiRequest } from "../../lib/api/api";


const ACCESS_TOKEN = 'access_token';

class Login extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);

        const {navigation} = this.props;

        this.state = {
            email:''
        }
    }


    componentDidMount() {
    }



    _handleOpenLink = async (url) => {
        let result = await WebBrowser.openBrowserAsync(url);
        this.setState({ result });
    };

    onhandleRegister = () => {
        Keyboard.dismiss();
        let {email, password, phone, full_name} = this.state;

        if (this.validate()) return;



        this.setState({
            loading: true,
            modalLoader: true
        }, () => {
            apiRequest(postAddEmail, 'post', {
                "email": email
            })
                .then(res => {
                    console.log(res)
                    this.setState({
                        loading: false
                    }, () => {
                        if(res.status ==='success'){
                            this.props.navigation.navigate('EnterPicture')
                            this.props.loginUserSuccess({
                                stage_id:res.data.stage_id
                            })
                        }else{
                            this.setState({
                                formError:res.message
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
                onPress={() => this.onhandleRegister()}
                style={{width: '100%'}}

            >
                {loading && (<ActivityIndicator size="large" color="#fff"/>)}
                {!loading && (<ButtonWithBackgroundText>{'Next'}</ButtonWithBackgroundText>)}
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
                    <LoaderText visible={this.state.loading} desciption={'Registering your email...'}/>
                    <KeyboardAwareScrollView
                        style={{
                            backgroundColor: 'transparent',
                            paddingTop: scale(10),
                        }}
                        resetScrollToCoords={{x: 0, y: 0}}
                        contentContainerStyle={formStyles.containerNoHeight}
                        scrollEnabled={true}
                        keyboardShouldPersistTaps={'handled'}
                        enableOnAndroid={true}
                        alwaysBounceVertical={false}
                        bounces={false}
                    >
                        <Header leftIcon={"ios-arrow-back"}
                                onPressLeftIcon={() => this.props.navigation.navigate('Login')}/>

                        <View style={[formStyles.auth_form,{flex:1}]}>
                            <Text style={styles.title}>Please enter your email address</Text>
                            <Text style={[formStyles.formError]}>{this.state.formError}</Text>
                            <View style={{marginTop: scale(0)}}>

                                <View style={{marginTop:scale(70)}}>
                                    <FloatingLabelInput
                                        label="Email Address"
                                        value={email}
                                        underlineColorAndroid={'transparent'}
                                        keyboardType={'email-address'}
                                        multiline={false}
                                        style={(this.state.formError || this.state.email_error)?{  borderBottomColor: '#CA5C55'}:{}}
                                        autoCorrect={false}
                                        onChangeText={text => this.setState({email: text, email_error: '',formError:''})}
                                    />
                                    <Text style={formStyles.error}>{this.state.email_error}</Text>
                                </View>

                            </View>
                            <View style={{marginBottom: scale(10), marginTop:scale(30)}}>
                            {this.renderButton()}
                            </View>
                        </View>
                    </KeyboardAwareScrollView>
                </View>
            </View>
        );
    }

    validate = () => {

        let error = false;
        if (this.state.email === '') {
            this.setState({
                email_error: "Please enter your email address",
            })
            error = true;
        }

        let emailRegex = /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/;

        if (!emailRegex.test(this.state.email)) {
            this.setState({
                email_error: "Please enter a valid email address",
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
        lineHeight:scale(32)
        // marginTop: scale(24),
    },
})