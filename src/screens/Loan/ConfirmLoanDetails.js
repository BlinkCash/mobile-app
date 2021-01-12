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

        const {requested_amount,
            purpose,proposed_payday,gender,marital_status,no_of_dependent,
            type_of_residence,address,educational_attainment,employment_status,
            sector_of_employment,work_start_date,monthly_repayment,monthly_net_income,work_email
        } = this.props.userLoanDetails

        let start_date = work_start_date

        if(work_start_date.includes('Z')){
            start_date = moment(work_start_date).format('DD/MM/YYYY')
        }

        // if (this.validate()) return;


        this.setState({
            loading: true,
            modalLoader: true
        }, () => {
            apiRequest(postLoanEligibility, 'post', {
                no_of_dependent,
                type_of_residence,
                address,
                educational_attainment,
                employment_status,
                sector_of_employment,
                // monthly_repayment,
                monthly_net_income,
                work_email,
                proposed_payday:proposed_payday,
                work_start_date:moment(start_date,'DD/MM/YYYY').format('YYYY/MM/DD'),
                purpose,
                requested_amount:Number(String(requested_amount).split(',').join('')),
                gender,
                marital_status
            })
                .then(res => {
                    console.log(res)
                    this.setState({
                        loading: false
                    }, () => {
                        if (res.status === 'success') {
                            this.props.navigation.navigate('EligibleLoansList', {
                                loanList:res.data
                            });
                            // this.props.getAllBanks();
                            // this.props.showToast('Successfully created account', 'success');

                        } else {
                            this.props.navigation.navigate('LoanError')
                            // this.props.showToast(res.message, 'error')
                        }
                    })
                })
                .catch(error => {
                    console.log(error.response)
                    //
                    if (error.response) {
                        this.props.navigation.navigate('LoanError')
                        // this.props.showToast(error.response.data.message, 'error')
                    } else {
                        this.props.navigation.navigate('LoanError')
                        // this.props.showToast(error.message, 'error')
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
        console.log(this.props.userLoanDetails)

        const {requested_amount,
            purpose,proposed_payday,gender,marital_status,no_of_dependent,
            type_of_residence,address,educational_attainment,employment_status,
            sector_of_employment,work_start_date,monthly_repayment,monthly_net_income,work_email
        } = this.props.userLoanDetails

        let start_date = work_start_date

        if(work_start_date.includes('Z')){
            start_date = moment(work_start_date).format('DD/MM/YYYY')
        }

        console.log(work_start_date)


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
                        <Header leftIcon={"ios-arrow-back"} title={'Confirm Your details'}
                                onPressLeftIcon={() => this.props.navigation.goBack()}/>


                        <View style={[formStyles.auth_form, {flex: 1, marginTop: scale(10)}]}>
                            <Text style={styles.title}>Confirm your details</Text>


                            <View style={{marginTop: scale(32)}}>
                                <Text style={styles.optionText}>Loan Details</Text>
                                <View style={[styles.roundCard, {
                                    paddingTop: scale(16)
                                }]}>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingHorizontal: scale(16),
                                        marginBottom:scale(20)
                                    }}>
                                        <View>
                                            <Text style={styles.label}>Amount</Text>
                                            <Text  style={styles.value}>{requested_amount}</Text>
                                        </View>
                                        <View>
                                            <Text style={[styles.label,{textAlign:'right'}]}>Application Date</Text>
                                            <Text  style={[styles.value,{textAlign:'right'}]}>{moment().format('MMM DD, YYYY')}</Text>
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
                                            <Text  style={styles.value}>{purpose}</Text>
                                        </View>
                                        <View>
                                            <Text style={[styles.label,{textAlign:'right'}]}>Repayment Date</Text>
                                            <Text  style={[styles.value,{textAlign:'right'}]}>{proposed_payday}</Text>
                                        </View>
                                    </View>
                                    <TouchItem
                                        onPress={() => this.props.navigation.navigate('EnterAmount')}
                                        style={{
                                            height:scale(52),
                                            justifyContent:'center',
                                            alignItems:'center',
                                            borderTopColor:'rgba(98, 149, 218, 0.15)',
                                            borderTopWidth:scale(1),
                                            marginTop:scale(18)
                                        }}
                                    >
                                        <Text style={styles.editButton}>Edit</Text>
                                    </TouchItem>
                                </View>
                            </View>


                            <View style={{marginTop: scale(32)}}>
                                <Text style={styles.optionText}>Personal Information</Text>
                                <View style={[styles.roundCard, {
                                    paddingTop: scale(16)
                                }]}>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingHorizontal: scale(16),
                                        marginBottom:scale(20)
                                    }}>
                                        <View>
                                            <Text style={styles.label}>Gender</Text>
                                            <Text  style={styles.value}>{gender}</Text>
                                        </View>
                                        <View>
                                            <Text style={[styles.label,{textAlign: 'right'}]}>Marital Status</Text>
                                            <Text  style={[styles.value,{textAlign:'right'}]}>{marital_status}</Text>
                                        </View>
                                    </View>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingHorizontal: scale(16),
                                        marginBottom:scale(20)
                                    }}>
                                        <View>
                                            <Text style={styles.label}>Children</Text>
                                            <Text  style={styles.value}>{no_of_dependent}</Text>
                                        </View>
                                        <View>
                                            <Text style={[styles.label,{textAlign: 'right'}]}>Type of Residence</Text>
                                            <Text   style={[styles.value,{textAlign:'right'}]}>{type_of_residence}</Text>
                                        </View>
                                    </View>
                                    <View style={{
                                        paddingHorizontal: scale(16)

                                    }}>
                                        <View>
                                            <Text style={styles.label}>Location</Text>
                                            <Text  style={styles.value}>{address}</Text>
                                        </View>
                                    </View>
                                    <TouchItem
                                        onPress={() => this.props.navigation.navigate('EnterPersonalDetails')}
                                        style={{
                                            height:scale(52),
                                            justifyContent:'center',
                                            alignItems:'center',
                                            borderTopColor:'rgba(98, 149, 218, 0.15)',
                                            borderTopWidth:scale(1),
                                            marginTop:scale(18)
                                        }}
                                    >
                                        <Text style={styles.editButton}>Edit</Text>
                                    </TouchItem>
                                </View>
                            </View>


                            <View style={{marginTop: scale(32)}}>
                                <Text style={styles.optionText}>Education & Employment</Text>
                                <View style={[styles.roundCard, {
                                    paddingTop: scale(16)
                                }]}>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingHorizontal: scale(16),
                                        marginBottom:scale(20)
                                    }}>
                                        <View  style={{maxWidth:'50%'}}>
                                            <Text style={styles.label}>Level of Education</Text>
                                            <Text  style={styles.value}>{educational_attainment}</Text>
                                        </View>
                                        <View>
                                            <Text style={[styles.label,{textAlign: 'right'}]}>Employment Status</Text>
                                            <Text   style={[styles.value,{textAlign:'right'}]}>{employment_status}</Text>
                                        </View>
                                    </View>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingHorizontal: scale(16),
                                        marginBottom:scale(20)
                                    }}>
                                        <View>
                                            <Text style={styles.label}>Sector of Employment</Text>
                                            <Text  style={styles.value}>{sector_of_employment}</Text>
                                        </View>
                                        <View>
                                            <Text style={[styles.label,{textAlign: 'right'}]}>Employment Start</Text>
                                            {/*<Text  style={[styles.value,{textAlign:'right'}]}>{work_start_date}</Text>*/}
                                            <Text  style={[styles.value,{textAlign:'right'}]}>{start_date}</Text>
                                        </View>
                                    </View>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingHorizontal: scale(16),
                                        marginBottom:scale(20)
                                    }}>
                                        <View>
                                            <Text style={styles.label}>Monthly Income</Text>
                                            <Text  style={styles.value}>{monthly_net_income}</Text>
                                        </View>
                                    </View>
                                    {/*<View style={{*/}
                                        {/*paddingHorizontal: scale(16),*/}
                                        {/*marginBottom:scale(20)*/}
                                    {/*}}>*/}
                                        {/*<View>*/}
                                            {/*<Text style={[styles.label]}>Monthly Repayment</Text>*/}
                                            {/*<Text  style={styles.value}>{monthly_repayment}</Text>*/}
                                        {/*</View>*/}
                                    {/*</View>*/}
                                    <View style={{
                                        paddingHorizontal: scale(16),
                                        // marginBottom:scale(20)
                                    }}>
                                        <View>
                                            <Text style={styles.label}>Official Email Address</Text>
                                            <Text  style={styles.value}>{work_email}</Text>
                                        </View>
                                    </View>
                                    <TouchItem
                                        onPress={() => this.props.navigation.navigate('EnterEducationAndEmployment')}
                                        style={{
                                            height:scale(52),
                                            justifyContent:'center',
                                            alignItems:'center',
                                            borderTopColor:'rgba(98, 149, 218, 0.15)',
                                            borderTopWidth:scale(1),
                                            marginTop:scale(18)
                                        }}
                                    >
                                        <Text style={styles.editButton}>Edit</Text>
                                    </TouchItem>
                                </View>
                            </View>

                            <View style={{marginBottom: scale(10), marginTop:scale(30)}}>
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
        color: '#4f4f4f',
        fontFamily: 'graphik-medium',
        fontSize: scale(14),
        marginBottom: scale(16)
    },
    editButton:{
        color: Colors.tintColor,
        fontFamily: 'graphik-semibold',
        fontSize: scale(12),
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