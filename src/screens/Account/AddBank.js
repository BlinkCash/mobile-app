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
import Header from '../../components/Header/OtherHeader';
import TouchItem from '../../components/TouchItem/_TouchItem'
import DateTimePicker from "react-native-modal-datetime-picker";


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
    checkfull_names, postAddBank,
    postVerifyBankAccount
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
import {getAllBanks} from "./action/account_actions";


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
            bank_code: '',
            bank: '',
            isDateTimePickerVisible: false,
        }
    }


    componentDidMount() {
        this.props.getBanks()
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
        let {bank_code, account_number, bank} = this.state


        if (this.validate()) return;
        Keyboard.dismiss();
        let {email, password, full_name} = this.state;

        let data = this.props.navigation.getParam('data', '')


        console.log({
            "account_number": account_number,
            "bank_code": bank.additional_code
        })
        this.setState({
            loading: true,
            modalLoader: true
        }, () => {
            apiRequest(postAddBank, 'post', {
                "account_number": account_number,
                "bank_code": bank.additional_code
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

    onChangeBankOption = (obj) => {
        this.setState({
            bank: obj,
            bank_error:''
        })
    }

    renderButton = () => {
        const {loading} = this.state;
        return (
            <ButtonWithBackgroundBottom
                disabled={loading}
                onPress={() => this.submit()}
                style={{width: '100%'}}

            >
                {loading && (<ActivityIndicator size="large" color="#fff"/>)}
                {!loading && (<ButtonWithBackgroundText>{'Add Bank'}</ButtonWithBackgroundText>)}
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
        const {bank_code, account_number,bank} = this.state;
        console.log(this.props.banks)
        let banks = this.props.banks.map(bank => {
            return {
                ...bank,
                label:bank.code_description,
                value:bank.additional_code
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
                        flex: 1
                    }}
                >
                    <LoaderText visible={this.state.loading} desciption={'Adding Bank Account...'}/>
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
                        <Header title={"Add Bank"} leftIcon={"ios-arrow-back"}
                                onPressLeftIcon={() => this.props.navigation.goBack()}
                        />

                        <View style={[formStyles.auth_form, {flex: 1}]}>
                            <Text style={styles.title}>Link your bank accounts for withdrawals</Text>
                            <View style={{marginTop: scale(0)}}>

                                <View style={{marginTop: scale(70)}}>
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
                                            account_number_error: ''
                                        })}
                                    />

                                    <Text style={formStyles.error}>{this.state.account_number_error}</Text>
                                </View>

                                <View style={{marginTop: scale(40), marginBottom: scale(30)}}>
                                    <SelectDropdown
                                        options={banks || []}
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
                                            <Text numberOfLines={1} style={styles.value}>{bank.label || ''}</Text>
                                        </View>
                                    </SelectDropdown>

                                    <Text style={formStyles.error}>{this.state.bank_error}</Text>
                                </View>

                            </View>
                            <View style={{marginBottom: scale(10)}}>
                                {this.renderButton()}
                            </View>

                            {/*<View style={{flex: 1, width: '100%', flexDirection: 'row'}}>*/}
                                {/*<View style={{*/}
                                    {/*alignSelf: 'flex-end',*/}
                                    {/*width: '100%',*/}
                                    {/*marginBottom:scale(30),*/}
                                    {/*flexDirection:'row',*/}
                                    {/*justifyContent:'center',*/}
                                    {/*alignItems:'center'*/}
                                {/*}}*/}
                                {/*>*/}
                                    {/*<Text*/}
                                        {/*style={{*/}
                                            {/*fontSize: scale(12),*/}
                                            {/*color: 'rgba(1, 27, 51, 0.5)',*/}
                                            {/*// textAlign: 'center',*/}
                                            {/*fontFamily: "graphik-medium",*/}
                                            {/*marginRight:scale(8)*/}
                                            {/*// marginTop: scale(24),*/}
                                        {/*}}*/}
                                    {/*>*/}
                                        {/*Powered by*/}
                                    {/*</Text>*/}
                                    {/*<Image*/}
                                        {/*style={{*/}
                                            {/*height: scale(16),*/}
                                            {/*width: scale(91),*/}
                                        {/*}}*/}
                                        {/*resizeMode={'contain'}*/}
                                        {/*source={require('../../../assets/images/paystack.png')}*/}
                                    {/*/>*/}
                                {/*</View>*/}

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
        banks: state.wallet.banks || []
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
    getBanks,
    getAllBanks
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
    passwordCheck: {
        fontSize: scale(12),
        color: '#3C5066',
        marginRight: scale(15),
        // textAlign: 'center',
        fontFamily: "graphik-regular",
        lineHeight: scale(13)
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
})