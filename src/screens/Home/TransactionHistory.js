import React from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity, StyleSheet, Dimensions,
    RefreshControl, ScrollView
} from "react-native";
import { connect } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { scale } from "../../lib/utils/scaleUtils";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import Header from '../../components/Header/OtherHeader';
import { editProfile } from "../../lib/api/url";
import { updateUserData } from "../Auth/action/auth_actions";
import TouchItem from '../../components/TouchItem/_TouchItem';

import { Colors } from "../../lib/constants/Colors";
import { withNavigationFocus } from "react-navigation";
import { formatAmount } from "../../lib/utils/helpers";
import TransactionDetails from './PurchaseDetails';
import Modal from "react-native-modal";
import { verticalScale } from "../../lib/utils/scaleUtils";
import { getTransactionHistory } from "./action/home_actions";
import * as Icon from "@expo/vector-icons";


class TransactionHistory extends React.Component {
    static navigationOptions = {
        header: null
    };

    state = {
        transactionHistory: [...this.props.transactionHistory],
        filteredHistory: [],
        searchTerm: ''
    };

    componentDidMount() {
        this.props.getTransactionHistory(this.props.auth.username);
        // this.setState(
        //     {
        //         transactionHistory: [...this.props.transactionHistory]
        //     }
        // )
    }


    onSearchChange = (searchTerm) => {
        let history = [...this.props.transactionHistory]
        let filteredHistory = history.filter((option) => {
            return option.description.toLowerCase().includes(searchTerm.toLowerCase())
        })

        this.setState({
            filteredHistory,
            searchTerm
        })

    }


    render() {
        const {goBack} = this.props.navigation;
        let history = this.state.searchTerm ? [...this.state.filteredHistory] : [...this.props.transactionHistory]

        return (
            <View>
                <Header title={"Transaction History"} leftIcon={"md-arrow-back"}
                        onPressLeftIcon={() => this.props.navigation.goBack()}/>
                <KeyboardAwareScrollView
                    style={{backgroundColor: "#fff"}}
                    resetScrollToCoords={{x: 0, y: 0}}
                    contentContainerStyle={styles.container}
                    scrollEnabled={true}
                    keyboardShouldPersistTaps={'handled'}
                    enableOnAndroid={true}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.props.loadingTransactionHistory}
                            onRefresh={() => this.props.getTransactionHistory(this.props.auth.username)}
                        />
                    }
                >
                    <View style={{
                        width: '100%', paddingTop: scale(12), paddingBottom: scale(12), paddingLeft: scale(15),
                        paddingRight: scale(15), backgroundColor: Colors.veryLightBlue
                    }}>
                        <TextInput
                            style={[styles.search]}
                            underlineColorAndroid={'transparent'}
                            placeholder={'Search'}
                            onChangeText={this.onSearchChange}
                            value={this.state.searchTerm}
                            multiline={false}
                            autoCorrect={false}
                        />
                    </View>
                    {history.map(transaction => {
                        console.log(transaction)
                        return (
                            <TouchItem style={styles.listItem} onPress={() => this.openModal(transaction)}>
                            <View style={{flex:1}}>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <Text style={[styles.otherAmount,{color:Colors.green}]}>{transaction.transaction_type}</Text>
                                    <Text style={[styles.otherAmount,{fontFamily:'AvenirLTStd-Heavy', fontSize:scale(20)}]}>₦{transaction.amount?formatAmount(transaction.amount):'0'}</Text>
                                </View>

                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={styles.amountTitle}>{transaction.description}</Text>
                                    {/*<Text style={styles.amount}>{transaction.amount}</Text>*/}
                                </View>
                                <Text style={styles.date}>{transaction.wallet_type}</Text>
                            </View>

                                <Icon.Ionicons
                                    name="ios-arrow-forward"
                                    size={scale(25)}
                                    style={styles.itemArrow}
                                    color="rgba(0, 0, 0, 0.25)"
                                />
                            </TouchItem>
                        )
                    })}

