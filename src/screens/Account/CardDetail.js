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
    Modal, TouchableWithoutFeedback, Image, StyleSheet, ScrollView
} from 'react-native';
import { connect } from 'react-redux';
import NavigationService from "../../../NavigationService";
import { FloatingLabelInput } from "../../components/Input/FloatingLabelInput";
import Header from '../../components/Header/OtherHeader';
import TouchItem from '../../components/TouchItem/_TouchItem'

import { loginUserSuccess } from "../Auth/action/auth_actions";
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
    postCreatePassword,
    postAddEmail, postChangePassword, postPinResetOtp, deleteBank, deleteCard
} from "../../lib/api/url";
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { withNavigationFocus } from 'react-navigation';
import { formStyles } from "../../../assets/styles/styles";
import { HeaderText } from "../../components/HeaderText/HeaderText";
import { showToast, hideToast } from "../../components/Toast/actions/toastActions";
import { scale } from "../../lib/utils/scaleUtils";
// import { resetCache } from "./action/auth_actions";
import * as WebBrowser from "expo-web-browser";
import { Colors } from "../../lib/constants/Colors";
import { LoaderText } from "../../components/Loader/Loader";
import * as Icon from "@expo/vector-icons";
import { apiRequest } from "../../lib/api/api";
import SwitchToggle from '@dooboo-ui/native-switch-toggle';
import { getAllCards, getBanks } from "./action/account_actions";
import FadeInView from "../../components/AnimatedComponents/FadeInView";
import Dialog from "react-native-dialog";
import cards from "../../../assets/images/cards/cards";
import moment from "moment";


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
            isCardPage: false,
            dialogVisible: false,
            loading: false,
        }
    }


    componentDidMount() {
        // this.props.getAllCards()
        // this.props.getBanks()
    }


    onhandleDelete = () => {
        Keyboard.dismiss();

        let card = this.props.navigation.getParam('card', '')

        console.log(card)
        this.setState({
            loading: true,
            dialogVisible: false,
            modalLoader: true
        }, () => {
            apiRequest(deleteCard(card.id), 'delete')
                .then(res => {
                    console.log(res)
                    this.setState({
                        loading: false
                    }, () => {

                        if (res.status === 'success') {
                            this.props.navigation.goBack();
                            this.props.getAllCards();
                            this.props.showToast('Successfully deleted card', 'success');

                        } else {
                            this.props.showToast(res.message, 'error')
                        }
                        // this.props.showToast('Registration Complete. Please check your email for a confirmation link', 'success')
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

    renderButton = () => {
        const {loading} = this.state;
        return (
            <ButtonWithBackgroundBottom
                disabled={loading}
                onPress={() => this.showDialog()}
                style={{alignSelf: 'flex-end', width: '100%', backgroundColor: '#EB5757', marginTop: scale(40)}}

            >
                {loading && (<ActivityIndicator size="large" color="#fff"/>)}
                {!loading && (<ButtonWithBackgroundText>{'Delete Card'}</ButtonWithBackgroundText>)}
            </ButtonWithBackgroundBottom>
        );
    };

    render() {
        const {navigate} = this.props.navigation;
        let card = this.props.navigation.getParam('card', '')
        const {email, password, full_name, phone, isCardPage} = this.state;
        let icon = cards[card.card_type]
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
                        <Header title={"Card Details"} leftIcon={"ios-arrow-back"}
                                onPressLeftIcon={() => this.props.navigation.goBack()}
                        />

                        <LoaderText visible={this.state.loading} desciption={'Deleting your card...'}/>


                        <View style={{
                            width: '100%',
                            paddingVertical: scale(27),
                            paddingHorizontal: scale(24)
                        }}>
                            <View
                                style={[styles.card,{backgroundColor: '#DC4F89'}]}>
                                <View style={{padding: scale(16)}}>
                                    <Text style={styles.name}>{`XXXX XXXX XXXX ${card.card_last4}`}</Text>
                                    <Text  style={styles.number}>{`${card.card_exp_month}/${card.card_exp_year}`}</Text>
                                </View>
                                <Image
                                    source={require('../../../assets/images/Vector.png')}
                                    style={{
                                        width: scale(100),
                                        height: scale(140),
                                        position: 'absolute',
                                        right: 0,
                                        top: 0,
                                        borderRadius: scale(6)
                                    }}
                                    resizeMode={'contain'}
                                />
                                <Image
                                    source={icon}
                                    style={{
                                        width: scale(58),
                                        height: scale(28),
                                        position: 'absolute',
                                        right: scale(16),
                                        bottom: scale(16),
                                    }}
                                    resizeMode={'contain'}
                                />
                            </View>


                            <View style={styles.listItem}>
                                <Text style={styles.item}>Expiry</Text>
                                <Text style={styles.item}>{`${card.card_exp_month}/${card.card_exp_year}`}</Text>
                            </View>
                            <View style={styles.listItem}>
                                <Text style={styles.item}>Added on</Text>
                                <Text style={styles.item}>{moment(card.created_on).format('MMM DD, YYYY')}</Text>
                            </View>

                            {this.renderButton()}
                        </View>

                    </KeyboardAwareScrollView>
                    {/*{this.state.dialogVisible && (<Dialog.Container visible={this.state.dialogVisible}>*/}
                        {/*<Dialog.Title>Confirm</Dialog.Title>*/}
                        {/*<Dialog.Description>*/}
                            {/*Confirm that you want to delete this card.*/}
                        {/*</Dialog.Description>*/}
                        {/*<Dialog.Button label="No" onPress={this.handleCancel} color={Colors.red}/>*/}
                        {/*<Dialog.Button label="Yes" onPress={this.onhandleDelete} bold color={Colors.green}/>*/}
                    {/*</Dialog.Container>)}*/}

                </View>
            </View>
        );
    }

    showDialog = () => {
        Alert.alert(
            'Confirm',
            'Confirm that you want to delete this card.',
            [
                {
                    text: 'No',
                    onPress: () => this.handleCancel(),
                    style: 'cancel',
                },
                {text: 'Yes', onPress: () => this.onhandleDelete()},
            ],
            {cancelable: false},
        );
        // this.setState({dialogVisible: true});
    };

    handleCancel = () => {
        this.setState({dialogVisible: false});
    };

}

const mapStateToProps = (state, ownProps) => {
    return {
        auth: state.authentication,
        loadingCards: state.account.loadingCards,
        loadingBanks: state.account.loadingBanks,
        cards: state.account.cards || [],
        banks: state.account.banks || [],
    };
};

const mapDispatchToProps = {
    loginUserSuccess,
    // handleForgotPassword,
    // resetAuthData,
    getAllCards,
    getBanks,
    showToast,
    // getExtraDetails,
    // resetCache,
    hideToast,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withNavigationFocus(Login));

const styles = StyleSheet.create({
    card: {
        width: '100%',
        minHeight: scale(140),
        backgroundColor: Colors.tintColor,
        borderRadius: scale(6),
        justifyContent: 'flex-end',
        marginBottom: scale(24)
    },
    name: {
        fontSize: scale(14),
        lineHeight: scale(15),
        fontFamily: 'graphik-regular',
        color: Colors.white,
        marginBottom: scale(5)
    },
    number: {
        fontSize: scale(12),
        lineHeight: scale(13),
        fontFamily: 'graphik-medium',
        color: Colors.white,
        marginBottom: scale(5)
    },
    info: {
        fontSize: scale(12),
        lineHeight: scale(13),
        fontFamily: 'graphik-regular',
        color: Colors.white
    },
    item: {
        fontSize: scale(14),
        lineHeight: scale(14),
        fontFamily: 'graphik-regular',
        color: Colors.greyText
    },
    listItem: {
        height: scale(54),
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomWidth: scale(1),
        borderBottomColor: 'rgba(98, 149, 218, 0.15)',
        // paddingHorizontal: scale(16)
    },

})