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
import { connect } from 'react-redux'
import SelectDropdown from "../../components/SelectPopUp/SelectPopUp";

import NavigationService from "../../../NavigationService";
import { FloatingLabelInput } from "../../components/Input/FloatingLabelInput";
import Header from '../../components/Header/Header';
import TouchItem from '../../components/TouchItem/_TouchItem'
import DateTimePicker from "react-native-modal-datetime-picker";


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
    checkfull_names, postBankDetails,
    postVerifyBankAccount
} from "../../lib/api/url";
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
import { apiRequest } from "../../lib/api/api";
import moment from 'moment';
import { getBanks } from "../Wallet/action/wallet_actions";


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
            account_number: '',
            bank_code: '',
            bank: '',
            isDateTimePickerVisible: false,
        }
    }


    componentDidMount() {
        this.props.getBanks()
    }

    validate = () => {

        let error = false;
        let phoneRegex = /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/;

        if (this.state.account_number === '') {
            this.setState({
                account_number_error: "Please enter your account number",
            })
            error = true;
        }
        if (this.state.bank === '') {
            this.setState({
                bank_error: "Please select a bank",
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


    submit = () => {

        Keyboard.dismiss();

        let account_number = this.props.navigation.getParam('account_number', '')
        let bank = this.props.navigation.getParam('bank', '')


        console.log({
            "account_number": account_number,
            "bank_code": bank.additional_code
        })
        this.setState({
            loading: true,
            modalLoader: true,
            formError:''
        }, () => {
            apiRequest(postBankDetails, 'post', {
                "account_number": account_number,
                "bank_code": bank.additional_code
            })
                .then(res => {
                    console.log(res)
                    this.setState({
                        loading: false
                    }, () => {

                        if(res.status ==='success'){
                            this.props.navigation.navigate('EnterPin')
                            this.props.loginUserSuccess({
                                stage_id:res.data.stage_id
                            })
                        }else{
                            this.setState({
                                formError:res.message
                            })
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

    onChangeBankOption = (obj) => {
        this.setState({
            bank: obj,
            bank_error:''
        })
    }

    renderButton = () => {
        const {loading} = this.state;
        return (
            <ButtonWithBackgroundBottom
                disabled={loading}
                onPress={() => this.submit()}
                style={{width: '100%'}}

            >
                {loading && (<ActivityIndicator size="large" color="#fff"/>)}
                {!loading && (<ButtonWithBackgroundText>{'Continue'}</ButtonWithBackgroundText>)}
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
        let account_number = this.props.navigation.getParam('account_number', '')
        let bank = this.props.navigation.getParam('bank', '')
        let account_name = this.props.navigation.getParam('account_name', '')

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
                    <LoaderText visible={this.state.loading} desciption={'Saving your account details...'}/>
                    <KeyboardAwareScrollView
                        style={{backgroundColor: 'transparent', flex: 1}}
                        // resetScrollToCoords={{x: 0, y: 0}}
                        contentContainerStyle={formStyles.containerNoHeight}
                        scrollEnabled={true}
                        keyboardShouldPersistTaps={'handled'}
                        enableOnAndroid={true}
                        alwaysBounceVertical={false}
                        bounces={false}
                    >
                        <Header leftIcon={"ios-arrow-back"}
                                onPressLeftIcon={() => this.props.navigation.goBack()}/>

                        <View style={[formStyles.auth_form, {flex: 1, marginTop:scale(10)}]}>
                            <Text style={[styles.title,{marginBottom:scale(54)}]}>Confirm your account</Text>
                            {!!this.state.formError && (
                                <Text style={[formStyles.formError,{marginTop:scale(10),marginBottom:scale(10)}]}>{this.state.formError}</Text>
                            )}
                            <View style={{
                                marginTop: scale(0),
                                borderWidth: scale(1),
                                borderColor:'rgba(17, 41, 69, 0.1)',
                                shadowColor: 'rgba(0, 0, 0, 0.09)',
                                backgroundColor:'white',
                                shadowOffset: {
                                    width: 0,
                                    height: scale(6)
                                },
                                shadowRadius: 4,
                                shadowOpacity: 1.0,
                                elevation: 2,
                                borderRadius:scale(scale(8)),
                                paddingVertical: scale(20),
                                justifyContent:'space-between',
                                minHeight:scale(250),
                                alignItems:'center',
                                marginBottom:scale(54)
                            }}>
                               <View>
                                   <Text style={styles.otherTitle}>Account Number</Text>
                                   <Text style={styles.otherText}>{account_number}</Text>
                               </View>
                                <View>
                                    <Text style={styles.otherTitle}>Account Name</Text>
                                    <Text style={styles.otherText}>{account_name}</Text>
                                </View>
                                <View>
                                    <Text style={styles.otherTitle}>Bank</Text>
                                    <Text style={styles.otherText}>{bank.label}</Text>
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



    showPassword = () => {
        this.setState({
            passwordShow: !this.state.passwordShow
        })
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        auth: state.authentication,
        banks: state.wallet.banks || []
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
    getBanks
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withNavigationFocus(Login));

const styles = StyleSheet.create({
    otherTitle: {
        fontSize: scale(12),
        color: Colors.greyText,
        // textAlign: 'center',
        fontFamily: "graphik-regular",
        lineHeight: scale(32),
        marginBottom: scale(5),
        textAlign: 'center'
        // marginTop: scale(24),
    },
    title: {
        fontSize: scale(24),
        color: Colors.greyText,
        // textAlign: 'center',
        fontFamily: "graphik-medium",
        lineHeight: scale(32)
        // marginTop: scale(24),
    },

    otherText: {
        fontSize: scale(26),
        textAlign: 'center',
        color: '#112945',
        // textAlign: 'center',
        fontFamily: "graphik-medium",
        marginBottom: scale(10),
        // marginTop: scale(24),
    },
    passwordCheckArea: {flexDirection: 'row', alignItems: 'center', width: scale(145), justifyContent: 'space-between'},
    select: {
        color: '#112945',
        borderBottomWidth: 1,
        borderBottomColor: '#9AA5B1',
        width: '100%',
        height: scale(50),
        justifyContent: 'space-between',
        paddingBottom: scale(8)
    },
    value: {
        fontSize: scale(16),
        color: Colors.greyText,
        fontFamily: 'graphik-regular',
    },
})