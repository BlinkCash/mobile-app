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
    postAddEmail, postChangePassword
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
import { SvgUri, SvgFromUri } from 'react-native-svg';
import cards from '../../../assets/images/cards/cards';


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
            isCardPage: false
        }
    }


    componentDidMount() {
        this.props.getAllCards()
        this.props.getAllBanks()
    }


    goToPage = () => {
        if (this.state.isCardPage) {
            this.props.navigation.navigate('AddCard')
        } else {
            this.props.navigation.navigate('AddBank')
        }
    }

    render() {
        const {navigate} = this.props.navigation;
        const {email, password, full_name, phone, isCardPage} = this.state;
        console.log(this.props.banks)
        console.log(this.props.cards)
        // let icon = ''
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
                    <LoaderText visible={this.state.loading} desciption={'Changing Password, Please wait'}/>
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
                        <Header title={"Banks & Cards"} leftIcon={"ios-arrow-back"}
                                onPressLeftIcon={() => this.props.navigation.goBack()} rightIcon={'Add'}
                                onPressRightIcon={this.goToPage}/>

                        <View>
                            <SwitchToggle
                                buttonText={isCardPage ? 'Cards' : 'Banks'}
                                backTextRight={isCardPage ? '' : 'Cards'}
                                backTextLeft={isCardPage ? 'Banks' : ''}
                                type={1}
                                buttonStyle={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'absolute',
                                    shadowColor: 'rgba(0, 0, 0, 0.05)',
                                    shadowOffset: {
                                        width: 0,
                                        height: scale(4)
                                    },
                                    shadowRadius: 4,
                                    shadowOpacity: 1.0,
                                    elevation: 2
                                }}
                                rightContainerStyle={{
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                leftContainerStyle={{
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'flex-start'
                                }}
                                buttonTextStyle={{
                                    fontSize: scale(12),
                                    color: Colors.tintColor,
                                    fontFamily: 'graphik-regular'
                                }}
                                textRightStyle={{
                                    fontSize: scale(12),
                                    color: Colors.greyText,
                                    fontFamily: 'graphik-regular'
                                }}
                                textLeftStyle={{
                                    fontSize: scale(12),
                                    color: Colors.greyText,
                                    fontFamily: 'graphik-regular'
                                }}
                                containerStyle={{
                                    marginTop: 16,
                                    width: Dimensions.get('window').width - 32,
                                    height: scale(36),
                                    borderRadius: scale(18),
                                    padding: scale(0.5),
                                    backgroundColor: 'green'
                                }}
                                backgroundColorOn="#ECECEC"
                                backgroundColorOff="#ECECEC"
                                circleStyle={{
                                    width: scale(175),
                                    height: scale(34),
                                    borderRadius: scale(17),
                                    // backgroundColor: '#ECECEC', // rgb(102,134,205)
                                }}
                                switchOn={isCardPage}
                                onPress={() => this.setState({isCardPage: !isCardPage})}
                                circleColorOff="white"
                                circleColorOn="white"
                                duration={100}
                            />
                        </View>

                        <View style={{
                            width: '100%',
                            paddingVertical: scale(27)
                        }}>
                            {isCardPage && (
                                <FadeInView style={{
                                    width: '100%',
                                    paddingHorizontal: scale(24)
                                }}>

                                    {!this.props.cards.length && (
                                        <View>
                                            <View style={{
                                                width: '100%',
                                                // justifyContent: 'center',
                                                alignItems: 'center',
                                                marginTop: scale(80),
                                                marginBottom: scale(8),
                                                paddingHorizontal: scale(20),
                                            }}>
                                                <Image
                                                    style={{width: scale(230), height: scale(176)}}
                                                    source={require('../../../assets/images/cards/empty.png')}
                                                    resizeMode={'contain'}
                                                />
                                            </View>
                                            <View>
                                                <Text style={styles.subtitle}>You have no cards on your account
                                                    yet.</Text>
                                            </View>
                                            <View style={{paddingHorizontal: scale(20), marginTop: scale(100)}}>
                                                <ButtonWithBackgroundBottom
                                                    onPress={() => this.props.navigation.navigate('AddCard')}
                                                    style={{width: '100%'}}

                                                >
                                                    <ButtonWithBackgroundText>{'Add Card'}</ButtonWithBackgroundText>
                                                </ButtonWithBackgroundBottom>
                                            </View>
                                        </View>
                                    )}
                                    {this.props.cards.map(card => {

                                        let icon = cards[card.card_type.toLowerCase()]
                                        return <TouchItem
                                            onPress={() => this.props.navigation.navigate('CardDetail', {
                                                card
                                            })}
                                            style={[styles.card, {backgroundColor: '#DC4F89'}]}>
                                            <View style={{padding: scale(16)}}>
                                                <Text style={styles.name}>{`XXXX XXXX XXXX ${card.card_last4}`}</Text>
                                                <Text
                                                    style={styles.number}>{`${card.card_exp_month}/${card.card_exp_year}`}</Text>
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
                                        </TouchItem>
                                    })}
                                </FadeInView>
                            )}
                            {!isCardPage && (
                                <FadeInView style={{
                                    width: '100%',
                                    paddingHorizontal: scale(24)
                                }}>
                                    {this.props.banks.map(bank => {
                                        return <TouchItem
                                            onPress={() => this.props.navigation.navigate('BankDetail', {
                                                bank
                                            })}
                                            style={styles.card}>
                                            <View style={{padding: scale(16)}}>
                                                <Text style={styles.name}>{bank.account_name}</Text>
                                                <Text style={styles.number}>{bank.account_number}</Text>
                                                <Text style={styles.info}>{bank.code_description}</Text>
                                            </View>
                                            <Image
                                                source={{uri: bank.url}}
                                                style={{
                                                    width: scale(58),
                                                    height: scale(28),
                                                    position: 'absolute',
                                                    right: scale(16),
                                                    bottom: scale(16),
                                                    zIndex: 999
                                                }}
                                                resizeMode={'contain'}
                                            />
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
                                        </TouchItem>
                                    })}
                                </FadeInView>
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
        marginBottom: scale(24),
        shadowColor: 'rgba(18, 22, 121, 0.16)',
        shadowOffset: {
            width: 0,
            height: scale(6)
        },
        shadowRadius: 10,
        shadowOpacity: 1.0,
        elevation: 2
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
    subtitle: {
        fontSize: scale(15),
        color: Colors.greyText,
        textAlign: 'center',
        marginTop: scale(8),
        fontFamily: "graphik-semibold",
        lineHeight: scale(22),
        maxWidth: scale(300),
        alignSelf: 'center',
        marginBottom: scale(24)
        // marginTop: scale(24),
    },
    info: {
        fontSize: scale(12),
        lineHeight: scale(13),
        fontFamily: 'graphik-regular',
        color: Colors.white
    }

})