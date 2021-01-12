import React from 'react';
import { Image, ImageBackground, Platform, View } from 'react-native';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import TabBarIcon from '../components/TabBarIcon';


import HomeScreen from '../screens/Home/HomeScreen';
// import LoanHistory from '../screens/Home/LoanHistory';
// import AgentClients from '../screens/Home/AgentClients';
// import MyAccount from '../screens/Account/profile';
//
// import Settings from '../screens/Support/settings';
//
// import { scale } from "../lib/utils/scaleUtils";
//
// import SuccessScreen from '../components/SuccessPage/SuccessPage';
import { Colors } from "../lib/constants/Colors";
import settings from "../screens/Account/settings";
import LoginSettings from "../screens/Account/LoginSettings";
import ChangePassword from "../screens/Account/ChangePassword";
import ChangePinOtp from "../screens/Account/ChangePinOtp";
import EnterNewPin from "../screens/Account/EnterNewPin";
import ChangePIN from "../screens/Account/ChangePIN";
import BankCards from "../screens/Account/BankCards";
import BankDetail from "../screens/Account/BankDetail";
import CardDetail from "../screens/Account/CardDetail";
import TermsAndConditions from "../screens/Account/TermsAndConditions";
import AddBank from "../screens/Account/AddBank";
import AddCard from "../screens/Account/AddCard";
import { scale } from "../lib/utils/scaleUtils";
import ChoosePicture from "../screens/Account/ChoosePicture";
import Loan from "../screens/Loan/Loan";
import EnterAmount from "../screens/Loan/EnterAmount";
import EnterLoanPurpose from "../screens/Loan/EnterLoanPurpose";
import EnterPaymentDate from "../screens/Loan/EnterPaymentDate";
import EnterPersonalDetails from "../screens/Loan/EnterPersonalDetails";
import EnterEducationAndEmployment from "../screens/Loan/EnterEducationAndEmployment";
import ConfirmLoanDetails from "../screens/Loan/ConfirmLoanDetails";
import EligibleLoansList from "../screens/Loan/EligibleLoansList";
import LoanDetail from "../screens/Loan/LoanDetail";
import Success from "../screens/Loan/Success";
import Error from "../screens/Loan/Error";
import RepayLoan from "../screens/Loan/RepayLoan";
import Transactions from "../screens/Transactions/Transactions";
import TransactionDetails from "../screens/Transactions/TransactionDetails";
import LoanHistory from "../screens/Loan/LoanHistory";
import LoanHistoryDetail from "../screens/Loan/LoanHistoryDetail";
import LoanCardList from "../screens/Loan/LoanCardList";
import Savings from "../screens/Savings/Savings";
import EnterSavingsName from "../screens/Savings/EnterSavingsName";
import EnterSavingsAmount from "../screens/Savings/EnterSavingsAmount";
import EnterSavingsMethod from "../screens/Savings/EnterSavingsMethod";
import EnterSavingsFrequency from "../screens/Savings/EnterSavingsFrequency";
import EnterFrequencyAmount from "../screens/Savings/EnterFrequencyAmount";
import EnterSavingsStartDate from "../screens/Savings/EnterSavingsStartDate";
import EnterSavingsMaturity from "../screens/Savings/EnterSavingsMaturity";
import EnterSavingsRepayment from "../screens/Savings/EnterSavingsRepayment";
import SavingsCardList from "../screens/Savings/SavingsCardList";
import ConfirmSavingsDetails from "../screens/Savings/ConfirmSavingsDetails";
import SavingsHistory from "../screens/Savings/SavingsHistory";
import SavingsHistoryDetail from "../screens/Savings/SavingsHistoryDetail";
import EmptySavings from "../screens/Savings/EmptySavings";
import SavingsDetail from "../screens/Savings/SavingsDetail";
import RollOver from "../screens/Savings/RollOver";
import TopUp from "../screens/Savings/TopUp";
import Withdraw from "../screens/Savings/Withdraw";
import EditSavingsPlan from "../screens/Savings/EditSavingsPlan";
import Wallet from "../screens/Wallet/Wallet";
import WalletCardList from "../screens/Wallet/WalletCardList";
import FundWallet from "../screens/Wallet/FundWallet";
import Transfer from "../screens/Wallet/Transfer";
import SelectBanks from "../screens/Wallet/SelectBanks";
import ConfirmBankDetails from "../screens/Wallet/ConfirmBankDetails";
import ViewSavingSummary from "../screens/Savings/ViewSavingSummary";
import EnterSavingTenor from "../screens/Savings/EnterSavingTenor";
// import BorrowerProfile from "../screens/Home/BorrowerProfile";
// import Market from "../screens/Market/Market";
// import { scale } from "../lib/utils/scaleUtils";


