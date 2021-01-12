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
import * as WebBrowser from "expo-web-browser";
import { Colors } from "../../lib/constants/Colors";
import { LoaderText } from "../../components/Loader/Loader";
import {updateSavingsDetails} from "./action/savings_actions";
import EnterSavingsStartDate from "./EnterSavingsStartDate";


const ACCESS_TOKEN = 'access_token';

class Login extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);

        const {navigation} = this.props;
        const email = navigation.getParam('email', this.props.auth.email);
        const {periodic_amount,target,frequency_id,start_date,end_date,tenor_id = 0,collection_method_id,product,name,card_id,repayment_method_id} = this.props.savingsDetails


        this.state = {
          amount:periodic_amount || ''
        }
    }


    componentDidMount() {
    }



    _handleOpenLink = async (url) => {
        let result = await WebBrowser.openBrowserAsync(url);
        this.setState({ result });
    };

    onhandleRegister = () => {
        Keyboard.dismiss();
        let {email, password, amount, full_amount} = this.state;
        const {product} = this.props.savingsDetails;

        if (this.validate()) return;

        this.props.updateSavingsDetails({
            // target: this.state.amount,
            periodic_amount: this.state.amount
        })
        if(product.is_fixed){
            this.props.navigation.navigate('EnterSavingsStartDate')
        }
        else{
            this.props.navigation.navigate('EnterSavingsMethod')
        }





    };

    renderButton = () => {
        const {loading} = this.state;
        return (
            <ButtonWithBackgroundBottom
                disabled={loading}
                onPress={() => this.onhandleRegister()}
                style={{alignSelf:'flex-end', width:'100%'}}

            >
                {loading && (<ActivityIndicator size="large" color="#fff"/>)}
                {!loading && (<ButtonWithBackgroundText>{'Proceed'}</ButtonWithBackgroundText>)}
            </ButtonWithBackgroundBottom>
        );
    };

    render() {
        const {navigate} = this.props.navigation;
        const {email, password, full_amount, amount, confirm_password} = this.state;
        const {product} = this.props.savingsDetails;
        let title = "What's your savings target?";
        if(product.is_fixed){
            title = "How much do you want to lock in this plan?"
        }
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
                        <Header leftIcon={"ios-arrow-back"} title={'Savings'}
                                onPressLeftIcon={() => this.props.navigation.goBack()}/>

                        <View style={[formStyles.auth_form,{flex:1}]}>
                            <Text style={styles.title}>{title}</Text>
                            <Text style={[formStyles.formError]}>{this.state.formError}</Text>
                            <View style={{marginTop: scale(0)}}>

                                <View style={{
                                    marginTop:scale(30)
                                }}>
                                    <FloatingLabelInput
                                        label="Amount (₦)"
                                        value={amount}
                                        underlineColorAndroid={'transparent'}
                                        keyboardType={'numeric'}
                                        maxLength={15}
                                        style={(this.state.formError || this.state.amount_error)?{  borderBottomColor: '#CA5C55'}:{}}
                                        multiline={false}
                                        autoCorrect={false}
                                        onChangeText={text => this.setState({amount: text, amount_error: '',formError:""})}
                                    />
                                    <Text style={formStyles.error}>{this.state.amount_error}</Text>
                                </View>

                            </View>
                            <View style={{flex:1, flexDirection:'row', marginBottom:scale(10)}}>
                                {this.renderButton()}
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </View>
        );
    }

    validate = () => {

        const {product} = this.props.savingsDetails;

        let error = false;
        if (this.state.amount === '') {
            this.setState({
                amount_error: "Please enter an amount",
            })
            error = true;
        }
        let reg = /[0-9]/;
        if ( !reg.test(this.state.amount)) {
            this.setState({
                amount_error: "Please enter an valid amount",
            })
            error = true;
        }

        if(+this.state.amount < +product.min_amount  ){
            this.setState({
                amount_error: `${product.min_amount} is the minimum amount for this plan`,
            })
            error = true;
        }
        if(+this.state.amount > +product.max_amount  ){
            this.setState({
                amount_error: `${product.max_amount} is the maximum amount for this plan`,
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
        savingsDetails: state.savings.savingsDetails || {},
    };
};

const mapDispatchToProps = {
    showToast,
    hideToast,
    updateSavingsDetails
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
        lineHeight:scale(32)
        // marginTop: scale(24),
    },
})