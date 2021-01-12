import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ActivityIndicator, Animated
} from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import SlideInView from '../../components/AnimatedComponents/SlideInView'
import SlideOutView from '../../components/AnimatedComponents/SlideOutView'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ButtonWithBackgroundBottom, ButtonWithBackgroundText } from "../../components/Button/Buttons";
import { getValidateMultichoiceAccount, postBuyMultichoice } from "../../lib/api/url";
import { apiRequest } from "../../lib/api/api";
import SelectPopup from "../../components/SelectPopUp/SelectPopUp";

import { connect } from "react-redux";

import { showToast } from "../../components/Toast/actions/toastActions";


import { withNavigationFocus } from "react-navigation";
import Header from '../../components/Header/OtherHeader';

import { scale } from "../../lib/utils/scaleUtils";
import { LoaderText } from "../../components/Loader/Loader";
import { fetchDataPlanOptions } from "./action/billsActions";
import NavigationService from "../../../NavigationService";
import { formatAmount } from "../../lib/utils/helpers";


class BuyAirtime extends React.Component {
    static navigationOptions = {
        header: null,
    };
    state = {
        currency: "&#8358;",
        amount: "0",
        receipientMobile: "",
        isLoadingAccountName: false,
        beneficiaryAccountName: "",
        accountNumber: "",
        cbnCode: "",
        page: 1,
        onBlurResetsInput: false,
        accountId: "",
        isAccountSelectNumeric: true,
        accountSearchable: true,
        bankSearchable: true,
        validateCount: 0,
        AccountValidateCount: 0,
        nameEnquiryError: false,
        transferAccounts: [],
        isloadingTransferAccounts: false,
        hasRequestedTransferAccounts: false,
        isDropdownAccount: false,
        isMobile: false,
        savedSelectClassName: ' ',
        loading: false,

        account: '',
        wallet: [],
        phoneNumber: '',
        serviceOptions: [
            {label: "GOTV", value: 'GOTV'},
            {label: "DSTV", value: 'DSTV'},
        ],
        serviceType: '',
        plan: '',
        walletTypeOptions: [
            {label: `Loans Wallet (Balance - N${formatAmount(this.props.wallet)})`, code: 'W001', value: 'Loans Wallet'},
            {label: `Savings Wallet (Balance - N${formatAmount(this.props.savingsWallet)})`, code: 'W002', value: 'Savings Wallet'},
            {label: `Agent Wallet (Balance - N${formatAmount(this.props.agentWallet)})`, code: 'W0A1', value: 'Agent Wallet'},
        ],
        walletType: '',
        code: '',
        bouquets: [],
        bouquet: '',
        decoderName: '',

    }

    componentDidMount() {

    }

    componentWillReceiveProps() {
        if (!this.props.isFocused) {

        }
    }


    onSubmit = () => {
        if (this.validatePageTwo()) return;
        let data = {

            "username": this.props.auth.username,
            "wallet_type": this.state.walletType.code,
            "top_up_phone_no": this.state.phoneNumber,
            "top_up_amount": parseFloat(this.state.amount),
            "service_type": this.state.serviceType.value,
            'account': this.state.account,
            'product_code': this.state.bouquet.product_code,
            'code': this.state.code
        }

        this.setState({
            loading: true
        }, () => {
            apiRequest(postBuyMultichoice, 'post', data).then(res => {
                // alert("User details updated successfully")
                this.setState({
                    loading: false
                })

                console.log(res)
                if(res.Status === 'error'){
                    this.props.showToast(res.Message, 'error', 6000);
                }else{
                    this.props.navigation.navigate('SuccessPage', {
                        buttonText: 'Go To Home',
                        title: 'Multichoice Purchase successful!',
                        description: `${data.account} has been topped up`,
                        close: () => {
                            this.props.navigation.navigate('Home')
                        },
                        redirect: () => {
                            this.props.navigation.navigate('Home')
                        }
                    })
                }

                // goBack()

            })
                .catch(err => {
                    console.log(err.response)
                    console.log(err.data)
                    this.setState({
                        loading: false
                    })
                    this.props.showToast('Purchase could not be completed', 'error', 3000);
                });
        })

    }


    onNameChange = (text) => {
        this.setState({
            beneficiaryAccountName: text,
            nameEnquiryError: false,
            beneficiaryName_error: ''
        })
    }

