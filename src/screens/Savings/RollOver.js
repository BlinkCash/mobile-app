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
    getSavingsDetails, postRollover
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
import SelectDropdown from "../../components/SelectPopUp/SelectPopUp";


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
            tenor:'',
            details: {
                frequency: {},
                card: {}
            }
        }
    }


    componentDidMount() {
        const id = this.props.navigation.getParam('id', '');
        // this.getTransactionDetails(id)
    }


    submit = () => {

        let details = this.props.navigation.getParam('details', '')

        if(!this.state.tenor){
            this.setState({
                tenor_error:'Please select a tenor to continue'
            })
            return
        }

        this.setState({
            loading: true
        }, () => {
            apiRequest(postRollover(details.id), 'post', {
                "tenor_id": this.state.tenor.value
            })
                .then(res => {
                    console.log(res)
                    this.setState({
                        loading: false
                    }, () => {
                        if (res.status === 'success') {
                            this.props.navigation.navigate('Success', {
                                title: 'Congrats!',
                                description: 'Your plan has been rolled over, you can now start enjoying compounding interests.',
                                buttonText: 'Done',
                                redirect: 'Savings'
                            });

                        } else {
                            // this.props.navigation.goBack();
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
        const {email, password, full_name, phone} = this.state;
        const {navigation, loanDetails} = this.props;
        let details = navigation.getParam('details', '')
        let target = navigation.getParam('target', 0)
        let balance = navigation.getParam('balance', 0)
        let percentage = navigation.getParam('percentage', 0)

        let tenors = [];

        console.log(details)
        const {savingsProducts} = this.props;

        const product = savingsProducts.find(fr => fr.id === details.product_id);
        tenors = product.tenor.map(t => {
            return {
                ...t,
                label: t.value + ' days',
                value: t.id
            }
        })
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
                    <LoaderText visible={this.state.loading} desciption={'Rolling Over Loan...'}/>
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
                        <Header title={"Roll over savings"} leftIcon={"ios-arrow-back"}
                                onPressLeftIcon={() => this.props.navigation.goBack()}/>

                        <View style={{paddingHorizontal: scale(25), width: '100%', marginTop: scale(24)}}>

                            <Text style={{
                                fontFamily:'graphik-medium',
                                color:Colors.greyText,
                                fontSize:scale(24),
                                marginBottom:scale(16)
                            }}>Rollover your savings?</Text>
                            <Text style={[styles.label,{lineHeight: scale(20), marginBottom:scale(16)}]}>Rollover your mature savings and start earning interests on the go.</Text>
                            <View
                                style={[styles.card, {backgroundColor: '#112945'}]}>
                                <View>
                                    <Text style={styles.name}>{`Savings`}</Text>
                                    <Text
                                        style={styles.number}>₦{formatAmount(Number(balance))}</Text>
                                </View>
                                <View style={{zIndex: 9999999}}>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: scale(8)
                                    }}>
                                        <Text
                                            style={[styles.name, {marginBottom: 0}]}>{parseInt(percentage * 100)}% Achieved</Text>
                                        <Text style={[styles.name, {
                                            fontSize: scale(14),
                                            marginBottom: 0
                                        }]}>Target : ₦{formatAmount(Number(target))}</Text>
                                    </View>
                                    <Progress progress={percentage} color={Colors.tintColor} borderColor="transparent"
                                              unfilledColor="#fff" borderRadius={scale(2)} height={scale(4)}
                                              width={null}/>
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

                        </View>

                        <View style={{paddingHorizontal: scale(25), width: '100%', marginTop: scale(24)}}>
                            <View style={{ marginBottom: scale(30)}}>
                                <SelectDropdown
                                    options={tenors || []}
                                    value={''}
                                    textStyle={{
                                        color: '#484848',
                                        fontFamily: 'effra-medium',
                                        marginRight: scale(3),
                                        fontSize: scale(16)
                                    }}
                                    title={`Select Tenor`}
                                    onChange={(obj) => this.onChangeOption(obj)}
                                >
                                    <View style={styles.select}
                                        // onPress={this.onhandleSubmit}
                                    >
                                        <Text style={styles.label}>Set new withdrawal date</Text>
                                        <Text numberOfLines={1} style={styles.value}>{this.state.tenor.label || ''}</Text>
                                    </View>
                                </SelectDropdown>

                                <Text style={formStyles.error}>{this.state.tenor_error}</Text>
                            </View>

                            <Text style={[styles.label,{lineHeight: scale(20)}]}>This date will be the maturity date of this savings plan. Any withdrawal before this date will attract a 20% penal charge on interest earned.</Text>

                            <View style={{marginTop: scale(30)}}>
                                {this.renderButton()}
                            </View>
                        </View>


                    </KeyboardAwareScrollView>
                </View>
            </View>
        );
    }

    renderButton = () => {
        const {loading} = this.state;
        return (
            <ButtonWithBackgroundBottom
                disabled={loading}
                onPress={() => this.submit()}
                style={{width: '100%'}}

            >
                {loading && (<ActivityIndicator size="large" color="#fff"/>)}
                {!loading && (<ButtonWithBackgroundText>{'Rollover savings'}</ButtonWithBackgroundText>)}
            </ButtonWithBackgroundBottom>
        );
    };

    onChangeOption = (obj) => {
        this.setState({
            tenor: obj,
            tenor_error:''
        })
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
    action: {
        fontFamily: 'graphik-semibold',
        fontSize: scale(12),
        color: '#112945',
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
    select: {
        color: '#112945',
        borderBottomWidth: 1,
        borderBottomColor: '#9AA5B1',
        width: '100%',
        height: scale(50),
        justifyContent: 'space-between',
        paddingBottom: scale(8)
    },
    value: {
        fontSize: scale(16),
        color: Colors.greyText,
        fontFamily: 'graphik-regular',
    },
    label: {
        fontFamily: 'graphik-regular',
        fontSize: scale(12),
        color: '#112945',
        opacity: 0.7,
    },
})