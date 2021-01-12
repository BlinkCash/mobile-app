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
import { getUserProfile, postLogin } from "../../lib/api/url";
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { withNavigationFocus } from 'react-navigation';
import { formStyles } from "../../../assets/styles/styles";
import { HeaderText } from "../../components/HeaderText/HeaderText";
import { showToast, hideToast } from "../../components/Toast/actions/toastActions";
import { scale, verticalScale } from "../../lib/utils/scaleUtils";
import { resetCache } from "./action/auth_actions";
import { Colors } from "../../lib/constants/Colors";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
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
        // const email = navigation.getParam('email', this.props.auth.email);

        this.state = {
            modalLoader: false,
            passwordShow: false,
            email: '',
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
        // let {status} = await Permissions.askAsync(Permissions.LOCATION);
        // if (status !== 'granted') {
        //     this.setState({
        //         errorMessage: 'Permission to access location was denied',
        //     });
        //     Alert.alert('Permissions', `You'll need to provide permissions to login`);
        //     return
        //     // Alert.alert('', `Permissions were denied`);
        // }
        // let location = await Location.getCurrentPositionAsync({});
        // this.setState({
        //     location
        // })
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


    onhandleLogin = () => {
        Keyboard.dismiss();
        let {email, password} = this.state;

        if (this.validate()) return;

        // this.props.navigation.navigate('LoginPinPad', {
        //     email
        // })

        let token = '';
        let user_id = '';
        this.setState({
            loading: true,
            modalLoader: true
        }, () => {
            axiosInstance
                .post(postLogin, {
                        // "username": this.props.auth.username,
                        "email": email,
                        "password": password
                    }, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                )
                .then(response => {
                    this.props.clearUserData();
                    console.log(response)
                    if (!response.data.status) {
                        this.setState({
                            loading: false,
                        })
                        this.props.showToast(response.data.message, 'error')
                    } else {

                        token = response.data.token;
                        user_id = response.data.user_id;
                        return axiosInstance.post(getUserProfile, {
                            token
                        })
                    }


                })
                .then(res => {
                    console.log(res)
                    this.setState({
                        loading: false,
                    })
                    if (res.data.status) {
                        this.storeToken(token);
                        let userData = res.data.data;
                        userData.access_token = token;
                        userData.email = email;
                        userData.user_id = user_id;

                        this.props.loginUserSuccess(userData);


                        this.props.navigation.navigate('Main')
                        this.props.showToast(res.data.message, 'success')
                    } else {
                        this.props.showToast(res.data.message, 'error')
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
                onPress={() => this.onhandleLogin(false)}
                style={{marginTop: 15}}

            ><ButtonWithBackgroundText>{'LOG IN'}</ButtonWithBackgroundText>
            </ButtonWithBackgroundBottom>
        );
    };

    render() {
        const {navigate} = this.props.navigation;
        const {email, password} = this.state;
        return (
            <ImageBackground
                style={{
                    flex: 1,
                    width: '100%',
                    backgroundColor: '#2C32BE',
                }}
                resizeMode={'cover'}
                // source={require('../../../assets/images/Login/Patterns.png')}
            >
                {!!this.state.loading && (
                    <LoaderText desciption={"Verifying Password..."} visible={this.state.loading}/>
                )}
                <View
                    style={{
                        backgroundColor: 'transparent',
                        paddingTop: scale(10),
                        flex:1,
                        justifyContent:'space-between'
                    }}
                >

                    <View style={{
                        width: '100%',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingHorizontal: scale(20),
                    }}>
                        <Image

                            style={{width: scale(140)}}
                            source={require('../../../assets/logo_white.png')}
                            resizeMode={'contain'}
                        />
                    </View>


                    <TouchItem style={{
                        width: '100%',
                        flex: 1,
                        paddingHorizontal: scale(20),
                        justifyContent:'center',
                        alignItems:'center'
                    }}>
                        <Image

                            style={{height: scale(100)}}
                            source={require('../../../assets/images/Login/fingerprint.png')}
                            resizeMode={'contain'}
                        />

                        <Text
                            style={[formStyles.otherText, {
                                textAlign: 'center',
                                marginTop:scale(25)
                            }]}
                        >
                            Confirm Biometrics
                        </Text>
                    </TouchItem>

                    <View style={{width: '100%', flexDirection: 'row'}}>
                        <TouchItem style={{
                            borderTopWidth: scale(1),
                            borderTopColor: 'rgba(255,255,255,0.1)',
                            minHeight: scale(75),
                            width: '100%',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                            onPress={() => this.props.navigation.navigate('Login')}
                        >
                            <Text
                                style={[formStyles.otherText, {
                                    textAlign: 'center'
                                }]}
                            >
                                Use Password
                            </Text>
                        </TouchItem>

                    </View>
                </View>
            </ImageBackground>
        );
    }

    validate = () => {

        let error = false;
        let emailRegex = /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/;

        if (this.state.email === '') {
            this.setState({
                email_error: "Please enter your username",
            })
            error = true;
        }
        // if (/[a-zA-Z]/.test(this.state.email)) {
        //     if (!emailRegex.test(this.state.email)) {
        //         this.setState({
        //             email_error: "Please enter a valid email",
        //         })
        //         error = true;
        //     }
        // }
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
