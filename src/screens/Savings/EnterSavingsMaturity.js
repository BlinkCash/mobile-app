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
    ScrollView as ReactScrollView,
    Modal, TouchableWithoutFeedback, Image, StyleSheet
} from 'react-native';
import { connect } from 'react-redux';
import NavigationService from "../../../NavigationService";
import { FloatingLabelInput } from "../../components/Input/FloatingLabelInput";
import Header from '../../components/Header/LoansHeader';
import TouchItem from '../../components/TouchItem/_TouchItem'

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
    postCreateSavings,
    postSavingsBreakdown
} from "../../lib/api/url";
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { withNavigationFocus, ScrollView } from 'react-navigation';
import { formStyles } from "../../../assets/styles/styles";
import { HeaderText } from "../../components/HeaderText/HeaderText";
import { showToast, hideToast } from "../../components/Toast/actions/toastActions";
import { scale, verticalScale, moderateScale } from "../../lib/utils/scaleUtils";
import * as WebBrowser from "expo-web-browser";
import { Colors } from "../../lib/constants/Colors";
import { LoaderText } from "../../components/Loader/Loader";
import { updateSavingsDetails, getSavingsFrequencies } from "./action/savings_actions";
import * as Icon from "@expo/vector-icons";
import moment from 'moment'
import DateTimePicker from "react-native-modal-datetime-picker";
import { Appearance } from "react-native-appearance";
import { apiRequest } from "../../lib/api/api";
import {chunkArray, convertDecimal} from "../../lib/utils/helpers";

const colorScheme = Appearance.getColorScheme();


const ACCESS_TOKEN = 'access_token';

