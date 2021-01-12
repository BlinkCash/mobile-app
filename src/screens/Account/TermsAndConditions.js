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
import { Colors } from "../../lib/constants/Colors";
import { LoaderText } from "../../components/Loader/Loader";
import * as Icon from "@expo/vector-icons";
import { apiRequest } from "../../lib/api/api";
import SwitchToggle from '@dooboo-ui/native-switch-toggle';
import { getAllCards, getBanks } from "./action/account_actions";
import FadeInView from "../../components/AnimatedComponents/FadeInView";
import * as WebBrowser from 'expo-web-browser'


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

                    <Header title={"Terms & Conditions"} leftIcon={"ios-arrow-back"}
                            onPressLeftIcon={() => this.props.navigation.goBack()}
                    />

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



                        <View style={{
                            width: '100%',
                            paddingVertical: scale(27),
                            paddingHorizontal: scale(24)
                        }}>
                            <Text style={styles.title}>Header</Text>
                            <Text style={styles.text}>This is a dummy text Giggs is a British rapper who made his critically acclaimed solo album debut in 2008 with Walk in da Park. Born Nathan Thompson in 1985 and hailing from Peckham, South London, he is affiliated with the group SN1 and is also known as Hollowman. His backstory includes a two-year prison sentence for gun charges. Following numerous mixtape releases and a much-touted freestyle called "Talking the Hardest," Giggs made his full-length solo debut in 2008 with the independently released album Walk in da Park. Later in the year, he won the 2008 BET Award for Best U.K. Act, beating out popular favorites Dizzee Rascal and Chip. He subsequently signed a recording contract with XL Recordings and made preparations to release his major-label album debut, Let Em Ave It, in 2010. Returning three years later, Giggs released his follow-up, When Will It Stop, in 2013, which saw him working with the likes of Ed Sheeran, Anthony Hamilton, and Styles P. Giggs returned in 2016 with his critically lauded third studio album Landlord, which reached number two on the U.K. Album Chart. After appearing on a pair of Drake tracks in early 2017, Giggs followed up with the Wamp 2 Dem mixtape in October of that year. ~ Jason Birchmeier, Rovi</Text>

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

    title: {
        fontSize: scale(24),
        lineHeight: scale(32),
        fontFamily: 'graphik-medium',
        color: Colors.greyText,
        marginBottom: scale(15)
    },
    text: {
        fontSize: scale(12),
        lineHeight: scale(28),
        fontFamily: 'graphik-regular',
        color: "#000",
        marginBottom: scale(5)
    }

})