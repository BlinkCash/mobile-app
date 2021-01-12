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
import moment from "moment";
import TransactionDetails from './TransactionDetails';
import Modal from "react-native-modal";
import { verticalScale } from "../../lib/utils/scaleUtils";
import { getReferees } from "./action/home_actions";


import { Image } from "react-native-expo-image-cache";
import { apiRequest } from "../../lib/api/api";
import { LoaderText } from "../../components/Loader/Loader";

// preview can be a local image or a data uri
const preview = {uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="};


class Referees extends React.Component {
    static navigationOptions = {
        header: null
    };

    state = {
        referees: [...this.props.referees],
        filteredReferees: [],
        searchTerm: '',
        loading: false
    };

    componentDidMount() {
        this.props.getReferees(this.props.auth.agent_code);
        // this.setState(
        //     {
        //         transactionHistory: [...this.props.transactionHistory]
        //     }
        // )
    }


    onSearchChange = (searchTerm) => {
        let referees = [...this.state.referees]
        let filteredReferees = referees.filter((option) => {
            const first_name = option.first_name || '';
            const last_name = option.last_name || '';
            const username = option.username || '';
            return first_name.toLowerCase().includes(searchTerm.toLowerCase()) || last_name.toLowerCase().includes(searchTerm.toLowerCase()) || username.toLowerCase().includes(searchTerm.toLowerCase())
        })

        this.setState({
            filteredReferees,
            searchTerm
        })

    }

    fetchClientLoans = (username) => {

        this.setState({
            loading: true
        }, () => {
            apiRequest(getLoanHistory(username), 'get').then(res => {
                // alert("User details updated successfully")

                console.log(res)

                // goBack()
                this.setState({
                    loading: false
                })

                this.props.navigation.navigate('ClientTransactionHistory', {
                    loanHistory: res,
                    username
                });
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
        let referees = this.state.searchTerm ? [...this.state.filteredReferees] : [...this.props.referees]

        return (
            <View>
                <Header title={"Referrals"} leftIcon={"md-arrow-back"}
                        onPressLeftIcon={() => this.props.navigation.goBack()}/>
                <LoaderText visible={this.state.loading} desciption={'Fetching Loans for this user...'}/>
                <KeyboardAwareScrollView
                    style={{backgroundColor: "#fff"}}
                    resetScrollToCoords={{x: 0, y: 0}}
                    contentContainerStyle={styles.container}
                    scrollEnabled={true}
                    keyboardShouldPersistTaps={'handled'}
                    enableOnAndroid={true}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.props.loadingReferees}
                            onRefresh={() => this.props.getReferees(this.props.auth.agent_code)}
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
                    {referees.map(transaction => {
                        console.log(transaction)
                        return (
                            <TouchItem style={styles.listItem}
                                       onPress={() => this.fetchClientLoans(transaction.username)}>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Text style={styles.itemTitle}>{transaction.email}</Text>
                                    </View>
                                    <Image style={{height: 40, width: 40, borderRadius: 20}} {...{preview, uri:transaction.avatar}} />
                                    {/*<Text style={styles.otherAmount}>{transaction.username}</Text>*/}
                                </View>

                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={styles.amount}>{transaction.username}</Text>
                                </View>
                                <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                    <Text style={styles.date}>{transaction.first_name} {transaction.last_name}</Text>
                                    <View style={styles[String(transaction.active_loan)]}/>
                                </View>

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
        referees: state.home.referees || [],
        loadingReferees: state.home.loadingReferees || false,
    };
};

const mapDispatchToProps = {
    updateUserData,
    getReferees
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withNavigationFocus(Referees));

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
        paddingVertical: scale(8)
    },
    itemTitle: {
        color: Colors.lightGreyText,
        fontFamily: 'AvenirLTStd-Light',
        fontSize: scale(12)
    },
    amount: {
        color: Colors.lightGreyText,
        fontFamily: 'AvenirLTStd-Heavy',
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
    true: {
        backgroundColor: Colors.green,
        width: scale(10),
        height: scale(10),
        borderRadius: scale(5),
        marginRight: scale(9)
    },
    false: {
        backgroundColor: '#F66565',
        width: scale(10),
        height: scale(10),
        borderRadius: scale(5),
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
