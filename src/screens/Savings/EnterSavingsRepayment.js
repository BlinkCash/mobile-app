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
import { updateSavingsDetails, getSavingsRepaymentMethods } from "./action/savings_actions";
import * as Icon from "@expo/vector-icons";
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

        this.state = {
            amount: '',
            selected: 0
        }
    }


    componentDidMount() {
        this.props.getSavingsRepaymentMethods()
    }


    _handleOpenLink = async (url) => {
        let result = await WebBrowser.openBrowserAsync(url);
        this.setState({result});
    };

    onhandleRegister = () => {
        Keyboard.dismiss();
        let {email, password, amount, full_amount} = this.state;

        const {savingsRepaymentMethods} = this.props

        let method = savingsRepaymentMethods.find(method => method.id === this.state.selected)
        // if (this.validate()) return;

        this.props.updateSavingsDetails({
            repayment_method_id: this.state.selected
        })


        if (method.name.toLowerCase() === 'wallet') {
            this.props.navigation.navigate('ConfirmSavingsDetails')
            return
        }
        this.props.navigation.navigate('SavingsCardList', {
            redirect: 'ConfirmSavingsDetails'
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
                {!loading && (<ButtonWithBackgroundText>{'Proceed'}</ButtonWithBackgroundText>)}
            </ButtonWithBackgroundBottom>
        );
    };

    render() {
        const {navigate} = this.props.navigation;
        const {email, password, full_amount, amount, selected} = this.state;
        const {savingsRepaymentMethods} = this.props
        console.log(savingsRepaymentMethods)
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

                        <View style={[formStyles.auth_form, {flex: 1}]}>
                            <Text style={styles.title}>Choose Funding Method</Text>
                            <Text style={[formStyles.formError]}>{this.state.formError}</Text>
                            <View style={{marginTop: scale(0)}}>

                                {savingsRepaymentMethods.map(method => {
                                    return <TouchItem
                                        style={{
                                            marginTop: scale(30)
                                        }}
                                        onPress={() => {
                                            this.setState({
                                                selected: method.id
                                            })
                                        }
                                        }
                                    >
                                        <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>

                                            {(selected === method.id) && (<Icon.Ionicons
                                                name={'ios-radio-button-on'}
                                                size={scale(25)}
                                                style={styles.menu}
                                                color={Colors.tintColor}
                                            />)}
                                            {(selected !== method.id) && (
                                                <Icon.Ionicons
                                                    name={'ios-radio-button-off'}
                                                    size={scale(25)}
                                                    style={styles.menu}
                                                    color={Colors.tintColor}
                                                />
                                            )}
                                            <View style={{marginLeft: scale(14)}}>
                                                <Text style={{
                                                    fontFamily: 'graphik-regular',
                                                    fontSize: scale(20),
                                                    color: Colors.greyText
                                                }}>{method.name}</Text>
                                                <Text style={styles.description}>
                                                    {method.description}
                                                </Text>
                                                {(method.name.toLowerCase() === 'wallet') && (
                                                    <View style={{
                                                        flexDirection: 'row',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        paddingRight:scale(24),
                                                        // marginRight: scale(15),
                                                        marginTop: scale(17),
                                                    }}>
                                                        <Text style={styles.walletTitle}>
                                                            Wallet Balance
                                                        </Text>
                                                        <Text style={styles.wallet}>
                                                            ₦{formatAmount(this.props.wallet.availableBalance)}
                                                        </Text>
                                                    </View>
                                                )}
                                            </View>
                                        </View>

                                    </TouchItem>
                                })}

                            </View>

                            {/* TODO: Update when wallet is ready*/}
                            {!!this.state.selected && (
                                <View style={{flex: 1, flexDirection: 'row', marginBottom: scale(10)}}>
                                    {this.renderButton()}
                                </View>
                            )}

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
        savingsRepaymentMethods: state.savings.savingsRepaymentMethods || [],
        wallet: state.wallet,
    };
};

const mapDispatchToProps = {
    showToast,
    hideToast,
    updateSavingsDetails,
    getSavingsRepaymentMethods
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
    description: {
        marginTop: scale(17),
        fontFamily: 'graphik-regular',
        fontSize: scale(12),
        color: Colors.greyText,
        lineHeight: scale(20),
        paddingRight: scale(24)
    },
    walletTitle: {
        // marginTop: scale(17),
        fontFamily: 'graphik-regular',
        fontSize: scale(12),
        color: Colors.greyText,
        // lineHeight: scale(20),
        // paddingRight:scale(24)
    },
    wallet: {
        fontSize: scale(18),
        // lineHeight: scale(13),
        fontFamily: 'graphik-medium',
        color: Colors.greyText,
    },
})