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
    postAddEmail, postChangePassword, postVerifyBankAccount, postWithdrawFromWallet
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
import FadeInView from "../../components/AnimatedComponents/FadeInView";
import { SvgUri, SvgFromUri } from 'react-native-svg';
import cards from '../../../assets/images/cards/cards';
import { getAllBanks } from "../Account/action/account_actions";
import SelectDropdown from "../../components/SelectPopUp/SelectPopUp";
import { getBanks } from "../Wallet/action/wallet_actions";
import { PinScreen } from "../../components/PinScreen/PinScreen";
import { formatAmount } from "../../lib/utils/helpers";
import { getWalletBalance, getAllWalletTransactions } from "../Wallet/action/wallet_actions";


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
            isBanksPage: false,
            account_number: '',
            bank_code: '',
            bank: '',
            selected: 0,
            message: ''
        }
    }


    componentDidMount() {
        // this.props.getAllCards()
        this.props.getBanks();
        this.props.getAllBanks()
        if(this.props.banks.length){
            this.setState({
                selected:this.props.banks[0].id
            })
        }
    }


    goToPage = () => {
        if (this.state.isBanksPage) {
            this.props.navigation.navigate('AddCard')
        } else {
            this.props.navigation.navigate('AddBank')
        }
    }

    render() {
        const {navigate} = this.props.navigation;
        const {email, password, full_name, selected, isBanksPage} = this.state;

        const {bank_code, account_number, bank} = this.state;

        let userBanks = this.props.userBanks.map(bank => {
            return {
                ...bank,
                label: bank.code_description,
                value: bank.additional_code
            }
        })
        // let icon = ''
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
                    <LoaderText visible={this.state.loadingNewBank} desciption={'Checking your details...'}/>
                    {!!this.props.loadingBanks && (
                        <LoaderText visible={this.props.loadingBanks} desciption={'Loading banks...'}/>
                    )}
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
                        <Header title={"Transfer"} leftIcon={"ios-arrow-back"}
                                onPressLeftIcon={() => this.props.navigation.goBack()}
                            // rightIcon={'Add'}
                            // onPressRightIcon={this.goToPage}
                        />

                        <View>
                            <SwitchToggle
                                buttonText={isBanksPage ? 'New Bank' : 'Your Banks'}
                                backTextRight={isBanksPage ? '' : 'New Bank'}
                                backTextLeft={isBanksPage ? 'Your Banks' : ''}
                                type={1}
                                buttonStyle={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'absolute',
                                    shadowColor: 'rgba(0, 0, 0, 0.05)',
                                    shadowOffset: {
                                        width: 0,
                                        height: scale(4)
                                    },
                                    shadowRadius: 4,
                                    shadowOpacity: 1.0,
                                    elevation: 2
                                }}
                                rightContainerStyle={{
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                leftContainerStyle={{
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'flex-start'
                                }}
                                buttonTextStyle={{
                                    fontSize: scale(12),
                                    color: Colors.tintColor,
                                    fontFamily: 'graphik-regular'
                                }}
                                textRightStyle={{
                                    fontSize: scale(12),
                                    color: Colors.greyText,
                                    fontFamily: 'graphik-regular'
                                }}
                                textLeftStyle={{
                                    fontSize: scale(12),
                                    color: Colors.greyText,
                                    fontFamily: 'graphik-regular'
                                }}
                                containerStyle={{
                                    marginTop: 16,
                                    width: Dimensions.get('window').width - 32,
                                    height: scale(36),
                                    borderRadius: scale(18),
                                    padding: scale(0.5),
                                    backgroundColor: 'green'
                                }}
                                backgroundColorOn="#ECECEC"
                                backgroundColorOff="#ECECEC"
                                circleStyle={{
                                    width: scale(175),
                                    height: scale(34),
                                    borderRadius: scale(17),
                                    // backgroundColor: '#ECECEC', // rgb(102,134,205)
                                }}
                                switchOn={isBanksPage}
                                onPress={() => this.setState({isBanksPage: !isBanksPage})}
                                circleColorOff="white"
                                circleColorOn="white"
                                duration={100}
                            />
                        </View>

                        <View style={{
                            width: '100%',
                            paddingVertical: scale(27)
                        }}>
                            {isBanksPage && (
                                <FadeInView style={{
                                    width: '100%',
                                    paddingHorizontal: scale(24)
                                }}>
                                    <Text
                                        style={[formStyles.formError, {marginTop: scale(15)}]}>{this.state.formError}</Text>
                                    <View style={{marginTop: scale(0)}}>

                                        <View style={{marginTop: scale(0)}}>
                                            <FloatingLabelInput
                                                label={`Account Number`}
                                                value={account_number}
                                                underlineColorAndroid={'transparent'}
                                                keyboardType={'numeric'}
                                                maxLength={10}
                                                multiline={false}
                                                autoCorrect={false}
                                                // style={{marginBottom: scale(12), height: scale(30)}}
                                                onChangeText={text => this.setState({
                                                    account_number: text,
                                                    account_number_error: '',
                                                    formError: ''
                                                })}
                                            />

                                            <Text style={formStyles.error}>{this.state.account_number_error}</Text>
                                        </View>

                                        <View style={{marginTop: scale(30), marginBottom: scale(30)}}>
                                            <SelectDropdown
                                                options={userBanks || []}
                                                value={''}
                                                textStyle={{
                                                    color: '#484848',
                                                    fontFamily: 'effra-medium',
                                                    marginRight: scale(3),
                                                    fontSize: scale(16)
                                                }}
                                                title={`Select Bank`}
                                                onChange={(obj) => this.onChangeBankOption(obj)}
                                            >
                                                <View style={styles.select}
                                                    // onPress={this.onhandleSubmit}
                                                >
                                                    <Text style={styles.label}>Bank Name </Text>
                                                    <Text numberOfLines={1}
                                                          style={[styles.value,{paddingRight:scale(20)}]}>{bank.label || ''}</Text>
                                                </View>
                                            </SelectDropdown>

                                            <Text style={[formStyles.error,{bottom:scale(-15)}]}>{this.state.bank_error}</Text>
                                        </View>

                                        {/*<View style={{marginTop: scale(30), marginBottom: scale(30)}}>*/}
                                        {/*<FloatingLabelInput*/}
                                        {/*label={`Message (Optional)`}*/}
                                        {/*value={this.state.message}*/}
                                        {/*underlineColorAndroid={'transparent'}*/}
                                        {/*maxLength={10}*/}
                                        {/*multiline={false}*/}
                                        {/*autoCorrect={false}*/}
                                        {/*// style={{marginBottom: scale(12), height: scale(30)}}*/}
                                        {/*onChangeText={text => this.setState({*/}
                                        {/*message: text,*/}
                                        {/*message_error: '',*/}
                                        {/*formError: ''*/}
                                        {/*})}*/}
                                        {/*/>*/}
                                        {/*<Text style={formStyles.error}>{this.state.message_error}</Text>*/}


                                        {/*</View>*/}

                                        <ButtonWithBackgroundBottom
                                            disabled={this.state.loadingNewBank}
                                            onPress={() => this.submitNewBank()}
                                            style={{width: '100%'}}

                                        >
                                            {!!this.state.loadingNewBank && (
                                                <ActivityIndicator size="large" color="#fff"/>)}
                                            {!this.state.loadingNewBank && (
                                                <ButtonWithBackgroundText>{'Next'}</ButtonWithBackgroundText>)}
                                        </ButtonWithBackgroundBottom>

                                    </View>
                                </FadeInView>
                            )}
                            {!isBanksPage && (
                                <FadeInView style={{
                                    width: '100%',
                                    paddingHorizontal: scale(24)
                                }}>

                                    {this.props.banks.map(bank => {
                                        return <TouchItem
                                            onPress={() => {
                                                this.setState({
                                                    selected: bank.id
                                                })
                                            }}
                                            style={[styles.card, {backgroundColor: selected === bank.id ? Colors.tintColor : 'white'}]}>
                                            <View style={{padding: scale(16)}}>

                                                {(selected === bank.id) && (<Icon.Ionicons
                                                    name={'ios-radio-button-on'}
                                                    size={scale(25)}
                                                    style={styles.menu}
                                                    color={Colors.white}
                                                />)}
                                                {(selected !== bank.id) && (
                                                    <Icon.Ionicons
                                                        name={'ios-radio-button-off'}
                                                        size={scale(25)}
                                                        style={styles.menu}
                                                        color={Colors.tintColor}
                                                    />
                                                )}

                                                <Text
                                                    style={[styles.name, selected !== bank.id ? {color: Colors.greyText} : {}]}>{`${bank.account_name}`}</Text>
                                                <View style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center'
                                                }}>
                                                    <Text
                                                        style={[styles.number, selected !== bank.id ? {color: Colors.greyText} : {}]}>{`${bank.code_description}`}</Text>
                                                    <Text
                                                        style={[styles.number, selected !== bank.id ? {color: Colors.greyText} : {}]}>{bank.account_number}</Text>
                                                </View>
                                            </View>
                                            {selected === bank.id && (<Image
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
                                            />)}

                                        </TouchItem>
                                    })}

                                    {!!selected && (
                                        <ButtonWithBackgroundBottom
                                            onPress={() => this.setState({pinScreenVisible: true})}
                                            style={{width: '100%'}}

                                        >
                                            <ButtonWithBackgroundText>{'Transfer'}</ButtonWithBackgroundText>
                                        </ButtonWithBackgroundBottom>
                                    )}

                                </FadeInView>
                            )}
                        </View>

                    </KeyboardAwareScrollView>
                </View>
            </View>
        );
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

    submitNewBank = () => {
        let {bank_code, account_number, bank} = this.state
        let amount = this.props.navigation.getParam('amount', '')


        if (this.validate()) return;
        Keyboard.dismiss();
        let {email, password, full_name} = this.state;

        let data = this.props.navigation.getParam('data', '')

        this.setState({
            loadingNewBank: true,
            modalLoader: true
        }, () => {
            apiRequest(postVerifyBankAccount, 'post', {
                "account_number": account_number,
                "bank_code": bank.additional_code
            })
                .then(res => {
                    console.log(res)
                    this.setState({
                        loadingNewBank: false
                    }, () => {

                        if (res.success) {
                            this.props.navigation.navigate('WalletConfirmBankDetails', {
                                "account_number": account_number,
                                "bank": bank,
                                "account_name": res.data.account_name,
                                'amount': amount
                            })
                        } else {
                            this.setState({
                                formError: res.message
                            })
                        }
                    })
                })
                .catch(error => {
                    console.log(error.response)
                    //
                    if (error.response) {
                        this.setState({
                            formError: error.response.data.message
                        })
                    } else {
                        this.setState({
                            formError: error.message
                        })
                    }
                    this.setState({
                        loadingNewBank: false
                    })
                });
        })
    };

    submit = (pin) => {
        let {selected, account_number} = this.state


        let bank = this.props.banks.find(b => b.id === selected)
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
                "bank_id": selected,
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
            bank_error: '',
            formError: ''
        })
    }

}

const mapStateToProps = (state, ownProps) => {
    return {
        auth: state.authentication,
        loadingCards: state.account.loadingCards,
        loadingBanks: state.account.loadingBanks,
        cards: state.account.cards || [],
        banks: state.account.banks || [],
        userBanks: state.wallet.banks || []

    };
};

const mapDispatchToProps = {
    loginUserSuccess,
    // handleForgotPassword,
    // resetAuthData,
    // getAllCards,
    getAllBanks,
    showToast,
    getWalletBalance,
    getAllWalletTransactions,
    hideToast,
    getBanks
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
        borderColor: Platform.OS === 'ios' ? 'rgba(98, 149, 218, 0.15)' : 'transparent',
        borderWidth: Platform.OS === 'ios' ? scale(1) : 0,
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
    label: {
        fontFamily: 'graphik-regular',
        fontSize: scale(12),
        color: '#112945'
    },

})