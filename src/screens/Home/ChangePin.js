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
import Header from '../../components/Header/OtherHeader';
import {loginUserSuccess} from "../Auth/action/auth_actions";


import {
   
} from './action/home_actions';
import {
    ButtonWithBackgroundText,
    ButtonWithBackgroundBottom
} from '../../components/Button/Buttons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { axiosInstance } from "../../lib/api/axiosClient";
import { postChangePin, postRegister, checkUsernames } from "../../lib/api/url";
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { withNavigationFocus } from 'react-navigation';
import { formStyles } from "../../../assets/styles/styles";
import { HeaderText } from "../../components/HeaderText/HeaderText";
import { showToast, hideToast } from "../../components/Toast/actions/toastActions";
import { scale } from "../../lib/utils/scaleUtils";
import { Colors } from "../../lib/constants/Colors";


const ACCESS_TOKEN = 'access_token';

class ChangePin extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);

        const {navigation} = this.props;
        const email = navigation.getParam('email', this.props.auth.email);

        this.state = {
            email: '',
            old_password: '',
            new_password: '',
            confirm_new_password: '',
            username: '',
            referral: '',
            phone: '',
            page: 1,
            loading: false,
            referredBy: '',
            referralId: '',
            referralCode: '',
            logInUserData:''
        }
    }


    componentDidMount() {
        const { navigation } = this.props;
        let logInUserData = navigation.getParam('logInUserData', '')
        this.setState({
            logInUserData
        })
    }



    onSubmit = () => {
        Keyboard.dismiss();
        console.log(this.state.logInUserData)
        const { old_password, new_password,confirm_new_password} = this.state;


        if (this.validate()) return;

        this.setState({
            loading: true,
            modalLoader: true
        }, () => {
            axiosInstance
                .post(postChangePin, {
                        "old_password": old_password,
                        "email": this.state.logInUserData?this.state.logInUserData.email:this.props.auth.email,
                        "password": new_password,
                        "password_confirmation": new_password,
                    }, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    this.setState({
                        loading: false,
                        modalLoader: false
                    }, () => {
                        if(res.data.success){
                            this.props.showToast("Pin Change Successful", 'success',5000)

                            if(this.state.logInUserData){
                                this.props.loginUserSuccess(this.state.logInUserData);
                                this.props.navigation.navigate('Home');
                            }else{
                                this.props.navigation.goBack();
                            }

                        }else {
                            this.props.showToast(`Pin Error: ${res.data}`, 'error',5000)

                        }
                    })
                })
                .catch(error => {

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
                onPress={() => this.onSubmit(false)}
                style={{marginTop: 15}}

            >
                {loading && (<ActivityIndicator size="large" color="#fff"/>)}
                {!loading && (<ButtonWithBackgroundText>{'Change Pin'}</ButtonWithBackgroundText>)}
            </ButtonWithBackgroundBottom>
        );
    };

    render() {
        const {navigate} = this.props.navigation;
        const { old_password, new_password,confirm_new_password} = this.state;
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
                        <Header title={"Change PIN"} leftIcon={"md-arrow-back"}
                                onPressLeftIcon={() => this.props.navigation.goBack()}/>

                        <View style={formStyles.auth_form}>
                            <View style={{marginTop: scale(0)}}>

                                {!!this.state.logInUserData && ( <Text
                                    style={{
                                        fontSize: scale(15),
                                        fontFamily: 'AvenirLTStd-Light',
                                        // paddingLeft: scale(19),
                                        color: Colors.greyText,
                                        marginBottom: scale(15)
                                    }}
                                >Please change your pin to continue</Text>)}
                                <View>
                                    <View>
                                        <FloatingLabelInput
                                            label="Old PIN"
                                            value={old_password}
                                            secureTextEntry={!this.state.passwordShow}
                                            underlineColorAndroid={'transparent'}
                                            keyboardType={'numeric'}
                                            maxLength={6}
                                            multiline={false}
                                            style={{paddingRight: scale(50)}}
                                            autoCorrect={false}
                                            onChangeText={text => this.setState({old_password: text, old_password_error: ''})}
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
                                                        color: '#555',
                                                        fontFamily: 'graphik-regular',
                                                        fontSize: scale(13)
                                                    }}>{!this.state.passwordShow ? 'SHOW' : 'HIDE'}
                                                    </Text>
                                                </TouchableOpacity>)
                                        }
                                        <Text style={formStyles.error}>{this.state.old_password_error}</Text>
                                    </View>

                                </View>
                                <View>
                                    <View>
                                        <FloatingLabelInput
                                            label="New PIN"
                                            value={new_password}
                                            secureTextEntry={!this.state.confirm_passwordShow}
                                            underlineColorAndroid={'transparent'}
                                            keyboardType={'numeric'}
                                            multiline={false}
                                            maxLength={4}
                                            style={{paddingRight: scale(50)}}
                                            autoCorrect={false}
                                            onChangeText={text => this.setState({
                                                new_password: text,
                                                new_password_error: ''
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
                                                        color: '#555',
                                                        fontFamily: 'graphik-regular',
                                                        fontSize: scale(13)
                                                    }}>{!this.state.confirm_passwordShow ? 'SHOW' : 'HIDE'}
                                                    </Text>
                                                </TouchableOpacity>)
                                        }
                                        <Text style={formStyles.error}>{this.state.new_password_error}</Text>
                                    </View>

                                </View>
                                <View>
                                    <View>
                                        <FloatingLabelInput
                                            label="Confirm New PIN"
                                            value={confirm_new_password}
                                            secureTextEntry={!this.state.confirm_passwordShow}
                                            underlineColorAndroid={'transparent'}
                                            keyboardType={'numeric'}
                                            multiline={false}
                                            maxLength={4}
                                            style={{paddingRight: scale(50)}}
                                            autoCorrect={false}
                                            onChangeText={text => this.setState({
                                                confirm_new_password: text,
                                                confirm_new_password_error: ''
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
                                        {/*{*/}
                                            {/*this.state.confirm_password !== '' && (*/}
                                                {/*<TouchableOpacity onPress={this.showConfirmPassword}*/}
                                                                  {/*style={formStyles.showpassword}>*/}
                                                    {/*<Text style={{*/}
                                                        {/*color: '#555',*/}
                                                        {/*fontFamily: 'graphik-regular',*/}
                                                        {/*fontSize: scale(13)*/}
                                                    {/*}}>{!this.state.confirm_passwordShow ? 'SHOW' : 'HIDE'}*/}
                                                    {/*</Text>*/}
                                                {/*</TouchableOpacity>)*/}
                                        {/*}*/}
                                        <Text style={formStyles.error}>{this.state.confirm_new_password_error}</Text>
                                    </View>

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
                    </KeyboardAwareScrollView>
                </View>
            </View>
        );
    }

    validate = () => {

        const { old_password, new_password,confirm_new_password} = this.state;

        let error = false;

        if (old_password === '') {
            this.setState({
                old_password_error: "Please enter the old PIN",
            })
            error = true;
        }

        if (new_password === '') {
            this.setState({
                new_password_error: "Please enter your new PIN",
            })
            error = true;
        }
        if (confirm_new_password === '') {
            this.setState({
                confirm_new_password_error: "Please confirm your new PIN",
            })
            error = true;
        }
        if (new_password !== confirm_new_password) {
            this.setState({
                confirm_new_password_error: "Please ensure new PINs match",
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
    showToast,
    hideToast,
    loginUserSuccess
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withNavigationFocus(ChangePin));
