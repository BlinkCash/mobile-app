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
    postAddEmail, postChangePassword, postCreateLoan, postRepayLoan, postInitCard, getTheTransactionDetails
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
import { getAllCards, getAllBanks } from "../Account/action/account_actions";
import FadeInView from "../../components/AnimatedComponents/FadeInView";
import { formatAmount } from "../../lib/utils/helpers";
import { PinScreen } from "../../components/PinScreen/PinScreen";
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
            selected: 0,
            details:{
                type:' ',
                status:' ',
                entry:' '
            }
        }
    }


    componentDidMount() {
        const id = this.props.navigation.getParam('id', '');
        this.getTransactionDetails(id)
    }



    getTransactionDetails = (id) => {

        this.setState({
            loading: true
        }, () => {
            apiRequest(getTheTransactionDetails(id), 'get')
                .then(res => {
                    console.log(res)
                    this.setState({
                        loading: false
                    }, () => {
                        if (res.status === 'success') {
                            this.setState({
                                details: res.data
                            })

                        } else {
                            this.props.navigation.goBack();
                            this.props.showToast(res.message, 'error')
                        }
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
    }


    render() {
        const {navigate} = this.props.navigation;
        const {email, password, full_name, phone, details} = this.state;
        const {navigation, loanDetails} = this.props;
        let loan = navigation.getParam('loan', '')

        console.log(details)
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
                    <LoaderText visible={this.state.loading} desciption={'Loading Transaction Details...'}/>
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
                        <Header title={"Transaction Summary"} leftIcon={"ios-arrow-back"}
                                onPressLeftIcon={() => this.props.navigation.goBack()}/>

                        <View style={{marginTop: scale(32), width:'100%', paddingHorizontal:scale(24)}}>
                            <View style={[styles.roundCard, {
                                paddingVertical: scale(16)
                            }]}>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    paddingHorizontal: scale(16),
                                    marginBottom: scale(20)
                                }}>
                                    <View>
                                        <Text style={styles.label}>Type</Text>
                                        {/*<Text style={styles.value}>₦{formatAmount(requested_amount)}</Text>*/}
                                        <Text style={styles.value}>{details.type?details.type.charAt(0).toUpperCase() + details.type.substring(1).toLowerCase():''}</Text>
                                    </View>
                                    <View>
                                        <Text style={[styles.label, {textAlign: 'right'}]}>Details</Text>

                                        <Text  style={[styles.value, {textAlign: 'right'}]}>{details.meta || 'N/A'}</Text>
                                    </View>
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    paddingHorizontal: scale(16),
                                    marginBottom: scale(20)

                                }}>
                                    <View>
                                        <Text style={styles.label}>Amount</Text>
                                        <Text style={styles.value}>₦{details.amount}</Text>

                                    </View>
                                    <View>
                                        <Text  style={[styles.label, {textAlign: 'right'}]}>Date</Text>
                                        <Text  style={[styles.value, {textAlign: 'right'}]}>{moment(details.created_on).format('MMM DD, YYYY')}</Text>
                                    </View>
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    paddingHorizontal: scale(16),
                                    marginBottom: scale(20)

                                }}>
                                    <View>
                                        <Text style={styles.label}>Status</Text>
                                        {/*<Text style={styles.value}>{details.status}</Text>*/}
                                        <Text style={[styles.value,styles[details.status]]}>{details.status.charAt(0).toUpperCase() + details.status.substring(1).toLowerCase()}</Text>

                                    </View>
                                    <View>
                                        <Text style={[styles.label, {textAlign: 'right'}]}>Reference</Text>
                                        <Text  style={[styles.value, {textAlign: 'right'}]} selectable>{details.reference}</Text>
                                    </View>
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    paddingHorizontal: scale(16),

                                }}>
                                    <View>
                                        <Text style={styles.label}>Payment Method</Text>
                                        <Text style={styles.value}>{details.entry.charAt(0).toUpperCase() + details.entry.substring(1).toLowerCase()}</Text>

                                    </View>
                                </View>
                            </View>
                        </View>

                    </KeyboardAwareScrollView>
                </View>
            </View>
        );
    }



}

const mapStateToProps = (state, ownProps) => {
    return {
        auth: state.authentication,
        loadingCards: state.account.loadingCards,
        loadingBanks: state.account.loadingBanks,
        cards: state.account.cards || [],
        banks: state.account.banks || [],
        loanDetails: state.loan.loanDetails || {},
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
        height: scale(95),
        backgroundColor: Colors.tintColor,
        borderRadius: scale(6),
        justifyContent: 'flex-end',
        marginBottom: scale(24),
        shadowColor: 'rgba(18, 22, 121, 0.16)',
        shadowOffset: {
            width: 0,
            height: scale(6)
        },
        shadowRadius: 10,
        shadowOpacity: 1.0,
        elevation: 2,
        borderColor: 'rgba(98, 149, 218, 0.15)',
        borderWidth: scale(1)
    },
    name: {
        fontSize: scale(14),
        // lineHeight: scale(15),
        fontFamily: 'graphik-regular',
        color: Colors.white,
        marginTop: scale(5)
    },
    number: {
        fontSize: scale(12),
        // lineHeight: scale(13),
        fontFamily: 'graphik-regular',
        color: Colors.white,
        marginTop: scale(5)
    },
    info: {
        fontSize: scale(12),
        lineHeight: scale(13),
        fontFamily: 'graphik-regular',
        color: Colors.white
    },
    topHeader: {
        fontSize: scale(14),
        fontFamily: 'graphik-regular',
        color: Colors.greyText,
        marginBottom: scale(25),
        textAlign: 'center'
    },
    value: {
        color: Colors.greyText,
        fontFamily: 'graphik-regular',
        fontSize: scale(15),
        marginTop: scale(8)
    },
    label: {
        fontFamily: 'graphik-regular',
        fontSize: scale(12),
        color: '#112945',
        opacity: 0.7,
        lineHeight: scale(14)
    },

    roundCard: {
        width: '100%',
        borderRadius: scale(6),
        borderWidth: scale(1),
        borderColor: 'rgba(98, 149, 218, 0.15)',
        shadowColor: 'rgba(18, 22, 121, 0.05)',
        shadowOffset: {
            width: 0,
            height: scale(6)
        },
        shadowRadius: 10,
        shadowOpacity: 1.0,
        elevation: 2,
        backgroundColor: 'white'
    },
    "settled":{
        color:'#219653'
    },
    "pending":{
        color:Colors.yellow
    },

})