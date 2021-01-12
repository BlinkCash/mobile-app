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
    Modal, TouchableWithoutFeedback, Image, BackHandler
} from 'react-native';
import { connect } from 'react-redux';
import NavigationService from "../../../NavigationService";
import { FloatingLabelInput } from "../../components/Input/FloatingLabelInput";
import Header from '../../components/Header/Header';
import { clearUserData } from "../Home/action/home_actions";
import * as LocalAuthentication from 'expo-local-authentication';
import Constants from 'expo-constants';
// import { Analytics, PageHit, ScreenHit } from 'expo-analytics';



import {
    handleForgotPassword,
    resetAuthData, loginUserSuccess, getExtraDetails, updateUserData
} from './action/auth_actions';
import {
    ButtonWithBackgroundText,
    ButtonWithBackgroundBottom
} from '../../components/Button/Buttons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { axiosInstance } from "../../lib/api/axiosClient";
import { getUserProfile, postLogin, authSettings } from "../../lib/api/url";
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
import * as Icon from "@expo/vector-icons";
import { clearLoanDetails } from "../Loan/action/loan_actions";
import FadeInView from "../../components/AnimatedComponents/FadeInView";


const ACCESS_TOKEN = 'access_token';

class Login extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);

        const {navigation} = this.props;
        const phone = navigation.getParam('phone', this.props.auth.phone);

        this.state = {
            modalLoader: false,
            passwordShow: false,
            phone,
            password: '',
            registerModalVisible: false,
            forgotPasswordModalVisible: false,
            loading: false,
            showSuccessModal: false,
            showAndroidFingerPrintAlert: false,
            fingerprintEnabled: false,
            rememberMeChecked: true,
            hasFaceIDSupport: false,
        }
    }


    async componentDidMount() {
        this.checkDeviceForHardware();

        // this.props.navigation.navigate('EnterPicture')
        //send google analytics
        // const analytics = new Analytics('UA-156102127-1', null, { debug: true });
        // analytics.hit(new PageHit('Login'))
        //     .then(() => console.log("success"))
        //     .catch(e => console.log(e.message));

        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {

            if(this.props.isFocused){

                Alert.alert(
                    'Confirm',
                    'Do you want to exit the app?',
                    [
                        {
                            text: 'No',
                            onPress: () => this.handleCancel(),
                            style: 'cancel',
                        },
                        {text: 'Yes', onPress: () => this.handleBackPress()},
                    ],
                    {cancelable: false},
                );

                // that.setState({
                //     backDialogVisible:true
                // })
            }
            return true
        });
    }

    handleBackPress = () => {
        BackHandler.exitApp(); // works best when the goBack is async
        return true;
    }

    handleCancel = () => {
        this.setState({backDialogVisible: false});
    };


    componentWillUnmount() {
        if(this.backHandler){
            this.backHandler.remove()
        }

    }


    checkDeviceForHardware = async () => {
        let compatible = await LocalAuthentication.hasHardwareAsync();

        if (compatible) {
            this.checkForBiometrics()
        }
    };

    checkForBiometrics = async () => {
        let biometricRecords = await LocalAuthentication.isEnrolledAsync();
        if (!biometricRecords) {
            console.log('Please ensure you have set up biometrics in your OS settings.');
        } else {
            let hasFaceIDSupport = false;

            if (Constants.platform.ios) {
                if (
                    Constants.platform.ios.model === '' ||
                    Constants.platform.ios.model.includes('X')
                ) {
                    hasFaceIDSupport = true;
                } else {
                    if (
                        Constants.platform.ios.model === 'Simulator' &&
                        Constants.deviceName.includes('X')
                    ) {
                        hasFaceIDSupport = true;
                    }
                }
            }
            this.setState({fingerprintEnabled: true, hasFaceIDSupport}, () => {
                console.log(this.props.auth.useLoginBiometrics)
                if (!!this.props.auth.useLoginBiometrics && !!this.props.auth.password && !!this.state.fingerprintEnabled) {
                    this.useFingerPrintLogin()
                }
            })
        }
    };


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


    goToPage = (userData) => {
        console.log(userData)
        let {stage_id, activated} = userData


        if (activated === 1) {
            this.props.navigation.navigate('Home')
        } else if (stage_id === 1) {
            this.props.navigation.navigate('EnterBVN')
        } else if (stage_id === 2) {
            this.props.navigation.navigate('EnterEmail')
        } else if (stage_id === 3) {
            this.props.navigation.navigate('EnterPicture')
        } else if (stage_id === 4) {
            this.props.navigation.navigate('EnterBankDetails')
        } else if (stage_id === 5) {
            this.props.navigation.navigate('EnterPin')
        } else {
            this.props.navigation.navigate('Home')
        }
    }

    onhandleLogin = () => {
        Keyboard.dismiss();
        let {phone, password} = this.state;

        if (this.validate()) return;

        // this.props.navigation.navigate('LoginPinPad', {
        //     phone
        // })

        let token = '';
        this.setState({
            loading: true,
            modalLoader: true
        }, () => {
            axiosInstance
                .post(postLogin, {
                        "phone_number": phone,
                        "password": password
                    }, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                )
                .then(async(res) => {
                    this.props.clearUserData();
                    this.props.resetCache();
                    // this.props.clearLoanDetails();
                    token = res.data.data.token;
                    console.log(res)
                    this.setState({
                        loading: false,
                    })
                    if (res.data.status === 'success') {
                        this.storeToken(token);
                        let userData = {...res.data.data};
                        userData.access_token = res.data.data.token;
                        userData.stage_id = res.data.data.stage_id;
                        userData.activated = res.data.data.activated;
                        userData.phone = phone;
                        userData.password = password;
                        const response = await axiosInstance.get(authSettings);
                        await AsyncStorage.setItem('utility_service_header', response.data.data.utility_service_header.key)
                        console.log(response.data.data.utility_service_header, '%%%%%%%%=======>>>>>>>')
                        this.props.loginUserSuccess(userData);
                        // this.props.showToast(res.data.message, 'success');
                        this.goToPage(userData)
                    } else {
                        this.props.showToast(res.data.message, 'error')
                    }

                })
                .catch(error => {
                    console.log(error)
                    if (error.response) {
                        this.props.showToast(error.response.data.message, 'error')
                        console.log(error.response)
                    } else {
                        this.props.showToast(error.message, 'error')
                    }
                    this.setState({
                        loading: false,
                    })
                });
        })
    };

    onhandleLoginFingerPrint = () => {
        Keyboard.dismiss();
        let {phone, password} = this.state;

        if (this.state.phone === '') {
            this.setState({
                phone_error: "Please enter your mobile number",
            })
            return
        }

        let token = '';
        this.setState({
            loading: true,
            modalLoader: true
        }, () => {
            axiosInstance
                .post(postLogin, {
                        "phone_number": phone,
                        "password": this.props.auth.password
                    }, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    this.props.clearUserData();
                    this.props.resetCache();
                    this.props.clearLoanDetails();
                    token = res.data.data.token;
                    console.log(res)
                    this.setState({
                        loading: false,
                    })
                    if (res.data.status === 'success') {
                        this.storeToken(token);
                        let userData = {...res.data.data};
                        userData.access_token = res.data.data.token;
                        userData.stage_id = res.data.data.stage_id;
                        userData.activated = res.data.data.activated;
                        userData.phone = phone;

                        this.props.loginUserSuccess(userData);
                        // this.props.showToast(res.data.message, 'success');
                        this.goToPage(userData)
                    } else {
                        this.props.showToast(res.data.message, 'error')
                    }

                })
                .catch(error => {
                    console.log(error)
                    if (error.response) {
                        this.props.showToast(error.response.data.message, 'error')
                        console.log(error.response)
                    } else {
                        this.props.showToast(error.message, 'error')
                    }
                    this.setState({
                        loading: false,
                    })
                });
        })
    };

    renderButton = () => {
        const {loading} = this.state;
        return (
            <ButtonWithBackgroundBottom
                disabled={loading}
                onPress={() => this.onhandleLogin()}
                style={{marginTop: 15}}

            ><ButtonWithBackgroundText>{'LOG IN'}</ButtonWithBackgroundText>
            </ButtonWithBackgroundBottom>
        );
    };

    render() {
        const {navigate} = this.props.navigation;
        const {phone, password} = this.state;
        return (
            <View style={{
                flex: 1
            }}>
                {!this.state.showFingerPrint && (
                    <FadeInView style={{flex: 1}}>
                        <ImageBackground
                            style={{
                                flex: 1,
                                width: '100%',
                                backgroundColor: '#2C32BE',
                            }}
                            resizeMode={'cover'}
                            source={require('../../../assets/images/Login/Patterns.png')}
                        >
                            {!!this.state.loading && (
                                <LoaderText desciption={"Verifying Password..."} visible={this.state.loading}/>
                            )}
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

                                <View style={{
                                    width: '100%',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    paddingHorizontal: scale(20),
                                }}>
                                    <Image

                                        style={{width: scale(140)}}
                                        source={require('../../../assets/logo_white.png')}
                                        resizeMode={'contain'}
                                    />
                                    <TouchItem onPress={() => this.props.navigation.navigate('EnterNumber')}><Text
                                        style={formStyles.signup}>Sign Up</Text></TouchItem>
                                </View>

                                <View style={{width: '100%', flex: 1}}>
                                    <View style={{marginTop: scale(50), width: '100%', paddingHorizontal: scale(20)}}>
                                        <Text style={formStyles.title}>Welcome Back</Text>
                                        <Text style={formStyles.subtitle}>Please enter your mobile number and password
                                            to get access to
                                            your account.</Text>
                                    </View>
                                    <View style={{width: '100%', height: '100%'}}>
                                        <View style={{paddingHorizontal: scale(20), width: '100%'}}>
                                            <View style={[formStyles.auth_form, {minHeight: verticalScale(250)}]}>
                                                <View>
                                                    <View>
                                                        <FloatingLabelInput
                                                            label="Mobile Number"
                                                            value={phone}
                                                            underlineColorAndroid={'transparent'}
                                                            keyboardType={'numeric'}
                                                            multiline={false}
                                                            autoCorrect={false}
                                                            onChangeText={text => this.setState({
                                                                phone: text,
                                                                phone_error: ''
                                                            })}
                                                        />
                                                        <Text style={formStyles.error}>{this.state.phone_error}</Text>
                                                    </View>


                                                    <View>
                                                        <View>
                                                            <FloatingLabelInput
                                                                label="Password"
                                                                value={password}
                                                                secureTextEntry={!this.state.passwordShow}
                                                                underlineColorAndroid={'transparent'}
                                                                multiline={false}
                                                                style={{paddingRight: scale(50)}}
                                                                autoCorrect={false}
                                                                // keyboardType="number-pad"
                                                                // maxLength={6}
                                                                onChangeText={text => this.setState({
                                                                    password: text,
                                                                    password_error: ''
                                                                })}
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
                                                            <Text
                                                                style={formStyles.error}>{this.state.password_error}</Text>
                                                        </View>

                                                    </View>
                                                </View>
                                                {this.renderButton()}
                                            </View>
                                        </View>

                                        <View style={{
                                            marginTop: scale(16),
                                            width: '100%',
                                            paddingHorizontal: scale(20)
                                        }}>
                                            <TouchableOpacity onPress={() => {
                                                NavigationService.navigate('EnterNumberForgotPassword')
                                            }}
                                            >
                                                <Text
                                                    style={[formStyles.otherText, {
                                                        textAlign: 'right'
                                                    }]}
                                                >
                                                    Forgot your Password?
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    {!!this.props.auth.password && !!this.state.fingerprintEnabled && (
                                        <View style={{flex: 1, width: '100%', flexDirection: 'row'}}>
                                            <TouchItem style={{
                                                alignSelf: 'flex-end',
                                                borderTopWidth: scale(1),
                                                borderTopColor: 'rgba(255,255,255,0.1)',
                                                minHeight: scale(50),
                                                width: '100%',
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}
                                                       onPress={this.useFingerPrintLogin}
                                            >
                                                <Text
                                                    style={[formStyles.otherText, {
                                                        textAlign: 'center'
                                                    }]}
                                                >
                                                    Login with Biometrics?
                                                </Text>
                                            </TouchItem>

                                        </View>)}

                                </View>
                            </KeyboardAwareScrollView>

                        </ImageBackground>
                    </FadeInView>
                )}

                {!!this.state.showFingerPrint && (
                    <FadeInView style={{flex: 1}}>
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
                                    flex: 1,
                                    justifyContent: 'space-between'
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
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <Image

                                        style={{height: scale(100)}}
                                        source={require('../../../assets/images/Login/fingerprint.png')}
                                        resizeMode={'contain'}
                                    />

                                    <Text
                                        style={[formStyles.otherText, {
                                            textAlign: 'center',
                                            marginTop: scale(25)
                                        }]}
                                    >
                                        Use your biometrics to log into BlinkCash
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
                                               onPress={() => {
                                                   LocalAuthentication.cancelAuthenticate();
                                                   this.setState({
                                                       showFingerPrint: false
                                                   })
                                               }}
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
                    </FadeInView>
                )}

                {
                    !!this.state.showAndroidFingerPrintAlert && (
                        <Modal
                            animationType="fade"
                            transparent={true}
                            visible={this.state.showAndroidFingerPrintAlert}
                            onRequestClose={(title, message) => {
                                this.setState({
                                    showAndroidFingerPrintAlert: false
                                }, () => {
                                    LocalAuthentication.cancelAuthenticate();
                                });
                            }}>
                            <View style={{
                                backgroundColor: "rgba(0,0,0, 0.75)",
                                flex: 1,
                                justifyContent: "center",
                                alignItems: 'center'
                            }}>
                                <View style={{
                                    minWidth: scale(250),
                                    backgroundColor: 'white',
                                    padding: scale(20),
                                    borderRadius: scale(5)
                                }}>
                                    <View>
                                        <Text style={formStyles.fingerprintTitle}>Fingerprint Login</Text>
                                        <Text style={formStyles.fingerprintDescription}>Confirm fingerprint to
                                            continue.</Text>


                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'center'
                                        }}>
                                            <Image
                                                source={require('../../../assets/images/fingerprint.png')
                                                }
                                                style={{width: scale(40), height: scale(60), marginRight: scale(10)}}
                                            />
                                            <Text style={[formStyles.fingerprintDescription, {color: '#0275d8'}]}>
                                                Touch Sensor
                                            </Text>
                                        </View>

                                        <TouchableOpacity
                                            style={{width: '100%', paddingTop: scale(10)}}
                                            onPress={() => {
                                                this.setState({
                                                    showAndroidFingerPrintAlert: false
                                                }, () => {
                                                    LocalAuthentication.cancelAuthenticate();
                                                });
                                            }}>
                                            <Text style={[formStyles.fingerprintDescription, {
                                                color: '#0275d8',
                                                alignSelf: 'flex-end',
                                                fontFamily: 'graphik-medium'
                                            }]}>Cancel</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>

                        </Modal>
                    )
                }
            </View>
        );
    }

    useFingerPrintLogin = () => {
        this.setState({
            showFingerPrint: true
        }, () => {
            if (Platform.OS === 'android') {
                this.showAndroidAlert();
            } else {
                this.scanBiometrics();
            }
        })
    }

    showAndroidAlert = () => {
        LocalAuthentication.cancelAuthenticate();
        this.scanBiometrics();
        // this.setState({
        //     showAndroidFingerPrintAlert:true
        // }, () => {
        //     // Alert.alert('Fingerprint Scan', 'Place your finger over the touch sensor.');
        //     this.scanBiometrics();
        // })
    };

    scanBiometrics = async () => {
        let result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Place your finger over the touch sensor.'
        });
        // this.setState({
        //     showAndroidFingerPrintAlert:false
        // })
        if (result.success) {
            this.onhandleLoginFingerPrint(true);
            // this.storeToken(this.props.auth.access_token);
            // this.props.loginUserSuccess(this.props.auth);
            // if (this.props.auth.verifiedMobileNo) {
            //     this.props.navigation.navigate('Main')
            // } else {
            //     this.props.navigation.navigate('VerifyPhoneNumber')
            // }
        } else {
            // LocalAuthentication.cancelAuthenticate();
            this.setState({
                showFingerPrint: false
            })

            console.log('Bio-Authentication failed or canceled.')
        }
    };

    validate = () => {

        let error = false;
        let phoneRegex = /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/;

        if (this.state.phone === '') {
            this.setState({
                phone_error: "Please enter your mobile number",
            })
            error = true;
        }
        if (this.state.password === '') {
            this.setState({
                password_error: "Please enter your password",
            })
            error = true;
        }
        // if (/[a-zA-Z]/.test(this.state.phone)) {
        //     if (!phoneRegex.test(this.state.phone)) {
        //         this.setState({
        //             phone_error: "Please enter a valid phone",
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
    clearUserData,
    clearLoanDetails,
    updateUserData
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withNavigationFocus(Login));
