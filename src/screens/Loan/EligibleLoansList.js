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
import TouchItem from '../../components/TouchItem/_TouchItem'
import { updateUserLoanDetails } from "./action/loan_actions";
import { getAllLoanOptions } from "./action/loan_actions";


import {
    ButtonWithBackgroundText,
    ButtonWithBackgroundBottom
} from '../../components/Button/Buttons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { axiosInstance } from "../../lib/api/axiosClient";
import {
    checkfull_names, postAddBank, postLoanEligibility,
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
        }
    }


    componentDidMount() {
        this.props.getAllLoanOptions();
    }


    submit = () => {

        const {
            requested_amount,
            purpose, proposed_payday, gender, marital_status, no_of_dependent,
            type_of_residence, address, educational_attainment, employment_status,
            sector_of_employment, work_start_date, monthly_repayment, monthly_net_income, work_email
        } = this.props.userLoanDetails

        // if (this.validate()) return;


        this.setState({
            loading: true,
            modalLoader: true
        }, () => {
            apiRequest(postLoanEligibility, 'post', {
                ...this.props.userLoanDetails
            })
                .then(res => {
                    console.log(res)
                    this.setState({
                        loading: false
                    }, () => {
                        if (res.status === 'success') {
                            this.props.navigation.goBack();
                            this.props.getAllBanks();
                            this.props.showToast('Successfully created account', 'success');

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


    renderButton = () => {
        const {loading} = this.state;
        return (
            <ButtonWithBackgroundBottom
                disabled={loading}
                onPress={() => this.submit()}
                style={{width: '100%'}}

            >
                {loading && (<ActivityIndicator size="large" color="#fff"/>)}
                {!loading && (<ButtonWithBackgroundText>{'Proceed'}</ButtonWithBackgroundText>)}
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

        const loanList = this.props.navigation.getParam('loanList', [])
        console.log(loanList)

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
                    <LoaderText visible={this.state.loading} desciption={'We’re processing your loan...'}/>
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
                            <Text style={styles.title}>Here’s what you’re eligible for</Text>


                            {loanList.map(loan => {
                                return <View style={{marginTop: scale(32)}}>
                                    <View style={[styles.roundCard, {
                                        paddingTop: scale(16)
                                    }]}>
                                        <View style={{
                                            paddingHorizontal: scale(16),
                                            marginBottom: scale(20)
                                        }}>
                                            <Text style={styles.topAmount}>₦{formatAmount(loan.loan_amount)}</Text>
                                            <Text style={styles.tenor}>{loan.tenor} Days tenor</Text>
                                            <Text style={styles.optionText}>You will repay ₦{formatAmount(loan.repayment_amount)}</Text>
                                            <Text style={[styles.optionText, {marginTop: 0}]}>by {loan.repayment_day}</Text>

                                        </View>
                                        <TouchItem
                                            onPress={() => this.props.navigation.navigate('LoanDetail', {
                                                loan
                                            })}
                                            style={{
                                                height: scale(52),
                                                justifyContent: 'space-between',
                                                paddingHorizontal: scale(16),
                                                alignItems: 'center',
                                                borderTopColor: 'rgba(98, 149, 218, 0.15)',
                                                borderTopWidth: scale(1),
                                                flexDirection: 'row',
                                                marginTop: scale(18)
                                            }}
                                        >
                                            <Text style={styles.editButton}>Repayment Breakdown</Text>
                                            <Icon.Ionicons
                                                name={'ios-arrow-forward'}
                                                size={scale(25)}
                                                style={styles.menu}
                                                color={Colors.tintColor}
                                            />
                                        </TouchItem>
                                    </View>
                                </View>
                            })}


                            {/*<View style={{marginBottom: scale(10), marginTop: scale(30)}}>*/}
                            {/*{this.renderButton()}*/}
                            {/*</View>*/}
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
        userLoanDetails: state.loan.userLoanDetails || {}
    };
};

const mapDispatchToProps = {
    showToast,
    hideToast,
    getPurposes,
    updateUserLoanDetails,
    getAllLoanOptions
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
        lineHeight: scale(26)
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

    roundCard: {
        width: '100%',
        borderRadius: scale(6),
        borderColor: Platform.OS === 'ios' ?'rgba(98, 149, 218, 0.15)':'transparent',
        borderWidth: Platform.OS === 'ios' ?scale(1):0,
        shadowColor: 'rgba(18, 22, 121, 0.05)',
        shadowOffset: {
            width: 0,
            height: scale(6)
        },
        shadowRadius: 10,
        shadowOpacity: 1.0,
        elevation: 2,
        backgroundColor: 'white'
    },
})