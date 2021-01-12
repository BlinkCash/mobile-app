import React, { Component } from "react";
import { connect } from 'react-redux'
// import { getBank } from './_duck/actions'
import { scale } from "../../lib/utils/scaleUtils";

import LoadingModal from '../../components/loadingModal';
import {
    StyleSheet,
    Text,
    View, Image, StatusBar, TouchableOpacity, ScrollView, Dimensions, AsyncStorage, ImageBackground, FlatList, Platform
} from 'react-native';
import Header from "../../components/Header/OtherHeader";
import { Colors } from "../../lib/constants/Colors";
import TouchItem from "../../components/TouchItem/_TouchItem";
import NavigationService from "../../../NavigationService";
import { logoutUserSuccess } from "../Auth/action/auth_actions";
import { formatAmount } from "../../lib/utils/helpers";
import { getWalletBalance, getAllWalletTransactions } from "./action/wallet_actions";
import moment from "moment";


const windowH = Dimensions.get('screen').height


class Wallet extends Component {

    constructor(props) {

        super(props);

        this.state = {};

    }


    componentDidMount() {
        this.props.getWalletBalance();
        this.props.getAllWalletTransactions();

    }


    startLoader = () => {
        this.setState({
            isModalVisible: true,
        })
    }

    dismissLoader = () => {

        this.setState({
            isModalVisible: false,
        })


    }

    goToPage = (urlName) => {
        if (urlName === 'Logout') {
            this._signOutAsync();
            return
        }
        this.props.navigation.navigate(urlName)
    }

    _signOutAsync = () => {
        this.props.logoutUserSuccess();
        AsyncStorage.removeItem('access_token');
        NavigationService.navigate('Login');
    };

