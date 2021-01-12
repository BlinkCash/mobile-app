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
import { editProfile, getLoanHistory } from "../../lib/api/url";
import { updateUserData } from "../Auth/action/auth_actions";
import TouchItem from '../../components/TouchItem/_TouchItem';

import { Colors } from "../../lib/constants/Colors";
import { withNavigationFocus } from "react-navigation";
import { formatAmount } from "../../lib/utils/helpers";
import TransactionDetails from './PurchaseDetails';
import Modal from "react-native-modal";
import { verticalScale } from "../../lib/utils/scaleUtils";
import * as Icon from "@expo/vector-icons";
import { apiRequest } from "../../lib/api/api";
import {showToast} from "../../components/Toast/actions/toastActions";
import moment from "moment";
import {getAgentClientLoans} from "../../lib/api/url";


class TransactionHistory extends React.Component {
    static navigationOptions = {
        header: null
    };

    state = {
        clientActiveLoans: [],
        filteredHistory: [],
        searchTerm: '',
        loading:false
    };

    componentDidMount() {
        this.fetchClientActiveLoans(this.props.auth.agent_code);
        // this.setState(
        //     {
        //         transactionHistory: [...this.props.transactionHistory]
        //     }
        // )
    }


    onSearchChange = (searchTerm) => {
        let history = [...this.state.clientActiveLoans]
        let filteredHistory = history.filter((option) => {
            return option.loan_code.toLowerCase().includes(searchTerm.toLowerCase()) || option.loan_status.toLowerCase().includes(searchTerm.toLowerCase())
        })

        this.setState({
            filteredHistory,
            searchTerm
        })

    }

    fetchClientActiveLoans = (code) => {

        this.setState({
            loading: true
        }, () => {
            apiRequest(getAgentClientLoans(code), 'get').then(res => {
                // alert("User details updated successfully")

                // goBack()
                this.setState({
                    loading: false,
                    clientActiveLoans:res
                })

            })
                .catch(err => {
                    console.log(err.response)
                    console.log(err.data)
                    this.setState({
                        loading: false
                    })
                    this.props.showToast('Could not fetch client loans', 'error', 3000);
                });
        })
    }


    render() {
        const {goBack} = this.props.navigation;
        let history = this.state.searchTerm ? [...this.state.filteredHistory] : [...this.state.clientActiveLoans]

        return (
            <View>
                <Header title={"Client Active Loans"} leftIcon={"md-arrow-back"}
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
                            refreshing={this.state.loading}
                            onRefresh={() => this.fetchClientActiveLoans(this.props.auth.agent_code)}
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
                            <TouchItem style={styles.listItem}  onPress={() => this.openModal(transaction)}>
                                <View style={{flex:1}}>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <View style={styles[transaction.loan_status]}/>
                                            <Text style={styles.itemTitle}>{transaction.loan_status}</Text>
                                        </View>
                                        <Text style={styles.otherAmount}>₦{transaction.loan_amount?formatAmount(transaction.loan_amount):'0'}</Text>
                                    </View>

                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Text style={styles.amountTitle}>PAYABLE</Text>
                                        <Text style={styles.amount}>₦{transaction.amount_pending?formatAmount(transaction.amount_pending):'0'}</Text>
                                    </View>
                                    <Text style={styles.date}>{moment(transaction.created_at).format('DD/MM/YYYY')}</Text>
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
                    style={[{margin:0}]}
                    // onSwipe={this.closeModal}
                    // swipeDirection="down"
                >
                    <View style={{
                        position: 'absolute',
                        bottom: 0,
                        width: '100%',
                        top: verticalScale(100),
                        borderTopLeftRadius: scale(10),
                        borderTopRightRadius: scale(10),
                        backgroundColor: "white",
                        // height: '150%'
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
                                <Text style={styles.modalTitle}>Loan Details</Text>
                                <TouchableOpacity onPress={this.closeModal} style={{paddingLeft:15, paddingRight:15}}>
                                    <Ionicons name='ios-close'
                                              size={scale(30)}
                                              color={'rgba(0, 0, 0, 0.5400000214576721)'}/>
                                </TouchableOpacity>
                            </View>

                        </View>
                        <ScrollView
                            style={{
                                // maxHeight: verticalScale(400),
                                // borderRadius: 0,
                                elevation: 2,
                                minWidth: scale(300),
                                width: '100%',
                                flex: 1,
                                paddingLeft: scale(20),
                                paddingRight: scale(20),
                                backgroundColor: 'white'
                            }}
                            contentContainerStyle={{backgroundColor: "white"}}
                            scrollEnabled={true}
                            keyboardShouldPersistTaps={'always'}
                            enableOnAndroid={true}
                        >
                            <TransactionDetails transaction={this.state.transactionDetails} />
                        </ScrollView>

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
    showToast
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