                </KeyboardAwareScrollView>
                {/*{!!this.state.showModal && (*/}
                <Modal
                    onRequestClose={this.closeModal}
                    animationIn={'slideInUp'}
                    onBackdropPress={this.closeModal}
                    isVisible={this.state.showModal}
                    style={[{margin: 0}, styles.modal]}
                    onSwipe={this.closeModal}
                    swipeDirection="down"
                >
                    <View style={{
                        position: 'absolute',
                        // bottom: 0,
                        width: '100%',
                        top: verticalScale(76),
                        borderTopLeftRadius: scale(10),
                        borderTopRightRadius: scale(10),
                        backgroundColor: "white",
                        height: '150%'
                    }}>
                        <View style={{}}>
                            <View style={{
                                height: scale(48),
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                borderBottomWidth: 1,
                                borderBottomColor: '#eee',
                                paddingLeft: 20,
                                paddingRight: 5,
                            }}>
                                <Text style={styles.modalTitle}>Transaction Details</Text>
                                <TouchableOpacity onPress={this.closeModal} style={{paddingLeft: 15, paddingRight: 15}}>
                                    <Ionicons name='ios-close'
                                              size={scale(30)}
                                              color={'rgba(0, 0, 0, 0.5400000214576721)'}/>
                                </TouchableOpacity>
                            </View>
                            <View>
                                <TransactionDetails transaction={this.state.transactionDetails}/>
                            </View>
                        </View>
                    </View>
                </Modal>
                {/*)}*/}
            </View>

        );
    }

    openModal = (transaction) => {
        this.setState({
            showModal: true,
            transactionDetails: transaction,
        })
    }
    closeModal = () => {
        this.setState({
            showModal: false,
            transactionDetails: null
        })
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        auth: state.authentication,
        transactionHistory: state.home.transactionHistory || [],
        loadingTransactionHistory: state.home.loadingTransactionHistory || false,
    };
};

const mapDispatchToProps = {
    updateUserData,
    getTransactionHistory
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withNavigationFocus(TransactionHistory));

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        paddingBottom: scale(70),
        width: '100%',
        minHeight: Dimensions.get('window').height
    },
    search: {
        borderColor: Colors.darkBlue,
        borderWidth: 1,
        height: scale(34),
        fontSize: scale(13),
        width: '100%',
        letterSpacing: scale(-0.3),
        color: Colors.greyText,
        fontFamily: 'graphik-regular',
        borderRadius: scale(5),
        paddingLeft: scale(10),
        paddingRight: scale(10),
        backgroundColor: '#EFF2F7',
        alignItems: 'center',
        justifyContent: 'center',
        // flex:1
    },

    //
    listItem: {
        minHeight: scale(70),
        borderBottomColor: '#979797',
        borderBottomWidth: 1,
        width: '100%',
        paddingHorizontal: scale(13),
        paddingVertical: scale(8),
        flexDirection:'row',
        alignItems:'flex-end'
    },
    itemTitle: {
        color: Colors.lightGreyText,
        fontFamily: 'AvenirLTStd-Light',
        fontSize: scale(12)
    },
    amount: {
        color: Colors.lightGreyText,
        fontFamily: 'AvenirLTStd-Heavy',
        marginLeft: scale(8),
        fontSize: scale(19)
    },
    amountTitle: {
        color: Colors.lightGreyText,
        fontFamily: 'graphik-regular',
        fontSize: scale(13)
    },
    date: {
        color: Colors.lightGreyText,
        fontFamily: 'graphik-medium',
        fontSize: scale(11)
    },
    otherAmount: {
        color: Colors.lightGreyText,
        fontFamily: 'graphik-regular',
        fontSize: scale(15)
    },
    Pending: {
        backgroundColor: '#F5A623',
        width: scale(10),
        height: scale(10),
        borderRadius: scale(2),
        marginRight: scale(9)
    },
    Declined: {
        backgroundColor: '#F66565',
        width: scale(10),
        height: scale(10),
        borderRadius: scale(2),
        marginRight: scale(9)
    },
    modalTitle: {
        color: '#00425F',
        fontSize: scale(16),
        textAlign: 'left',
        fontWeight: '400',
        letterSpacing: -0.3,
        fontFamily: 'graphik-regular'
    },

});
