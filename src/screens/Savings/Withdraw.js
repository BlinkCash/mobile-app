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
    Modal, TouchableWithoutFeedback, Image, StyleSheet, ScrollView
} from 'react-native';
import { connect } from 'react-redux';
import NavigationService from "../../../NavigationService";
import { FloatingLabelInput } from "../../components/Input/FloatingLabelInput";
import Header from '../../components/Header/OtherHeader';
import TouchItem from '../../components/TouchItem/_TouchItem'

import { loginUserSuccess } from "../Auth/action/auth_actions";
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
    postAddEmail, postChangePassword, postCreateLoan, postRepayLoan, postWithdrawSavings
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
import SwitchToggle from '@dooboo-ui/native-switch-toggle';
import { getAllCards, getAllBanks } from "../Account/action/account_actions";
import FadeInView from "../../components/AnimatedComponents/FadeInView";
import { formatAmount } from "../../lib/utils/helpers";
import { PinScreen } from "../../components/PinScreen/PinScreen";
// import {getAllLoans,getTheRunningLoan} from "./action/loan_actions";
import { TextInputMask } from "react-native-masked-text";
import {getMySavings} from "./action/savings_actions";
import {getWalletBalance, getAllWalletTransactions} from "../Wallet/action/wallet_actions";



const ACCESS_TOKEN = 'access_token';

class Login extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);

        const {navigation} = this.props;
        const balance = navigation.getParam('balance', '');
        const { loanDetails} = this.props;


        this.state = {
            isCardPage: false,
            selected: 0,
            pinScreenVisible: false,
            wrongPinError: '',
            // amount: Number(balance) || 0
            amount:  0

        }
    }


    componentDidMount() {
        this.props.getAllCards()
        // this.props.getAllBanks()
    }


    submit = (pin) => {

        const {navigation, loanDetails} = this.props;
        let details = navigation.getParam('details', '')

        this.setState({
            loading: true,
            wrongPinError:''
            // pinScreenVisible: false
        }, () => {
            apiRequest(postWithdrawSavings(details.id), 'post', {
                // "loan_id": loan.id,
                "pin": pin,
                "amount":Number(String(this.state.amount).split(',').join(''))
            })
                .then(res => {
                    console.log(res)
                    this.setState({
                        loading: false,
                        pinScreenVisible:false
                    }, () => {
                        if (res.status === 'success') {
                            this.props.navigation.navigate('Success', {
                                title: 'Congrats!',
                                description: 'Your withdrawal was successful',
                                buttonText: 'Go to Wallet',
                                redirect: 'Wallet'
                            });
                            // this.props.getAllLoans();
                            //TODO:Add fetch wallet after withdrawing to wallet
                            this.props.getMySavings();
                            this.props.getWalletBalance();
                            this.props.getAllWalletTransactions();

                            // this.props.getTheRunningLoan();
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
                        // pinScreenVisible:false,
                        loading: false
                    })
                });
        })


    };

    render() {
        const {navigate} = this.props.navigation;
        const {email, password, full_name, phone, selected} = this.state;
        const {navigation, loanDetails} = this.props;
        let details = navigation.getParam('details', '')
        console.log(details)

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
                    <PinScreen
                        handleSubmit={this.submit}
                        visible={this.state.pinScreenVisible}
                        loading={this.state.loading}
                        wrongPinError={this.state.wrongPinError}
                        resetError={() => {
                            this.setState({
                                wrongPinError:''
                            })
                        }}
                        close={() => {
                            this.setState({pinScreenVisible: false})
                        }}/>
                    {/*<LoaderText visible={this.state.loading} desciption={'Changing Password, Please wait'}/>*/}
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
                        <Header title={"Withdraw"} leftIcon={"ios-arrow-back"}
                                onPressLeftIcon={() => this.props.navigation.goBack()}/>


                        <View style={[formStyles.auth_form, {flex: 1}]}>

                            <TextInputMask
                                type={'money'}
                                underlineColorAndroid={'transparent'}

                                style={
                                //     {
                                    //     borderBottomWidth: 0,
                                    //     borderBottomColor: 'transparent',
                                    //     fontSize: scale(32),
                                    //     textAlign: 'center'
                                    // }
                                    styles.topAmount
                                }
                                options={{
                                    precision: 2,
                                    separator: '.',
                                    delimiter: ',',
                                    unit: '',
                                    suffixUnit: ''
                                }}
                                multiline={false}
                                autoFocus
                                autoCorrect={false}
                                value={this.state.amount}
                                onChangeText={text => {
                                    this.setState({
                                        amount: text,amount_error:''
                                    })
                                }}
                            />
                            <Text style={styles.topHeader}>Amount (₦)</Text>
                            <Text style={[formStyles.error,{bottom:scale(-10), width:'100%', position:'relative', textAlign:'center'}]}>{this.state.amount_error}</Text>


                            <View style={{flex: 1, flexDirection: 'row', marginBottom: scale(10)}}>
                                <View style={{alignSelf: 'flex-end', width: '100%'}}>
                                    {!details.is_matured && (  <Text style={{
                                        fontSize: scale(12),
                                        // lineHeight: scale(15),
                                        fontFamily: 'graphik-regular',
                                        color: Colors.greyText,
                                        lineHeight:scale(20),
                                        marginBottom: scale(30)
                                    }}>
                                        There will be a 20% penal charge on interest earned if you proceed to make this withdrawal.
                                    </Text>)}
                                    {this.renderButton()}
                                </View>

                            </View>

                            {/*<Text style={styles.topAmount}>{formatAmount(loanDetails.schedule.repayment_amount)}</Text>*/}
                        </View>


                    </KeyboardAvoidingView>
                </View>
            </View>
        );
    }

    renderButton = () => {
        const {loading} = this.state;
        const {navigation, loanDetails} = this.props;
        let details = navigation.getParam('details', '')
        return (
            <ButtonWithBackgroundBottom
                disabled={loading}
                onPress={() => {

                    if(!this.state.amount){
                        this.setState({
                            amount_error:'Enter an amount to continue'
                        })
                        return
                    }

                    this.setState({
                        pinScreenVisible:true
                    })
                }}
                style={{marginBottom:scale(10)}}
                // style={{alignSelf: 'flex-end', width: '100%'}}

            >
                {loading && (<ActivityIndicator size="large" color="#fff"/>)}
                {!loading && (<ButtonWithBackgroundText>{'Withdraw to Wallet'}</ButtonWithBackgroundText>)}
            </ButtonWithBackgroundBottom>
        );
    };


}

