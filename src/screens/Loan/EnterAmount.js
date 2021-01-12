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
import { connect } from 'react-redux';
import NavigationService from "../../../NavigationService";
import { FloatingLabelInput } from "../../components/Input/FloatingLabelInput";
import Header from '../../components/Header/LoansHeader';
import TouchItem from '../../components/TouchItem/_TouchItem'
import { TextInputMask } from 'react-native-masked-text'


import {
    handleForgotPassword,
    resetAuthData, loginUserSuccess, getExtraDetails,
} from '../Auth/action/auth_actions';
import {
    ButtonWithBackgroundText,
    ButtonWithBackgroundBottom
} from '../../components/Button/Buttons';
import { updateUserLoanDetails } from "./action/loan_actions";
import { postLogin, postRegister, checkfull_names, postAuthInit } from "../../lib/api/url";
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { withNavigationFocus } from 'react-navigation';
import { formStyles } from "../../../assets/styles/styles";
import { HeaderText } from "../../components/HeaderText/HeaderText";
import { showToast, hideToast } from "../../components/Toast/actions/toastActions";
import { scale, verticalScale } from "../../lib/utils/scaleUtils";
import { resetCache } from "../Auth/action/auth_actions";
import * as WebBrowser from "expo-web-browser";
import { Colors } from "../../lib/constants/Colors";
import { LoaderText } from "../../components/Loader/Loader";
import { formatAmount } from "../../lib/utils/helpers";


const ACCESS_TOKEN = 'access_token';

class Login extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);

        const {
            requested_amount
        } = props.userLoanDetails

        const {navigation} = this.props;
        const email = navigation.getParam('email', this.props.auth.email);

        this.state = {
            amount: Number(requested_amount) || 0
        }
    }


    componentDidMount() {
    }


    _handleOpenLink = async (url) => {
        let result = await WebBrowser.openBrowserAsync(url);
        this.setState({result});
    };


    onhandleSubmit = () => {

        console.log(this.state.amount)
        if (!this.state.amount) {
            this.setState({
                amount_error: 'Please enter an amount to continue'
            })
            return;
        }
        this.props.updateUserLoanDetails({
            requested_amount: this.state.amount
        })
        this.props.navigation.navigate('EnterLoanPurpose')

    }

    renderButton = () => {
        const {loading} = this.state;
        return (
            <ButtonWithBackgroundBottom
                disabled={loading}
                onPress={() => this.onhandleSubmit()}
                style={{alignSelf: 'flex-end', width: '100%'}}

            >
                {loading && (<ActivityIndicator size="large" color="#fff"/>)}
                {!loading && (<ButtonWithBackgroundText>{'Continue'}</ButtonWithBackgroundText>)}
            </ButtonWithBackgroundBottom>
        );
    };

    render() {
        const {navigate} = this.props.navigation;
        const {email, password, full_name, amount, confirm_password} = this.state;
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
                    <LoaderText visible={this.state.loading} desciption={'Sending OTP...'}/>
                    <KeyboardAvoidingView
                        style={{backgroundColor: 'transparent', flex: 1}}
                        // resetScrollToCoords={{x: 0, y: 0}}
                        contentContainerStyle={formStyles.container}
                        // scrollEnabled={true}
                        // keyboardShouldPersistTaps={'handled'}
                        // enableOnAndroid={true}
                        // alwaysBounceVertical={false}
                        // bounces={false}
                        behavior="padding" enabled
                    >
                        <Header leftIcon={"ios-arrow-back"} title={'Apply for a loan'}
                                onPressLeftIcon={() => this.props.navigation.goBack()}/>

                        <View style={[formStyles.auth_form, {flex: 1}]}>
                            <Text style={styles.title}>How much do you need ? (₦)</Text>
                            <View style={{marginTop: scale(0)}}>

                                <View style={{marginTop: scale(30)}}>
                                    {/*<FloatingLabelInput*/}
                                        {/*label=""*/}
                                        {/*value={amount}*/}
                                        {/*underlineColorAndroid={'transparent'}*/}
                                        {/*keyboardType={'numeric'}*/}
                                        {/*maxLength={15}*/}
                                        {/*style={{*/}
                                            {/*borderBottomWidth: 0,*/}
                                            {/*borderBottomColor: 'transparent',*/}
                                            {/*fontSize: scale(32),*/}
                                            {/*textAlign: 'center'*/}
                                        {/*}}*/}
                                        {/*multiline={false}*/}
                                        {/*autoFocus*/}
                                        {/*autoCorrect={false}*/}
                                        {/*onChangeText={text => this.setState({amount: text, amount_error: ''})}*/}
                                    {/*/>*/}

                                    <TextInputMask
                                        type={'money'}
                                        underlineColorAndroid={'transparent'}

                                        style={{
                                            borderBottomWidth: 0,
                                            borderBottomColor: 'transparent',
                                            fontSize: scale(32),
                                            textAlign: 'center'
                                        }}
                                        options={{
                                            precision: 2,
                                            separator: '.',
                                            delimiter: ',',
                                            unit: '',
                                            suffixUnit: ''
                                        }}
                                        multiline={false}
                                        autoFocus
                                        autoCorrect={false}
                                        value={this.state.amount}
                                        onChangeText={text => {
                                            this.setState({
                                                amount: text,
                                                amount_error:''
                                            })
                                        }}
                                    />


                                    <Text style={[formStyles.error,{width:'100%', textAlign:'center', bottom:-10}]}>{this.state.amount_error}</Text>
                                </View>

                            </View>
                            <View style={{position: 'absolute', width: '100%', alignSelf: 'center', paddingBottom: verticalScale(40), bottom: 0}}>
                                {this.renderButton()}
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </View>
        );
    }

    validate = () => {

        let error = false;
        if (this.state.amount === '') {
            this.setState({
                amount_error: "Please enter your mobile number",
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
    updateUserLoanDetails
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withNavigationFocus(Login));

const styles = StyleSheet.create({
    title: {
        fontSize: scale(24),
        color: Colors.greyText,
        textAlign: 'left',
        fontFamily: "graphik-medium",
        lineHeight: scale(32)
        // marginTop: scale(24),
    },
    input: {
        height: scale(42),
        color: "#000",
        borderBottomWidth: 1,
        borderBottomColor: '#9AA5B1',
        fontFamily: 'graphik-regular',
        marginBottom: scale(20),
        fontSize: scale(32),
        textAlign: 'center'
    }
})