    goToNextPage = () => {
        if (this.validatePageOne()) return;

        this.setState({
            loading: true
        }, () => {
            apiRequest(getValidateMultichoiceAccount(this.state.account, this.state.serviceType.value), 'get').then(res => {
                // alert("User details updated successfully")

                if (res.Status === 'success') {
                    let bouquets = res.Data.bouquets.map(bouquet => {
                        return {
                            ...bouquet,
                            label: bouquet.name
                        }
                    })
                    console.log(bouquets)
                    this.setState({
                        loading: false,
                        page: 2,
                        code: res.Data.productCode,
                        bouquets: bouquets,
                        decoderName: res.Data.name
                    })
                } else {
                    this.setState({
                        loading: false,
                    })
                    this.props.showToast('IUC number validation not successful', 'error', 3000);

                }
                console.log(res)

                // goBack()

            })
                .catch(err => {
                    console.log(err.response)
                    console.log(err.data)
                    this.setState({
                        loading: false
                    })
                    this.props.showToast('IUC number validation not successful', 'error', 3000);
                });
        })
    }
    goBack = () => {
        if (this.state.page === 1) {
            this.props.navigation.navigate('Home')
        } else {
            this.setState({
                page: 1
            })
        }
    }

    validatePageOne = () => {

        let error = false;

        if (this.state.walletType === '') {
            this.setState({
                walletTypeError: "Please select a wallet type",
            })
            error = true;
        }
        if (this.state.account === '') {
            this.setState({
                accountError: "Please enter a valid number",
            })
            error = true;
        }
        if (this.state.serviceType === '') {
            this.setState({
                serviceTypeError: "Please select a Multichoice Service",
            })
            error = true;
        }
        return error
    }
    validatePageTwo = () => {

        let error = false;

        if (Number(this.state.amount) === 0) {
            this.setState({
                amount_error: "Please enter an amount",
            })
            error = true;
        }
        if (this.state.phoneNumber === '') {
            this.setState({
                phoneNumberError: "Please enter a phone number",
            })
            error = true;
        }
        if (this.state.bouquet === '') {
            this.setState({
                bouquetError: "Please select a network",
            })
            error = true;
        }
        return error
    }