const SettingStack = createStackNavigator({
        SettingsPage: settings,
        LoginSettings: LoginSettings,
        ChangePassword: ChangePassword,
        ChangePinOtp: ChangePinOtp,
        EnterNewPIN: EnterNewPin,
        ChangePIN: ChangePIN,
        BankCards: BankCards,
        BankDetail: BankDetail,
        CardDetail: CardDetail,
        AddBank: AddBank,
        AddCard: AddCard,
        ChoosePicture: ChoosePicture,
        TermsAndConditions: TermsAndConditions,
    },
    {
        headerMode: 'none'
    })

const WalletStack = createStackNavigator({
        WalletPage: Wallet,
        FundWallet: FundWallet,
        WalletSelectBanks: SelectBanks,
        WalletTransfer: Transfer,
        AddCard: AddCard,
        WalletCardList: WalletCardList,
        Success: Success,
        WalletConfirmBankDetails: {screen: ConfirmBankDetails},
    },
    {
        headerMode: 'none'
    })

const MainStack = createStackNavigator({
    Home: HomeScreen,
    Settings: SettingStack,
    Wallet: WalletStack,
    // LoanHistory: LoanHistory,
    // AgentClients: AgentClients,
    // BorrowerProfile: BorrowerProfile,
    // Account: AccountStack,
    // SuccessPage: SuccessScreen,
}, {
    headerMode: 'none'
});

MainStack.navigationOptions = ({navigation}) => {
    let tabBarVisible = true;
    if (navigation.state.index > 0) {
        tabBarVisible = false;
    }

    return {

        tabBarLabel: 'Home',
        tabBarVisible,
        tabBarIcon: ({focused}) => {
            if (focused) {
                return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Image
                        // style={{
                        //     // height: scale(30),
                        //     width: scale(250),
                        // }}
                        style={{width: scale(23), height: scale(22)}}
                        source={require('../../assets/images/Home/home_active.png')}
                    />
                </View>
            } else {
                return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Image
                        style={{width: scale(23), height: scale(22)}}
                        source={require('../../assets/images/Home/home_inactive.png')}

                    />
                </View>
            }
        },
    }
};


//loans

const LoanStack = createStackNavigator({
    Loan: Loan,
    EnterAmount: EnterAmount,
    EnterLoanPurpose: EnterLoanPurpose,
    EnterPaymentDate: EnterPaymentDate,
    EnterPersonalDetails: EnterPersonalDetails,
    EnterEducationAndEmployment: EnterEducationAndEmployment,
    ConfirmLoanDetails: ConfirmLoanDetails,
    EligibleLoansList: EligibleLoansList,
    LoanDetail: LoanDetail,
    RepayLoan: RepayLoan,
    LoanSuccess: Success,
    LoanError: Error,
    LoanHistory: LoanHistory,
    LoanHistoryDetail: LoanHistoryDetail,
    AddCard: AddCard,
    LoanCardList: LoanCardList,
}, {
    headerMode: 'none'
});

LoanStack.navigationOptions = ({navigation}) => {
    let tabBarVisible = true;
    if (navigation.state.index > 0) {
        tabBarVisible = false;
    }

    return {

        tabBarLabel: 'Loans',
        tabBarVisible,
        tabBarIcon: ({focused}) => {
            if (focused) {
                return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Image
                        // style={{
                        //     // height: scale(30),
                        //     width: scale(250),
                        // }}
                        style={{width: scale(33), height: scale(22)}}
                        resizeMode={'contain'}
                        source={require('../../assets/images/Home/loans_active.png')}
                    />
                </View>
            } else {
                return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Image
                        style={{width: scale(33), height: scale(22)}}
                        resizeMode={'contain'}
                        source={require('../../assets/images/Home/loans_inactive.png')}

                    />
                </View>
            }
        },
        tabBarOnPress: ({navigation, defaultHandler}) => {
            // const { route, focused, index } = scene;
            console.log('onPress:', navigation);
            navigation.navigate('Loan')
            // navigation.popToTop();
        },
        tabBarOnLongPress: ({navigation, defaultHandler}) => {
            // const { route, focused, index } = scene;
            console.log('onPress:', navigation);
            navigation.navigate('Loan')
            // navigation.popToTop();
        }
    }
};

//savings


