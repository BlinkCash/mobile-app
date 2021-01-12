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
    Modal, TouchableWithoutFeedback, Image, StyleSheet, ImageBackground
} from 'react-native';
import { connect } from 'react-redux';
import NavigationService from "../../../NavigationService";
import { FloatingLabelInput } from "../../components/Input/FloatingLabelInput";
import Header from '../../components/Header/Header';
import TouchItem from '../../components/TouchItem/_TouchItem'


import {
    handleForgotPassword,
    resetAuthData, loginUserSuccess, getExtraDetails,
} from '../Auth/action/auth_actions';
import {
    ButtonWithBackgroundText,
    ButtonWithBackgroundBottom
} from '../../components/Button/Buttons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { axiosInstance } from "../../lib/api/axiosClient";
import { postLogin, postRegister, checkfull_names, postAuthInit } from "../../lib/api/url";
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { withNavigationFocus } from 'react-navigation';
import { formStyles } from "../../../assets/styles/styles";
import { HeaderText } from "../../components/HeaderText/HeaderText";
import { showToast, hideToast } from "../../components/Toast/actions/toastActions";
import { scale } from "../../lib/utils/scaleUtils";
import { resetCache } from "../Auth/action/auth_actions";
import * as WebBrowser from "expo-web-browser";
import { Colors } from "../../lib/constants/Colors";
import { LoaderText } from "../../components/Loader/Loader";
import { getAllLoans,getTheRunningLoan } from "./action/loan_actions";
import moment from "moment";
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
            phone: ''
        }
    }


    componentDidMount() {
        this.props.getAllLoans();
        this.props.getTheRunningLoan();
    }

    goToPage = () => {
        const {requested_amount,
            purpose,proposed_payday,gender,marital_status,no_of_dependent,
            type_of_residence,address,educational_attainment,employment_status,
            sector_of_employment,work_start_date,monthly_repayment,monthly_net_income,work_email
        } = this.props.userLoanDetails

        if(work_email && educational_attainment && employment_status && sector_of_employment && work_start_date && monthly_net_income){
            this.props.navigation.navigate('ConfirmLoanDetails')
        }else{
            this.props.navigation.navigate('EnterAmount')
        }
    }

    renderButton = () => {
        const {loading} = this.state;
        return (
            <ButtonWithBackgroundBottom
                disabled={loading}
                onPress={() => this.goToPage()}
                style={{width: '100%'}}

            >
                {!!loading && (<ActivityIndicator size="large" color="#fff"/>)}
                {!loading && (<ButtonWithBackgroundText>{'Apply for a Loan'}</ButtonWithBackgroundText>)}
            </ButtonWithBackgroundBottom>
        );
    };

    render() {
        const {navigate} = this.props.navigation;
        const {email, password, full_name, phone, confirm_password} = this.state;

        const {
            requested_amount,
            purpose, proposed_payday, gender, marital_status, no_of_dependent,
            type_of_residence, address, educational_attainment, employment_status,
            sector_of_employment, work_start_date, monthly_repayment, monthly_net_income, work_email
        } = this.props.loanDetails.id ? this.props.userLoanDetails : {}



        const {loanDetails} = this.props;
        console.log(work_start_date)


        return (

            <View style={{
                flex:1
            }}>
                <LoaderText visible={this.props.loading} desciption={'Fetching Loan Details...'}/>
                <KeyboardAwareScrollView>
                    <View style={{
                        width: '100%',
                        // justifyContent: 'center',
                        // alignItems: 'center',
                        marginTop: scale(30),
                        paddingHorizontal: scale(24),
                    }}>
                        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                           <Text style={{
                               fontFamily: 'graphik-medium',
                               fontSize: scale(30),
                               color: Colors.greyText,
                               // width: '100%',
                               textAlign: 'left'
                           }}>Loans</Text>
                           {!!this.props.loans.length && (
                               <TouchItem onPress={()=>this.props.navigation.navigate('LoanHistory')}>
                                   <Text style={{
                                       fontFamily: 'graphik-semibold',
                                       fontSize: scale(14),
                                       color: Colors.tintColor
                                   }}>Loan History</Text>
                               </TouchItem>
                           )}

                       </View>
                    </View>
                    {!this.props.loanDetails.id && (
                    // {true && (
                        <View>
                            <View style={{
                                width: '100%',
                                // justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: scale(8),
                                paddingHorizontal: scale(20),
                            }}>
                                <Image
                                    style={{width: scale(290), height: scale(289)}}
                                    source={require('../../../assets/images/Loans/empty.png')}
                                    resizeMode={'contain'}
                                />
                            </View>
                            <View>
                                <Text style={styles.title}>Get Instant Loans</Text>
                                <Text style={styles.subtitle}>Get instant loans with ease right now </Text>
                            </View>
                            <View style={{paddingHorizontal: scale(20)}}>
                                {this.renderButton()}
                            </View>
                        </View>
                    )}

                    {!!this.props.loanDetails.id && (
                    // {false && (
                        <View style={{paddingHorizontal: scale(25)}}>

                            <View style={{marginTop: scale(32)}}>
                                <View style={[styles.roundCard, {
                                    backgroundColor: '#112945'
                                }]}>
                                    <ImageBackground
                                        style={{
                                            width: '100%',
                                            height: scale(240),
                                            justifyContent:'flex-end',
                                            // backgroundColor:'red'
                                        }}
                                        resizeMode={'cover'}
                                        source={require('../../../assets/images/Loans/loan.png')}
                                    >
                                        <View style={{
                                            paddingHorizontal: scale(16),
                                            marginBottom: scale(18)
                                            // marginBottom:scale(20)
                                        }}>
                                            <View>
                                                <Text style={styles.topHeader}>You have an active loan</Text>
                                                <Text style={styles.topHeader2}>₦{formatAmount(loanDetails.schedule.repayment_amount)}</Text>
                                                <Text style={styles.topHeader3}>To be paid by {moment(loanDetails.schedule.repayment_day).format('MMM DD, YYYY')}</Text>
                                            </View>
                                        </View>
                                    </ImageBackground>
                                    <TouchItem
                                        onPress={() => this.props.navigation.navigate('RepayLoan',{
                                            loan:this.props.loanDetails
                                        })}
                                        style={{
                                            height: scale(52),
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderTopColor: 'rgba(98, 149, 218, 0.15)',
                                            borderTopWidth: scale(1)
                                        }}
                                    >
                                        <Text style={styles.editButton}>REPAY NOW</Text>
                                    </TouchItem>
                                </View>
                            </View>
                            <View style={{marginTop: scale(32)}}>
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
                                            <Text style={styles.value}>₦{formatAmount(+loanDetails.loan_amount)}</Text>
                                        </View>
                                        <View>
                                            <Text  style={[styles.label, {textAlign: 'right'}]}>Interest</Text>
                                            <Text  style={[styles.value, {textAlign: 'right'}]}>₦{formatAmount(+loanDetails.interest_due)}</Text>
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
                                            <Text style={styles.value}>{purpose}</Text>
                                        </View>
                                        <View>
                                            <Text  style={[styles.label, {textAlign: 'right'}]}>Application Date</Text>
                                            <Text
                                                style={[styles.value, {textAlign: 'right'}]}>{moment(loanDetails.created_on).format('MMM DD, YYYY')}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>


                            <View style={{marginVertical: scale(32)}}>
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
                                            <Text style={styles.label}>Marital Status</Text>
                                            <Text style={styles.value}>{marital_status}</Text>
                                        </View>
                                        <View>
                                            <Text style={[styles.label, {textAlign: 'right'}]}>No. of Children</Text>
                                            <Text style={[styles.value, {textAlign:'right'}]}>{no_of_dependent}</Text>
                                        </View>
                                    </View>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingHorizontal: scale(16),
                                        marginBottom: scale(20)
                                    }}>
                                        <View style={{maxWidth:'50%'}}>
                                            <Text style={styles.label}>Level of education</Text>
                                            <Text style={styles.value}>{educational_attainment}</Text>
                                        </View>
                                        <View>
                                            <Text style={[styles.label, {textAlign: 'right'}]}>Employment status</Text>
                                            <Text style={[styles.value, {textAlign:'right'}]}>{employment_status}</Text>
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
                                            <Text style={styles.value}>{sector_of_employment}</Text>
                                        </View>
                                    </View>
                                    <View style={{
                                        paddingHorizontal: scale(16),
                                        marginBottom: scale(20)
                                    }}>
                                        <View>
                                            <Text style={[styles.label]}>Been working there since?</Text>
                                            <Text style={styles.value}>{moment(work_start_date).format('MMM DD, YYYY')}</Text>
                                        </View>
                                    </View>
                                    <View style={{
                                        paddingHorizontal: scale(16),
                                        // marginBottom:scale(20)
                                    }}>
                                        <View>
                                            <Text style={styles.label}>Monthly income</Text>
                                            <Text style={styles.value}>{monthly_net_income}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                        </View>
                    )}

                </KeyboardAwareScrollView>
            </View>

        );
    }

}

