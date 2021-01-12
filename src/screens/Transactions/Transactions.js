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
import TouchItem from '../../components/TouchItem/_TouchItem'


import {
    handleForgotPassword,
    resetAuthData, loginUserSuccess, getExtraDetails,
} from '../Auth/action/auth_actions';
import {
    ButtonWithBackgroundText,
    ButtonWithBackgroundBottom
} from '../../components/Button/Buttons';
import { postLogin, postRegister, checkfull_names, postAuthInit } from "../../lib/api/url";
import { withNavigationFocus } from 'react-navigation';
import { showToast, hideToast } from "../../components/Toast/actions/toastActions";
import { scale } from "../../lib/utils/scaleUtils";
import { resetCache } from "../Auth/action/auth_actions";
import { Colors } from "../../lib/constants/Colors";
import { getAllTransactions, getLoanDetails } from "./action/transaction_actions";
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
        this.props.getAllTransactions();
        // this.props.getLoanDetails();
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


        return (

            <View style={{flex:1}}>
                <View style={{
                    // paddingBottom:scale(25),
                    flex:1
                }}>
                    <View style={{
                        width: '100%',
                        // justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: scale(30),
                        paddingHorizontal: scale(24),
                    }}>
                        <Text style={{
                            fontFamily: 'graphik-medium',
                            fontSize: scale(30),
                            color: Colors.greyText,
                            width: '100%',
                            textAlign: 'left'
                        }}>Transactions</Text>
                    </View>


                    {(!this.props.transactions.length) && (
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
                                    source={require('../../../assets/images/Transactions/empty.png')}
                                    resizeMode={'contain'}
                                />
                            </View>
                            <View>
                                {/*<Text style={styles.otherTitle}>Hurray</Text>*/}
                                <Text style={styles.otherSubtitle}>You are yet to make your first transaction.</Text>
                            </View>
                            {/*<View style={{paddingHorizontal: scale(20)}}>*/}
                                {/*{this.renderButton()}*/}
                            {/*</View>*/}
                        </View>
                    )}

                    {(!!this.props.transactions.length) && (
                        <View style={{
                            marginTop: scale(40),
                            paddingHorizontal: scale(24),
                            flex:1
                        }}>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                borderBottomColor: 'rgba(98, 149, 218, 0.15)',
                                borderBottomWidth: scale(1),
                                height: scale(62),
                                alignItems: 'center'
                            }}>
                                <Text style={styles.amount}>Amount</Text>
                                <Text style={styles.type}>Type</Text>
                                <Text style={styles.date}>Date</Text>
                            </View>

                            <FlatList
                                data={this.props.transactions}
                                refreshing={this.props.loading}
                                onRefresh={() => this.props.getAllTransactions()}
                                renderItem={({item, index}) => {

                                    return (
                                        <TouchItem style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            borderBottomColor: 'rgba(98, 149, 218, 0.15)',
                                            borderBottomWidth: scale(1),
                                            height: scale(62),
                                            alignItems: 'center'
                                        }}
                                                   onPress={() => this.props.navigation.navigate('TransactionDetails', {
                                                       id: item.id
                                                   })}
                                        >
                                            <View style={{
                                                flexDirection: 'row',
                                                alignItems: 'center'
                                            }}>
                                                {/*{*/}
                                                    {/*item.entry === 'debit' && (*/}
                                                        {/*<Image*/}
                                                            {/*style={{width: scale(28), height: scale(28), marginRight: scale(16)}}*/}
                                                            {/*source={require('../../../assets/images/Transactions/down_arrow.png')}*/}

                                                        {/*/>*/}
                                                    {/*)*/}
                                                {/*}*/}
                                                {/*{*/}
                                                    {/*item.entry !== 'debit' && (*/}
                                                        {/*<Image*/}
                                                            {/*style={{width: scale(28), height: scale(28), marginRight: scale(16)}}*/}
                                                            {/*source={require('../../../assets/images/Transactions/up_arrow.png')}*/}

                                                        {/*/>*/}
                                                    {/*)*/}
                                                {/*}*/}
                                                <Text style={styles.amount}>{formatAmount(+item.amount)}</Text>
                                            </View>
                                            <Text style={styles.type}>{item.type.charAt(0).toUpperCase() + item.type.substring(1).toLowerCase()}</Text>
                                            <Text style={styles.date}>{moment(item.created_on).format('MMM DD, YYYY')}</Text>
                                        </TouchItem>
                                    );
                                }}
                                keyExtractor={item => item.id}
                            />
                        </View>
                    )}

                </View>
            </View>

        );
    }

}

const mapStateToProps = (state, ownProps) => {
    return {
        auth: state.authentication,
        loading: state.transaction.loading,
        transactions: state.transaction.transactions || [],
        loadingTransactionHistory: state.transaction.loading || false
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
    getAllTransactions,
    getLoanDetails
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withNavigationFocus(Login));

const styles = StyleSheet.create({
    title: {
        fontSize: scale(20),
        color: Colors.greyText,
        textAlign: 'center',
        fontFamily: "graphik-semibold",
        lineHeight: scale(32)
        // marginTop: scale(24),
    },
    subtitle: {
        fontSize: scale(14),
        color: Colors.greyText,
        textAlign: 'center',
        marginTop: scale(8),
        fontFamily: "graphik-regular",
        lineHeight: scale(24),
        maxWidth: scale(200),
        alignSelf: 'center',
        marginBottom: scale(24)
        // marginTop: scale(24),
    },
    amount: {
        color: '#112945',
        fontFamily: 'graphik-regular',
        fontSize: scale(14),
        // marginBottom: scale(16)
    },
    type: {
        color: '#112945',
        fontFamily: 'graphik-regular',
        fontSize: scale(14),
        textAlign: 'right',
        flex: 1
    },
    date: {
        color: '#9AA5B1',
        fontFamily: 'graphik-regular',
        fontSize: scale(12),
        width: scale(112),
        textAlign: 'right',
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
        fontSize: scale(15),
        color: Colors.greyText,
        textAlign: 'center',
        marginTop: scale(40),
        fontFamily: "graphik-semibold",
        lineHeight: scale(22),
        maxWidth: scale(300),
        alignSelf: 'center',
        marginBottom: scale(45)
        // marginTop: scale(24),
    },
})