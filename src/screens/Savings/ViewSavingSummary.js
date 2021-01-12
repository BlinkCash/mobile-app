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
import TouchItem from '../../components/TouchItem/_TouchItem';
import moment from 'moment'

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
import { formatAmount } from "../../lib/utils/helpers";


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
          amount:periodic_amount || 0
        }
    }


    componentDidMount() {
    }



    _handleOpenLink = async (url) => {
        let result = await WebBrowser.openBrowserAsync(url);
        this.setState({ result });
    };

    onhandleRegister = () => {

        const {navigation} = this.props;
        let data = navigation.getParam('data', '')
        const {periodic_amount, target, frequency_id, start_date, end_date, tenor_id = 0, collection_method_id, product, name, card_id, repayment_method_id} = this.props.savingsDetails

        const collectionMethod = (this.props.savingsCollectionMethods.find(fr => fr.id === collection_method_id)) || ''
        const collection_name = collectionMethod.name?collectionMethod.name.toLowerCase():''

        this.props.updateSavingsDetails({
            target: data.maturity_value
        })

        if(product.is_fixed || (collection_name === 'automated')){
            this.props.navigation.navigate('SavingsCardList', {
                redirect:'ConfirmSavingsDetails'
            })
        }else{
            this.props.navigation.navigate('EnterSavingsRepayment')
        }

        Keyboard.dismiss();

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
        const {periodic_amount, target, frequency_id, start_date, end_date, tenor_id = 0, collection_method_id, product, name, card_id, repayment_method_id} = this.props.savingsDetails


        const {navigation} = this.props;
        let data = navigation.getParam('data', '')
        console.log(data)
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
                            <Text style={styles.title}>You would have ₦{formatAmount(Number(data.maturity_value))} by {moment(data.maturity_date, 'YYYY-MM-DD').format('MMM, Do YYYY')}</Text>
                            {/*{!product.is_fixed && (*/}
                                <Text style={styles.description}>{data.summary}</Text>
                            {/* )} */}

                            {/*<Text style={[formStyles.formError]}>{this.state.formError}</Text>*/}

                            <View style={{flex:1, flexDirection:'row', marginBottom:scale(10)}}>
                                {this.renderButton()}
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </View>
        );
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
        savingsCollectionMethods: state.savings.savingsCollectionMethods || [],
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
    description: {
        marginTop: scale(17),
        fontFamily: 'graphik-regular',
        fontSize: scale(12),
        color: Colors.greyText,
        lineHeight: scale(20),
        paddingRight: scale(24)
    },
})