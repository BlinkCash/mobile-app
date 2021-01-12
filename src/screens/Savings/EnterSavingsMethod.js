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
import { updateSavingsDetails, getSavingsCollections } from "./action/savings_actions";
import * as Icon from "@expo/vector-icons";


const ACCESS_TOKEN = 'access_token';

class Login extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);

        const {periodic_amount, target, frequency_id, start_date, end_date, tenor_id = 0, collection_method_id, product, name, card_id, repayment_method_id} = this.props.savingsDetails

        const {navigation} = this.props;
        const email = navigation.getParam('email', this.props.auth.email);

        this.state = {
            amount: '',
            selected: collection_method_id || 0
        }
    }


    componentDidMount() {
        this.props.getSavingsCollections()
    }


    _handleOpenLink = async (url) => {
        let result = await WebBrowser.openBrowserAsync(url);
        this.setState({result});
    };

    onhandleRegister = () => {
        Keyboard.dismiss();
        let {email, password, amount, full_amount} = this.state;

        // if (this.validate()) return;

        this.props.updateSavingsDetails({
            collection_method_id: this.state.selected
        })

        let method = this.props.savingsCollectionMethods.find(c => c.id === this.state.selected)
        console.log(method)
        if (method.name.toLowerCase() === 'manual') {
            this.props.navigation.navigate('EnterSavingsStartDate')
        } else {
            this.props.navigation.navigate('EnterSavingsFrequency')
        }


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
        const {savingsCollectionMethods} = this.props
        console.log(savingsCollectionMethods)
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
                            <Text style={styles.title}>What’s your preferred savings method?</Text>
                            <Text style={[formStyles.formError]}>{this.state.formError}</Text>
                            <View style={{marginTop: scale(0)}}>

                                {savingsCollectionMethods.map(method => {
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
                                        <View style={{flexDirection: 'row'}}>

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
                                            </View>

                                        </View>

                                    </TouchItem>
                                })}

                            </View>
                            {this.state.selected !== 0 && (
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
        savingsCollectionMethods: state.savings.savingsCollectionMethods || [],
        savingsDetails: state.savings.savingsDetails || {}
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
    }
})