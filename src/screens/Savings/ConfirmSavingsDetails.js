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
import { updateSavingsDetails ,resetSavingsDetails,getSavingsCollections} from "./action/savings_actions";
// import { getAllLoanOptions } from "./action/loan_actions";


import {
    ButtonWithBackgroundText,
    ButtonWithBackgroundBottom
} from '../../components/Button/Buttons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { axiosInstance } from "../../lib/api/axiosClient";
import {
    checkfull_names, postAddBank, postCreateSavings, postLoanEligibility,
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
import { getMySavings } from "./action/savings_actions";


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
        this.props.getSavingsCollections();
    }


    submit = () => {

        const {periodic_amount, target, frequency_id, start_date, end_date, tenor_id = 0, collection_method_id, product, name, card_id, repayment_method_id} = this.props.savingsDetails

        const collectionMethod = (this.props.savingsCollectionMethods.find(fr => fr.name.toLowerCase() === "automated")) || ''
        const cardRepaymentMethod = (this.props.savingsRepaymentMethods.find(fr => fr.name.toLowerCase() === "card")) || ''
        console.log(this.props.savingsRepaymentMethods)


        const collectionMethodManual = (this.props.savingsCollectionMethods.find(fr => fr.id === collection_method_id)) || ''

        let collection_name_manual = collectionMethodManual.name?collectionMethodManual.name.toLowerCase():'';


        // if (this.validate()) return;
        const params = {
            name,
            periodic_amount: Number(periodic_amount) || 0,
            product_id: product.id,
            collection_method_id,
            frequency_id,
            card_id,
            repayment_method_id,
            start_date: moment(start_date, 'DD/MM/YYYY').format('YYYY/MM/DD'),
            target: Number(target)
        }
        if (tenor_id) {
            params.tenor_id = tenor_id
        } else if (end_date) {
            params.end_date = moment(end_date, 'DD/MM/YYYY').format('YYYY/MM/DD')
        }

        if(product.is_fixed){
            // params.periodic_amount = params.target;
            params.collection_method_id = collectionMethod.id;
            params.repayment_method_id = cardRepaymentMethod.id;
        }
        if(collection_name_manual === 'automated'){
            params.repayment_method_id = cardRepaymentMethod.id;
            params.tenor_id = tenor_id
        }

        if(collection_name_manual === 'manual'){
            delete params.repayment_method_id;
        }

        this.setState({
            loading: true,
            modalLoader: true
        }, () => {
            apiRequest(postCreateSavings, 'post', params)
                .then(res => {
                    console.log(res)
                    this.setState({
                        loading: false
                    }, () => {
                        if (res.status === 'success') {

                            this.props.navigation.navigate('Success', {
                                title: 'Success!',
                                description: 'You just created a Savings plan.',
                                buttonText: 'Go to Dashboard',
                                redirect: 'Home'
                            });
                            this.props.getMySavings();
                            // this.props.resetSavingsDetails();
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
                        // this.props.navigation.navigate('LoanError')
                        this.props.showToast(error.response.data.message, 'error')
                    } else {
                        // this.props.navigation.navigate('LoanError')
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
        console.log(this.props.userLoanDetails)


        const {periodic_amount, target, frequency_id, start_date, end_date, tenor_id = 0, collection_method_id, product} = this.props.savingsDetails

        const frequency = (this.props.savingsFrequencies.find(fr => fr.id === frequency_id)) || ''
        const tenor = product.tenor.find(fr => fr.id === tenor_id)
        const collectionMethod = (this.props.savingsCollectionMethods.find(fr => fr.id === collection_method_id)) || ''

        console.log(this.props.savingsDetails)

        let collection_name = collectionMethod.name?collectionMethod.name.toLowerCase():''

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
                    <LoaderText visible={this.state.loading} desciption={'We’re creating your plan...'}/>
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
                        <Header leftIcon={"ios-arrow-back"} title={'Savings'}
                                onPressLeftIcon={() => this.props.navigation.goBack()}/>


                        <View style={[formStyles.auth_form, {flex: 1, marginTop: scale(10)}]}>
                            <Text style={styles.title}>Here’s a summary of what your plan looks like</Text>


                            <View style={{marginTop: scale(32)}}>
                                {/*<Text style={styles.optionText}>Loan Details</Text>*/}

                                {!!product.is_fixed && (
                                    <View style={[styles.roundCard, {
                                        paddingTop: scale(16)
                                    }]}>
                                        <View style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            paddingHorizontal: scale(16),
                                            marginBottom: scale(20)
                                        }}>
                                            <View>
                                                <Text style={styles.label}>Locked In</Text>
                                                <Text style={[styles.value,{color:'#DC4F89'}]}>₦{formatAmount(periodic_amount)}</Text>
                                            </View>
                                            <View>
                                                <Text style={[styles.label, {textAlign: 'right'}]}>Tenor</Text>
                                                <Text style={[styles.value, {textAlign: 'right'}]}>{tenor ? tenor.value : ''} days</Text>
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
                                                <Text style={styles.label}>Start By</Text>
                                                <Text style={styles.value}>{moment(start_date, 'DD/MM/YYYY').format('MMM DD, YYYY')}</Text>
                                            </View>
                                            {!!end_date && (
                                                <View>
                                                    <Text style={[styles.label]}>Withdraw by</Text>
                                                    <Text
                                                        style={[styles.value, {textAlign: 'right'}]}>{moment(end_date, 'DD/MM/YYYY').format('MMM DD, YYYY')}</Text>
                                                </View>
                                            )}

                                        </View>
                                        <TouchItem
                                            onPress={() => this.props.navigation.navigate('EnterSavingsName')}
                                            style={{
                                                height: scale(52),
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                borderTopColor: 'rgba(98, 149, 218, 0.15)',
                                                borderTopWidth: scale(1),
                                                marginTop: scale(18)
                                            }}
                                        >
                                            <Text style={styles.editButton}>Edit</Text>
                                        </TouchItem>
                                    </View>
                                )}

                                {!product.is_fixed && (
                                    <View>
                                        {(collection_name === 'manual') && (
                                            <View style={[styles.roundCard, {
                                                paddingTop: scale(16)
                                            }]}>
                                                <View style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    paddingHorizontal: scale(16),
                                                    marginBottom: scale(20)
                                                }}>
                                                    <View>
                                                        <Text style={styles.label}>Savings Target</Text>
                                                        <Text style={styles.value}>{target?`₦${formatAmount(+target)}`:'N/A'}</Text>
                                                    </View>
                                                    <View>
                                                        <Text style={[styles.label, {textAlign: 'right'}]}>Savings</Text>
                                                        <Text style={[styles.value, {textAlign: 'right'}]}>{periodic_amount?`₦${formatAmount(periodic_amount)}`:'N/A'}</Text>
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
                                                        <Text style={styles.label}>Start By</Text>
                                                        <Text style={styles.value}>{moment(start_date, 'DD/MM/YYYY').format('MMM DD, YYYY')}</Text>
                                                    </View>
                                                    {!!end_date && (
                                                        <View>
                                                            <Text style={[styles.label, {textAlign: 'right'}]}>Withdraw by</Text>
                                                            <Text
                                                                style={[styles.value, {textAlign: 'right'}]}>{moment(end_date, 'DD/MM/YYYY').format('MMM DD, YYYY')}</Text>
                                                        </View>
                                                    )}

                                                    {!!tenor && (
                                                        <View>
                                                            <Text style={[styles.label, {textAlign: 'right'}]}>Tenor</Text>
                                                            <Text style={[styles.value, {textAlign: 'right'}]}>{tenor.value} days</Text>
                                                        </View>
                                                    )}
                                                </View>
                                                <View style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    paddingHorizontal: scale(16),
                                                    // marginBottom:scale(20)

                                                }}>
                                                    <View>
                                                        <Text style={[styles.label]}>Type</Text>
                                                        <Text
                                                            style={[styles.value]}>{collectionMethod.name}</Text>
                                                    </View>
                                                </View>
                                                <TouchItem
                                                    onPress={() => this.props.navigation.navigate('EnterSavingsName')}
                                                    style={{
                                                        height: scale(52),
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        borderTopColor: 'rgba(98, 149, 218, 0.15)',
                                                        borderTopWidth: scale(1),
                                                        marginTop: scale(18)
                                                    }}
                                                >
                                                    <Text style={styles.editButton}>Edit</Text>
                                                </TouchItem>
                                            </View>
                                        )}

                                        {(collection_name !== 'manual') && (
                                            <View style={[styles.roundCard, {
                                                paddingTop: scale(16)
                                            }]}>
                                                <View style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    paddingHorizontal: scale(16),
                                                    marginBottom: scale(20)
                                                }}>
                                                    <View>
                                                        <Text style={styles.label}>Savings</Text>
                                                        <Text style={styles.value}>₦{formatAmount(periodic_amount)}</Text>
                                                    </View>
                                                    <View>
                                                        <Text style={[styles.label, {textAlign: 'right'}]}>Frequency</Text>
                                                        <Text style={[styles.value, {textAlign: 'right'}]}>{frequency.name.charAt(0).toUpperCase()+ frequency.name.substring(1).toLowerCase()}</Text>
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
                                                        <Text style={styles.label}>Savings Target</Text>
                                                        <Text style={styles.value}>₦{formatAmount(target)}</Text>
                                                    </View>
                                                    <View>
                                                        <Text style={[styles.label, {textAlign: 'right'}]}>Start By</Text>
                                                        <Text
                                                            style={[styles.value, {textAlign: 'right'}]}>{moment(start_date, 'DD/MM/YYYY').format('MMM DD, YYYY')}</Text>
                                                    </View>
                                                </View>
                                                <View style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    paddingHorizontal: scale(16),
                                                    // marginBottom:scale(20)

                                                }}>
                                                    {!!end_date && (
                                                        <View>
                                                            <Text style={[styles.label]}>Withdraw by</Text>
                                                            <Text
                                                                style={[styles.value]}>{moment(end_date, 'DD/MM/YYYY').format('MMM DD, YYYY')}</Text>
                                                        </View>
                                                    )}

                                                    {!!tenor && (
                                                        <View>
                                                            <Text style={[styles.label]}>Tenor</Text>
                                                            <Text style={[styles.value]}>{tenor.value} days</Text>
                                                        </View>
                                                    )}

                                                    <View>
                                                        <Text style={[styles.label, {textAlign: 'right'}]}>Type</Text>
                                                        <Text
                                                            style={[styles.value, {textAlign: 'right'}]}>{collectionMethod.name}</Text>
                                                    </View>
                                                </View>
                                                <TouchItem
                                                    onPress={() => this.props.navigation.navigate('EnterSavingsName')}
                                                    style={{
                                                        height: scale(52),
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        borderTopColor: 'rgba(98, 149, 218, 0.15)',
                                                        borderTopWidth: scale(1),
                                                        marginTop: scale(18)
                                                    }}
                                                >
                                                    <Text style={styles.editButton}>Edit</Text>
                                                </TouchItem>
                                            </View>
                                        )}
                                    </View>
                                )}


                            </View>


                            <View style={{marginBottom: scale(10), marginTop: scale(30)}}>
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
        userLoanDetails: state.loan.userLoanDetails || {},
        savingsDetails: state.savings.savingsDetails || {},
        savingsFrequencies: state.savings.savingsFrequencies || [],
        savingsCollectionMethods: state.savings.savingsCollectionMethods || [],
        savingsRepaymentMethods: state.savings.savingsRepaymentMethods || [],


    };
};

const mapDispatchToProps = {
    showToast,
    hideToast,
    getPurposes,
    updateSavingsDetails,
    resetSavingsDetails,
    getMySavings,
    getSavingsCollections
    // getAllLoanOptions
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
    editButton: {
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