class Login extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);

        let {periodic_amount, target, frequency_id, start_date, end_date, tenor_id = 0, collection_method_id, product, name, card_id, repayment_method_id} = this.props.savingsDetails


        const {navigation} = this.props;
        const email = navigation.getParam('email', this.props.auth.email);
        end_date = end_date || ''

        let date = end_date.split('/').length === 3 ?
            moment(end_date, 'DD/MM/YYYY').format('DD/MM/YYYY') :
            moment(end_date).format('DD/MM/YYYY');

        this.state = {
            amount: '',
            selected: tenor_id || 0,
            date: end_date ? date : '',
            isDateTimePickerVisible: false,
            savingsSummary: {}
        }
    }


    componentDidMount() {
        console.log(this.props.navigation.getParam('offers'), '#####@@@@!!!!')
        this.props.getSavingsFrequencies()
    }

    handleDatePicked = date => {
        console.warn("A date has been picked: ", date);
        this.formatDate(date)
        this.hideDateTimePicker();
    };


    formatDate(date) {

        this.setState({
            date: moment(date).format('DD/MM/YYYY'),
            selected: 0
        })

        // this.setState({birthdaydate: mths[month] + " " + day + ", " + year})

    }

    hideDateTimePicker = () => {
        this.setState({isDateTimePickerVisible: false});
    };


    _handleOpenLink = async (url) => {
        let result = await WebBrowser.openBrowserAsync(url);
        this.setState({result});
    };

    onhandleRegister = () => {
        Keyboard.dismiss();
        let {email, password, amount, full_amount} = this.state;

        // if (this.validate()) return;

        let params = {};
        // if (this.state.selected) {
        params.tenor_id = this.state.selected;
        params.offer_id = this.state.selected;
        params.periodic_amount = this.props.navigation.getParam('amount').replace(/,/g, '');
        if (this.state.savingsSummary.maturity_value) {
            params.target = this.state.savingsSummary.maturity_value;
        }

        this.props.updateSavingsDetails(params);
        const { product, collection_method_id } = this.props.savingsDetails;

        const collectionMethod = (this.props.savingsCollectionMethods.find(fr => fr.id === collection_method_id)) || ''
        const collection_name = collectionMethod.name?collectionMethod.name.toLowerCase():''

        if(product.is_fixed || (collection_name === 'automated')){
            this.props.navigation.navigate('SavingsCardList', {
                redirect:'ConfirmSavingsDetails'
            })
        }else{
            this.props.navigation.navigate('EnterSavingsRepayment')
        }

    };

    submit = () => {

        const {periodic_amount, target, frequency_id, start_date, end_date, tenor_id, collection_method_id, product, name, card_id, repayment_method_id} = this.props.savingsDetails

        // const collectionMethod = (this.props.savingsCollectionMethods.find(fr => fr.name.toLowerCase() === "automated")) || ''


        const collectionMethod = (this.props.savingsCollectionMethods.find(fr => fr.id === collection_method_id)) || ''

        let collection_name = collectionMethod.name ? collectionMethod.name.toLowerCase() : '';
        this.setState({
            type: collection_name
        })
        if (collection_name === 'manual') {
            // this.props.navigation.navigate('ConfirmSavingsDetails')
            this.setState({
                displayBreakdown: true
            })
            return
        }

        console.log(this.props.savingsDetails.product.id, '####!!!!!%%%%%%%%%')

        // if (this.validate()) return;
        const params = {
            // name,
            tenor_id:this.state.selected,
            periodic_amount: Number(this.props.navigation.getParam('amount')),
            product_id: product.id,
            // collection_method_id,
            frequency_id,
            // repayment_method_id,
            start_date: moment(start_date, 'DD/MM/YYYY').format('YYYY/MM/DD'),
        }
        const offers = this.props.navigation.getParam('offers');
        if (offers && offers.length) {
            delete params.tenor_id;
            params.tenor = this.props.navigation.getParam('offerTenor');
            params.product_id = product.id;
            params.offer_id = this.state.selected;
        }
        console.log(params, '######@@@@@!!!!')
        // if (tenor_id) {
        //     params.tenor_id = tenor_id
        // } else if (end_date) {
        //     params.end_date = moment(end_date, 'DD/MM/YYYY').format('YYYY/MM/DD')
        // }

        // if (product.is_fixed) {
        //     params.periodic_amount = Number(target);
        // }
        // console.log(params)

        this.setState({
            loading: true,
            modalLoader: true
        }, () => {
            apiRequest(postSavingsBreakdown, 'post', params)
                .then(res => {
                    // console.log(res)
                    this.setState({
                        loading: false
                    }, () => {
                        if (res.status === 'success') {
                            console.log(res, '======>>>>>>>>>>@@@@@@')
                            this.setState({
                                savingsSummary: res.data,
                                displayBreakdown: true
                            });

                        } else {

                            this.props.showToast(res.message, 'error')
                        }
                    })
                })
                .catch(error => {
                    // console.log(error.response)
                    //
                    if (error.response) {
                        // this.props.navigation.navigate('LoanError')
                        this.props.showToast(error.response.data.message, 'error')
                    } else {
                        // this.props.navigation.navigate('LoanError')
                        this.props.showToast(error.message, 'error')
                    }
                    this.setState({
                        loading: false,
                        selectedTenor: -1,
                        selected: false
                    })
                });
        })
    };
    renderButton = () => {
        const {loading, selected} = this.state;
        return (
            <ButtonWithBackgroundBottom
                disabled={!selected || loading}
                onPress={() => this.onhandleRegister()}
                style={{width: '100%',  backgroundColor: (!selected || loading) ?'rgba(42, 157, 253, 0.45)' : Colors.tintColor }}

            >
                {loading && (<ActivityIndicator size="large" color="#fff"/>)}
                {!loading && (<ButtonWithBackgroundText>{'Proceed'}</ButtonWithBackgroundText>)}
            </ButtonWithBackgroundBottom>
        );
    };

    separateNumByComma = (num) => {
        return ('' + num).replace(
          /(\d)(?=(?:\d{3})+(?:\.|$))|(\.\d\d?)\d*$/g, 
          function(m, s1, s2){
            return s2 || (s1 + ',');
          }
        );
    }

    calculatePayout = (val) => {
        const {savingsFrequencies, savingsDetails} = this.props
        // console.log(savingsDetails)
        const {product} = savingsDetails;

        console.log(this.props.navigation.getParam('offers'), '=@@@@@@========>>>!!!!!', this.state.selectedTenor);
        // const totalDays = this.calculateDays();
        const interest = ((this.state.selectedInterestRate * this.state.methodTenor) / 365) / 100;
        console.log(val, interest, '=====!!!!!')
        return val * interest + val;
    }

    // calculateDays = () => {
    //     const { methodTenor, tenorType } = this.state;
    //     if (ten)
    // }
    render() {
        const {navigate} = this.props.navigation;
        const {email, password, full_amount, amount, selected} = this.state;
        const {savingsFrequencies, savingsDetails} = this.props
        // console.log(savingsDetails)
        const {product} = savingsDetails;

        let title = 'How do you plan to save?'

        let tenors = chunkArray(product.tenor, 2)
        let name = this.props.navigation.getParam('nameOfFrequency', '')
        let subtitle = 'The amount you would like to lock in this plan'
        if (!product.is_fixed) {
            subtitle = `The amount you would like to save ${name}`
        }
        const { type } = this.state;
        const hasOffers = this.props.navigation.getParam('offers') && this.props.navigation.getParam('offers').length;
        const offers = this.props.navigation.getParam('offers') && this.props.navigation.getParam('offers').length  ? this.props.navigation.getParam('offers') : product.tenor;
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
                    <LoaderText visible={this.state.loading} desciption={'Getting Savings Breakdown...'}/>
                    <ReactScrollView
                        style={{backgroundColor: 'transparent', flex: 1}}
                        // resetScrollToCoords={{x: 0, y: 0}}
                        contentContainerStyle={formStyles.container}
                        scrollEnabled={true}
                        keyboardShouldPersistTaps={'handled'}
                        enableOnAndroid={true}
                        alwaysBounceVertical={false}
                        bounces={false}
                        // behavior="padding"
                        // enabled
                    >
                        <Header leftIcon={"ios-arrow-back"} title={'Savings'}
                                onPressLeftIcon={() => this.props.navigation.goBack()}/>

                        <View style={[formStyles.auth_form, {flex: 1}]}>
                            <Text style={styles.title}>{title}</Text>
                            <Text style={[formStyles.formError, {marginTop:0}]}>{this.state.formError}</Text>
                            <View style={{marginTop: scale(0)}}>
                                <View style={{
                                    marginTop:scale(10)
                                }}>
                                    <FloatingLabelInput
                                        label="Amount (₦)"
                                        value={this.separateNumByComma(this.props.navigation.getParam('amount').replace(/,/g, ''))}
                                        underlineColorAndroid={'transparent'}
                                        keyboardType={'numeric'}
                                        disabled={true}
                                        maxLength={15}
                                        style={(this.state.formError || this.state.amount_error)?{  borderBottomColor: '#CA5C55', marginBottom: scale(10)}:{marginBottom: scale(10)}}
                                        multiline={false}
                                        autoCorrect={false}
                                        onChangeText={text => this.setState({amount: text, amount_error: '',formError:""})}
                                    />
                                    <Text style={this.state.amount_error ?
                                        {
                                            ...formStyles.subtitle,
                                            color: Colors.greyText,
                                        }:
                                        {
                                            ...formStyles.subtitle,
                                            color: Colors.greyText,
                                        }}>{subtitle}</Text>
                                    <Text style={{...formStyles.error, position: 'relative', marginTop: verticalScale(5)}}>{this.state.amount_error}</Text>
                                </View>
                                <Text style={styles.subHeader}>
                                    Choose offer
                                </Text>
                                <ScrollView
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    style={{
                                        // backgroundColor: 'red',
                                        // height: verticalScale(400)
                                    }}
                                >
                                        {offers.map(method => {
                                            const selected = hasOffers ? method.id === this.state.selectedTenor : method.value === this.state.selectedTenor;
                                            return <TouchableOpacity
                                                style={selected ? {...styles.tenorCard, backgroundColor: 'rgba(42, 157, 253, 0.15)'} : styles.tenorCard}
                                                onPress={() => {
                                                    // if (!this.state.amount || parseInt(this.state.amount.replace(/,/g, '')) < 100) {
                                                    //     this.setState({
                                                    //         amount_error: 'A minimum value of ₦100 is required'
                                                    //     });
                                                    //     return;
                                                    // }
                                                    this.setState({
                                                        selected: method.id,
                                                        date: '',
                                                        selectedTenor: hasOffers ? method.id : method.value,
                                                        methodTenor: method.value ? method.value : method.max_tenor,
                                                        tenorType: method.tenor_period ? method.tenor_period : 'days',
                                                        selectedInterestRate: hasOffers ? method.interest_rate : product.interest_rate,
                                                    }, () => this.submit())

                                                }
                                                }
                                            >
                                                <View style={{flexDirection: 'row', justifyContent: 'space-between', padding: moderateScale(15)}}>
                                                <View style={{
                                                        // backgroundColor: 'red',
                                                        minHeight: verticalScale(65),
                                                        justifyContent: 'center'
                                                    }}>
                                                    <Text style={{
                                                        // marginLeft: scale(14),
                                                        fontFamily: 'graphik-regular',
                                                        fontSize: scale(20),
                                                        fontWeight: 'bold',
                                                        color: Colors.greyText,
                                                        marginBottom: verticalScale(5)
                                                    }}>{method.value ? method.value : `${this.props.navigation.getParam('offerTenor')} ${method.tenor_period}`}</Text>
                                                    <Text style={{
                                                        // marginLeft: scale(14),
                                                        fontFamily: 'graphik-regular',
                                                        fontSize: scale(16),
                                                        // fontWeight: '500',
                                                        color: Colors.greyText
                                                    }}>{hasOffers ? method.interest_rate : product.interest_rate}% per annum</Text>
                                                    </View>
                                                    <View style={{
                                                        display: 'flex',
                                                        alignItems: 'flex-end',
                                                        // width: '100%',
                                                        marginBottom: 0
                                                    }}>
                                                    {(selected) && (<Icon.Ionicons
                                                        name={'ios-radio-button-on'}
                                                        size={scale(25)}
                                                        style={styles.menu}
                                                        color={Colors.tintColor}
                                                    />)}
                                                    {(!selected) && (
                                                        <Icon.Ionicons
                                                            name={'ios-radio-button-off'}
                                                            size={scale(25)}
                                                            style={{
                                                                marginBottom: 0
                                                            }}
                                                            color={Colors.tintColor}
                                                        />
                                                    )}
                                                    </View>

                                                </View>

                                            </TouchableOpacity>
                                        })}
                                        </ScrollView>
                                    {/* </View> */}
                                {/* // })} */}
                            </View>
                            {this.state.displayBreakdown ? <View>
                                <Text style={styles.subHeader}>
                                Breakdown
                            </Text>
                                <View style={[styles.roundCard, {
                                            paddingTop: scale(16),
                                            marginTop: scale(10)
                                        }]}>
                                    <View style={{
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                paddingHorizontal: scale(16),
                                                marginBottom: scale(20),
                                            }}>
                                        <View>
                                            <Text style={styles.label}>{this.props.savingsDetails.product.is_fixed ? 'Locked in' : type === 'manual' ? 'Savings Target' : 'Maturity Date'}</Text>
                                        <Text style={[styles.value]}>{this.props.savingsDetails.product.is_fixed ? `₦${this.separateNumByComma(this.props.navigation.getParam('amount').replace(/,/g, ''))}` : type === 'manual' ? 'N/A' : moment(this.state.savingsSummary.maturity_date).toString().split(' ').slice(0, 4).join(' ')}</Text>
                                        </View>
                                        <View>
                                            <Text style={[styles.label, {textAlign: 'right'}]}>{type === 'manual' ? 'Savings' : 'Interest rate'}</Text>
                                            <Text style={[styles.value, {textAlign: 'right'}]}> {type === 'manual' ? `₦${this.separateNumByComma(this.props.navigation.getParam('amount').replace(/,/g, ''))}` : `${this.state.savingsSummary.interest_rate ? this.state.savingsSummary.interest_rate : 0}%`}</Text>
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
                                                <Text style={styles.label}>{type === 'manual' ? 'Start By' : 'Interest value'}</Text>
                                                <Text style={styles.value}>{type === 'manual' ? moment(this.props.savingsDetails.start_date, 'DD/MM/YYYY').toString().split(' ').slice(0, 4).join(' ') : `₦${convertDecimal(this.state.savingsSummary.interest_accurred)}`}</Text>
                                            </View>
                                            <View>
                                                <Text style={[styles.label, {textAlign: 'right'}]}>{type === 'manual' ? 'Tenor' : 'Withholding tax'}</Text>
                                                <Text
                                                    style={[styles.value, {textAlign: 'right'}]}>{type === 'manual' ? `${this.state.selectedTenor} days` : this.state.savingsSummary.withholding_tax ? `₦${convertDecimal(this.state.savingsSummary.withholding_tax)}` : 'N/A'}</Text>
                                            </View>
                                    </View>

                                    {<View style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            paddingHorizontal: scale(16),
                                            marginBottom: scale(20)

                                        }}>
                                            <View>
                                                <Text style={styles.label}>{'Total payout'}</Text>
                                    <Text style={{...styles.value, color: '#27AE60'}}>{type === 'manual' ? `₦${convertDecimal(this.calculatePayout(Number(this.props.navigation.getParam('amount'))))}` : `₦${convertDecimal(this.state.savingsSummary.maturity_value)}`}</Text>
                                            </View>
                                    </View>}
                                </View>
                            </View> : <View/>}
                            <Text style={{
                                fontSize: scale(12),
                                fontFamily: 'graphik-regular',
                                color: Colors.greyText,
                                marginTop: scale(26),
                                lineHeight: scale(20)
                            }}>
                                Any withdrawal before the maturity date will attract a 20% penal charge on interest earned.
                            </Text>

                            {/* {(this.state.selected !== 0 || !!this.state.date) && ( */}
                                <View style={{marginTop: '10%', width: '100%', alignSelf: 'center', paddingBottom: verticalScale(30), bottom: 0}}>
                                    {this.renderButton()}
                                </View>
                            {/* )} */}

                        </View>
                        <DateTimePicker
                            isVisible={this.state.isDateTimePickerVisible}
                            onConfirm={this.handleDatePicked}
                            onCancel={this.hideDateTimePicker}
                            isDarkModeEnabled={colorScheme === 'dark'}
                            minimumDate={new Date()}
                        />
                    </ReactScrollView>
                </View>
            </View>
        );
    }

    validate = () => {

        let error = false;
        if (this.state.amount === '') {
            this.setState({
                amount_error: "Please enter an amount",
            })
            error = true;
        }
        return error
    }


    showPassword = () => {
        this.setState({
            passwordShow: !this.state.passwordShow
        })
    }
    showConfirmPassword = () => {
        this.setState({
            confirm_passwordShow: !this.state.confirm_passwordShow
        })
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        auth: state.authentication,
        savingsFrequencies: state.savings.savingsFrequencies || [],
        savingsDetails: state.savings.savingsDetails || {},
        savingsCollectionMethods: state.savings.savingsCollectionMethods || [],


    };
};