    render() {
        let fetchingDataPlans = this.props.fetchingDataPlans || false

        return (
            <View style={{flex: 1, backgroundColor: '#fff'}}>
                <Header title={"Pay MultiChoice Bills"} leftIcon={"ios-arrow-back"}
                        onPressLeftIcon={() => this.goBack()}/>
                <LoaderText visible={this.state.loading} desciption={'Processing...'}/>
                <LoaderText visible={fetchingDataPlans} desciption={'Fetching Data Plan Options'}/>
                <KeyboardAwareScrollView
                    resetScrollToCoords={{x: 0, y: 0}}
                    contentContainerStyle={styles.container}
                    scrollEnabled={true}
                    keyboardShouldPersistTaps={'always'}
                    enableOnAndroid={true}
                    alwaysBounceVertical={false}
                >
                    <View style={{marginTop: 0, padding: scale(20), width: '100%', marginBottom: scale(30)}}>

                        {this.state.page === 1 && (
                            <SlideOutView>
                                <View>
                                    <View>
                                        <Text style={styles.label}>Choose a Wallet</Text>
                                        <SelectPopup
                                            options={this.state.walletTypeOptions || []}
                                            title={'Select a Wallet type'}
                                            value={this.state.walletType ? this.state.walletType : {label: ''}}
                                            textStyle={{
                                                color: '#484848',
                                                fontFamily: 'graphik-regular',
                                                marginRight: scale(3),
                                                fontSize: scale(14)
                                            }}
                                            dropdownImageStyle={{
                                                paddingRight: scale(7)
                                            }}
                                            style={styles.pickerInput}
                                            onChange={(item) => {
                                                this.setState({walletType: item, walletTypeError: ''})
                                            }}
                                        />
                                        {
                                            !!this.state.walletTypeError && (
                                                <Text style={styles.error}>{this.state.walletTypeError}</Text>
                                            )
                                        }
                                    </View>
                                    <View>
                                        <Text style={styles.label}>Select Cable Provider</Text>
                                        <SelectPopup
                                            options={this.state.serviceOptions || []}
                                            title={'Select a Cable Provider'}
                                            value={this.state.serviceType ? this.state.serviceType : {label: ''}}
                                            textStyle={{
                                                color: '#484848',
                                                fontFamily: 'graphik-regular',
                                                marginRight: scale(3),
                                                fontSize: scale(14)
                                            }}
                                            dropdownImageStyle={{
                                                paddingRight: scale(7)
                                            }}
                                            style={styles.pickerInput}
                                            onChange={(item) => {
                                                this.setState({serviceType: item, serviceTypeError: ''})
                                            }}
                                        />
                                        {
                                            !!this.state.serviceTypeError && (
                                                <Text style={styles.error}>{this.state.serviceTypeError}</Text>
                                            )
                                        }
                                    </View>

                                    <View>
                                        <Text style={styles.label}>Enter IUC number (Customer ID)</Text>
                                        <TextInput
                                            underlineColorAndroid={'transparent'}
                                            style={[styles.textInput]}
                                            keyboardType={'numeric'}
                                            onChangeText={(text) => this.setState({
                                                account: text,
                                                accountError: ''
                                            })}
                                            value={this.state.account}
                                            multiline={false}
                                            maxLength={13}
                                            placeholder={"Enter IUC number"}
                                        />
                                        {
                                            !!this.state.accountError && (
                                                <Text style={styles.error}>{this.state.accountError}</Text>
                                            )
                                        }
                                    </View>
                                </View>
                            </SlideOutView>
                        )}

                        {this.state.page === 2 && (
                            <SlideInView>
                                <View>
                                    {!!this.state.decoderName && (
                                        <View>
                                            <Text style={[styles.label, {}]}>Multichoice Name</Text>
                                            <Text
                                                style={[styles.label, {fontFamily: 'AvenirLTStd-Heavy'}]}>{this.state.decoderName}</Text>
                                        </View>
                                    )}

                                    <View>
                                        <Text style={styles.label}>Choose Bouquet</Text>
                                        <SelectPopup
                                            options={this.state.bouquets || []}
                                            title={'Select a Bouquet'}
                                            value={this.state.bouquet ? this.state.bouquet : {label: ''}}
                                            textStyle={{
                                                color: '#484848',
                                                fontFamily: 'graphik-regular',
                                                marginRight: scale(3),
                                                fontSize: scale(14)
                                            }}
                                            dropdownImageStyle={{
                                                paddingRight: scale(7)
                                            }}
                                            style={styles.pickerInput}
                                            onChange={(item) => {
                                                this.setState({bouquet: item, bouquetError: '', amount: item.amount})
                                            }}
                                        />
                                        {
                                            !!this.state.bouquetError && (
                                                <Text style={styles.error}>{this.state.bouquetError}</Text>
                                            )
                                        }
                                    </View>
                                    <View style={{paddingBottom: scale(25)}}>
                                        <Text style={styles.label}>Select Amount</Text>
                                        <View style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            width: '100%',
                                            paddingBottom: 15
                                        }}>
                                            <TextInput
                                                underlineColorAndroid={'transparent'}
                                                // placeholder={'Email Address'}
                                                style={[styles.amountInput, {textAlign: 'left'}]}
                                                keyboardType={'numeric'}
                                                onChangeText={text => this.setState({amount: text, amount_error: ''})}
                                                value={this.state.amount}
                                                multiline={false}
                                                editable={false}
                                                ref={ref => (this.amountInput = ref)}
                                                // onBlur={this.formatAmount}
                                                // placeholder={"Enter an amount"}
                                            />
                                            {
                                                !!this.state.amount_error && (
                                                    <Text
                                                        style={[styles.error, {bottom: 0}]}>{this.state.amount_error}</Text>
                                                )
                                            }
                                        </View>

                                    </View>
                                    <View>
                                        <Text style={styles.label}>Enter phone number</Text>
                                        <TextInput
                                            underlineColorAndroid={'transparent'}
                                            style={[styles.textInput]}
                                            keyboardType={'numeric'}
                                            onChangeText={(text) => this.setState({
                                                phoneNumber: text,
                                                phoneNumberError: ''
                                            })}
                                            value={this.state.phoneNumber}
                                            multiline={false}
                                            maxLength={13}
                                            placeholder={"Enter phone number"}
                                        />
                                        {
                                            !!this.state.phoneNumberError && (
                                                <Text style={styles.error}>{this.state.phoneNumberError}</Text>
                                            )
                                        }
                                    </View>
                                </View>
                            </SlideInView>
                        )}


                        <View>

