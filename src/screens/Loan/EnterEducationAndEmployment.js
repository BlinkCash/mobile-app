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
    checkfull_names,
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
import DateTimePicker from "react-native-modal-datetime-picker";
import { Appearance } from "react-native-appearance";


const ACCESS_TOKEN = 'access_token';
const colorScheme = Appearance.getColorScheme();

class Login extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);

        const {navigation} = this.props;
        const email = navigation.getParam('email', this.props.auth.email);

        let {requested_amount,
            purpose,proposed_payday,gender,marital_status,no_of_dependent,
            type_of_residence,address,educational_attainment,employment_status,
            sector_of_employment,work_start_date,monthly_repayment,monthly_net_income,work_email
        } = props.userLoanDetails

        work_start_date = work_start_date || ''
        let date = work_start_date.split('/').length === 3?
            moment(work_start_date,'DD/MM/YYYY').format('DD/MM/YYYY'):
            moment(work_start_date).format('DD/MM/YYYY');

        this.state = {
            educational_attainment: educational_attainment?{label:educational_attainment, value:educational_attainment}:'',
            employment_status: employment_status?{label:employment_status, value:employment_status}:'',
            sector_of_employment: sector_of_employment?{label:sector_of_employment, value:sector_of_employment}:'',
            address: address || '',
            monthly_net_income: monthly_net_income?{label:monthly_net_income, value:monthly_net_income}:'',
            monthly_repayment: monthly_repayment?{label:monthly_repayment, value:monthly_repayment}:'',
            work_email: work_email || '',
            isDateTimePickerVisible: false,
            work_start_date:work_start_date?date: '',
        }
    }


    componentDidMount() {
        this.props.getAllLoanOptions();
    }

    validate = () => {

        const { work_start_date, educational_attainment, employment_status, sector_of_employment, monthly_net_income, work_email, monthly_repayment} = this.state;

        let error = false;
        let phoneRegex = /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/;

        if (work_start_date === '') {
            this.setState({
                work_start_date_error: "Please select the day you started working",
            })
            error = true;
        }
        if (educational_attainment === '') {
            this.setState({
                educational_attainment_error: "Please select the highest education level",
            })
            error = true;
        }
        if (employment_status === '') {
            this.setState({
                employment_status_error: "Please select your current employment status",
            })
            error = true;
        }
        if (sector_of_employment=== '') {
            this.setState({
                sector_of_employment_error: "Please select the sector you work in",
            })
            error = true;
        }
        if (monthly_net_income === '') {
            this.setState({
                monthly_net_income_error: "Please select the range of monthly income",
            })
            error = true;
        }
        if (work_email === '') {
            this.setState({
                work_email_error: "Please enter your work email",
            })
            error = true;
        }

        let emailRegex = /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/;

        if (!emailRegex.test(work_email)) {
            this.setState({
                work_email_error: "Please enter a valid email address",
            })
            error = true;
        }
        // if (monthly_repayment === '') {
        //     this.setState({
        //         monthly_repayment_error: "Please select current monthly loan repayment",
        //     })
        //     error = true;
        // }


        return error
    }


    submit = () => {
        const { work_start_date, educational_attainment, employment_status, sector_of_employment, monthly_net_income, work_email, monthly_repayment} = this.state;


        if (this.validate()) return;

        this.props.updateUserLoanDetails({
            educational_attainment: educational_attainment.value,
            employment_status: employment_status.value,
            sector_of_employment: sector_of_employment.value,
            monthly_net_income: monthly_net_income.value,
            monthly_repayment: monthly_repayment.value,
            work_start_date,
            work_email,
        })
        this.props.navigation.navigate('ConfirmLoanDetails')


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
                {!loading && (<ButtonWithBackgroundText>{'Continue'}</ButtonWithBackgroundText>)}
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

    getDataFromLoanOptions = (type) => {
        let data = this.props.loanOptions.find(item => {
            return item.key === type
        })

        let options = data ? data.option : [];
        options = options.map(item => {
            return {
                label: item.value,
                value: item.value,
            }
        })
        console.log(options)
        return options

    }

    render() {
        const {navigate} = this.props.navigation;
        const { work_start_date, educational_attainment, employment_status, sector_of_employment, monthly_net_income, work_email, monthly_repayment} = this.state;
        // let loan_purposes = this.props.loan_purposes.map(purpose => {
        //     return {
        //         ...purpose,
        //         label:purpose.code_description,
        //         value:purpose.ref_code
        //     }
        // })


        this.getDataFromLoanOptions()
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
                    <LoaderText visible={this.state.loading} desciption={'Verifying Bank Account, Please wait'}/>
                    <KeyboardAwareScrollView
                        style={{backgroundColor: 'transparent', flex: 1}}
                        // resetScrollToCoords={{x: 0, y: 0}}
                        contentContainerStyle={formStyles.container}
                        scrollEnabled={true}
                        keyboardShouldPersistTaps={'handled'}
                        enableOnAndroid={true}
                        alwaysBounceVertical={false}
                        bounces={false}
                        extraHeight={130} extraScrollHeight={130}
                    >
                        <Header leftIcon={"ios-arrow-back"} title={'Apply for a loan'}
                                onPressLeftIcon={() => this.props.navigation.goBack()}/>

                        <View style={[formStyles.auth_form, {flex: 1}]}>
                            <Text style={styles.title}>Let’s have your Education & Employment</Text>
                            <View style={{marginTop: scale(0)}}>

                                {/*<View style={{marginTop: scale(30)}}>*/}
                                {/*<FloatingLabelInput*/}
                                {/*label="Date of birth"*/}
                                {/*value={`23/6/2019`}*/}
                                {/*editable={false}*/}
                                {/*underlineColorAndroid={'transparent'}*/}
                                {/*multiline={false}*/}
                                {/*autoFocus*/}
                                {/*autoCorrect={false}*/}
                                {/*/>*/}
                                {/*<Text style={formStyles.error}>{this.state.amount_error}</Text>*/}
                                {/*</View>*/}

                                <View style={{marginTop: scale(30), marginBottom: scale(30)}}>
                                    <SelectDropdown
                                        options={this.getDataFromLoanOptions('education_attainment')}
                                        value={''}
                                        textStyle={{
                                            color: '#484848',
                                            fontFamily: 'effra-medium',
                                            marginRight: scale(3),
                                            fontSize: scale(16)
                                        }}
                                        title={`Level Of Education`}
                                        onChange={(obj) => {
                                            this.setState({
                                                educational_attainment: obj,
                                                educational_attainment_error: ''
                                            })
                                        }}
                                    >
                                        <View style={styles.select}
                                            // onPress={this.onhandleSubmit}
                                        >
                                            <Text style={styles.label}>What's your highest level of education?</Text>
                                            <Text numberOfLines={1}
                                                  style={styles.value}>{educational_attainment.label || ''}</Text>
                                        </View>
                                    </SelectDropdown>

                                    <Text style={styles.error}>{this.state.educational_attainment_error}</Text>
                                </View>
                                <View style={{marginTop: scale(30), marginBottom: scale(30)}}>
                                    <SelectDropdown
                                        options={this.getDataFromLoanOptions('employment_status')}
                                        value={''}
                                        textStyle={{
                                            color: '#484848',
                                            fontFamily: 'effra-medium',
                                            marginRight: scale(3),
                                            fontSize: scale(16)
                                        }}
                                        title={`Employment Status`}
                                        onChange={(obj) => {
                                            this.setState({
                                                employment_status: obj,
                                                employment_status_error: ''
                                            })
                                        }}
                                    >
                                        <View style={styles.select}
                                            // onPress={this.onhandleSubmit}
                                        >
                                            <Text style={styles.label}>What's your current employment status?</Text>
                                            <Text numberOfLines={1}
                                                  style={styles.value}>{employment_status.label || ''}</Text>
                                        </View>
                                    </SelectDropdown>

                                    <Text style={styles.error}>{this.state.employment_status_error}</Text>
                                </View>
                                <View style={{marginTop: scale(30), marginBottom: scale(30)}}>
                                    <SelectDropdown
                                        options={this.getDataFromLoanOptions('sector_of_employment')}

                                        value={''}
                                        textStyle={{
                                            color: '#484848',
                                            fontFamily: 'effra-medium',
                                            marginRight: scale(3),
                                            fontSize: scale(16)
                                        }}
                                        title={`Employment Sector`}
                                        onChange={(obj) => {
                                            this.setState({
                                                sector_of_employment: obj,
                                                sector_of_employment_error: ''
                                            })
                                        }}
                                    >
                                        <View style={styles.select}
                                            // onPress={this.onhandleSubmit}
                                        >
                                            <Text style={styles.label}>Which sector do you work in?</Text>
                                            <Text numberOfLines={1}
                                                  style={styles.value}>{sector_of_employment.label || ''}</Text>
                                        </View>
                                    </SelectDropdown>

                                    <Text style={styles.error}>{this.state.sector_of_employment_error}</Text>
                                </View>
                                <View style={{marginTop: scale(30), marginBottom: scale(30)}}>
                                    <View style={{marginTop: scale(0)}}>

                                        <Text style={styles.label}>When did you start working there?</Text>
                                        <TouchItem
                                            style={styles.option}
                                            onPress={() => this.setState({
                                                isDateTimePickerVisible: true
                                            })}>
                                            <Text
                                                style={styles.optionText}>{this.state.work_start_date}</Text>
                                        </TouchItem>

                                        <Text style={styles.error}>{this.state.work_start_date_error}</Text>

                                    </View>
                                </View>

                                <View style={{marginTop: scale(30), marginBottom: scale(30)}}>
                                    <SelectDropdown
                                        options={this.getDataFromLoanOptions('monthly_net_income')}

                                        value={''}
                                        textStyle={{
                                            color: '#484848',
                                            fontFamily: 'effra-medium',
                                            marginRight: scale(3),
                                            fontSize: scale(16)
                                        }}
                                        title={`Monthly Income`}
                                        onChange={(obj) => {
                                            this.setState({
                                                monthly_net_income: obj,
                                                monthly_net_income_error: ''
                                            })
                                        }}
                                    >
                                        <View style={styles.select}
                                            // onPress={this.onhandleSubmit}
                                        >
                                            <Text style={styles.label}>What's the range of your monthly salary?</Text>
                                            <Text numberOfLines={1}
                                                  style={styles.value}>{monthly_net_income.label || ''}</Text>
                                        </View>
                                    </SelectDropdown>

                                    <Text style={styles.error}>{this.state.monthly_net_income_error}</Text>
                                </View>
                                {/*<View style={{marginTop: scale(30), marginBottom: scale(30)}}>*/}
                                    {/*<SelectDropdown*/}
                                        {/*options={this.getDataFromLoanOptions('monthly_repayment')}*/}

                                        {/*value={''}*/}
                                        {/*textStyle={{*/}
                                            {/*color: '#484848',*/}
                                            {/*fontFamily: 'effra-medium',*/}
                                            {/*marginRight: scale(3),*/}
                                            {/*fontSize: scale(16)*/}
                                        {/*}}*/}
                                        {/*title={`Monthly Income`}*/}
                                        {/*onChange={(obj) => {*/}
                                            {/*this.setState({*/}
                                                {/*monthly_repayment: obj,*/}
                                                {/*monthly_repayment_error: ''*/}
                                            {/*})*/}
                                        {/*}}*/}
                                    {/*>*/}
                                        {/*<View style={styles.select}*/}
                                            {/*// onPress={this.onhandleSubmit}*/}
                                        {/*>*/}
                                            {/*<Text style={styles.label}>What's your current monthly loan*/}
                                                {/*repayment?</Text>*/}
                                            {/*<Text numberOfLines={1}*/}
                                                  {/*style={styles.value}>{monthly_repayment.label || ''}</Text>*/}
                                        {/*</View>*/}
                                    {/*</SelectDropdown>*/}

                                    {/*<Text style={styles.error}>{this.state.monthly_repayment_error}</Text>*/}
                                {/*</View>*/}

                                <View style={{marginTop: scale(30)}}>
                                    <FloatingLabelInput
                                        label="What is your work email address?"
                                        value={work_email}
                                        onChangeText={text => this.setState({
                                            work_email: text,
                                            work_email_error: ''
                                        })}
                                        style={{marginBottom: 0}}
                                        underlineColorAndroid={'transparent'}
                                        multiline={false}
                                        autoCorrect={false}
                                    />
                                    <Text style={styles.error}>{this.state.work_email_error}</Text>
                                </View>


                            </View>
                            <View style={{marginBottom: scale(10), marginTop:scale(15)}}>
                                {this.renderButton()}
                            </View>
                        </View>
                        <DateTimePicker
                            isVisible={this.state.isDateTimePickerVisible}
                            onConfirm={this.handleDatePicked}
                            onCancel={this.hideDateTimePicker}
                            isDarkModeEnabled={colorScheme === 'dark'}
                            maximumDate={new Date()}
                        />
                    </KeyboardAwareScrollView>
                </View>
            </View>
        );
    }

    handleDatePicked = date => {
        console.warn("A date has been picked: ", date);
        this.formatDate(date)
        this.hideDateTimePicker();
    };


    formatDate(date) {

        this.setState({
            work_start_date: moment(date).format('DD/MM/YYYY'),
            work_start_date_error:''
        })
        // this.setState({birthdaydate: mths[month] + " " + day + ", " + year})

    }

    hideDateTimePicker = () => {
        this.setState({isDateTimePickerVisible: false});
    };

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
        color: '#112945',
        opacity: 0.7
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
    error: {
        fontSize: scale(10),
        color: '#e73624',
        marginTop: scale(3),
        // position: 'absolute',
        fontFamily: 'graphik-medium',
        right: 0,
        width: '100%',
        textAlign: 'right'
    },
})