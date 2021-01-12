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
import Header from '../../components/Header/LoansHeader';
import { PinScreen } from '../../components/PinScreen/PinScreen';
import { updateUserLoanDetails } from "./action/loan_actions";
import { getAllLoanOptions } from "./action/loan_actions";
import { getAllCards } from "../Account/action/account_actions";


import {
    ButtonWithBackgroundText,
    ButtonWithBackgroundBottom
} from '../../components/Button/Buttons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { axiosInstance } from "../../lib/api/axiosClient";
import {
    checkfull_names, postAddBank, postCreateLoan, postLoanEligibility,
    postVerifyBankAccount
} from "../../lib/api/url";
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { withNavigationFocus } from 'react-navigation';
import { formStyles } from "../../../assets/styles/styles";
import { HeaderText } from "../../components/HeaderText/HeaderText";
import { showToast, hideToast } from "../../components/Toast/actions/toastActions";
import { scale } from "../../lib/utils/scaleUtils";
import * as WebBrowser from "expo-web-browser";
import { Colors } from "../../lib/constants/Colors";
import { LoaderText } from "../../components/Loader/Loader";
import * as Icon from "@expo/vector-icons";
import { apiRequest } from "../../lib/api/api";
import moment from 'moment';
import { getPurposes } from "../Wallet/action/wallet_actions";
import { formatAmount } from "../../lib/utils/helpers";
import { getAllLoans } from "./action/loan_actions";
import TouchItem from "../../components/TouchItem/_TouchItem";

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
            gender: '',
            marital_status: '',
            no_of_dependent: '',
            address: '',
            type_of_residence: '',
            isDateTimePickerVisible: false,
            pinScreenVisible: false,
        }
    }


    componentDidMount() {
        this.props.getAllCards()
        this.props.getAllLoanOptions();
    }

    openTerms = async () => {
        await WebBrowser.openBrowserAsync('https://www.blinkcash.ng/terms.html#privacy');
    };
    submit = (pin) => {

        const loan = this.props.navigation.getParam('loan', {})

        console.log(loan)


        this.setState({
            loading: true,
            pinScreenVisible: false
        }, () => {
            apiRequest(postCreateLoan, 'post', {
                "token": loan.loan_token,
                "pin": pin
            })
                .then(res => {
                    console.log(res)
                    this.setState({
                        loading: false
                    }, () => {
                        if (res.status === 'success') {
                            this.props.navigation.navigate('LoanSuccess', {
                                title: 'Congratulations!',
                                description: 'Your loan has been credited to your wallet',
                                buttonText: 'Go to Wallet',
                                redirect: 'Home'
                            });
                            this.props.getAllLoans();
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


    onSubmit = () => {
        const loan = this.props.navigation.getParam('loan', {})

        // this.setState({pinScreenVisible:true})
        // if (this.props.cards.length) {
            this.props.navigation.navigate('LoanCardList',{
                loan
            })
        // } else {
        //     this.props.navigation.navigate('AddCard')
        // }
    }

    renderButton = () => {
        const {loading} = this.state;
        return (
            <ButtonWithBackgroundBottom
                disabled={loading}
                onPress={() => this.onSubmit()}
                style={{width: '100%'}}

            >
                {loading && (<ActivityIndicator size="large" color="#fff"/>)}
                {!loading && (<ButtonWithBackgroundText>{'Accept Loan Terms'}</ButtonWithBackgroundText>)}
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

        const {
            requested_amount,
            purpose, proposed_payday, gender, marital_status, no_of_dependent,
            type_of_residence, address, educational_attainment, employment_status,
            sector_of_employment, work_start_date, monthly_repayment, monthly_net_income, work_email
        } = this.props.userLoanDetails

        const loan = this.props.navigation.getParam('loan', {})
        console.log(loan)

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
                    <LoaderText visible={this.state.loading} desciption={'Creating Loan'}/>
                    <PinScreen
                        handleSubmit={this.submit}
                        visible={this.state.pinScreenVisible} close={() => {
                        console.log('here')
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
                        <Header leftIcon={"ios-arrow-back"} title={'Apply for a loan'}
                                onPressLeftIcon={() => this.props.navigation.goBack()}/>


                        <View style={[formStyles.auth_form, {flex: 1, marginTop: scale(10)}]}>
                            <Text style={styles.title}>Repayment Breakdown</Text>
                            <Text style={[styles.title, {marginTop: scale(20), marginBottom: scale(27)}]}>You will
                                repay <Text style={{color: '#2C32BE'}}>₦{formatAmount(loan.repayment_amount)}</Text> in {loan.tenor} days</Text>


                            <View>
                                <View style={styles.row}>
                                    <Text>Principal</Text>
                                    <Text>₦{formatAmount(loan.loan_amount)}</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text>Interest (25%)</Text>
                                    <Text>₦{formatAmount(loan.repayment_amount - loan.loan_amount)}</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text>Repayment</Text>
                                    <Text>₦{formatAmount(loan.repayment_amount)}</Text>
                                </View>
                            </View>


                            <View style={{marginBottom: scale(16), marginTop: scale(30)}}>
                                {this.renderButton()}
                            </View>
                            <TouchItem onPress={this.openTerms}>
                                <Text style={{
                                    fontSize: scale(12),
                                    color: '#3C5066',
                                    // textAlign: 'center',
                                    fontFamily: "graphik-regular",
                                    lineHeight: scale(20),
                                    textAlign: 'center'
                                }}>By clicking accept you agree to Blinkcash <Text style={{color:Colors.tintColor, textDecorationLine:'underline'}}>Terms & Conditions</Text></Text>
                            </TouchItem>

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
        loan_purposes: state.wallet.loan_purposes || [],
        loanOptions: state.loan.loanOptions || [],
        userLoanDetails: state.loan.userLoanDetails || {},
        cards: state.account.cards || [],
    };
};

const mapDispatchToProps = {
    showToast,
    hideToast,
    getPurposes,
    updateUserLoanDetails,
    getAllLoanOptions,
    getAllLoans,
    getAllCards
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
    optionText: {
        color: Colors.greyText,
        fontFamily: 'graphik-medium',
        fontSize: scale(16),
        marginTop: scale(16),
        lineHeight: scale(15)
    },
    editButton: {
        color: '#3C5066',
        fontFamily: 'graphik-semibold',
        fontSize: scale(12),
    },
    tenor: {
        color: '#3C5066',
        fontFamily: 'graphik-regular',
        fontSize: scale(18),
        marginTop: scale(20)
    },
    topAmount: {
        fontFamily: 'graphik-medium',
        fontSize: scale(30),
        color: Colors.tintColor,
    },

    row: {
        height: scale(47),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopWidth: scale(1),
        borderTopColor: 'rgba(98, 149, 218, 0.15)'
    },
})