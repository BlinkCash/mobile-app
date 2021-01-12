import React from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Alert,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
    AsyncStorage, Share, PermissionsAndroid, TextInput, PanResponder, RefreshControl, ImageBackground, BackHandler
} from 'react-native';
import { scale, verticalScale } from "../../lib/utils/scaleUtils";
import noImage from "../../../assets/images/noImageDataURI";
import getSymbolFromCurrency from "currency-symbol-map";
import { getUser, getDashboard } from "./action/home_actions";


import { logoutUserSuccess } from "../Auth/action/auth_actions";
import { connect } from 'react-redux';
// import {
//     getAllLoanHistory,
//     getCurrentActiveLoan,
//     getWalletInfo,
//     getSavingsWalletInfo,
//     getAgentWalletInfo
// } from "./action/home_actions";
import TouchItem from '../../components/TouchItem/_TouchItem';
import { Colors } from '../../lib/constants/Colors'
import { LinearGradient } from 'expo-linear-gradient';
import { showToast } from "../../components/Toast/actions/toastActions";

import * as Icon from '@expo/vector-icons'

import FadeInView from '../../components/AnimatedComponents/FadeInView';
import { withNavigationFocus } from 'react-navigation';
import { formatAmount } from "../../lib/utils/helpers";
import { formStyles } from "../../../assets/styles/styles";
import moment from 'moment'
// import { getBanks } from "../Wallet/action/wallet_actions";
// import { getAgentDashboard } from "./action/home_actions";
// import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
// import * as Contacts from 'expo-contacts';
// import { apiRequest } from "../../lib/api/api";
// import { getAcceptRejectLoan, postContacts,postAllSMS } from "../../lib/api/url";
// import * as Permissions from "expo-permissions";
// import { ButtonWithBackgroundBottom, ButtonWithBackgroundText } from "../../components/Button/Buttons";
// import { Ionicons } from "@expo/vector-icons";
import { LoaderText } from "../../components/Loader/Loader";
// import { frontendUrl } from "../../lib/api/url";
// import SmsAndroid from 'react-native-get-sms-android';
import NavigationService from "../../../NavigationService";
import { ButtonWithBackgroundBottom, ButtonWithBackgroundText } from "../../components/Button/Buttons";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";
import { getMySavings } from "../Savings/action/savings_actions";
import { getTheRunningLoan } from "../Loan/action/loan_actions";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Feather } from "@expo/vector-icons";
import { getWalletBalance } from "../Wallet/action/wallet_actions";
import { getTheWhatsappNumber } from "../Account/action/account_actions";
import Dialog from "react-native-dialog";
import {getAllTransactions} from "../Transactions/action/transaction_actions";

const preview = {uri: noImage};

