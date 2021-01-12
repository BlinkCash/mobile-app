import React from 'react';
import { connect } from 'react-redux';
import {
    Text,
    View,
    ScrollView
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
                <View

                >
                    <View style={styles.firstRow}>
                        {transaction.loan_status &&
                        <View style={styles.successful}>
                            <Text style={styles.statusText}>{transaction.loan_status}</Text>
                        </View>
                        }
                        <View>
                            <Text style={styles.dateTime}>{moment(transaction.created_at).format('DD/MM/YYYY')}</Text>
                        </View>
                    </View>

                    {transaction.loan_purpose &&
                    <View style={styles.secondRow}>
                        <View>
                            <Text style={styles.transactionStatus}>Loan Purpose</Text>
                            <Text style={styles.transactionStatusText}
                                  numberOfLines={3}>{transaction.loan_purpose}</Text>
                        </View>
                    </View>
                    }
                    <View style={styles.thirdRow}>
                        <View style={styles.item}>
                            <Text style={styles.transactionStatus}>Applied Amount</Text>
                            <Text
                                style={styles.transactionStatusText}>&#8358;{transaction.loan_amount ? formatAmount(transaction.loan_amount) : 0}</Text>
                        </View>
                        <View style={styles.item}>
                            <Text style={styles.transactionStatus}>Amount Pending</Text>
                            <Text
                                style={styles.surchargeText}>&#8358;{transaction.amount_pending ? formatAmount(transaction.amount_pending) : 0}</Text>
                        </View>
                        <View style={styles.item}>
                            <Text style={styles.transactionStatus}>Amount Payable</Text>
                            <Text
                                style={styles.surchargeText}>&#8358;{transaction.total_payable ? formatAmount(transaction.total_payable) : 0}</Text>
                        </View>
                        <View style={styles.item}>
                            <Text style={styles.transactionStatus}>Repayment Date</Text>
                            <Text
                                style={styles.surchargeText}>{transaction.repayment_date ? moment(transaction.repayment_date).format('DD/MM/YYYY') : 'N/A'}</Text>
                        </View>
                        <View style={styles.item}>
                            <Text style={styles.transactionStatus}>Loan Tenor</Text>
                            <Text
                                style={styles.surchargeText}>{transaction.loan_tenure} day(s)</Text>
                        </View>
                        <View style={styles.item}>
                            <Text style={styles.transactionStatus}>Overdue Days</Text>
                            <Text
                                style={styles.surchargeText}>{transaction.overdue_days || 0} day(s)</Text>
                        </View>
                        <View style={styles.item}>
                            <Text style={styles.transactionStatus}>Amount Paid</Text>
                            <Text
                                style={styles.surchargeText}>&#8358;{transaction.amount_paid ? formatAmount(transaction.amount_paid) : 0}</Text>
                        </View>
                        <View style={styles.item}>
                            <Text style={styles.transactionStatus}>Interest</Text>
                            <Text
                                style={styles.surchargeText}>&#8358;{transaction.interest ? formatAmount(transaction.interest) : 0}</Text>
                        </View>
                        <View style={styles.item}>
                            <Text style={styles.transactionStatus}>Penalty</Text>
                            <Text
                                style={styles.surchargeText}>&#8358;{transaction.penalty ? formatAmount(transaction.penalty) : 0}</Text>
                        </View>
                    </View>
                    <View style={styles.fourthRow}>
                        {transaction.loan_code &&
                        <View style={{paddingBottom: verticalScale(10)}}>
                            <Text style={styles.transactionStatus}>Loan Code</Text>
                            <Text style={styles.transactionStatusText}>{transaction.loan_code}</Text>
                        </View>
                        }
                        {!!transaction.user_id &&
                        <View style={{paddingBottom: verticalScale(10)}}>
                            <Text style={styles.transactionStatus}>User Name</Text>
                            <Text style={styles.transactionStatusText}
                                  numberOfLines={3}>{transaction.user_id}</Text>
                        </View>
                        }
                        <View style={{paddingBottom: verticalScale(10)}}>
                            <Text style={styles.transactionStatus}>Net Income</Text>
                            <Text
                                style={styles.transactionStatusText}>&#8358;{transaction.net_income ? formatAmount(transaction.net_income) : 0}</Text>
                        </View>

                    </View>


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
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: verticalScale(10)
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


