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
import { scale, verticalScale } from "../../lib/utils/scaleUtils";
import * as WebBrowser from "expo-web-browser";
import { Colors } from "../../lib/constants/Colors";
import { LoaderText } from "../../components/Loader/Loader";
import {updateSavingsDetails} from "./action/savings_actions";
import {getSavingsCollections} from "./action/savings_actions";


const ACCESS_TOKEN = 'access_token';

class Login extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);

        const {navigation} = this.props;
        const {periodic_amount,target,frequency_id,start_date,end_date,tenor_id = 0,collection_method_id,product,name,card_id,repayment_method_id} = this.props.savingsDetails

        const email = navigation.getParam('email', this.props.auth.email);

        this.state = {
          name:name || ''
        }
    }


    componentDidMount() {
        this.props.getSavingsCollections()

    }



    _handleOpenLink = async (url) => {
        let result = await WebBrowser.openBrowserAsync(url);
        this.setState({ result });
    };

    onhandleRegister = () => {
        let product = this.props.navigation.getParam('product', '')

        Keyboard.dismiss();
        let {email, password, name, full_name} = this.state;

        if (this.validate()) return;

        this.props.updateSavingsDetails({
            product,
            name: this.state.name
        })

        if(product.is_fixed){
            this.props.navigation.navigate('EnterSavingsStartDate')
        }
        else{
            this.props.navigation.navigate('EnterSavingsMethod')
        }
        // this.props.navigation.navigate('EnterSavingsAmount')




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
        const {email, password, full_name, name, confirm_password} = this.state;
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
                        // contentContainerStyle={formStyles.container}
                        // scrollEnabled={true}
                        // keyboardShouldPersistTaps={'handled'}
                        // enableOnAndroid={true}
                        // alwaysBounceVertical={false}
                        // bounces={false}
                        behavior="padding" enabled
                    >
                        <Header leftIcon={"ios-arrow-back"} title={'Savings'}
                                onPressLeftIcon={() => this.props.navigation.goBack()}/>

                        <View style={[formStyles.auth_form,{flex:1, paddingTop: 0, marginTop: 0}]}>
                            <Text style={styles.title}>Let’s give your plan a name</Text>
                            <Text style={[formStyles.formError]}>{this.state.formError}</Text>
                            <View style={{marginTop: scale(0)}}>

                                <View style={{
                                    marginTop:scale(15)
                                }}>
                                    <FloatingLabelInput
                                        label=""
                                        value={name}
                                        underlineColorAndroid={'transparent'}
                                        // keyboardType={'numeric'}
                                        maxLength={15}
                                        style={(this.state.formError || this.state.name_error)?{  borderBottomColor: '#CA5C55'}:{}}
                                        multiline={false}
                                        autoCorrect={false}
                                        onChangeText={text => this.setState({name: text, name_error: '',formError:""})}
                                    />
                                    <Text style={formStyles.error}>{this.state.name_error}</Text>
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
        if (this.state.name === '') {
            this.setState({
                name_error: "Please enter a name",
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
    updateSavingsDetails,
    getSavingsCollections
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