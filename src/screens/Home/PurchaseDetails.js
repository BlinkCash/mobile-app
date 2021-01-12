import React from 'react';
import { connect } from 'react-redux';
import {
    Text,
    View,
    ActivityIndicator
} from 'react-native';
import { withNavigationFocus } from 'react-navigation';
import { scale, verticalScale } from "../../lib/utils/scaleUtils";
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import { formatAmount } from '../../lib/utils/helpers';

class TransactionDetails extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            paymentDetails: this.props.transaction,
        }
    }

    componentWillUnmount() {
        // if (prevProps.isFocused && !this.props.isFocused) {
        //     this.props.saveTransactionDetails(null);
        // }
    }

    render() {
        const {auth, transaction} = this.props;
        console.log(transaction);
        return (
            <View style={styles.container}>
                {transaction &&
                <View>
                    <View style={styles.firstRow}>
                        <View style={styles.successful}>
                            <Text style={styles.statusText}>{transaction.transaction_type}</Text>
                        </View>

                        <View>
                            <Text style={styles.dateTime}>{moment(transaction.created_at).format('DD/MM/YYYY')}</Text>
                        </View>
                    </View>

                    {transaction.reference &&
                    <View style={styles.secondRow}>
                        <View>
                            <Text style={styles.transactionStatus}>Transaction Reference</Text>
                            <Text style={styles.transactionStatusText}
                                  numberOfLines={3}>{transaction.reference}</Text>
                        </View>
                    </View>
                    }
                    {transaction.amount &&
                    <View style={styles.secondRow}>
                        <View>
                            <Text style={styles.transactionStatus}>Amount</Text>
                            <Text style={styles.transactionStatusText}
                                  numberOfLines={3}>₦{transaction.amount?formatAmount(transaction.amount):'0'}</Text>
                        </View>
                    </View>
                    }
                    <View style={styles.thirdRow}>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingBottom: verticalScale(10)
                        }}>
                            <Text style={styles.transactionStatus}>Description</Text>
                            <Text
                                style={styles.transactionStatusText}>{transaction.description}</Text>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <Text style={styles.transactionStatus}>Transaction Code</Text>
                            <Text
                                style={styles.surchargeText}>{transaction.transaction_code}</Text>
                        </View>
                    </View>
                    <View style={styles.fourthRow}>
                        {!!transaction.account_name &&
                        <View style={{paddingBottom: verticalScale(10)}}>
                            <Text style={styles.transactionStatus}>Account Name</Text>
                            <Text style={styles.transactionStatusText}>{transaction.account_name}</Text>
                        </View>
                        }
                        {!!transaction.account_number &&
                        <View style={{paddingBottom: verticalScale(10)}}>
                            <Text style={styles.transactionStatus}>Account Number</Text>
                            <Text style={styles.transactionStatusText}
                                  numberOfLines={3}>{transaction.account_number}</Text>
                        </View>
                        }
                        {!!transaction.bank_name &&
                        <View style={{paddingBottom: verticalScale(10)}}>
                            <Text style={styles.transactionStatus}>Bank Name</Text>
                            <Text style={styles.transactionStatusText}
                                  numberOfLines={3}>{transaction.bank_name}</Text>
                        </View>
                        }

                    </View>

                    {/*{(transaction.requestRef || transaction.paymentRef) &&*/}
                    {/*<View style={styles.fifthRow}>*/}
                    {/*{transaction.requestRef &&*/}
                    {/*<View style={{paddingBottom: verticalScale(10)}}>*/}
                    {/*<Text style={styles.transactionStatus}>Request Reference</Text>*/}
                    {/*<Text style={styles.transactionStatusText}>{transaction.requestRef}</Text>*/}
                    {/*</View>*/}
                    {/*}*/}
                    {/*{transaction.paymentRef &&*/}
                    {/*<View>*/}
                    {/*<Text style={styles.transactionStatus}>Payment Reference</Text>*/}
                    {/*<Text style={styles.transactionStatusText} numberOfLines={3}>{transaction.paymentRef}</Text>*/}
                    {/*</View>*/}
                    {/*}*/}
                    {/*</View>*/}
                    {/*}*/}
                </View>
                }
            </View>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        auth: state.authentication,
        paymentDetails: state.transactions
    };
};

const mapDispatchToProps = {};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TransactionDetails);

const styles = {
    container: {
        marginTop: scale(50),
        marginHorizontal: scale(30),
    },
    firstRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: '#D8D8D8',
        borderBottomWidth: 1,
    },
    successful: {
        flexDirection: 'row',
        paddingVertical: verticalScale(15),
        // paddingBottom: verticalScale(5),
    },
    statusText: {
        fontFamily: 'AvenirLTStd-Heavy',
        fontSize: scale(16),
        fontWeight: '700',
    },
    dateTime: {
        // fontFamily: 'SFProText-Regular',
        fontSize: scale(12),
        fontWeight: '400',
        // textAlign: 'right',
    },
    secondRow: {
        borderBottomColor: '#D8D8D8',
        borderBottomWidth: 1,
        paddingVertical: verticalScale(10)
    },
    transactionStatus: {
        fontSize: scale(12),
        textAlign: 'left',
        fontWeight: '400',
        color: 'rgba(0, 0, 0, 0.6000000238418579)'
    },
    transactionStatusText: {
        fontSize: scale(14),
        textAlign: 'left',
        fontWeight: '600',
        fontFamily: 'graphik-medium',
    },
    thirdRow: {
        borderBottomColor: '#D8D8D8',
        borderBottomWidth: 1,
        paddingVertical: verticalScale(15)
    },
    surchargeText: {
        fontSize: scale(12),
        textAlign: 'left',
        fontWeight: '600',
    },
    fourthRow: {
        borderBottomColor: '#D8D8D8',
        borderBottomWidth: 1,
        paddingTop: verticalScale(15)
    },
    fifthRow: {
        borderBottomColor: '#D8D8D8',
        borderBottomWidth: 1,
        paddingVertical: verticalScale(15)
    },
}


