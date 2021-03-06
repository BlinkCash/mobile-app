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
import { postLogin, postRegister, checkfull_names, postAuthInit } from "../../lib/api/url";
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
          phone:''
        }
    }


    componentDidMount() {
        // this.props.navigation.navigate('EnterBvnDetails')
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
            modalLoader: true,
            formError:''
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

                        if(res.data.status ==='success'){
                            this.props.navigation.navigate('EnterOtp',{
                                phone
                            })
                        }else{
                            this.setState({
                                formError:res.data.message
                            })

                            if(res.data.message.toLowerCase().includes('login')){
                                this.setState({
                                    goBackToLogin: true
                                })
                            }
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
                        if(error.response.data.message.toLowerCase().includes('login')){
                            this.setState({
                                goBackToLogin: true
                            })
                        }
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
        return !!this.state.goBackToLogin? (
            <ButtonWithBackgroundBottom
                onPress={() => this.props.navigation.navigate('Login')}
                style={{alignSelf:'flex-end', width:'100%', marginBottom: scale(10)}}

            >
            <ButtonWithBackgroundText>{'Go Back To Login'}</ButtonWithBackgroundText>
            </ButtonWithBackgroundBottom>
        ):(
            <ButtonWithBackgroundBottom
                disabled={loading}
                onPress={() => this.onhandleRegister()}
                style={{alignSelf:'flex-end', width:'100%',marginBottom: scale(10)}}

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
                        flex: 1,
                    }}
                >
                    <LoaderText visible={this.state.loading} desciption={'Sending OTP...'}/>
                    {/*<LoaderText visible={true} desciption={'Sending OTP...'}/>*/}
                    <KeyboardAvoidingView
                        style={{backgroundColor: 'transparent', flex: 1}}
                        // resetScrollToCoords={{x: 0, y: 0}}
                        android
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

                        <View style={[formStyles.auth_form,{flex:1}]}>
                            <Text style={styles.title}>Please enter your mobile number to get started.</Text>
                            <Text style={[formStyles.formError]}>{this.state.formError}</Text>
                            <View style={{marginTop: scale(0)}}>

                                <View style={{
                                    marginTop:scale(30)
                                }}>
                                    <FloatingLabelInput
                                        label="Mobile Number"
                                        value={phone}
                                        underlineColorAndroid={'transparent'}
                                        keyboardType={'number-pad'}
                                        maxLength={15}
                                        style={(this.state.formError || this.state.phone_error)?{  borderBottomColor: '#CA5C55'}:{}}
                                        multiline={false}
                                        autoCorrect={false}
                                        onChangeText={text => this.setState({phone: text, phone_error: '',formError:""})}
                                    />
                                    <Text style={formStyles.error}>{this.state.phone_error}</Text>
                                </View>

                            </View>
                        </View>
                        <View style={{flex:1, paddingLeft: scale(15),  paddingRight: scale(15), flexDirection:'row', marginBottom:scale(10)}}>
                        {this.renderButton()}
                    </View>
                    </KeyboardAvoidingView>
                </View>
            </View>
        );
    }

    validate = () => {

        let error = false;
        if (this.state.phone === '') {
            this.setState({
                phone_error: "Please enter your mobile number",
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