const mapStateToProps = (state, ownProps) => {
    return {
        auth: state.authentication,
        loadingCards: state.account.loadingCards,
        loadingBanks: state.account.loadingBanks,
        cards: state.account.cards || [],
        banks: state.account.banks || [],
        loanDetails: state.loan.loanDetails || {},
    };
};

const mapDispatchToProps = {
    loginUserSuccess,
    // handleForgotPassword,
    // resetAuthData,
    getAllCards,
    getAllBanks,
    showToast,
    // getAllLoans,
    // getExtraDetails,
    // resetCache,
    hideToast,
    getMySavings,
    getWalletBalance,
    getAllWalletTransactions
    // getTheRunningLoan
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withNavigationFocus(Login));

const styles = StyleSheet.create({
    card: {
        width: '100%',
        height: scale(95),
        backgroundColor: Colors.tintColor,
        borderRadius: scale(6),
        justifyContent: 'flex-end',
        marginBottom: scale(24),
        shadowColor: 'rgba(18, 22, 121, 0.16)',
        shadowOffset: {
            width: 0,
            height: scale(6)
        },
        shadowRadius: 10,
        shadowOpacity: 1.0,
        elevation: 1,
        borderColor: Platform.OS === 'ios' ?'rgba(98, 149, 218, 0.15)':'transparent',
        borderWidth: Platform.OS === 'ios' ?scale(1):0,
    },
    name: {
        fontSize: scale(14),
        // lineHeight: scale(15),
        fontFamily: 'graphik-regular',
        color: Colors.white,
        marginTop: scale(5)
    },
    number: {
        fontSize: scale(12),
        // lineHeight: scale(13),
        fontFamily: 'graphik-regular',
        color: Colors.white,
        marginTop: scale(5)
    },
    info: {
        fontSize: scale(12),
        lineHeight: scale(13),
        fontFamily: 'graphik-regular',
        color: Colors.white
    },
    topHeader: {
        fontSize: scale(12),
        fontFamily: 'graphik-regular',
        color: '#9AA5B1',
        marginTop: scale(10),
        textAlign: 'center'
    },
    topAmount: {
        fontSize: scale(32),
        fontFamily: 'graphik-medium',
        color: Colors.greyText,
        textAlign: 'center'
    }

})