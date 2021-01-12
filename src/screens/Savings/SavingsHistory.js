import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    FlatList,
    StyleSheet, ImageBackground, Image
} from 'react-native';
import { connect } from 'react-redux';
import NavigationService from "../../../NavigationService";
import { FloatingLabelInput } from "../../components/Input/FloatingLabelInput";
import Header from '../../components/Header/OtherHeader';
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
import { getSavingsProducts, getMySavings } from "./action/savings_actions";

import moment from "moment";
import { formatAmount } from "../../lib/utils/helpers";


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
            phone: ''
        }
    }


    componentDidMount() {
        this.props.getMySavings();
        // this.props.getLoanDetails();
    }

    renderButton = () => {
        const {loading} = this.state;
        return (
            <ButtonWithBackgroundBottom
                disabled={loading}
                onPress={() => this.props.navigation.navigate('Savings')}
                style={{width: '100%'}}

            >
                {!!loading && (<ActivityIndicator size="large" color="#fff"/>)}
                {!loading && (<ButtonWithBackgroundText>{'Create a Plan Now'}</ButtonWithBackgroundText>)}
            </ButtonWithBackgroundBottom>
        );
    };

    render() {
        const {navigate} = this.props.navigation;

        console.log(this.props.savings)

        return (


            <View>
                <Header title={"History"} leftIcon={"ios-arrow-back"}
                        onPressLeftIcon={() => this.props.navigation.goBack()}/>


                <View style={{
                    // marginTop: scale(40),
                    paddingBottom:scale(30),
                    paddingHorizontal: scale(24)
                }}>
                    {(!this.props.savings.length) && (
                        <View>
                            <View style={{
                                width: '100%',
                                // justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: scale(50),
                                marginBottom: scale(8),
                                paddingHorizontal: scale(20),
                            }}>
                                <Image
                                    style={{width: scale(300), height: scale(250)}}
                                    source={require('../../../assets/images/Savings/empty.png')}
                                    resizeMode={'contain'}
                                />
                            </View>
                            <View>
                                {/*<Text style={styles.otherTitle}>Hurray</Text>*/}
                                <Text style={styles.otherSubtitle}>You currently have no savings history.</Text>
                            </View>
                            <View style={{paddingHorizontal: scale(20)}}>
                                {this.renderButton()}
                            </View>
                        </View>
                    )}



                    {(!!this.props.savings.length) && ( <FlatList
                        data={this.props.savings}
                        refreshing={this.props.loading}
                        onRefresh={() => this.props.getMySavings()}
                        renderItem={({item, index}) => {

                            return (
                                <TouchItem style={{
                                    // flexDirection: 'row',
                                    justifyContent: 'center',
                                    borderBottomColor: 'rgba(98, 149, 218, 0.15)',
                                    borderBottomWidth: scale(1),
                                    height: scale(80),
                                    alignItems: 'center',
                                    width: '100%'
                                }}
                                           onPress={() => this.props.navigation.navigate('SavingsHistoryDetail', {
                                               id: item.id
                                           })}
                                >
                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        width: '100%',
                                        marginBottom: scale(12)
                                    }}>
                                        <Text style={styles.title}>{item.name}</Text>
                                        <Text style={styles.amount}>₦{formatAmount(item.balance)}</Text>
                                    </View>
                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        width: '100%'
                                    }}>
                                        <Text style={styles.subtitle}>{item.interest_rate}%</Text>
                                        <Text
                                            style={[styles.status]}>{moment(item.start_date).format('MMM DD, YYYY')}</Text>
                                    </View>
                                </TouchItem>
                            );
                        }}
                        keyExtractor={item => item.id}
                    />)}
                </View>
            </View>


        );
    }

}

const mapStateToProps = (state, ownProps) => {
    return {
        auth: state.authentication,
        transactions: state.transaction.transactions || [],
        savings: state.savings.savings || [],
        loading: state.savings.loading || false
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
    // getAllTransactions,
    getMySavings
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withNavigationFocus(Login));

const styles = StyleSheet.create({
    title: {
        fontSize: scale(14),
        color: Colors.greyText,
        // textAlign: 'center',
        fontFamily: "graphik-regular",
        // marginTop: scale(24),
    },
    subtitle: {
        fontSize: scale(12),
        color: '#9AA5B1',
        fontFamily: "graphik-regular",
        // marginTop: scale(24),
    },
    amount: {
        color: '#112945',
        fontFamily: 'graphik-medium',
        fontSize: scale(16),
        textAlign: 'right'
        // marginBottom: scale(16)
    },
    status: {
        color: '#112945',
        fontFamily: 'graphik-regular',
        fontSize: scale(12),
        textAlign: 'right',
    },
    date: {
        color: '#9AA5B1',
        fontFamily: 'graphik-regular',
        fontSize: scale(12),
        width: scale(112),
        textAlign: 'right',
    },
    "SETTLED": {
        color: '#219653'
    },
    "PENDING": {
        color: Colors.yellow
    },
    otherTitle: {
        fontSize: scale(20),
        color: Colors.greyText,
        textAlign: 'center',
        fontFamily: "graphik-semibold",
        lineHeight: scale(32)
        // marginTop: scale(24),
    },
    otherSubtitle: {
        fontSize: scale(16),
        color: Colors.greyText,
        textAlign: 'center',
        marginTop: scale(10),
        fontFamily: "graphik-regular",
        lineHeight: scale(24),
        maxWidth: scale(200),
        alignSelf: 'center',
        marginBottom: scale(45)
        // marginTop: scale(24),
    },
})