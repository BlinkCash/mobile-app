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
    postAddEmail,
    postChangePassword,
    postCreateLoan,
    postRepayLoan,
    postInitCard,
    getTheTransactionDetails,
    getSavingsDetails, getSavingsBalance
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
import { getUserLoanDetails } from "../../lib/api/url";
import Progress from 'react-native-progress/Bar';


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
            details: {
                frequency: {},
                card: {}
            },
            balance: 0,
            target: 0,
        }
    }


    componentDidMount() {
        const id = this.props.navigation.getParam('id', '');
        this.getTransactionDetails(id)
        this.getBalance(id)
    }

    componentDidUpdate(prevProps) {
        const {navigation, loanDetails} = this.props;
        const id = this.props.navigation.getParam('id', '');
        let refreshData = navigation.getParam('refreshData', false)
        let refreshDataOld = prevProps.navigation.getParam('refreshData', false)

        if (refreshData && !refreshDataOld) {
            this.getTransactionDetails(id)
            this.getBalance(id)
        }

    }

    getTransactionDetails = (id) => {

        this.setState({
            loading: true
        }, () => {
            apiRequest(getSavingsDetails(id), 'get')
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

    getBalance = (id) => {

        this.setState({
            loading: true
        }, () => {
            apiRequest(getSavingsBalance(id), 'get')
                .then(res => {
                    console.log(res)
                    this.setState({
                        loading: false
                    }, () => {
                        if (res.status === 'success') {

                            this.setState({
                                balance: res.data.balance,
                                target: res.data.target,
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
        let percentage = (Number(this.state.balance) / Number(this.state.target)) || 0;

        const {savingsProducts} = this.props;

        const product = (savingsProducts.find(c => c.id === details.product_id)) || ''
        console.log(product)

        let collection_method = details.collection_method?details.collection_method.name.toLowerCase():""


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
                    <LoaderText visible={this.state.loading} desciption={'Loading Savings Details...'}/>
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
                        <Header title={"Savings Details"} leftIcon={"ios-arrow-back"}
                                onPressLeftIcon={() => this.props.navigation.goBack()}/>

                        <View style={{paddingHorizontal: scale(25), width: '100%', marginTop: scale(24)}}>

                            {!product.is_fixed && (
                                <View style={[styles.card, {backgroundColor: '#112945'}]}>
                                    <View>
                                        <Text style={styles.name}>{`Savings`}</Text>
                                        <Text
                                            style={styles.number}>₦{formatAmount(Number(this.state.balance))}</Text>
                                    </View>

                                    {(collection_method !== 'manual') && (
                                        <View style={{zIndex: 9999999}}>
                                            <View style={{
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                marginBottom: scale(8)
                                            }}>
                                                <Text
                                                    style={[styles.name, {marginBottom: 0}]}>{parseInt(percentage * 100) || 0}%
                                                    Achieved</Text>
                                                <Text style={[styles.name, {
                                                    fontSize: scale(14),
                                                    marginBottom: 0
                                                }]}>Target : ₦{formatAmount(Number(this.state.target))}</Text>
                                            </View>
                                            <Progress progress={percentage} color={Colors.tintColor} borderColor="transparent"
                                                      unfilledColor="#fff" borderRadius={scale(2)} height={scale(4)}
                                                      width={null}/>
                                        </View>
                                    )}

                                    <Image
                                        source={require('../../../assets/images/Vector3.png')}
                                        style={{
                                            width: scale(113),
                                            height: scale(130),
                                            position: 'absolute',
                                            right: 0,
                                            top: 0,
                                            borderRadius: scale(6)
                                        }}
                                        resizeMode={'contain'}
                                    />
                                </View>
                            )}

                            {!!product.is_fixed && (
                                <View
                                    style={[styles.card, {backgroundColor: '#112945', justifyContent:'center'}]}>
                                    <View>
                                        <Text style={styles.name}>{`Savings`}</Text>
                                        <Text
                                            style={styles.number}>₦{formatAmount(Number(this.state.balance))}</Text>
                                    </View>
                                    <Image
                                        source={require('../../../assets/images/Vector3.png')}
                                        style={{
                                            width: scale(113),
                                            height: scale(130),
                                            position: 'absolute',
                                            right: 0,
                                            top: 0,
                                            borderRadius: scale(6)
                                        }}
                                        resizeMode={'contain'}
                                    />
                                </View>
                            )}


                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                {!product.is_fixed && (
                                    <TouchItem style={{flexDirection: 'row', alignItems: 'center'}} onPress={() => {
                                        this.props.navigation.navigate('TopUp', {
                                            details,
                                            balance: this.state.balance,
                                            target: this.state.target,
                                            percentage
                                        })

                                    }}>
                                        <Image
                                            source={require('../../../assets/images/Savings/top_up.png')}
                                            style={{
                                                width: scale(24),
                                                height: scale(24),
                                                marginRight: scale(8)
                                            }}
                                            resizeMode={'contain'}
                                        />
                                        <Text style={[styles.action, {color: '#219653'}]}>TOP UP</Text>
                                    </TouchItem>
                                )}

                                <TouchItem style={{flexDirection: 'row', alignItems: 'center'}} onPress={() => {
                                    this.props.navigation.navigate('Withdraw', {
                                        details,
                                        balance: this.state.balance,
                                        target: this.state.target,
                                        percentage
                                    })

                                }}>
                                    <Image
                                        source={require('../../../assets/images/Savings/withdraw.png')}
                                        style={{
                                            width: scale(24),
                                            height: scale(24),
                                            marginRight: scale(8)
                                        }}
                                        resizeMode={'contain'}
                                    />
                                    <Text style={[styles.action, {color: '#EB5757'}]}>WITHDRAW</Text>
                                </TouchItem>
                                <TouchItem style={{flexDirection: 'row', alignItems: 'center'}} onPress={() => {
                                    if (!!details.is_matured) {
                                        this.props.navigation.navigate('RollOver', {
                                            details,
                                            balance: this.state.balance,
                                            target: this.state.target,
                                            percentage
                                        })
                                    }else{
                                        this.props.showToast('You cannot rollover your plan until it is mature.', 'error')
                                    }
                                }}>
                                    <Image
                                        source={require('../../../assets/images/Savings/rollover.png')}
                                        style={{
                                            width: scale(24),
                                            height: scale(24),
                                            marginRight: scale(8)
                                        }}
                                        resizeMode={'contain'}
                                    />
                                    <Text style={[styles.action, {
                                        color: Colors.tintColor,
                                        opacity: !details.is_matured ? 0.4 : 1
                                    }]}>ROLLOVER</Text>
                                </TouchItem>
                            </View>
                        </View>


                        <View style={{paddingHorizontal: scale(25), width: '100%'}}>

                            {!product.is_fixed && (
                                <View style={{marginTop: scale(32)}}>
                                    <View style={[styles.roundCard, {
                                        paddingTop: scale(16)
                                    }]}>
                                        <View style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            paddingHorizontal: scale(16),
                                            marginBottom: scale(20)
                                        }}>
                                            <View>
                                                <Text style={styles.label}>Name</Text>
                                                <Text style={styles.value}>{details.name}</Text>
                                            </View>
                                            <View>
                                                <Text style={[styles.label, {textAlign: 'right'}]}>Periodic Amount</Text>
                                                {/*<Text style={[styles.value, {textAlign: 'right'}]}>{moment(details.created_on).format('MMM Do YYYY')}</Text>*/}
                                                <Text
                                                    style={[styles.value, {textAlign: 'right'}]}>{collection_method === 'manual'?"--":`₦${formatAmount(details.periodic_amount)}`} </Text>

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
                                                <Text style={styles.label}>Frequency</Text>
                                                <Text style={styles.value}>{details.frequency?details.frequency.name:'N/A'}</Text>
                                            </View>

                                            <View>
                                                <Text style={[styles.label, {textAlign: 'right'}]}>Debit card</Text>
                                                <Text
                                                    style={[styles.value, {textAlign: 'right'}]}>{details.card?`${details.card.card_last4} ${details.card.card_type}`:'N/A'}</Text>
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
                                                <Text
                                                    style={[styles.value, {color: details.status ? "#27AE60" : '#EB5757'}]}>{details.status ? 'Active' : 'Inactive'}</Text>
                                            </View>
                                            <View>
                                                <Text style={[styles.label, {textAlign: 'right'}]}>Start Date</Text>
                                                <Text
                                                    style={[styles.value, {textAlign: 'right'}]}>{moment(details.start_date).format('MMM DD, YYYY')}</Text>
                                            </View>
                                        </View>
                                        <View style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            paddingHorizontal: scale(16),

                                        }}>
                                            <View>
                                                <Text style={styles.label}>Withdraw by</Text>
                                                <Text
                                                    style={styles.value}>{details.end_date?moment(details.end_date).format('MMM DD, YYYY'):'N/A'}</Text>
                                            </View>
                                        </View>
                                        <TouchItem
                                            onPress={() => this.props.navigation.navigate('EditSavingsPlan',{
                                                details,
                                                balance: this.state.balance,
                                                target: this.state.target,
                                                percentage
                                            })}
                                            style={{
                                                height: scale(52),
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                borderTopColor: 'rgba(98, 149, 218, 0.15)',
                                                borderTopWidth: scale(1),
                                                marginTop: scale(18)
                                            }}
                                        >
                                            <Text style={styles.editButton}>Edit</Text>
                                        </TouchItem>
                                    </View>
                                </View>
                            )}

                            {!!product.is_fixed && (
                                <View style={{marginTop: scale(32)}}>
                                    <View style={[styles.roundCard, {
                                        paddingTop: scale(16)
                                    }]}>
                                        <View style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            paddingHorizontal: scale(16),
                                            marginBottom: scale(20)
                                        }}>
                                            <View>
                                                <Text style={styles.label}>Name</Text>
                                                <Text style={styles.value}>{details.name}</Text>
                                            </View>
                                            <View>
                                                <Text style={[styles.label, {textAlign: 'right'}]}>Debit card</Text>
                                                <Text
                                                    style={[styles.value, {textAlign: 'right'}]}>{details.card?`${details.card.card_last4} ${details.card.card_type}`:'N/A'}</Text>
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
                                                <Text
                                                    style={[styles.value, {color: details.status ? "#27AE60" : '#EB5757'}]}>{details.status ? 'Active' : 'Inactive'}</Text>
                                            </View>
                                            <View>
                                                <Text style={[styles.label, {textAlign: 'right'}]}>Start Date</Text>
                                                <Text
                                                    style={[styles.value, {textAlign: 'right'}]}>{moment(details.start_date).format('MMM DD, YYYY')}</Text>
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
                                                <Text style={styles.label}>Withdraw by</Text>
                                                <Text
                                                    style={styles.value}>{details.end_date?moment(details.end_date).format('MMM DD, YYYY'):'N/A'}</Text>
                                            </View>
                                        </View>
                                        {/*<TouchItem*/}
                                            {/*onPress={() => this.props.navigation.navigate('EditSavingsPlan',{*/}
                                                {/*details,*/}
                                                {/*balance: this.state.balance,*/}
                                                {/*target: this.state.target,*/}
                                                {/*percentage*/}
                                            {/*})}*/}
                                            {/*style={{*/}
                                                {/*height: scale(52),*/}
                                                {/*justifyContent: 'center',*/}
                                                {/*alignItems: 'center',*/}
                                                {/*borderTopColor: 'rgba(98, 149, 218, 0.15)',*/}
                                                {/*borderTopWidth: scale(1),*/}
                                                {/*marginTop: scale(18)*/}
                                            {/*}}*/}
                                        {/*>*/}
                                            {/*<Text style={styles.editButton}>Edit</Text>*/}
                                        {/*</TouchItem>*/}
                                    </View>
                                </View>
                            )}

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
        savingsProducts: state.savings.savingsProducts || [],
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
        height: scale(130),
        backgroundColor: Colors.tintColor,
        borderRadius: scale(6),
        justifyContent: 'space-between',
        marginBottom: scale(32),
        shadowColor: 'rgba(18, 22, 121, 0.16)',
        padding: scale(16),
        shadowOffset: {
            width: 0,
            height: scale(6)
        },
        shadowRadius: 10,
        shadowOpacity: 1.0,
        elevation: 2
    },
    name: {
        fontSize: scale(12),
        // lineHeight: scale(15),
        fontFamily: 'graphik-regular',
        color: Colors.white,
        marginBottom: scale(5),
        opacity: 0.6,
    },
    number: {
        fontSize: scale(26),
        // lineHeight: scale(13),
        fontFamily: 'graphik-medium',
        color: Colors.white,
        // marginTop: scale(8)
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
        fontSize: scale(14),
        marginTop: scale(8)
    },
    label: {
        fontFamily: 'graphik-regular',
        fontSize: scale(12),
        color: '#112945',
        opacity: 0.7,
        lineHeight: scale(14)
    },
    action: {
        fontFamily: 'graphik-semibold',
        fontSize: scale(12),
        color: '#112945',
    },

    roundCard: {
        width: '100%',
        borderRadius: scale(6),
        borderColor: Platform.OS === 'ios' ?'rgba(98, 149, 218, 0.15)':'transparent',
        borderWidth: Platform.OS === 'ios' ?scale(1):0,
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
    optionText: {
        color: '#4f4f4f',
        fontFamily: 'graphik-medium',
        fontSize: scale(14),
        marginBottom: scale(16)
    },
    editButton: {
        color: Colors.tintColor,
        fontFamily: 'graphik-semibold',
        fontSize: scale(12),
    },
})