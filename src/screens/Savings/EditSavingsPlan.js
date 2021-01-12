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
    Modal, TouchableWithoutFeedback, Image, StyleSheet, TextInput
} from 'react-native';
import { connect } from 'react-redux'
import SelectDropdown from "../../components/SelectPopUp/SelectPopUp";

import { WebView } from 'react-native-webview';
import Header from '../../components/Header/OtherHeader';
// import {getAllCards} from "./action/account_actions";


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
import {
    checkfull_names, postAddBank, postInitCard,
    postVerifyBankAccount, postVerifyCard, putUpdateSavings
} from "../../lib/api/url";
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
import * as Icon from "@expo/vector-icons";
import { apiRequest } from "../../lib/api/api";
import moment from 'moment';
import { getBanks } from "../Wallet/action/wallet_actions";
// import { getAllBanks } from "./action/account_actions";
import PaystackWebview from "../../components/Paystack/Paystack";
import { getSavingsFrequencies } from "./action/savings_actions";
import { FloatingLabelInput } from "../../components/Input/FloatingLabelInput";
import SwitchToggle from "@dooboo-ui/native-switch-toggle";
import TouchItem from "../../components/TouchItem/_TouchItem";
import { formatAmount } from "../../lib/utils/helpers";


const ACCESS_TOKEN = 'access_token';