const SavingsStack = createStackNavigator({
    Savings: Savings,
    EmptySavings: EmptySavings,
    EnterSavingsName: EnterSavingsName,
    EnterSavingsAmount: EnterSavingsAmount,
    EnterSavingsMethod: EnterSavingsMethod,
    EnterSavingsFrequency: EnterSavingsFrequency,
    EnterFrequencyAmount: EnterFrequencyAmount,
    ViewSavingSummary: ViewSavingSummary,
    EnterSavingsStartDate: EnterSavingsStartDate,
    EnterSavingsMaturity: EnterSavingsMaturity,
    EnterSavingTenor: EnterSavingTenor,
    EnterSavingsRepayment: EnterSavingsRepayment,
    AddCard: AddCard,
    SavingsCardList: SavingsCardList,
    ConfirmSavingsDetails: ConfirmSavingsDetails,
    Success: Success,
    SavingsHistory: SavingsHistory,
    SavingsHistoryDetail: SavingsHistoryDetail,
    SavingsDetail: SavingsDetail,
    RollOver: RollOver,
    TopUp: TopUp,
    Withdraw: Withdraw,
    EditSavingsPlan: EditSavingsPlan,
}, {
    headerMode: 'none'
});

SavingsStack.navigationOptions = ({navigation}) => {
    let tabBarVisible = true;
    let routeStackLength = navigation.state.routes.length
    let routes = navigation.state.routes
    if (navigation.state.index > 0 && (routes[routeStackLength - 1].routeName !== "EmptySavings") && (routes[routeStackLength - 1].routeName !== "ConfirmSavingsDetails")) {
        tabBarVisible = false;
    }

    return {

        tabBarLabel: 'Savings',
        tabBarVisible,
        tabBarIcon: ({focused}) => {
            if (focused) {
                return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Image
                        // style={{
                        //     // height: scale(30),
                        //     width: scale(250),
                        // }}
                        style={{width: scale(28), height: scale(22)}}
                        resizeMode={'contain'}
                        source={require('../../assets/images/Home/savings_active.png')}
                    />
                </View>
            } else {
                return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Image
                        style={{width: scale(28), height: scale(22)}}
                        resizeMode={'contain'}
                        source={require('../../assets/images/Home/savings_inactive.png')}

                    />
                </View>
            }
        },
        tabBarOnPress: ({navigation, defaultHandler}) => {
            // const { route, focused, index } = scene;
            console.log('onPress:', navigation);
            navigation.navigate('Savings')
            // navigation.popToTop();
        },
        tabBarOnLongPress: ({navigation, defaultHandler}) => {
            // const { route, focused, index } = scene;
            console.log('onPress:', navigation);
            navigation.navigate('Savings')
            // navigation.popToTop();
        },
    }
};

//transactions
const TransactionStack = createStackNavigator({
    Transactions: Transactions,
    TransactionDetails: TransactionDetails,
}, {
    headerMode: 'none'
});

TransactionStack.navigationOptions = ({navigation}) => {
    let tabBarVisible = true;
    if (navigation.state.index > 0) {
        tabBarVisible = false;
    }

    return {

        tabBarLabel: 'Transactions',
        tabBarVisible,
        tabBarIcon: ({focused}) => {
            if (focused) {
                return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Image
                        // style={{
                        //     // height: scale(30),
                        //     width: scale(250),
                        // }}
                        style={{width: scale(23), height: scale(22)}}
                        source={require('../../assets/images/Home/transactions_active.png')}
                    />
                </View>
            } else {
                return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Image
                        style={{width: scale(23), height: scale(22)}}
                        source={require('../../assets/images/Home/transactions_inactive.png')}

                    />
                </View>
            }
        },
    }
};

export default createBottomTabNavigator({
    MainStack,
    LoanStack,
    SavingsStack,
    TransactionStack
    // MarketStack,
    // AccountStack
}, {
    tabBarOptions: {
        // showLabel: false,
        activeTintColor: '#3C5066',
        // inactiveBackgroundColor: '#F1F1F1',
        // activeBackgroundColor: '#F1F1F1',
        labelStyle: {
            fontSize: scale(10),
            fontFamily: 'graphik-regular',
            marginBottom: scale(7)
        },
        style: {
            borderTopWidth: 0,
            height: scale(56),
            shadowColor: 'rgba(176, 190, 197, 0.24)',
            shadowOffset: {
                width: scale(4),
                height: 0
            },
            shadowRadius: 8,
            shadowOpacity: 1.0,
            elevation: 2
        }
    }
});