const mapDispatchToProps = {
    showToast,
    hideToast,
    updateSavingsDetails,
    getSavingsFrequencies
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
    tenorCard: {
        marginTop: scale(10),
        marginRight: scale(20),
        minHeight: verticalScale(100),
        width: scale(180),
        borderColor: '#2A9DFD',
        borderRadius: moderateScale(8),
        borderWidth: moderateScale(1),
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
    subHeader: {
        fontFamily: 'graphik-regular',
        fontStyle: 'normal',
        fontSize: moderateScale(14),
        lineHeight: moderateScale(14),
        fontWeight: 'bold',
        color: '#4F4F4F',
        marginTop: verticalScale(20)
    },
    optionText: {
        color: 'black',
        fontFamily: 'graphik-regular',
        fontSize: scale(16),
    },
    label: {
        fontFamily: 'graphik-regular',
        fontSize: scale(12),
        color: '#112945'
    },
    value: {
        color: Colors.greyText,
        fontFamily: 'graphik-regular',
        fontSize: scale(14),
        marginTop: scale(8)
    },
    otherText: {
        fontSize: scale(12),
        color: '#112945',
        // textAlign: 'center',
        fontFamily: "graphik-regular",
        lineHeight: scale(20)
        // marginTop: scale(24),
    },
    option: {
        // paddingHorizontal: scale(9),
        paddingVertical: scale(7),
        borderBottomWidth: scale(1),
        // borderColor: Colors.darkBlue,
        borderBottomColor: '#9AA5B1',
        marginRight: scale(12),
        // marginBottom: scale(5),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between"
        // borderRadius: scale(3)
    },
})