class Login extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);

        const {navigation} = this.props;
        let details = navigation.getParam('details', '')
        let target = navigation.getParam('target', '')

        let frequency = '';
        if (details.frequency) {
            frequency = {
                ...details.frequency,
                label: details.frequency.name.charAt(0).toUpperCase() + details.frequency.name.substring(1).toLowerCase(),
                value: details.frequency.id,
            }
        }

        let card = '';
        if (details.card) {
            card = {
                ...details.card,
            }
        }

        console.log(details)

        this.state = {
            password: '',
            account_number: '',
            target: formatAmount(target) || '',
            frequency,
            card,
            bank_code: '',
            name: details.name || '',
            periodic_amount: details.periodic_amount || '',
            isDateTimePickerVisible: false,
            showPaystackView: false,
            authorization_url: '',
            reference: '',
            status: details.status || 0
        }
    }


    componentDidMount() {

        this.props.getSavingsFrequencies();
        // this.initializeTransaction()
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


    submit = () => {

        const {navigation, loanDetails} = this.props;
        let details = navigation.getParam('details', '')
        let params = {
            "status": Number(this.state.status),
        }

        if (this.state.name) {
            params.name = this.state.name
        }
        if (this.state.periodic_amount) {
            params.periodic_amount = Number(this.state.periodic_amount)
        }
        if (this.state.target) {
            params.target = Number(this.state.target.split(',').join(''))
        }
        if (this.state.frequency) {
            params.frequency_id = this.state.frequency.id
        }
        if (this.state.card.id) {
            params.card_id = this.state.card.id
        }
        console.log(params)

        this.setState({
            loading: "Updating Savings Plan..."
        }, () => {
            apiRequest(putUpdateSavings(details.id), 'put', params)
                .then(res => {
                    console.log(res)
                    this.setState({
                        loading: false
                    }, () => {
                        if (res.status === 'success') {
                            this.props.navigation.navigate('SavingsDetail', {
                                refreshData: true
                            });
                            this.props.showToast(res.message, 'success')
                        } else {
                            // this.props.navigation.goBack();
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


    onChange = (text) => {
        this.setState({
            password: text
        }, () => {
            this.validate()
        })
    }

    componentDidUpdate(prevProps) {
        const {navigation, loanDetails} = this.props;
        let card = navigation.getParam('card', '')

        if (card && (this.state.card.id !== card.id)) {
            if (prevProps.navigation)
                this.setState({
                    card
                })
        }

    }

    render() {
        const {navigate} = this.props.navigation;
        const {bank_code, account_number, bank} = this.state;
        const {navigation, loanDetails} = this.props;
        let details = navigation.getParam('details', '')
        let target = navigation.getParam('target', '')

        const {savingsFrequencies} = this.props


        let frequencies = savingsFrequencies.map(freq => {
            return {
                ...freq,
                value: freq.id,
                label: freq.name.charAt(0).toUpperCase() + freq.name.substring(1).toLowerCase()
            }
        })

        return (
            <View style={{
                flex: 1,
                justifyContent: 'center'
            }}
            >
                <View
                    style={{
                        flex: 1,
                        backgroundColor: '#efefef'
                    }}
                >
                    <LoaderText visible={this.state.loading} desciption={this.state.loading}/>
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
                        <Header title={"Edit Plan"} leftIcon={"ios-arrow-back"}
                                onPressLeftIcon={() => this.props.navigation.goBack()} rightIcon={'Save'}
                                onPressRightIcon={this.submit}/>
                        <View style={{
                            width: '100%', paddingHorizontal: scale(24), borderBottomWidth: scale(1),
                            borderBottomColor: 'rgba(18, 22, 121, 0.07)', backgroundColor: 'white'
                        }}>
                            <View style={styles.item}>
                                <Text style={styles.title}>Plan name</Text>
                                <TextInput
                                    style={styles.textInput}
                                    value={this.state.name}
                                    underlineColorAndroid={'transparent'}
                                    multiline={false}
                                    autoCorrect={false}
                                    onChangeText={text => this.setState({name: text, name_error: ''})}
                                />
                            </View>
                            <View style={[styles.item, {borderWidth: 0, borderBottomColor: 'transparent'}]}>
                                <Text style={styles.title}>My Target (₦)</Text>
                                <TextInput
                                    style={styles.textInput}
                                    value={this.state.target}
                                    underlineColorAndroid={'transparent'}
                                    multiline={false}
                                    keyboardType={'numeric'}
                                    autoCorrect={false}
                                    onChangeText={text => this.setState({target: text, target_error: ''})}
                                />
                            </View>
                        </View>


                        <View style={{
                            width: '100%',
                            paddingHorizontal: scale(24),
                            borderBottomWidth: scale(1),
                            marginTop: scale(24),
                            borderBottomColor: 'rgba(18, 22, 121, 0.07)',
                            backgroundColor: 'white'
                        }}>
                            {!!this.state.periodic_amount && (
                                <View style={styles.item}>
                                    <Text style={styles.title}>Periodic Amount (₦)</Text>
                                    <TextInput
                                        style={styles.textInput}
                                        value={this.state.periodic_amount}
                                        underlineColorAndroid={'transparent'}
                                        keyboardType={'numeric'}
                                        multiline={false}
                                        autoCorrect={false}
                                        onChangeText={text => this.setState({
                                            periodic_amount: text,
                                            periodic_amount_error: ''
                                        })}
                                    />
                                </View>)}


                            {!!this.state.frequency && (
                                <View style={[styles.item]}>
                                    <Text style={styles.title}>Frequency</Text>
                                    <SelectDropdown
                                        options={frequencies || []}
                                        value={''}
                                        textStyle={{
                                            color: '#484848',
                                            fontFamily: 'effra-medium',
                                            marginRight: scale(3),
                                            fontSize: scale(16)
                                        }}
                                        dropdownImageStyle={{
                                            display: 'none',
                                            right: 9999
                                        }}
                                        title={`Select Frequency`}
                                        onChange={(obj) => {
                                            this.setState({
                                                frequency: obj,
                                                frequency_error: ''
                                            })
                                        }}
                                        style={{
                                            flex: 1,
                                        }}
                                    >
                                        <View style={styles.select}
                                            // onPress={this.onhandleSubmit}
                                        >
                                            <Text numberOfLines={1} style={{
                                                fontFamily: 'graphik-regular',
                                                fontSize: scale(14),
                                                color: '#193152',
                                                textAlign: 'right',
                                                width: '100%'
                                            }}>{this.state.frequency.label || ''}</Text>
                                        </View>
                                    </SelectDropdown>
                                </View>
                            )}

                            <View style={[styles.item, {borderWidth: 0, borderBottomColor: 'transparent'}]}>
                                <Text style={styles.title}>Plan Status</Text>
                                <Text
                                    style={[styles.textInput, {color: this.state.status ? "#27AE60" : '#EB5757'}]}>{this.state.status ? 'Active' : 'Inactive'}</Text>
                            </View>
                        </View>

                        <View style={{
                            width: '100%',
                            paddingHorizontal: scale(24),
                            borderBottomWidth: scale(1),
                            marginTop: scale(24),
                            borderBottomColor: 'rgba(18, 22, 121, 0.07)',
                            backgroundColor: 'white'
                        }}>
                            <View style={[styles.item, {borderWidth: 0, borderBottomColor: 'transparent'}]}>
                                <Text style={styles.title}>Pause Savings</Text>
                                <SwitchToggle
                                    containerStyle={{
                                        width: scale(44),
                                        height: scale(24),
                                        borderRadius: scale(12),
                                        backgroundColor: '#ccc',
                                        padding: scale(2),
                                    }}
                                    circleStyle={{
                                        width: scale(20),
                                        height: scale(20),
                                        borderRadius: scale(10),
                                        backgroundColor: 'white', // rgb(102,134,205)
                                    }}
                                    switchOn={!this.state.status}
                                    onPress={() => this.setState({
                                        status: !this.state.status
                                    })}
                                    backgroundColorOn={Colors.tintColor}
                                    backgroundColorOff={'#ECECEC'}
                                    circleColorOff="white"
                                    circleColorOn="white"
                                    duration={100}
                                />
                            </View>
                        </View>

                        {!!this.state.card && (
                            <View style={{
                                width: '100%',
                                paddingHorizontal: scale(24),
                                borderBottomWidth: scale(1),
                                marginTop: scale(24),
                                borderBottomColor: 'rgba(18, 22, 121, 0.07)',
                                backgroundColor: 'white'
                            }}>
                                <TouchItem style={[styles.item, {borderWidth: 0, borderBottomColor: 'transparent'}]}
                                           onPress={
                                               () => this.props.navigation.navigate('SavingsCardList', {
                                                   details,
                                                   redirect: 'EditSavingsPlan',
                                                   amount: this.state.amount
                                               })
                                           }>
                                    <Text style={styles.title}>Debit Card</Text>
                                    <Text
                                        style={[styles.textInput]}>{this.state.card.card_type} {this.state.card.card_last4}</Text>
                                </TouchItem>
                            </View>
                        )}


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
        banks: state.wallet.banks || [],
        savingsFrequencies: state.savings.savingsFrequencies || [],
    };
};

const mapDispatchToProps = {
    loginUserSuccess,
    handleForgotPassword,
    resetAuthData,
    showToast,
    getExtraDetails,
    getSavingsFrequencies,
    resetCache,
    hideToast,
    getBanks,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withNavigationFocus(Login));

const styles = StyleSheet.create({
    title: {
        fontSize: scale(14),
        color: '#9AA5B1',
        // textAlign: 'center',
        fontFamily: "graphik-regular",
        // lineHeight: scale(32)
        // marginTop: scale(24),
    },
    passwordCheck: {
        fontSize: scale(12),
        color: '#3C5066',
        marginRight: scale(15),
        // textAlign: 'center',
        fontFamily: "graphik-regular",
        lineHeight: scale(13)
        // marginTop: scale(24),
    },
    item: {
        // paddingHorizontal: scale(9),
        // paddingVertical: scale(7),
        borderBottomWidth: scale(1),
        // borderColor: Colors.darkBlue,
        borderBottomColor: 'rgba(18, 22, 121, 0.07)',
        // marginRight: scale(12),
        // marginBottom: scale(5),
        flexDirection: 'row',
        alignItems: 'center',
        height: scale(60),
        justifyContent: "space-between"
        // borderRadius: scale(3)
    },
    textInput: {
        fontFamily: 'graphik-regular',
        fontSize: scale(14),
        color: '#193152',
        textAlign: 'right',
        width: '50%'
    },
    otherText: {
        fontSize: scale(12),
        color: '#112945',
        // textAlign: 'center',
        fontFamily: "graphik-regular",
        lineHeight: scale(20)
        // marginTop: scale(24),
    },
    passwordCheckArea: {flexDirection: 'row', alignItems: 'center', width: scale(145), justifyContent: 'space-between'},
    select: {
        color: '#112945',
        // borderBottomWidth: 1,
        // borderBottomColor: '#9AA5B1',
        width: '100%',
        height: scale(60),
        justifyContent: 'center',
        // paddingBottom: scale(8)
    },
    value: {
        fontSize: scale(16),
        color: Colors.greyText,
        fontFamily: 'graphik-regular',
    },
})
