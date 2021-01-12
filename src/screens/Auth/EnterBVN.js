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
import Header from '../../components/Header/Header';
import TouchItem from '../../components/TouchItem/_TouchItem'


import {
    handleForgotPassword,
    resetAuthData, loginUserSuccess, getExtraDetails,
} from './action/auth_actions';
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
    getDasboardData,
    postVerifyBVN
} from "../../lib/api/url";
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { withNavigationFocus } from 'react-navigation';
import { formStyles } from "../../../assets/styles/styles";
import { HeaderText } from "../../components/HeaderText/HeaderText";
import { showToast, hideToast } from "../../components/Toast/actions/toastActions";
import { scale } from "../../lib/utils/scaleUtils";
import { resetCache } from "./action/auth_actions";
import * as WebBrowser from "expo-web-browser";
import { Colors } from "../../lib/constants/Colors";
import { LoaderText } from "../../components/Loader/Loader";
import { apiRequest } from "../../lib/api/api";


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
            bvn: ''
        }
    }


    componentDidMount() {
    }


    onhandleRegister = () => {
        Keyboard.dismiss();
        let {email, password, bvn, full_name} = this.state;

        if (this.validate()) return;


        this.setState({
            loading: true,
        }, () => {
            apiRequest(postVerifyBVN, 'post', {
                bvn
            })
                .then(res => {
                    console.log(res)
                    this.setState({
                        loading: false
                    }, () => {

                        if(res.success){
                            this.props.navigation.navigate('EnterBvnDetails', {
                                data:res
                            })
                        }

                        // this.props.showToast('Registration Complete. Please check your email for a confirmation link', 'success')
                    })
                })
                .catch(error => {
                    console.log(error.response)
                    //
                    if (error.response) {
                        this.setState({
                            formError:error.response.data.message
                        })
                    } else {
                        this.setState({
                            formError:error.message
                        })
                    }
                    this.setState({
                        loading: false
                    })
                });
        })
    };

    renderButton = () => {
        const {loading} = this.state;
        return (
            <ButtonWithBackgroundBottom
                disabled={loading}
                onPress={() => this.onhandleRegister()}
                style={{alignSelf: 'flex-end', width: '100%'}}

            >
                {loading && (<ActivityIndicator size="large" color="#fff"/>)}
                {!loading && (<ButtonWithBackgroundText>{'Continue'}</ButtonWithBackgroundText>)}
            </ButtonWithBackgroundBottom>
        );
    };

    render() {
        const {navigate} = this.props.navigation;
        const {email, password, full_name, phone, bvn} = this.state;
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
                    <LoaderText visible={this.state.loading} desciption={'Verifying details...'}/>
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
                        <Header leftIcon={"ios-arrow-back"}
                                onPressLeftIcon={() => this.props.navigation.navigate('Login')}/>

                        <View style={[formStyles.auth_form, {flex: 1}]}>
                            <Text style={styles.title}>Please enter your BVN</Text>
                            <Text style={[formStyles.formError]}>{this.state.formError}</Text>
                            <View style={{marginTop: scale(0)}}>

                                <View style={{marginTop: scale(35)}}>
                                    <FloatingLabelInput
                                        label="BVN"
                                        value={bvn}
                                        underlineColorAndroid={'transparent'}
                                        keyboardType={'numeric'}
                                        style={(this.state.formError || this.state.bvn_error)?{  borderBottomColor: '#CA5C55'}:{}}
                                        maxLength={11}
                                        multiline={false}
                                        autoCorrect={false}
                                        onChangeText={text => this.setState({bvn: text, bvn_error: '',formError:''})}
                                    />
                                    <Text style={formStyles.error}>{this.state.bvn_error}</Text>
                                </View>

                                <Text style={styles.otherText}>
                                    Your BVN does not give us access to your account, we can only access your Full name,
                                    Mobile Number and Date of Birth
                                </Text>

                            </View>
                            <View style={{flex: 1, flexDirection: 'row', marginBottom: scale(10)}}>
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
        if (this.state.bvn === '') {
            this.setState({
                bvn_error: "Please enter your BVN",
            })
            error = true;
        }
        if (this.state.bvn.length < 11) {
            this.setState({
                bvn_error: "Please enter a valid BVN",
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
        auth: state.authentication
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
    otherText: {
        fontSize: scale(12),
        color: '#112945',
        // textAlign: 'center',
        fontFamily: "graphik-regular",
        lineHeight: scale(20)
        // marginTop: scale(24),
    }
})