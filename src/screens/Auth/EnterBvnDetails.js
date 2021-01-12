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
import DateTimePicker from "react-native-modal-datetime-picker";
import { Appearance } from 'react-native-appearance';


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
import {
    postLogin,
    postRegister,
    checkfull_names,
    postAuthInit,
    postCreatePassword,
    postVerifyBVN, confirmBVN
} from "../../lib/api/url";
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
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
import { apiRequest } from "../../lib/api/api";
import moment from 'moment'


const ACCESS_TOKEN = 'access_token';
const colorScheme = Appearance.getColorScheme();

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
            lastFiveDigits: '',
            dob: '',
            isDateTimePickerVisible: false,
        }
    }

    handleDatePicked = date => {
        console.warn("A date has been picked: ", date);
        this.formatDate(date)
        this.hideDateTimePicker();
    };


    formatDate(date) {

        this.setState({
            dob: moment(date).format('DD/MM/YYYY'),
            formError:"",
            dob_error:""
        })

        // this.setState({birthdaydate: mths[month] + " " + day + ", " + year})

    }

    hideDateTimePicker = () => {
        this.setState({isDateTimePickerVisible: false});
    };


    submit = () => {
        let {dob, lastFiveDigits} = this.state


        Keyboard.dismiss();
        let {email, password, full_name} = this.state;

        let data = this.props.navigation.getParam('data', '')
        let mobile = data.data.mobile
        let bvn = data.data.bvn
        // let mobile = '232302';
        // let bvn = '';


        if (mobile.substr(mobile.length - 5) !== lastFiveDigits) {
            this.setState({
                formError:'The digits you have entered don\'t match what is registered on your BVN.'
            })
            // this.props.showToast("Last 5 digits of BVN number don't match", 'error')
            return
        }

        if (!dob) {
            this.setState({
                dob_error:'Please select Date of Birth to continue'
            })
            // this.props.showToast("Please select Date of Birth to continue", 'error')
            return
        }


        this.setState({
            loading: true,
            modalLoader: true
        }, () => {
            apiRequest(confirmBVN, 'post', {
                "bvn": bvn,
                "bvn_phone_number": mobile,
                "dob":  moment(dob,'DD/MM/YYYY').format('YYYY/MM/DD')
            })
                .then(res => {
                    console.log(res)
                    this.setState({
                        loading: false
                    }, () => {

                        if (res.status === 'success') {
                            this.props.loginUserSuccess({
                                stage_id:res.data.stage_id
                            })
                            this.props.navigation.navigate('EnterEmail')
                        } else {
                            this.setState({
                                formError:res.message
                            })
                            // this.props.showToast(res.data.message, 'error')
                        }
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
            password: text
        }, () => {
            this.validate()
        })
    }


    render() {
        const {navigate} = this.props.navigation;
        const {email, password, full_name, phone, lastFiveDigits} = this.state;
        let data = this.props.navigation.getParam('data', '')
        var eighteenYearsAgo = new Date();
        eighteenYearsAgo = eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear()-18);
        eighteenYearsAgo = new Date(eighteenYearsAgo)
        let mobile = data.data.mobile;
        // let mobile=''

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
                    <LoaderText visible={this.state.loading} desciption={'Checking your details...'}/>
                    <KeyboardAwareScrollView
                        style={{backgroundColor: 'transparent'}}
                        // resetScrollToCoords={{x: 0, y: 0}}
                        resetScrollToCoords={{x: 0, y: 0}}
                        contentContainerStyle={formStyles.container}
                        scrollEnabled={true}
                        keyboardShouldPersistTaps={'never'}
                        enableOnAndroid={true}
                        alwaysBounceVertical={false}
                        bounces={false}
                    >
                        <Header leftIcon={"ios-arrow-back"}
                                onPressLeftIcon={() => this.props.navigation.goBack()}/>

                        <View style={[formStyles.auth_form, {flex: 1}]}>
                            <Text style={styles.title}>Hello {data.data.first_name}, please verify that this BVN belongs to you</Text>
                            <Text style={[formStyles.formError]}>{this.state.formError}</Text>

                            <View style={{marginTop: scale(0)}}>

                                <View style={{marginTop: scale(70)}}>
                                    <Text style={styles.label}>{`Enter last 5 digits of phone number starting with ${mobile.substr(0, 6).startsWith('+234') ?
                                        mobile.substr(0, 6).replace('+234', '0') : mobile.substr(0, 6).startsWith('234') ? mobile.substr(0, 6).replace('234', '0') : mobile.substr(0, 6)}`}</Text>
                                    <FloatingLabelInput
                                        label={``}
                                        value={lastFiveDigits}
                                        underlineColorAndroid={'transparent'}
                                        keyboardType={'phone-pad'}
                                        maxLength={5}
                                        multiline={false}
                                        style={{marginBottom: scale(12), height: scale(30)}}
                                        // ref={component => this._textInput = component}
                                        // style={(this.state.formError)?{  borderBottomColor: '#CA5C55',marginBottom: scale(12), height: scale(30)}:{marginBottom: scale(12), height: scale(30)}}
                                        autoCorrect={false}
                                        onChangeText={text => this.setState({
                                            lastFiveDigits: text,
                                            lastFiveDigits_error: '',
                                            formError:""
                                        })}
                                    />

                                    <Text style={formStyles.error}>{this.state.lastFiveDigits_error}</Text>
                                </View>
                                <Text style={styles.otherText}>
                                    This must be the mobile number registered on your BVN
                                </Text>

                                <View style={{marginTop: scale(40), marginBottom: scale(30)}}>
                                    <Text style={styles.label}>Date of Birth</Text>
                                    <TouchItem
                                        style={styles.option}
                                        onPress={() => this.setState({
                                            isDateTimePickerVisible: true
                                        })}>
                                        <Text
                                            style={styles.optionText}>{this.state.dob}</Text>
                                        <MaterialIcons name={"keyboard-arrow-down"}
                                                       size={scale(20)}
                                                       color={'#666'}/>
                                    </TouchItem>

                                    <Text style={[formStyles.error,{bottom:-15}]}>{this.state.dob_error}</Text>
                                </View>

                            </View>
                            <View style={{marginBottom: scale(10)}}>
                                {this.renderButton()}
                            </View>
                        </View>
                        <DateTimePicker
                            isVisible={this.state.isDateTimePickerVisible}
                            onConfirm={this.handleDatePicked}
                            onCancel={this.hideDateTimePicker}
                            date={this.state.dob?moment(this.state.dob,"DD/MM/YYYY").toDate():new Date()}
                            isDarkModeEnabled = {colorScheme === 'dark'}
                            maximumDate={eighteenYearsAgo}
                        />
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
    option: {
        // paddingHorizontal: scale(9),
        paddingVertical: scale(7),
        borderBottomWidth: scale(1),
        // borderColor: Colors.darkBlue,
        borderBottomColor: '#9AA5B1',
        marginRight: scale(12),
        // marginBottom: scale(5),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between"
        // borderRadius: scale(3)
    },
    optionText: {
        color: 'black',
        fontFamily: 'graphik-regular',
        fontSize: scale(16),
    },
    label: {
        fontFamily: 'graphik-regular',
        fontSize: scale(12),
        color: '#112945'
    },
    otherText: {
        fontSize: scale(12),
        color: '#112945',
        // textAlign: 'center',
        fontFamily: "graphik-regular",
        lineHeight: scale(20)
        // marginTop: scale(24),
    },
    passwordCheckArea: {flexDirection: 'row', alignItems: 'center', width: scale(145), justifyContent: 'space-between'}
})