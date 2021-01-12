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
    getSavingsOfferings,
    postSavingsBreakdown,
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

const savingsTenors = [
  {
    value: 'Days'
  },
  {
    value: 'Weeks'
  },
  {
    value: 'Months'
  }
]
class EnterSavingTenor extends React.Component {
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
            duration: '',
            selected: tenor_id || 0,
            date: end_date ? date : '',
            isDateTimePickerVisible: false,
            savingsSummary: {}
        }
    }


    componentDidMount() {
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
        params.periodic_amount = amount.replace(/,/g, '');
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

    submit = async () => {
      try {
        if (!this.state.amount || parseInt(this.state.amount.replace(/,/g, '')) < 100) {
          this.setState({
              amount_error: 'A minimum value of ₦100 is required'
          });
          return;
        }
        if (!this.state.selected) {
          this.setState({
            period_error: 'Period is required'
          });
          return;
        }
        if (!this.state.duration || parseInt(this.state.duration, 10) < 1) {
          this.setState({
            duration_error: 'Duration is required'
          });
          return;
        }
        const {savingsFrequencies, savingsDetails} = this.props;
        const payload = {
          tenor: parseInt(this.state.duration, 10),
          tenor_period: this.state.selected.toLowerCase(),
          amount: this.state.amount.replace(/,/g, ''),
          product_id: savingsDetails.product.id
        }
        const response = await  apiRequest(getSavingsOfferings, 'post', payload);
        // return
        this.props.navigation.navigate('EnterSavingsMaturity', {
          offers: response.data,
          amount: this.state.amount.replace(/,/g, ''),
          offerTenor: parseInt(this.state.duration, 10),
          tenorPeriod: this.state.selected.toLowerCase(),
        })
      } catch (error) {
        console.log(error.toString(), '=====')
      }
    };
    renderButton = () => {
        const {loading, selected} = this.state;
        return (
            <ButtonWithBackgroundBottom
                disabled={loading}
                onPress={() => this.submit()}
                style={{width: '100%', backgroundColor: (loading) ?'rgba(42, 157, 253, 0.45)' : Colors.tintColor }}

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

        console.log(savingsDetails, '=========>>>!!!!!', this.state.selectedTenor);
        const interest = ((savingsDetails.product.interest_rate * this.state.selectedTenor) / 365) / 100;
        console.log(val * interest)
        return val * interest + val;
    }
    render() {
        const {navigate} = this.props.navigation;
        const {email, password, full_amount, amount, selected} = this.state;
        const {savingsFrequencies, savingsDetails} = this.props
        // console.log(savingsDetails)
        const {product} = savingsDetails;

        console.log(savingsDetails, '=========>>>');
        let title = 'How do you plan to save====='

        let tenors = chunkArray(product.tenor, 2)
        let name = this.props.navigation.getParam('nameOfFrequency', '')
        let subtitle = 'The amount you would like to lock in this plan'
        if (!product.is_fixed) {
            subtitle = `The amount you would like to save ${name}`
        }
        const { type } = this.state;
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
                            {/* <Text style={styles.title}>{title}</Text> */}
                            <Text style={[formStyles.formError, {marginTop:0}]}>{this.state.formError}</Text>
                            <View style={{marginTop: scale(0)}}>
                                <View style={{
                                    marginTop:scale(0)
                                }}>
                                    <FloatingLabelInput
                                        label="Amount (₦)"
                                        value={this.separateNumByComma(amount.replace(/,/g, ''))}
                                        underlineColorAndroid={'transparent'}
                                        keyboardType={'numeric'}
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
                                    Choose a saving period
                                </Text>
                                <ScrollView
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    style={{
                                        // backgroundColor: 'red',
                                        // height: verticalScale(400)
                                    }}
                                >
                                        {savingsTenors.map(method => {
                                            return <TouchableOpacity
                                                style={method.value === this.state.selected ? {...styles.tenorCard, backgroundColor: 'rgba(42, 157, 253, 0.15)'} : styles.tenorCard}
                                                onPress={() => {
                                                    this.setState({
                                                        selected: method.value,
                                                        date: '',
                                                    })

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
                                                    }}>{method.value}</Text>
                                                    <Text style={{
                                                        // marginLeft: scale(14),
                                                        fontFamily: 'graphik-regular',
                                                        fontSize: scale(16),
                                                        // fontWeight: '500',
                                                        color: Colors.greyText
                                                    }}></Text>
                                                    </View>
                                                    <View style={{
                                                        display: 'flex',
                                                        alignItems: 'flex-end',
                                                        // width: '100%',
                                                        marginBottom: 0
                                                    }}>
                                                    {(this.state.selected === method.value) && (<Icon.Ionicons
                                                        name={'ios-radio-button-on'}
                                                        size={scale(25)}
                                                        style={styles.menu}
                                                        color={Colors.tintColor}
                                                    />)}
                                                    {(this.state.selected !== method.value) && (
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
                                    <Text style={{...formStyles.error, position: 'relative', marginTop: verticalScale(5)}}>{this.state.period_error}</Text>
                                    {/* </View> */}
                                {/* // })} */}
                                <View style={{
                                    marginTop:scale(10)
                                }}>
                                    <FloatingLabelInput
                                        label="Duration"
                                        value={this.state.duration}
                                        underlineColorAndroid={'transparent'}
                                        keyboardType={'numeric'}
                                        maxLength={15}
                                        style={(this.state.formError || this.state.duration_error)?{  borderBottomColor: '#CA5C55', marginBottom: scale(10)}:{marginBottom: scale(10)}}
                                        multiline={false}
                                        autoCorrect={false}
                                        onChangeText={text => this.setState({duration: text, duration_error: '',formError:""})}
                                    />
                                    <Text style={{...formStyles.error, position: 'relative', marginTop: verticalScale(5)}}>{this.state.duration_error}</Text>
                                </View>
                            </View>
                     
                            {/* {(this.state.selected !== 0 || !!this.state.date) && ( */}
                                <View style={{position: 'absolute', width: '100%', alignSelf: 'center', paddingBottom: verticalScale(30), bottom: 0}}>
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
)(withNavigationFocus(EnterSavingTenor));

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