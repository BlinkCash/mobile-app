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
    postAddEmail, postChangePassword, postPinResetOtp, deleteBank
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
import { getAllCards, getAllBanks } from "./action/account_actions";
import FadeInView from "../../components/AnimatedComponents/FadeInView";
import Dialog from "react-native-dialog";


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

        let bank = this.props.navigation.getParam('bank', '')

        console.log(bank)
        this.setState({
            loading: true,
            dialogVisible: false,
            modalLoader: true
        }, () => {
            apiRequest(deleteBank(bank.id), 'delete')
                .then(res => {
                    console.log(res)
                    this.setState({
                        loading: false
                    }, () => {

                        if (res.status === 'success') {
                            this.props.navigation.goBack();
                            this.props.getAllBanks();
                            this.props.showToast('Successfully deleted account', 'success');

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
                {!loading && (<ButtonWithBackgroundText>{'Delete Bank'}</ButtonWithBackgroundText>)}
            </ButtonWithBackgroundBottom>
        );
    };

    render() {
        const {navigate} = this.props.navigation;
        let bank = this.props.navigation.getParam('bank', '')
        const {email, password, full_name, phone, isCardPage} = this.state;
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
                        <Header title={"Bank Details"} leftIcon={"ios-arrow-back"}
                                onPressLeftIcon={() => this.props.navigation.goBack()}
                        />

                        <LoaderText visible={this.state.loading} desciption={'Deleting this account...'}/>


                        <View style={{
                            width: '100%',
                            paddingVertical: scale(27),
                            paddingHorizontal: scale(24)
                        }}>
                            <View
                                style={styles.card}>
                                <View style={{padding: scale(16)}}>
                                    <Text style={styles.name}>{bank.account_name}</Text>
                                    <Text style={styles.number}>{bank.account_number}</Text>
                                    <Text style={styles.info}>{bank.code_description}</Text>
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
                                {/*<Image*/}
                                    {/*source={{uri:bank.url}}*/}
                                    {/*style={{*/}
                                        {/*width: scale(58),*/}
                                        {/*height: scale(28),*/}
                                        {/*position:'absolute',*/}
                                        {/*right:scale(16),*/}
                                        {/*bottom:0,*/}
                                    {/*}}*/}
                                    {/*resizeMode={'contain'}*/}
                                {/*/>*/}
                            </View>


                            <View style={styles.listItem}>
                                <Text style={styles.item}>Bank Name</Text>
                                <Text style={styles.item}>{bank.code_description}</Text>
                            </View>
                            <View style={styles.listItem}>
                                <Text style={styles.item}>Account Name</Text>
                                <Text style={[styles.item,{
                                    maxWidth:scale(200)
                                }]}>{bank.account_name}</Text>
                            </View>

                            {this.renderButton()}
                        </View>

                    </KeyboardAwareScrollView>
                    {this.state.dialogVisible && (<Dialog.Container visible={this.state.dialogVisible}>
                        <Dialog.Title>Confirm</Dialog.Title>
                        <Dialog.Description>
                            Confirm that you want to delete this bank account.
                        </Dialog.Description>
                        <Dialog.Button label="No" onPress={this.handleCancel} color={Colors.red}/>
                        <Dialog.Button label="Yes" onPress={this.onhandleDelete} bold color={Colors.green}/>
                    </Dialog.Container>)}

                </View>
            </View>
        );
    }

    showDialog = () => {
        this.setState({dialogVisible: true});
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
    getAllBanks,
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