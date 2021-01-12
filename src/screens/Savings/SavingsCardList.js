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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import {getTheRunningLoan} from "./action/loan_actions";
import { axiosInstance } from "../../lib/api/axiosClient";
import {
    postLogin,
    postRegister,
    checkfull_names,
    postAuthInit,
    postCreatePassword,
    postAddEmail, postChangePassword, postCreateLoan, postRepayLoan, getSavingsBalance, postTopUpSavings
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
// import {getAllLoans} from "./action/loan_actions";
import {updateSavingsDetails} from "./action/savings_actions";
import {getMySavings} from "./action/savings_actions";
import cards from "../../../assets/images/cards/cards";
import { getAllWalletTransactions, getWalletBalance } from "../Wallet/action/wallet_actions";



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
            isCardPage: false,
            selected: 0,
            pinScreenVisible: false,
            wrongPinError: '',
            card:''
        }
    }


    componentDidMount() {
        console.log(this.props.navigation)
        this.props.getAllCards()
    }


    submit = (pin) => {
        Keyboard.dismiss();
        let {email, password, full_amount} = this.state;
        const {navigation, loanDetails} = this.props;
        let details = navigation.getParam('details', '')
        let redirect = navigation.getParam('redirect', '')
        let amount = navigation.getParam('amount', '')

        console.log(redirect)
        if(redirect === 'ConfirmSavingsDetails'){
            this.props.updateSavingsDetails({
                card_id: this.state.selected
            })
            this.props.navigation.navigate('ConfirmSavingsDetails')
            return
        }

        if(redirect === 'EditSavingsPlan'){
            this.props.navigation.navigate('EditSavingsPlan',{
                card:this.state.card
            })
            return
        }

        let params = {
            "amount":Number(String(amount).split(',').join('')),
            // "card_id": this.state.selected
        }

        if(this.state.selected === 'wallet'){
            params.use_wallet = true
        }else{
            params.card_id = this.state.selected
        }

        this.setState({
            loading: true
        }, () => {
            apiRequest(postTopUpSavings(details.id), 'post',params)
                .then(res => {
                    console.log(res)
                    this.setState({
                        loading: false
                    }, () => {
                        if (res.status === 'success') {

                            this.props.getMySavings();
                            this.props.getWalletBalance();
                            this.props.getAllWalletTransactions();
                            this.props.navigation.navigate('Success', {
                                title: 'Congrats!',
                                description: 'Your plan has been topped up with ₦' + amount,
                                buttonText: 'Done',
                                redirect: 'Savings'
                            });

                        } else {
                            this.props.navigation.goBack();
                            this.props.showToast(res.message, 'error')
                        }
                    })
                })
                .catch(error => {
                    console.log(error.response)
                    //
                    if (error.response) {
                        this.props.showToast(error.response.data.message, 'error')
                    } else {
                        this.props.showToast(error.message, 'error')
                    }
                    this.setState({
                        loading: false
                    })
                });
        })

    };

    render() {
        const {navigate} = this.props.navigation;
        const {email, password, full_name, phone, selected} = this.state;
        const {navigation, loanDetails} = this.props;
        let loan = navigation.getParam('loan', '')
        let redirect = navigation.getParam('redirect', '')


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

                    <LoaderText visible={this.state.loading} desciption={'Processing...'}/>
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
                        <Header title={"Choose Card"} leftIcon={"ios-arrow-back"}
                                onPressLeftIcon={() => this.props.navigation.goBack()} rightIcon={'Add'}
                                onPressRightIcon={() => this.props.navigation.navigate('AddCard')}/>


                        {/*<View style={{marginTop: scale(40)}}>*/}
                            {/*<Text style={styles.topHeader}>We help you automate your savings using your debit card</Text>*/}
                        {/*</View>*/}
                        <View style={{
                            width: '100%',
                            paddingVertical: scale(27)
                        }}>
                            {!!(redirect === 'TopUp') && (
                                <View style={{
                                    width: '100%',
                                    paddingHorizontal: scale(24)
                                }}>
                                    <View style={{
                                        // paddingHorizontal: scale(24),
                                        marginBottom: scale(16),
                                    }}>
                                        <Text tyle={{
                                            fontSize: scale(14),
                                            fontFamily: 'graphik-regular',
                                            color: '#3C5066',

                                        }}>Top Up using</Text>
                                    </View>
                                    <TouchItem
                                        onPress={() => {
                                            this.setState({
                                                selected: 'wallet'
                                            })
                                        }}
                                        style={[styles.card, {backgroundColor: selected === 'wallet' ? '#DC4F89' : 'white'}]}>
                                        <View style={{padding: scale(16), flex:1,justifyContent:'space-between'}}>

                                            {(selected === 'wallet') && (  <Icon.Ionicons
                                                name={'ios-radio-button-on'}
                                                size={scale(25)}
                                                style={styles.menu}
                                                color={Colors.white}
                                            />)}
                                            {(selected !== 'wallet') && (
                                                <Icon.Ionicons
                                                    name={'ios-radio-button-off'}
                                                    size={scale(25)}
                                                    style={styles.menu}
                                                    color={Colors.tintColor}
                                                />
                                            )}

                                            {/*<Text style={[styles.name, selected !== 'wallet' ? {color: Colors.greyText} : {}]}>{`XXXX XXXX XXXX ${card.card_last4}`}</Text>*/}
                                            <View style={{flexDirection:'row',justifyContent:'space-between', alignItems:'center'}}>
                                                <Text
                                                    style={[styles.number, selected !== 'wallet' ? {color: Colors.greyText} : {}]}>{`Wallet`}</Text>
                                                <Text
                                                    style={[styles.wallet, selected !== 'wallet' ? {color: Colors.greyText} : {}]}>BALANCE: ₦<Text>{
                                                    formatAmount(this.props.wallet.availableBalance)}</Text></Text>
                                            </View>
                                        </View>
                                    </TouchItem>
                                </View>
                            )}

                            <View style={{
                                paddingHorizontal: scale(24)
                            }}>
                                <Text tyle={{
                                    fontSize: scale(14),
                                    fontFamily: 'graphik-regular',
                                    color: '#3C5066',

                                }}>Cards</Text>
                            </View>
                            <View style={{
                                width: '100%',
                                marginTop: scale(16),
                                paddingHorizontal: scale(24)
                            }}>
                                {this.props.cards.map(card => {
                                    let icon = cards[card.card_type]
                                    return <TouchItem
                                        onPress={() => {
                                            this.setState({
                                                selected: card.id,
                                                card
                                            })
                                        }}
                                        style={[styles.card, {backgroundColor: selected === card.id ? '#DC4F89' : 'white'}]}>
                                        <View style={{padding: scale(16)}}>

                                            {(selected === card.id) && (  <Icon.Ionicons
                                                name={'ios-radio-button-on'}
                                                size={scale(25)}
                                                style={styles.menu}
                                                color={Colors.white}
                                            />)}
                                            {(selected !== card.id) && (
                                                <Icon.Ionicons
                                                    name={'ios-radio-button-off'}
                                                    size={scale(25)}
                                                    style={styles.menu}
                                                    color={Colors.tintColor}
                                                />
                                            )}

                                            <Text
                                                style={[styles.name, selected !== card.id ? {color: Colors.greyText} : {}]}>{`XXXX XXXX XXXX ${card.card_last4}`}</Text>
                                           <View style={{flexDirection:'row',justifyContent:'space-between', alignItems:'center'}}>
                                               <Text
                                                   style={[styles.number, selected !== card.id ? {color: Colors.greyText} : {}]}>{`${card.card_exp_month}/${card.card_exp_year}`}</Text>
                                               <Text
                                                   style={[styles.number, selected !== card.id ? {color: Colors.greyText} : {}]}>{`${card.card_exp_month}/${card.card_exp_year}`}</Text>
                                           </View>
                                        </View>
                                        <Image
                                            source={require('../../../assets/images/Vector2.png')}
                                            style={{
                                                width: scale(100),
                                                height: scale(95),
                                                position: 'absolute',
                                                right: 0,
                                                top: 0,
                                                borderRadius: scale(6)
                                            }}
                                            resizeMode={'contain'}
                                        />
                                        <Image
                                            source={icon}
                                            style={{
                                                width: scale(58),
                                                height: scale(28),
                                                position: 'absolute',
                                                right: scale(16),
                                                bottom: scale(16),
                                            }}
                                            resizeMode={'contain'}
                                        />
                                    </TouchItem>
                                })}
                            </View>

                            {(selected !== 0) && (
                                <View style={{
                                    marginBottom: scale(10),
                                    marginTop: scale(30),
                                    paddingHorizontal: scale(24)
                                }}>
                                    {this.renderButton()}
                                </View>
                            )}

                        </View>

                    </KeyboardAwareScrollView>
                </View>
            </View>
        );
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
                {!loading && (<ButtonWithBackgroundText>{'Use this card'}</ButtonWithBackgroundText>)}
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
        wallet: state.wallet,
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
    getMySavings,
    // getAllLoans,
    // getExtraDetails,
    // resetCache,
    hideToast,
    updateSavingsDetails,
    getAllWalletTransactions,
    getWalletBalance
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
        elevation: 2,
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
    wallet:{
        fontSize: scale(12),
        // lineHeight: scale(13),
        fontFamily: 'graphik-semibold',
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
        fontSize: scale(24),
        fontFamily: 'graphik-medium',
        color: Colors.greyText,
        // marginBottom: scale(25),
        textAlign: 'left'
    },
    topAmount: {
        fontSize: scale(32),
        fontFamily: 'graphik-medium',
        color: Colors.greyText,
        textAlign: 'center'
    }

})