    render() {
        console.log(this.props.auth)
        const {loanDetails, wallet} = this.props;


        console.log(wallet)
        let {photo_url, first_name, last_name, email, bvn} = this.props.auth

        return (

            <ScrollView style={styles.container}>

                <LoadingModal isModalVisible={this.state.isModalVisible}/>
                {/*<StatusBar*/}
                {/*backgroundColor="#234d82"*/}
                {/*barStyle="light-content"*/}
                {/*/>*/}


                <Header title={"Wallet"} leftIcon={"ios-arrow-back"}
                        onPressLeftIcon={() => this.props.navigation.navigate('Home')}/>

                <View style={{
                    width: '100%',
                    paddingHorizontal: scale(24),
                    paddingTop: scale(24)
                }}>

                    <View style={{
                        // marginTop: scale(30)
                    }}>
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
                                <View style={{
                                    paddingHorizontal: scale(16),
                                    // marginBottom: scale(18),
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                    // marginBottom:scale(20)
                                }}>
                                    <View>
                                        <Text
                                            style={styles.topHeader1}>Wallet Balance</Text>
                                        <Text style={styles.topHeader2}>₦{formatAmount(wallet.availableBalance)}</Text>
                                    </View>
                                </View>
                            </ImageBackground>
                        </View>
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingHorizontal: scale(20),
                        marginTop: scale(36)
                    }}>
                        <TouchItem style={{flexDirection: 'row', alignItems: 'center'}} onPress={() => {
                            this.props.navigation.navigate('FundWallet', {
                                wallet
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
                        <TouchItem style={{flexDirection: 'row', alignItems: 'center'}} onPress={() => {
                            this.props.navigation.navigate('WalletTransfer', {
                                wallet,
                            })

                        }}>
                            <Image
                                source={require('../../../assets/images/Home/transfer.png')}
                                style={{
                                    width: scale(24),
                                    height: scale(24),
                                    marginRight: scale(8)
                                }}
                                resizeMode={'contain'}
                            />
                            <Text style={[styles.action, {color: '#EB5757'}]}>TRANSFER</Text>
                        </TouchItem>
                    </View>

                    <View style={{
                        borderTopColor: 'rgba(98, 149, 218, 0.15)',
                        borderTopWidth: scale(1),
                        marginTop: scale(30),
                        paddingTop: scale(16)
                    }}>
                        <Text style={styles.topTitle}>Wallet transactions</Text></View>
                    <FlatList
                        data={this.props.wallet.transactions}
                        // refreshing={this.props.loading}
                        // onRefresh={() => this.props.getAllTransactions()}
                        renderItem={({item, index}) => {

                            return (
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    borderBottomColor: 'rgba(98, 149, 218, 0.15)',
                                    borderBottomWidth: scale(1),
                                    height: scale(62),
                                    alignItems: 'center'
                                }}
                                >
                                    <View>
                                        <Text
                                            style={styles.name}>{item.transaction_type.charAt(0).toUpperCase() + item.transaction_type.substring(1).toLowerCase()}</Text>
                                        {!!item.status && (   <Text
                                            style={[styles.status,item.status === 'failed'?{color:'#EB5757'}:{}]}>{item.status.charAt(0).toUpperCase() + item.status.substring(1).toLowerCase()}</Text>)}

                                    </View>
                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}>
                                        <View>
                                            <Text style={styles.amount}>₦{formatAmount(item.amount)}</Text>
                                            <Text
                                                style={styles.date}>{moment(item.created_on).format('MMM DD, YYYY')}</Text>
                                        </View>
                                        {
                                            item.entry === 'debit' && (
                                                <Image
                                                    style={{width: scale(28), height: scale(28), marginLeft: scale(14)}}
                                                    source={require('../../../assets/images/Transactions/down_arrow.png')}

                                                />
                                            )
                                        }
                                        {
                                            item.entry !== 'debit' && (
                                                <Image
                                                    style={{width: scale(28), height: scale(28), marginLeft: scale(14)}}
                                                    source={require('../../../assets/images/Transactions/up_arrow.png')}

                                                />
                                            )
                                        }

                                    </View>
                                </View>
                            );
                        }}
                        keyExtractor={item => item.id}
                    />

                </View>


            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    topHeader: {
        minHeight: scale(243),
        width: '100%',
        borderBottomWidth: scale(1),
        borderBottomColor: ' rgba(18, 22, 121, 0.07)',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.white
    },
    topHeader2: {
        fontSize: scale(35),
        color: Colors.white,
        // marginBottom:scale(12),
        fontFamily: "graphik-medium",
        textAlign: 'center',
    },
    action: {
        fontFamily: 'graphik-semibold',
        fontSize: scale(12),
        color: '#112945',
    },
    topHeader1: {
        fontSize: scale(10),
        color: Colors.white,
        marginBottom: scale(12),
        textAlign: 'center',
        opacity: 0.7,
        fontFamily: "graphik-regular",
    },
    tapToChange: {
        color: Colors.greyText,
        fontFamily: 'graphik-regular',
        fontSize: scale(10),
        marginTop: scale(17),
        opacity: 0.5
    },
    name: {
        color: '#112945',
        fontFamily: 'graphik-regular',
        fontSize: scale(14),
        // marginTop: scale(24),
    },
    status:{
        color: '#219653',
        fontFamily: 'graphik-regular',
        fontSize: scale(11),
        marginTop:scale(5)
    },
    email: {
        color: '#193152',
        fontFamily: 'graphik-regular',
        fontSize: scale(14),
        marginTop: scale(6),
        opacity: 0.5

    },
    innerTitle: {
        color: '#193152',
        fontFamily: 'graphik-regular',
        fontSize: scale(12),
        marginTop: scale(6),
        opacity: 0.6,
        marginBottom: scale(8)

    },
    innerValue: {
        color: '#193152',
        fontFamily: 'graphik-regular',
        fontSize: scale(14),
    },
    title: {
        color: Colors.greyText,
        fontFamily: 'graphik-medium',
        fontSize: scale(12),
        marginBottom: scale(16)
    },
    listItem: {
        height: scale(64),
        justifyContent: 'center',
        borderBottomWidth: scale(1),
        borderBottomColor: ' rgba(18, 22, 121, 0.07)',
        paddingHorizontal: scale(16)
    },
    roundCard: {
        width: '100%',
        borderRadius: scale(16),
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

    topTitle: {
        color: '#112945',
        fontFamily: 'graphik-medium',
        fontSize: scale(16),
        marginBottom: scale(15),
    },
    amount: {
        color: '#112945',
        fontFamily: 'graphik-regular',
        fontSize: scale(14),
        marginBottom: scale(11),
        textAlign: 'right',
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
        // width: scale(112),
        textAlign: 'right',
    },
    warning: {
        backgroundColor: 'orange',
        borderRadius: 5,
        padding: 10,
        textAlign: "center",
        marginLeft: 20,
        marginRight: 20,
        marginTop: 10,
        flexDirection: 'row'
    },
    lastLink: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        justifyContent: 'center',
        marginLeft: 20,
        marginRight: 20,
        marginTop: 10
    },
    label: {
        fontWeight: '500',
        fontSize: 14,
        color: '#10c341',
        marginBottom: 5,
        marginTop: 10
    },
    text: {
        fontSize: 18,
        textAlign: 'left',
        flexWrap: 'wrap'
    },
    navText: {
        fontSize: 18,
        textAlign: 'left',
        flexWrap: 'wrap',
        marginTop: 10
    },

    profileImg: {
        height: 70,
        width: 70,
        borderRadius: 35
    }

});

const mapStateToProps = state => ({
    auth: state.authentication,
    wallet: state.wallet,
    transactions: state.transaction.transactions || [],
    // banks: state.profileReducer.bank.data
})

const mapDispatchToProps = {
    logoutUserSuccess,
    getWalletBalance,
    getAllWalletTransactions
}


export default connect(mapStateToProps, mapDispatchToProps)(Wallet)