const mapStateToProps = (state, ownProps) => {
    return {
        auth: state.authentication,
        loading: state.loan.loading,
        loans: state.loan.loans || [],
        loanDetails: state.loan.loanDetails || {},
        userLoanDetails: state.loan.userLoanDetails || {}
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
    getAllLoans,
    getTheRunningLoan
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withNavigationFocus(Login));

const styles = StyleSheet.create({
    title: {
        fontSize: scale(20),
        color: Colors.greyText,
        textAlign: 'center',
        fontFamily: "graphik-semibold",
        lineHeight: scale(32)
        // marginTop: scale(24),
    },
    subtitle: {
        fontSize: scale(14),
        color: Colors.greyText,
        textAlign: 'center',
        marginTop: scale(8),
        fontFamily: "graphik-regular",
        lineHeight: scale(24),
        maxWidth: scale(200),
        alignSelf: 'center',
        marginBottom: scale(24)
        // marginTop: scale(24),
    },
    optionText: {
        color: '#4f4f4f',
        fontFamily: 'graphik-medium',
        fontSize: scale(14),
        marginBottom: scale(16)
    },
    editButton: {
        color: Colors.white,
        fontFamily: 'graphik-semibold',
        fontSize: scale(12),
    },
    value: {
        color: Colors.greyText,
        fontFamily: 'graphik-regular',
        fontSize: scale(18),
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
    topHeader:{
        fontSize: scale(12),
        color: Colors.white,
        marginBottom:scale(12),
        fontFamily: "graphik-regular",
    },
    topHeader2:{
        fontSize: scale(32),
        color: Colors.white,
        marginBottom:scale(12),
        fontFamily: "graphik-medium",
    },
    topHeader3:{
        fontSize: scale(12),
        color: Colors.white,
        marginBottom:scale(12),
        fontFamily: "graphik-regular",
    }
})