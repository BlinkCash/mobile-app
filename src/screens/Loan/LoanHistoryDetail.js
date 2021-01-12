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
    postAddEmail, postChangePassword, postCreateLoan, postRepayLoan, postInitCard, getTheTransactionDetails
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
import moment from "moment";
import { getUserLoanDetails } from "../../lib/api/url";


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
            details: {
                loan_profile: {},
                loan_transactions:[]
            }
        }
    }


    componentDidMount() {
        const id = this.props.navigation.getParam('id', '');
        this.getTransactionDetails(id)
    }


    getTransactionDetails = (id) => {

        this.setState({
            loading: true
        }, () => {
            apiRequest(getUserLoanDetails(id), 'get')
                .then(res => {
                    console.log(res)
                    this.setState({
                        loading: false
                    }, () => {
                        if (res.status === 'success') {
                            this.setState({
                                details: res.data
                            })

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
    }


    render() {
        const {navigate} = this.props.navigation;
        const {email, password, full_name, phone, details} = this.state;
        const {navigation, loanDetails} = this.props;
        let loan = navigation.getParam('loan', '')

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
                    <LoaderText visible={this.state.loading} desciption={'Loading Loan Details...'}/>
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
                        <Header title={"Loan Details"} leftIcon={"ios-arrow-back"}
                                onPressLeftIcon={() => this.props.navigation.goBack()}/>

                        <View style={{paddingHorizontal: scale(25), width: '100%'}}>
                            {!!this.state.details.loan_transactions.length && (
                                <View style={{marginTop: scale(32)}}>
                                    <Text style={styles.optionText}>Loan Repayment</Text>
                                    <View style={[styles.roundCard, {
                                        paddingVertical: scale(16)
                                    }]}>
                                        <View style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            paddingHorizontal: scale(16),
                                            marginBottom: scale(20)
                                        }}>
                                            <Text style={styles.label}>Date</Text>
                                            {/*<Text style={styles.value}>₦{formatAmount(details.loan_amount)}</Text>*/}

                                            <Text style={[styles.label, {textAlign: 'right', flex: 1,}]}>Amount</Text>
                                            <Text style={[styles.label, {
                                                textAlign: 'right',
                                                width: scale(110),
                                            }]}>Balance</Text>
                                        </View>

                                        {this.state.details.loan_transactions.map(transaction => {
                                            return <View style={{
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                paddingHorizontal: scale(16),
                                                marginBottom: scale(13)
                                            }}>
                                                <Text style={[styles.value,{ fontSize:scale(12)}]}>{moment(transaction.created_on).format('MMM DD, YYYY')}</Text>
                                                {/*<Text style={styles.value}>₦{formatAmount(details.loan_amount)}</Text>*/}

                                                <Text style={[styles.value, {textAlign: 'right', fontSize:scale(12), flex: 1,}]}>₦{formatAmount(+transaction.amount)}</Text>
                                                <Text style={[styles.value, {
                                                    textAlign: 'right',
                                                    fontSize:scale(12),
                                                    width: scale(110),
                                                }]}>{transaction.balance || '0'}</Text>
                                            </View>
                                        })}
                                    </View>
                                </View>
                            )}


                            <View style={{marginTop: scale(32)}}>
                                <Text style={styles.optionText}>Loan Details</Text>
                                <View style={[styles.roundCard, {
                                    paddingVertical: scale(16)
                                }]}>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingHorizontal: scale(16),
                                        marginBottom: scale(20)
                                    }}>
                                        <View>
                                            <Text style={styles.label}>Principal</Text>
                                            <Text style={styles.value}>₦{formatAmount(details.loan_amount)}</Text>
                                        </View>
                                        <View>
                                            <Text style={[styles.label, {textAlign: 'right'}]}>Interest</Text>
                                            <Text
                                                style={[styles.value, {textAlign: 'right'}]}>₦{formatAmount(+details.interest_due)}</Text>
                                        </View>
                                    </View>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingHorizontal: scale(16),
                                        marginBottom: scale(20)

                                    }}>
                                        <View>
                                            <Text style={styles.label}>Application Date</Text>
                                            <Text style={styles.value}>{moment(details.created_on).format('MMM DD, YYYY')}</Text>
                                        </View>
                                        <View>
                                            <Text style={[styles.label, {textAlign: 'right'}]}>Repayment Date</Text>
                                            <Text
                                                style={[styles.value, {textAlign: 'right'}]}>{details.loan_profile.proposed_payday}</Text>
                                        </View>
                                    </View>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingHorizontal: scale(16)
                                    }}>
                                        <View>
                                            <Text style={styles.label}>Purpose of loan</Text>
                                            <Text
                                                style={styles.value}>{details.loan_profile.purpose}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <View style={{marginTop: scale(32)}}>
                                <Text style={styles.optionText}>Personal Information</Text>
                                <View style={[styles.roundCard, {
                                    paddingVertical: scale(16)
                                }]}>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingHorizontal: scale(16),
                                        marginBottom: scale(20)
                                    }}>
                                        <View>
                                            <Text style={styles.label}>Gender</Text>
                                            <Text style={styles.value}>{details.loan_profile.gender}</Text>
                                        </View>
                                        <View>
                                            <Text style={[styles.label, {textAlign: 'right'}]}>Marital Status</Text>
                                            <Text
                                                style={[styles.value, {textAlign: 'right'}]}>{details.loan_profile.marital_status}</Text>
                                        </View>
                                    </View>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingHorizontal: scale(16),
                                        marginBottom: scale(20)
                                    }}>
                                        <View>
                                            <Text style={styles.label}>Children</Text>
                                            <Text style={styles.value}>{details.loan_profile.no_of_dependent}</Text>
                                        </View>
                                        <View>
                                            <Text style={[styles.label, {textAlign: 'right'}]}>Type of Residence</Text>
                                            <Text
                                                style={[styles.value, {textAlign: 'right'}]}>{details.loan_profile.type_of_residence}</Text>
                                        </View>
                                    </View>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingHorizontal: scale(16),
                                    }}>
                                        <View>
                                            <Text style={styles.label}>Location</Text>
                                            <Text style={styles.value}>{details.loan_profile.address}</Text>
                                        </View>
                                        {/*<View>*/}
                                        {/*<Text style={styles.label}>Type of Residence</Text>*/}
                                        {/*<Text*/}
                                        {/*style={styles.value}>{details.loan_profile.type_of_residence}</Text>*/}
                                        {/*</View>*/}
                                    </View>
                                </View>
                            </View>

                            <View style={{marginTop: scale(32)}}>
                                <Text style={styles.optionText}>Education & Employment</Text>
                                <View style={[styles.roundCard, {
                                    paddingVertical: scale(16)
                                }]}>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingHorizontal: scale(16),
                                        marginBottom: scale(20)
                                    }}>
                                        <View  style={{maxWidth:'50%'}}>
                                            <Text style={styles.label}>Level of education</Text>
                                            <Text
                                                style={styles.value}>{details.loan_profile.educational_attainment}</Text>
                                        </View>
                                        <View>
                                            <Text style={[styles.label, {textAlign: 'right'}]}>Employment status</Text>
                                            <Text
                                                style={[styles.value, {textAlign: 'right'}]}>{details.loan_profile.employment_status}</Text>
                                        </View>
                                    </View>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingHorizontal: scale(16),
                                        marginBottom: scale(20)
                                    }}>
                                        <View>
                                            <Text style={styles.label}>Sector of Employment</Text>
                                            <Text
                                                style={styles.value}>{details.loan_profile.sector_of_employment}</Text>
                                        </View>
                                        <View>
                                            <Text style={[styles.label, {textAlign: 'right'}]}>Employment start</Text>
                                            <Text
                                                style={[styles.value, {textAlign: 'right'}]}>{moment(details.loan_profile.work_start_date).format('MMM DD, YYYY')}</Text>
                                        </View>
                                    </View>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingHorizontal: scale(16),
                                        marginBottom: scale(20)
                                    }}>
                                        <View>
                                            <Text style={styles.label}>Monthly income</Text>
                                            <Text style={styles.value}>{details.loan_profile.monthly_net_income}</Text>
                                        </View>
                                    </View>
                                    {/*<View style={{*/}
                                        {/*flexDirection: 'row',*/}
                                        {/*justifyContent: 'space-between',*/}
                                        {/*alignItems: 'center',*/}
                                        {/*paddingHorizontal: scale(16),*/}
                                        {/*marginBottom: scale(20)*/}
                                    {/*}}>*/}
                                        {/*<View>*/}
                                            {/*<Text style={styles.label}>Current monthly repayment</Text>*/}
                                            {/*<Text*/}
                                                {/*style={styles.value}>{details.loan_profile.monthly_repayment}</Text>*/}
                                        {/*</View>*/}
                                    {/*</View>*/}
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingHorizontal: scale(16)
                                    }}>
                                        <View>
                                            <Text style={styles.label}>Official email address</Text>
                                            <Text
                                                style={styles.value}>{details.loan_profile.work_email}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>

                    </KeyboardAwareScrollView>
                </View>
            </View>
        );
    }


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
    // getExtraDetails,
    // resetCache,
    hideToast,
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
        borderColor: 'rgba(98, 149, 218, 0.15)',
        borderWidth: scale(1)
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
        fontSize: scale(14),
        fontFamily: 'graphik-regular',
        color: Colors.greyText,
        marginBottom: scale(25),
        textAlign: 'center'
    },
    value: {
        color: Colors.greyText,
        fontFamily: 'graphik-regular',
        fontSize: scale(14),
        marginTop: scale(8)
    },
    label: {
        fontFamily: 'graphik-regular',
        fontSize: scale(12),
        color: '#112945',
        opacity: 0.7,
        lineHeight: scale(14)
    },

    roundCard: {
        width: '100%',
        borderRadius: scale(6),
        borderWidth: scale(1),
        borderColor: 'rgba(98, 149, 218, 0.15)',
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
    optionText: {
        color: '#4f4f4f',
        fontFamily: 'graphik-medium',
        fontSize: scale(14),
        marginBottom: scale(16)
    },

})