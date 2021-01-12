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
    Modal, TouchableWithoutFeedback, Image, StyleSheet, ImageBackground
} from 'react-native';
import { connect } from 'react-redux';
import NavigationService from "../../../NavigationService";
import { FloatingLabelInput } from "../../components/Input/FloatingLabelInput";
import Header from '../../components/Header/Header';
import TouchItem from '../../components/TouchItem/_TouchItem'


import {
    handleForgotPassword,
    resetAuthData, loginUserSuccess, getExtraDetails,
} from '../Auth/action/auth_actions';
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
import { resetCache } from "../Auth/action/auth_actions";
import * as WebBrowser from "expo-web-browser";
import { Colors } from "../../lib/constants/Colors";
import { LoaderText } from "../../components/Loader/Loader";
import moment from "moment";
import { formatAmount } from "../../lib/utils/helpers";
import {getSavingsProducts} from "./action/savings_actions";
import {resetSavingsDetails} from "./action/savings_actions";
import {getSavingsRepaymentMethods} from "./action/savings_actions";


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
            phone: '',
            imageUrls:{
                'regular saving':require('../../../assets/images/Savings/regular.png'),
                "halal saving":require('../../../assets/images/Savings/halal.png'),
                "fixed deposit":require('../../../assets/images/Savings/fixed.png'),
                "default":require('../../../assets/images/Savings/default.png'),
            }
        }
    }


    componentDidMount() {
        this.props.getSavingsProducts();
        this.props.getSavingsRepaymentMethods()
    }

    renderButton = () => {
        const {loading} = this.state;
        return (
            <ButtonWithBackgroundBottom
                disabled={loading}
                onPress={() => this.props.navigation.navigate('EnterAmount')}
                style={{width: '100%'}}

            >
                {!!loading && (<ActivityIndicator size="large" color="#fff"/>)}
                {!loading && (<ButtonWithBackgroundText>{'Apply for a Loan'}</ButtonWithBackgroundText>)}
            </ButtonWithBackgroundBottom>
        );
    };

    render() {
        const {navigate} = this.props.navigation;
        const {email, password, full_name, phone, confirm_password} = this.state;

        const {
            requested_amount,
            purpose, proposed_payday, gender, marital_status, no_of_dependent,
            type_of_residence, address, educational_attainment, employment_status,
            sector_of_employment, work_start_date, monthly_repayment, monthly_net_income, work_email
        } = this.props.loanDetails.id ? this.props.userLoanDetails : {}


        const {savingsProducts} = this.props;
        console.log(savingsProducts)

        return (

            <View>
                <KeyboardAwareScrollView>
                    <View style={{
                        width: '100%',
                        // justifyContent: 'center',
                        // alignItems: 'center',
                        marginTop: scale(30),
                        marginBottom:scale(30),
                        paddingHorizontal: scale(20),
                    }}>
                        <View>
                            <Text style={{
                                fontFamily: 'graphik-medium',
                                fontSize: scale(30),
                                color: Colors.greyText,
                                // width: '100%',
                                textAlign: 'left'
                            }}>Choose a plan</Text>
                        </View>
                    </View>

                    <View style={{paddingHorizontal: scale(25),paddingBottom:scale(30)}}>
                        {savingsProducts.map(product => {
                            return  <TouchItem style={{marginTop: scale(16)}} onPress={() => {
                                this.props.resetSavingsDetails();
                                this.props.navigation.navigate('EnterSavingsName',{
                                    product
                                })
                            }}>
                                <View style={[styles.roundCard, {
                                    paddingVertical: scale(16)
                                }]}>

                                    <Image
                                        style={{width: scale(40), height: scale(40)}}
                                        source={this.state.imageUrls[product.name.toLowerCase()] || this.state.imageUrls.default }
                                        resizeMode={'contain'}
                                    />
                                    <Text style={styles.title}>{product.name}</Text>
                                    <Text style={styles.subtitle}>{product.description}</Text>
                                </View>
                            </TouchItem>
                        })}

                    </View>

                </KeyboardAwareScrollView>
            </View>

        );
    }

}

const mapStateToProps = (state, ownProps) => {
    return {
        auth: state.authentication,
        loading: state.loan.loading,
        savingsProducts: state.savings.savingsProducts || [],
        loanDetails: state.loan.loanDetails || {},
        userLoanDetails: state.loan.userLoanDetails || {}
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
    getSavingsProducts,
    resetSavingsDetails,
    getSavingsRepaymentMethods
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withNavigationFocus(Login));

const styles = StyleSheet.create({
    title: {
        fontSize: scale(14),
        color: Colors.greyText,
        fontFamily: "graphik-semibold",
        // lineHeight: scale(32),
        marginTop: scale(16),
    },
    subtitle: {
        fontSize: scale(12),
        color: Colors.greyText,
        // textAlign: 'center',
        marginTop: scale(8),
        fontFamily: "graphik-regular",
        lineHeight: scale(18),
        // maxWidth: scale(200),

        // marginTop: scale(24),
    },
    optionText: {
        color: '#4f4f4f',
        fontFamily: 'graphik-medium',
        fontSize: scale(14),
        marginBottom: scale(16)
    },
    editButton: {
        color: Colors.white,
        fontFamily: 'graphik-semibold',
        fontSize: scale(12),
    },
    value: {
        color: Colors.greyText,
        fontFamily: 'graphik-regular',
        fontSize: scale(18),
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
        borderColor: Platform.OS === 'ios' ?'rgba(98, 149, 218, 0.15)':'transparent',
        borderWidth: Platform.OS === 'ios' ?scale(1):0,
        shadowColor: 'rgba(18, 22, 121, 0.05)',
        shadowOffset: {
            width: 0,
            height: scale(6)
        },
        shadowRadius: 10,
        shadowOpacity: 1.0,
        elevation: scale(1),
        paddingHorizontal:scale(20),
        backgroundColor: 'white'
    },
    topHeader: {
        fontSize: scale(12),
        color: Colors.white,
        marginBottom: scale(12),
        fontFamily: "graphik-regular",
    },
    topHeader2: {
        fontSize: scale(32),
        color: Colors.white,
        marginBottom: scale(12),
        fontFamily: "graphik-medium",
    },
    topHeader3: {
        fontSize: scale(12),
        color: Colors.white,
        marginBottom: scale(12),
        fontFamily: "graphik-regular",
    }
})