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
import Header from '../../components/Header/OtherHeader';
import TouchItem from '../../components/TouchItem/_TouchItem'
import DateTimePicker from "react-native-modal-datetime-picker";


// import {
//     handleForgotPassword,
//     resetAuthData, loginUserSuccess, getExtraDetails,
// } from './action/auth_actions';
import {
    ButtonWithBackgroundText,
    ButtonWithBackgroundBottom
} from '../../components/Button/Buttons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { axiosInstance } from "../../lib/api/axiosClient";
import {
    checkfull_names, postAddBank, postBankDetails,
    postVerifyBankAccount, postWithdrawFromWallet
} from "../../lib/api/url";
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { withNavigationFocus } from 'react-navigation';
import { formStyles } from "../../../assets/styles/styles";
import { HeaderText } from "../../components/HeaderText/HeaderText";
import { showToast, hideToast } from "../../components/Toast/actions/toastActions";
import { scale } from "../../lib/utils/scaleUtils";
// import { resetCache } from "./action/auth_actions";
import * as WebBrowser from "expo-web-browser";
import { Colors } from "../../lib/constants/Colors";
import { LoaderText } from "../../components/Loader/Loader";
import * as Icon from "@expo/vector-icons";
import { apiRequest } from "../../lib/api/api";
import moment from 'moment';
import { getBanks } from "../Wallet/action/wallet_actions";
import { formatAmount } from "../../lib/utils/helpers";
import {getAllBanks} from "../Account/action/account_actions";
import {getWalletBalance, getAllWalletTransactions} from "../Wallet/action/wallet_actions";
import { PinScreen } from "../../components/PinScreen/PinScreen";


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
            pinScreenVisible:false
        }
    }


    componentDidMount() {
        // this.props.getBanks()
    }


    submit = (pin) => {
        let account_number = this.props.navigation.getParam('account_number', '')
        let bank = this.props.navigation.getParam('bank', '')


        this.setState({
            loading: true,
            modalLoader: true
        }, () => {
            apiRequest(postAddBank, 'post', {
                "account_number": account_number,
                "bank_code": bank.additional_code
            })
                .then(res => {
                    console.log(res)
                    this.setState({
                        loading: false
                    }, () => {
                        if (res.status === 'success') {
                            this.transfer(pin, res.data);
                            // this.props.showToast('Successfully created account', 'success');

                        } else {
                            this.props.navigation.goBack();
                            this.setState({
                                pinScreenVisible: false
                            })
                            this.props.showToast(res.message, 'error')
                        }
                    })
                })
                .catch(error => {
                    console.log(error.response)
                    //
                    if (error.response) {
                        this.setState({
                            wrongPinError: error.response.data.message
                        })
                    } else {
                        this.setState({
                            wrongPinError: error.message
                        })
                    }
                    this.setState({
                        loading: false,
                        pinScreenVisible: false
                    })
                });
        })
    };


    transfer = (pin, bank) => {
        let {selected, account_number} = this.state


        // if (this.validate()) return;
        Keyboard.dismiss();
        let {email, password, full_name} = this.state;

        const {navigation, loanDetails} = this.props;
        let amount = navigation.getParam('amount', '')


        this.setState({
            loading: true,
            modalLoader: true
        }, () => {
            apiRequest(postWithdrawFromWallet, 'post', {
                "amount": Number(String(amount).split(',').join('')),
                "bank_id": bank.id,
                pin
            })
                .then(res => {
                    console.log(res)
                    this.setState({
                        loading: false,
                        pinScreenVisible: false
                    }, () => {

                        if (res.status === 'success') {
                            this.props.navigation.navigate('Success', {
                                title: 'Success!',
                                description: `Your ₦${amount} transfer to ${bank.account_name} was successful`,
                                buttonText: 'Go to Dashboard',
                                redirect: 'Home'
                            });
                            this.props.getAllBanks();
                            this.props.getWalletBalance();
                            this.props.getAllWalletTransactions();
                            // this.props.showToast('Successfully created account', 'success');

                        } else {
                            this.props.showToast(res.message, 'error')
                        }
                    })
                })
                .catch(error => {
                    console.log(error.response)
                    //
                    if (error.response) {
                        this.setState({
                            wrongPinError: error.response.data.message
                        })
                    } else {
                        this.setState({
                            wrongPinError: error.message
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
                onPress={() => this.setState({pinScreenVisible:true})}
                style={{width: '100%'}}

            >
                {loading && (<ActivityIndicator size="large" color="#fff"/>)}
                {!loading && (<ButtonWithBackgroundText>{'Continue'}</ButtonWithBackgroundText>)}
            </ButtonWithBackgroundBottom>
        );
    };



    render() {
        let account_number = this.props.navigation.getParam('account_number', '')
        let bank = this.props.navigation.getParam('bank', '')
        let account_name = this.props.navigation.getParam('account_name', '')
        let amount = this.props.navigation.getParam('amount', '')

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
                    <PinScreen
                        handleSubmit={this.submit}
                        visible={this.state.pinScreenVisible}
                        loading={this.state.loading}
                        wrongPinError={this.state.wrongPinError}
                        resetError={() => {
                            this.setState({
                                wrongPinError: ''
                            })
                        }}
                        close={() => {
                            this.setState({pinScreenVisible: false})
                        }}/>
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
                        <Header title={"Confirm"} leftIcon={"ios-arrow-back"}
                                onPressLeftIcon={() => this.props.navigation.goBack()}
                        />

                        <View style={[formStyles.auth_form, {flex: 1, marginTop:scale(10)}]}>
                            <Text style={[styles.title,{marginBottom:scale(54)}]}>Transfer ₦{amount} to</Text>
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
                            <TouchItem onPress={()=>this.props.navigation.goBack()} style={{
                                alignItems:'center',
                                width:'100%',
                                marginBottom:scale(40)
                            }}>
                                <Text style={{
                                    fontSize:scale(12),
                                    fontFamily:'graphik-semibold',
                                    color:Colors.tintColor
                                }}>Wrong Account?</Text>
                            </TouchItem>
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
    // loginUserSuccess,
    // handleForgotPassword,
    // resetAuthData,
    showToast,
    getAllBanks,
    getAllWalletTransactions,
    getWalletBalance,
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
        lineHeight: scale(32),
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