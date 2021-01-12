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
import {getAllLoanOptions} from "./action/loan_actions";


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


const ACCESS_TOKEN = 'access_token';

class Login extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);

        const {requested_amount,
            purpose,proposed_payday,gender,marital_status,no_of_dependent,
            type_of_residence,address,educational_attainment,employment_status,
            sector_of_employment,work_start_date,monthly_repayment,monthly_net_income,work_email
        } = props.userLoanDetails
        const {navigation} = this.props;
        const email = navigation.getParam('email', this.props.auth.email);

        this.state = {
            gender: gender?{label:gender, value:gender}:'',
            marital_status: marital_status?{label:marital_status, value:marital_status}:'',
            no_of_dependent: no_of_dependent?{label:no_of_dependent, value:no_of_dependent}:'',
            address: address,
            type_of_residence: type_of_residence?{label:type_of_residence, value:type_of_residence}:'',
            isDateTimePickerVisible: false,
        }
    }


    componentDidMount() {
        this.props.getAllLoanOptions();
    }

    validate = () => {

        let error = false;
        let phoneRegex = /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/;

        if (this.state.gender === '') {
            this.setState({gender_error: "Please select a gender",
            })
            error = true;
        }
        if (this.state.marital_status === '') {
            this.setState({marital_status_error: "Please select a marital status",
            })
            error = true;
        }
        if (this.state.no_of_dependent === '') {
            this.setState({no_of_dependent_error: "Please select number of dependents",
            })
            error = true;
        }
        if (this.state.address === '') {
            this.setState({address_error: "Please enter an address",
            })
            error = true;
        }
        if (this.state.type_of_residence === '') {
            this.setState({type_of_residence_error: "Please select a residence type",
            })
            error = true;
        }

        return error
    }


    submit = () => {
        const {purpose_code, account_number, gender,marital_status,no_of_dependent,type_of_residence,address} = this.state;


        if (this.validate()) return;

        this.props.updateUserLoanDetails({
            gender:gender.value,
            marital_status:marital_status.value,
            no_of_dependent:no_of_dependent.value,
            type_of_residence:type_of_residence.value,
            address
        })
        this.props.navigation.navigate('EnterEducationAndEmployment')


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

        let options = data?data.option:[];
        options = options.map(item => {
            return {
                label:item.value,
                value:item.value,
            }
        })
        console.log(options)
        return options

    }

    render() {
        const {navigate} = this.props.navigation;
        const {purpose_code, account_number, gender,marital_status,no_of_dependent,type_of_residence,address} = this.state;
        let {photo_url, first_name, last_name, email, bvn, phone} = this.props.auth

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
                            <Text style={styles.title}>Let's have your details</Text>
                            <View style={{marginTop: scale(0)}}>

                                <View style={{marginTop: scale(30)}}>
                                    <FloatingLabelInput
                                        label="Name"
                                        value={`${first_name.charAt(0).toUpperCase() + first_name.substring(1).toLowerCase()} ${last_name.charAt(0).toUpperCase() + last_name.substring(1).toLowerCase()} `}
                                        editable={false}
                                        underlineColorAndroid={'transparent'}
                                        multiline={false}
                                        autoFocus
                                        autoCorrect={false}
                                    />
                                </View>
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
                                        options={this.getDataFromLoanOptions('gender')}
                                        value={''}
                                        textStyle={{
                                            color: '#484848',
                                            fontFamily: 'effra-medium',
                                            marginRight: scale(3),
                                            fontSize: scale(16)
                                        }}
                                        title={`Gender`}
                                        onChange={(obj) => {
                                            this.setState({
                                                gender: obj,
                                                gender_error: ''
                                            })
                                        }}
                                    >
                                        <View style={styles.select}
                                            // onPress={this.onhandleSubmit}
                                        >
                                            <Text style={styles.label}>What's your gender?</Text>
                                            <Text numberOfLines={1} style={styles.value}>{gender.label || ''}</Text>
                                        </View>
                                    </SelectDropdown>

                                    <Text style={styles.error}>{this.state.gender_error}</Text>
                                </View>
                                <View style={{marginTop: scale(30), marginBottom: scale(30)}}>
                                    <SelectDropdown
                                        options={this.getDataFromLoanOptions('marital_status')}
                                        value={''}
                                        textStyle={{
                                            color: '#484848',
                                            fontFamily: 'effra-medium',
                                            marginRight: scale(3),
                                            fontSize: scale(16)
                                        }}
                                        title={`Marital Status`}
                                        onChange={(obj) => {
                                            this.setState({
                                                marital_status: obj,
                                                marital_status_error: ''
                                            })
                                        }}
                                    >
                                        <View style={styles.select}
                                            // onPress={this.onhandleSubmit}
                                        >
                                            <Text style={styles.label}>What's your marital status?</Text>
                                            <Text numberOfLines={1} style={styles.value}>{marital_status.label || ''}</Text>
                                        </View>
                                    </SelectDropdown>

                                    <Text style={styles.error}>{this.state.marital_status_error}</Text>
                                </View>
                                <View style={{marginTop: scale(30), marginBottom: scale(30)}}>
                                    <SelectDropdown
                                        options={this.getDataFromLoanOptions('no_of_dependent')}

                                        value={''}
                                        textStyle={{
                                            color: '#484848',
                                            fontFamily: 'effra-medium',
                                            marginRight: scale(3),
                                            fontSize: scale(16)
                                        }}
                                        title={`Number of Children`}
                                        onChange={(obj) => {
                                            this.setState({
                                                no_of_dependent: obj,
                                                no_of_dependent_error: ''
                                            })
                                        }}
                                    >
                                        <View style={styles.select}
                                            // onPress={this.onhandleSubmit}
                                        >
                                            <Text style={styles.label}>How many children do you have?</Text>
                                            <Text numberOfLines={1} style={styles.value}>{no_of_dependent.label || ''}</Text>
                                        </View>
                                    </SelectDropdown>

                                    <Text style={styles.error}>{this.state.no_of_dependent_error}</Text>
                                </View>
                                <View style={{marginTop: scale(30), marginBottom: scale(30)}}>
                                    <SelectDropdown
                                        options={this.getDataFromLoanOptions('type_of_residence')}

                                        value={''}
                                        textStyle={{
                                            color: '#484848',
                                            fontFamily: 'effra-medium',
                                            marginRight: scale(3),
                                            fontSize: scale(16)
                                        }}
                                        title={`Type of Residence`}
                                        onChange={(obj) => {
                                            this.setState({
                                                type_of_residence: obj,
                                                type_of_residence_error: ''
                                            })
                                        }}
                                    >
                                        <View style={styles.select}
                                            // onPress={this.onhandleSubmit}
                                        >
                                            <Text style={styles.label}>What type of residence do you live in?</Text>
                                            <Text numberOfLines={1} style={styles.value}>{type_of_residence.label || ''}</Text>
                                        </View>
                                    </SelectDropdown>

                                    <Text style={styles.error}>{this.state.type_of_residence_error}</Text>
                                </View>

                                <View style={{marginTop: scale(30)}}>
                                    <FloatingLabelInput
                                        label="What is your current place of residence?"
                                        value={address}
                                        onChangeText={text => this.setState({
                                            address: text,
                                            address_error: ''
                                        })}
                                        style={{marginBottom:0}}
                                        maxLength={50}
                                        underlineColorAndroid={'transparent'}
                                        multiline={false}
                                        autoCorrect={false}
                                    />
                                    <Text style={styles.error}>{this.state.address_error}</Text>
                                </View>

                            </View>
                            <View style={{marginBottom: scale(10)}}>
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
        width:'100%',
        textAlign: 'right'
    },
})