                            {this.state.page === 1 && (
                                <ButtonWithBackgroundBottom
                                    disabled={this.state.loading}
                                    onPress={this.goToNextPage}
                                    style={{
                                        borderRadius: scale(5),
                                        marginTop: scale(10)
                                    }}

                                >
                                    {(!!this.state.loading) && (
                                        <ActivityIndicator size="large" color="#fff"/>)}
                                    {(!this.state.loading) && (
                                        <ButtonWithBackgroundText>{'Next'}</ButtonWithBackgroundText>)}
                                </ButtonWithBackgroundBottom>
                            )}
                            {this.state.page === 2 && (
                                <ButtonWithBackgroundBottom
                                    disabled={this.state.loading}
                                    onPress={this.onSubmit}
                                    style={{
                                        borderRadius: scale(5),
                                        marginTop: scale(10)
                                    }}

                                >
                                    {(!!this.state.loading) && (
                                        <ActivityIndicator size="large" color="#fff"/>)}
                                    {(!this.state.loading) && (
                                        <ButtonWithBackgroundText>{'Pay'}</ButtonWithBackgroundText>)}
                                </ButtonWithBackgroundBottom>
                            )}


                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </View>
        )

    }

    minusAmount = () => {
        this.amountInput.focus();
        if (this.state.loading) return
        if (this.state.amount > 100) {
            this.setState({
                amount_error: '',
                amount: String(Number(this.state.amount) - 50)
            })
        }
    }
    addAmount = () => {
        this.amountInput.focus();
        if (this.state.loading) return;
        if (Number(this.state.amount) || this.state.amount === "0") {
            this.setState({
                amount_error: '',
                amount: String(Number(this.state.amount) + 50)
            })
        }
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        auth: state.authentication,
        transferBanks: state.wallet.banks,
        dataPlans: state.bills.dataPlans || {},
        bills: state.bills,
        fetchingDataPlans: state.bills.fetchingDataPlans,
        wallet: state.home.wallet || 0,
        savingsWallet: state.home.savingsWallet || 0,
        agentWallet: state.home.agentWallet || 0,
    };
};
const mapDispatchToProps = {
    showToast,
    fetchDataPlanOptions
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withNavigationFocus(BuyAirtime));

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        // flexGrow: 1
    },
    amountControl: {
        backgroundColor: '#EFF2F7',
        width: scale(30),
        height: scale(30),
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center'
    },
    amountInput: {
        fontSize: scale(32),
        color: '#00425F',
        fontFamily: 'AvenirLTStd-Heavy',
        borderRadius: scale(5),
        paddingLeft: scale(10),
        paddingRight: scale(10),
        flex: 1,
        textAlign: 'center',
        letterSpacing: scale(-0.6),
        // backgroundColor: '#e5eef5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textInput: {
        borderColor: '#efefef',
        borderWidth: 1,
        height: scale(48),
        fontSize: scale(14),
        width: '100%',
        marginBottom: scale(20),
        color: 'rgba(0, 0, 0, 0.699999988079071)',
        fontFamily: 'graphik-regular',
        borderRadius: scale(5),
        paddingLeft: scale(10),
        paddingRight: scale(10),
        backgroundColor: '#EFF2F7',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pickerInput: {
        borderColor: '#efefef',
        height: scale(48),
        width: '100%',
        marginBottom: scale(20),
        color: 'rgba(0, 0, 0, 0.699999988079071)',
        fontFamily: 'graphik-regular',
        fontSize: scale(14),
        borderRadius: scale(5),
        paddingLeft: scale(10),
        backgroundColor: '#EFF2F7',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0,
        borderBottomColor: '#efefef',
    },
    label: {
        fontSize: scale(12),
        color: 'rgba(0, 66, 95, 0.800000011920929)',
        fontFamily: 'graphik-regular',
        marginBottom: scale(7),
        letterSpacing: scale(-0.3)
    },
    topUpEcash: {
        backgroundColor: '#fff',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: scale(5),
        borderColor: '#0275d8',
        borderWidth: 1,
        marginBottom: scale(20),

    },
    buttonText: {
        fontFamily: 'graphik-medium',
        color: '#0275d8',
        fontSize: scale(18),

    },
    headerText: {
        fontSize: scale(22),
        fontFamily: 'graphik-medium'
    },
    verifyButton: {
        backgroundColor: '#0275d8',
        height: scale(50),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5
    },
    error: {
        fontSize: scale(10),
        color: '#ff3726',
        bottom: scale(3),
        position: 'absolute',
        fontFamily: 'graphik-regular',
        right: 0
    }
});