class HomeScreen extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            searchTerm: '',
            showModal: false,
            inactive: true,
            backDialogVisible:false
        }

    }


    static navigationOptions = {
        header: null,
    };

    componentDidMount() {
        // this.props.navigation.navigate('EnterBvnDetails')
        // this.props.getSavingsProducts();
        this.props.getMySavings();
        this.props.getTheRunningLoan();
        this.props.getAllTransactions();


        this.props.getWalletBalance();

        if (!this.props.whatsapp_number) {
            this.props.getTheWhatsappNumber();
        }
        let that = this;
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {

            if(this.props.isFocused){

                Alert.alert(
                    'Confirm',
                    'Do you want to log out?',
                    [
                        {
                            text: 'No',
                            onPress: () => this.handleCancel(),
                            style: 'cancel',
                        },
                        {text: 'Yes', onPress: () => this.handleBackPress()},
                    ],
                    {cancelable: false},
                );

                // that.setState({
                //     backDialogVisible:true
                // })
                return true
            }
            // return true
        });

    }


    handleBackPress = () => {
        this._signOutAsync();
        BackHandler.exitApp(); // works best when the goBack is async
        return true;
    }

    _signOutAsync = () => {
        this.props.logoutUserSuccess();
        AsyncStorage.removeItem('access_token');
        NavigationService.navigate('Login');
    };

    handleCancel = () => {
        this.setState({backDialogVisible: false});
    };


    componentWillUnmount() {
        if(this.backHandler){
            this.backHandler.remove()
        }

    }

    componentDidUpdate(prevProps) {

        if (!prevProps.isFocused && this.props.isFocused) {

            this.props.getMySavings();
            this.props.getTheRunningLoan();

            this.props.getWalletBalance();
            // this.setState(
            //     {
            //         loanHistory: [...this.props.loanHistory]
            //     }
            // )
        }
    }


    render() {

        let {photo_url, first_name, last_name, email, bvn, phone} = this.props.auth

        const {savingsProducts, savings} = this.props;
        const {loanDetails, wallet} = this.props;

        const {
            requested_amount,
            purpose, proposed_payday, gender, marital_status, no_of_dependent,
            type_of_residence, address, educational_attainment, employment_status,
            sector_of_employment, work_start_date, monthly_repayment, monthly_net_income, work_email
        } = this.props.loanDetails.id ? this.props.userLoanDetails : {}


        return (
            <View style={{
                // backgroundColor: '#F1F1F1',
                flex: 1
            }}>
                <ScrollView
                    // style={styles.container}
                    scrollEnabled={true}
                    keyboardShouldPersistTaps={'handled'}
                    alwaysBounceVertical={false}
                    bounces={false}>
                    <View style={{paddingHorizontal: scale(24), width: '100%', paddingBottom: scale(30)}}>
                        {/*<LoaderText visible={this.state.loading} desciption={'Processing'}/>*/}
                        <TouchItem style={styles.topHeader} onPress={() => this.props.navigation.navigate('Settings')}>

                            {!photo_url && (

                                <View style={{
                                    width: scale(48),
                                    height: scale(48),
                                    borderRadius: scale(24),
                                    backgroundColor: Colors.tintColor,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <Image
                                        style={{
                                            // height: scale(30),
                                            backgroundColor: Colors.tintColor,
                                            width: scale(15),
                                        }}
                                        resizeMode={'contain'}
                                        source={require('../../../assets/images/Home/user.png')}
                                    />
                                </View>
                            )}

                            {!!photo_url && (

                                <Image
                                    style={{
                                        height: scale(48),
                                        width: scale(48),
                                        borderRadius: scale(24),
                                        backgroundColor: Colors.tintColor,
                                    }}
                                    resizeMode={'cover'}
                                    source={{uri: photo_url}}
                                />
                            )}
                            <View style={{
                                width: '100%',
                                // paddingTop: scale(21),
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <Text
                                    style={styles.welcomeTitle}>Hi, {first_name.charAt(0).toUpperCase() + first_name.substring(1).toLowerCase()}!</Text>
                            </View>

                        </TouchItem>

                        <View style={{marginTop: scale(30)}}>
                            <View style={[styles.roundCard, {
                                backgroundColor: '#2C32BE'
                            }]}>
                                <ImageBackground
                                    style={{
                                        width: '100%',
                                        height: scale(186),
                                        justifyContent: 'space-between',
                                        borderRadius: scale(16),
                                        overflow: 'hidden'
                                        // backgroundColor:'red'
                                    }}
                                    resizeMode={'cover'}
                                    source={require('../../../assets/images/Home/wallet1.png')}
                                >
                                    <TouchItem style={{
                                        paddingHorizontal: scale(16),
                                        // marginBottom: scale(18),
                                        flex: 1,
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                        // marginBottom:scale(20)
                                    }} onPress={() => this.props.navigation.navigate('Wallet', {
                                        loan: this.props.loanDetails
                                    })}>
                                        <View>
                                            <Text
                                                style={styles.topHeader1}>Wallet Balance</Text>
                                            <Text
                                                style={styles.topHeader2}>₦{formatAmount(wallet.availableBalance)}</Text>
                                        </View>
                                    </TouchItem>
                                    <TouchItem
                                        onPress={() => this.props.navigation.navigate('FundWallet', {
                                            loan: this.props.loanDetails
                                        })}
                                        style={{
                                            height: scale(60),
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderTopColor: 'rgba(98, 149, 218, 0.15)',
                                            borderTopWidth: scale(1)
                                        }}
                                    >
                                        <Text style={styles.editButton}>Fund Wallet</Text>
                                    </TouchItem>
                                </ImageBackground>
                            </View>
                        </View>
                        <Text style={{
                            fontFamily: 'graphik-medium',
                            fontSize: scale(12),
                            color: Colors.greyText,
                            opacity: 0.5,
                            marginTop: scale(24)
                        }}>SAVINGS PLANS</Text>
                        {(savings.length !== 0) && (
                            <ScrollView horizontal={true} style={{marginTop: scale(24)}}>
                                <View style={{flexDirection: 'row'}}>
                                    {savings.map(saving => {

                                        return <TouchItem
                                            onPress={() => this.props.navigation.navigate('SavingsDetail', {
                                                id: saving.id
                                            })}
                                            style={[styles.card, {backgroundColor: '#DC4F89'}]}>
                                            <View>
                                                <Text style={styles.name}>{`${saving.name}`}</Text>
                                            </View>
                                            <View>
                                                <Text
                                                    style={[styles.number, {
                                                        fontSize: scale(12),
                                                        marginBottom: scale(8)
                                                    }]}>Balance</Text>
                                                <Text style={[styles.name, {
                                                    fontSize: scale(14),
                                                    marginBottom: 0
                                                }]}>₦{formatAmount(saving.balance)}</Text>
                                            </View>
                                            <Image
                                                source={require('../../../assets/images/Vector4.png')}
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

                                            <View style={{
                                                // width: scale(58),
                                                // height: scale(28),
                                                position: 'absolute',
                                                right: scale(16),
                                                bottom: scale(16),
                                            }}>
                                                <Text
                                                    style={[styles.number, {
                                                        fontSize: scale(12),
                                                        marginBottom: scale(8)
                                                    }]}>Interest</Text>
                                                <Text style={[styles.name, {
                                                    fontSize: scale(14),
                                                    marginBottom: 0,
                                                    textAlign: 'center'
                                                }]}>{saving.interest_rate}%</Text>
                                            </View>
                                        </TouchItem>
                                    })}
                                    <TouchItem
                                        style={{
                                            backgroundColor: '#2C32BE',
                                            width: scale(250),
                                            height: scale(106),
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            flexDirection: 'row',
                                            paddingHorizontal: scale(16),
                                            borderRadius: scale(6),
                                        }}
                                        onPress={() => this.props.navigation.navigate('EmptySavings')}
                                    >
                                        <Text style={{
                                            fontFamily: 'graphik-medium',
                                            fontSize: scale(15),
                                            color: 'white',
                                            maxWidth: scale(120),
                                            lineHeight: scale(22)
                                        }}>Create a new Savings plan</Text>
                                        <View style={{
                                            width: scale(50),
                                            height: scale(50),
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderRadius: scale(25),
                                            backgroundColor: Colors.tintColor
                                        }}>
                                            <Feather
                                                name={'plus'}
                                                color="white"
                                                size={scale(25)}
                                            />
                                        </View>

                                    </TouchItem>
                                </View>
                            </ScrollView>
                        )}

                        {(savings.length === 0) && (
                            <TouchItem style={{marginTop: scale(24)}}
                                       onPress={() => this.props.navigation.navigate('Savings')}>
                                <View style={[styles.roundCard, {
                                    backgroundColor: '#DC4F89'
                                }]}>
                                    <ImageBackground
                                        style={{
                                            width: '100%',
                                            height: scale(227),
                                            justifyContent: 'space-between',
                                            borderRadius: scale(16),
                                            overflow: 'hidden'
                                            // backgroundColor:'red'
                                        }}
                                        resizeMode={'cover'}
                                        source={require('../../../assets/images/Home/savings1.png')}
                                    >
                                        <View style={{
                                            paddingHorizontal: scale(24),
                                            paddingVertical: scale(24),
                                            // marginBottom: scale(18),
                                            flex: 1,
                                            // alignItems: 'center',
                                            // justifyContent: 'center'
                                            // marginBottom:scale(20)
                                        }}>
                                            <View>
                                                <Text
                                                    style={styles.topHeader3}>Save, Earn, Enjoy.</Text>
                                                <Text style={styles.topHeader4}>Save and earn interest at the same
                                                    time.</Text>
                                            </View>
                                        </View>
                                    </ImageBackground>
                                </View>
                            </TouchItem>
                        )}

                        <Text style={{
                            fontFamily: 'graphik-medium',
                            fontSize: scale(12),
                            color: Colors.greyText,
                            opacity: 0.5,
                            marginTop: scale(24)
                        }}>LOAN</Text>
                        {!this.props.loanDetails.id && (
                            <TouchItem style={{marginTop: scale(24)}}
                                       onPress={() => this.props.navigation.navigate('Loan')}>
                                <View style={[styles.roundCard, {
                                    backgroundColor: '#112945'
                                }]}>
                                    <ImageBackground
                                        style={{
                                            width: '100%',
                                            height: scale(227),
                                            justifyContent: 'space-between',
                                            borderRadius: scale(16),
                                            overflow: 'hidden'
                                            // backgroundColor:'red'
                                        }}
                                        resizeMode={'cover'}
                                        source={require('../../../assets/images/Home/loans1.png')}
                                    >
                                        <View style={{
                                            paddingHorizontal: scale(24),
                                            paddingVertical: scale(24),
                                            // marginBottom: scale(18),
                                            flex: 1,
                                            // alignItems: 'center',
                                            // justifyContent: 'center'
                                            // marginBottom:scale(20)
                                        }}>
                                            <View>
                                                <Text
                                                    style={styles.topHeader3}>Get Instant loans</Text>
                                                <Text style={styles.topHeader4}>Get instant loans with ease right
                                                    now</Text>
                                            </View>
                                        </View>
                                    </ImageBackground>
                                </View>
                            </TouchItem>
                        )}

                        {!!this.props.loanDetails.id && (
                            <TouchItem style={{marginTop: scale(24)}}
                                       onPress={() => this.props.navigation.navigate('Loan')}>
                                <View style={[styles.roundCard, {
                                    backgroundColor: '#112945'
                                }]}>
                                    <ImageBackground
                                        style={{
                                            width: '100%',
                                            height: scale(227),
                                            justifyContent: 'flex-end',

                                            // justifyContent: 'space-between',
                                            // borderRadius: scale(16),
                                            overflow: 'hidden',
                                            backgroundColor: 'transparent'
                                        }}
                                        resizeMode={'cover'}
                                        source={require('../../../assets/images/Loans/loan.png')}
                                    >
                                        <View style={{
                                            paddingHorizontal: scale(18),
                                            paddingBottom: scale(18)
                                            // marginBottom:scale(20)
                                        }}>
                                            <View>
                                                <Text style={styles.loanHeader}>You have an active loan</Text>
                                                <Text
                                                    style={styles.loanHeader2}>₦{formatAmount(loanDetails.schedule.repayment_amount)}</Text>
                                                <Text style={styles.loanHeader3}>To be paid
                                                    by {moment(loanDetails.schedule.repayment_day).format('MMM DD, YYYY')}</Text>
                                            </View>
                                        </View>
                                    </ImageBackground>
                                </View>
                            </TouchItem>
                        )}


                    </View>

                </ScrollView>
                {this.state.backDialogVisible && (<Dialog.Container visible={this.state.backDialogVisible}>
                    <Dialog.Title>Confirm</Dialog.Title>
                    <Dialog.Description>
                        Confirm that you want to exit the app.
                    </Dialog.Description>
                    <Dialog.Button label="Cancel" onPress={this.handleCancel} color={Colors.red}/>
                    <Dialog.Button label="Confirm" onPress={this.handleBackPress} bold color={Colors.green}/>
                </Dialog.Container>)}
            </View>
        );
    }

}

const mapStateToProps = (state, ownProps) => {
    return {
        auth: state.authentication,
        wallet: state.wallet,
        loanHistory: state.home.loanHistory || [],
        home: state.home || null,
        loading_dashboard: state.home.loading || false,
        savings: state.savings.savings || [],
        loanDetails: state.loan.loanDetails || {},
        userLoanDetails: state.loan.userLoanDetails || {},
        whatsapp_number: state.account.whatsapp_number || '',

    };
};

const mapDispatchToProps = {
    logoutUserSuccess,
    getMySavings,
    getTheRunningLoan,
    getWalletBalance,
    getTheWhatsappNumber,
    getAllTransactions
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withNavigationFocus(HomeScreen));

const styles = StyleSheet.create({
        amount: {
            color: Colors.tintColor,
            fontFamily: 'graphik-medium',
            fontSize: scale(20),
            letterSpacing: scale(-0.2)
        },

        roundCard: {
            width: '100%',
            borderRadius: scale(16),
            // borderWidth: scale(1),
            // borderColor: 'rgba(98, 149, 218, 0.15)',
            borderColor: Platform.OS === 'ios' ? 'rgba(98, 149, 218, 0.15)' : 'transparent',
            borderWidth: Platform.OS === 'ios' ? scale(1) : 0,
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

        topHeader: {
            // backgroundColor: '#055DA2',
            flexDirection: 'row',
            paddingTop: scale(30),
            // justifyContent:'center',
            alignItems: 'center'
            // borderBottomEndRadius: scale(27),
            // borderBottomStartRadius: scale(27),
        },

        welcomeTitle: {
            color: Colors.greyText,
            fontFamily: 'graphik-medium',
            fontSize: scale(14),
            marginLeft: scale(16)
            // marginTop: scale(11)
        },
        editButton: {
            color: Colors.white,
            fontFamily: 'graphik-semibold',
            fontSize: scale(14),
        },
        topHeader2: {
            fontSize: scale(35),
            color: Colors.white,
            // marginBottom:scale(12),
            fontFamily: "graphik-medium",
            textAlign: 'center',
        },
        topHeader1: {
            fontSize: scale(10),
            color: Colors.white,
            marginBottom: scale(12),
            textAlign: 'center',
            opacity: 0.7,
            fontFamily: "graphik-regular",
        },
        topHeader3: {
            fontSize: scale(20),
            color: Colors.white,
            marginBottom: scale(8),
            fontFamily: "graphik-semibold",
        },
        topHeader4: {
            fontSize: scale(14),
            maxWidth: scale(185),
            lineHeight: scale(22),
            color: Colors.white,
            // marginBottom: scale(12),
            // opacity: 0.7,
            fontFamily: "graphik-regular",
        },
        card: {
            width: scale(250),
            height: scale(106),
            backgroundColor: Colors.tintColor,
            borderRadius: scale(6),
            overflow: 'hidden',
            marginRight: scale(16),
            justifyContent: 'space-between',
            // marginBottom: scale(24),
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
            fontFamily: 'graphik-medium',
            color: Colors.white,
            marginBottom: scale(8)
        },
        number: {
            fontSize: scale(10),
            fontFamily: 'graphik-regular',
            color: Colors.white,
            opacity: 0.4
            // marginBottom: scale(5)
        },
        loanHeader: {
            fontSize: scale(12),
            color: Colors.white,
            marginBottom: scale(12),
            fontFamily: "graphik-regular",
        },
        loanHeader2: {
            fontSize: scale(32),
            color: Colors.white,
            marginBottom: scale(12),
            fontFamily: "graphik-medium",
        },
        loanHeader3: {
            fontSize: scale(12),
            color: Colors.white,
            marginBottom: scale(12),
            fontFamily: "graphik-regular",
        }

    }
);
