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
import { postBuyAirtime } from "../../lib/api/url";
import { apiRequest } from "../../lib/api/api";
import SelectPopup from "../../components/SelectPopUp/SelectPopUp";
import ContactsList from '../../components/ContactsList/ContactsList'


import { connect } from "react-redux";

import { showToast } from "../../components/Toast/actions/toastActions";


import { withNavigationFocus } from "react-navigation";
import Header from '../../components/Header/OtherHeader';

import { scale } from "../../lib/utils/scaleUtils";
import { LoaderText } from "../../components/Loader/Loader";
import { formatAmount } from "../../lib/utils/helpers";
import * as Permissions from 'expo-permissions';
import * as Contacts from 'expo-contacts';
import * as Icon from "@expo/vector-icons";
import TouchItem from "../../components/TouchItem/_TouchItem";
import { Colors } from "../../lib/constants/Colors";


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

        selectedAccount: '',
        wallet: [],
        phoneNumber: '',
        networkOptions: [
            {label: "MTN VTU", value: 'MTNVTU'},
            {label: "AIRTEL VTU", value: 'AIRTELVTU'},
            {label: "ETISALAT VTU", value: 'ETISALATVTU'},
            {label: "GLO VTU", value: 'GLOVTU'},
        ],
        network: '',
        walletTypeOptions: [
            {
                label: `Loans Wallet (Balance - N${formatAmount(this.props.wallet)})`,
                code: 'W001',
                value: 'Loans Wallet'
            },
            {
                label: `Savings Wallet (Balance - N${formatAmount(this.props.savingsWallet)})`,
                code: 'W002',
                value: 'Savings Wallet'
            },
            {
                label: `Agent Wallet (Balance - N${formatAmount(this.props.agentWallet)})`,
                code: 'W0A1',
                value: 'Agent Wallet'
            },
        ],
        walletType: '',
        showContacts: false,
        contacts: [],
        fetchingContacts: false
    }

    componentDidMount() {

    }

    componentWillReceiveProps() {
        if (!this.props.isFocused) {

        }
    }


    onSubmit = () => {
        if (this.validate()) return;
        let data = {

            "username": this.props.auth.username,
            "wallet_type": this.state.walletType.code,
            "top_up_phone_no": this.state.phoneNumber,
            "top_up_amount": parseFloat(this.state.amount),
            "network_provider_vtu": this.state.network.value,
        }

        console.log(data)
        this.setState({
            loading: true
        }, () => {
            apiRequest(postBuyAirtime, 'post', data).then(res => {
                // alert("User details updated successfully")
                this.setState({
                    loading: false
                })
                console.log(res)
                if (res.Status === "error") {
                    this.props.showToast(res.Message, 'error', 6000);
                } else {
                    this.props.navigation.navigate('SuccessPage', {
                        buttonText: 'Go To Home',
                        title: 'Airtime Purchase successful!',
                        description: `${data.top_up_phone_no} has been topped up`,
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
                    this.setState({
                        loading: false
                    })
                    this.props.showToast('Airtime Purchase not successful', 'error', 3000);
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


    validate = () => {

        let error = false;

        if (Number(this.state.amount) === 0) {
            this.setState({
                amount_error: "Please enter an amount",
            })
            error = true;
        }
        if (this.state.walletType === '') {
            this.setState({
                walletTypeError: "Please select a wallet type",
            })
            error = true;
        }
        if (this.state.phoneNumber === '') {
            this.setState({
                phoneNumberError: "Please enter a phone number",
            })
            error = true;
        }
        if (this.state.network === '') {
            this.setState({
                networkError: "Please select a network",
            })
            error = true;
        }
        return error
    }

    goBack = () => {
        this.props.navigation.navigate('Home')
    }

    getContacts = async () => {
        this.setState({
            fetchingContacts: true
        }, async () => {

            // Ask for permission to query contacts.
            if (this.state.contacts.length > 0) {
                this.setState({
                    showContacts: true,
                    fetchingContacts: false
                })
                return
            }
            const permission = await Permissions.askAsync(Permissions.CONTACTS);
            if (permission.status !== 'granted') {
                // Permission was denied...
                this.setState({
                    fetchingContacts: false
                })
                return;
            }
            const contacts = await Contacts.getContactsAsync({
                fields: [
                    Contacts.Fields.PhoneNumbers,
                    Contacts.Fields.Name
                ],
                // pageSize: 10,
                pageOffset: 0,
            });
            let contactsWithNumber = [];
            contacts.data.map((contact) => {
                if (contact.phoneNumbers) {
                    if (contact.phoneNumbers.length > 0) {

                        contact.phoneNumbers.map((number) => {
                            contactsWithNumber.push(
                                {
                                    label: contact.name,
                                    value: {
                                        customerId: number.number.replace(/\s/g, '')
                                    }
                                }
                            )
                        })
                    }
                }
            })
            this.setState({
                showContacts: true,
                contacts: contactsWithNumber,
                fetchingContacts: false
            })
        })

    }
    closeContacts = () => {
        this.setState({
            showContacts: false
        })
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: '#fff'}}>
                <Header title={"Buy Airtime"} leftIcon={"ios-arrow-back"}
                        onPressLeftIcon={() => this.goBack()}/>
                <LoaderText visible={this.state.loading} desciption={'Purchasing Airtime'}/>
                <KeyboardAwareScrollView
                    resetScrollToCoords={{x: 0, y: 0}}
                    contentContainerStyle={styles.container}
                    scrollEnabled={true}
                    keyboardShouldPersistTaps={'always'}
                    enableOnAndroid={true}
                    alwaysBounceVertical={false}
                >
                    <View style={{marginTop: 0, padding: scale(20), width: '100%', marginBottom: scale(30)}}>

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
                                    <Text style={styles.label}>Select Network Provider</Text>
                                    <SelectPopup
                                        options={this.state.networkOptions || []}
                                        title={'Select a transfer type'}
                                        value={this.state.network ? this.state.network : {label: ''}}
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
                                            this.setState({network: item, networkError: ''})
                                        }}
                                    />
                                    {
                                        !!this.state.networkError && (
                                            <Text style={styles.error}>{this.state.networkError}</Text>
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
                                        <TouchableOpacity onPress={() => {
                                            this.minusAmount()
                                        }} style={styles.amountControl}>
                                            <Ionicons name={"ios-remove"} size={scale(20)}
                                                      color={'#444'}/>
                                        </TouchableOpacity>
                                        <TextInput
                                            underlineColorAndroid={'transparent'}
                                            // placeholder={'Email Address'}
                                            style={styles.amountInput}
                                            keyboardType={'numeric'}
                                            onChangeText={text => this.setState({amount: text, amount_error: ''})}
                                            value={this.state.amount}
                                            multiline={false}
                                            editable={!this.state.loading}
                                            ref={ref => (this.amountInput = ref)}
                                            // onBlur={this.formatAmount}
                                            // placeholder={"Enter an amount"}
                                        />
                                        <TouchableOpacity onPress={() => {
                                            this.addAmount()
                                        }} style={styles.amountControl}>
                                            <Ionicons name={"ios-add"} size={scale(30)}
                                                      color={'#444'}/>
                                        </TouchableOpacity>
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
                                <TouchableOpacity onPress={this.getContacts}>
                                    {!!this.state.fetchingContacts && (
                                        <ActivityIndicator size={"small"} color={'#999'}/>
                                    )}
                                    {!this.state.fetchingContacts && (
                                        <View style={{flexDirection:'row', alignItems:'center'}}>

                                            <Icon.Ionicons
                                                name="ios-contacts"
                                                size={scale(25)}
                                                style={{marginRight:scale(10)}}
                                                color={Colors.blue}
                                            />
                                            <Text style={[styles.label, {fontFamily: 'graphik-medium', marginBottom:0}]}>Select from Phone
                                                Contacts</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </SlideOutView>


                        <View>

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
                                    <ButtonWithBackgroundText>{'Purchase Airtime'}</ButtonWithBackgroundText>)}
                            </ButtonWithBackgroundBottom>


                        </View>
                    </View>
                    {this.state.showContacts && (
                        <ContactsList
                            options={this.state.contacts || []}
                            value={''}
                            show={this.state.showContacts}
                            close={this.closeContacts}
                            textStyle={{
                                color: '#484848',
                                fontFamily: 'sf-medium',
                                marginRight: 3,
                                fontSize: 16
                            }}
                            title={'Contacts'}
                            style={[styles.pickerInput, {
                                width: 45,
                                borderBottomLeftRadius: 0,
                                borderTopLeftRadius: 0,
                            }]}
                            dropdownImageStyle={{
                                paddingRight: 7
                            }}
                            onChange={(obj) => {
                                console.log(obj)
                                this.setState({
                                    phoneNumber: obj.value.customerId,
                                    phoneNumberError: ''
                                })
                            }}
                        />
                    )}
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
        transfer: state.transfer,
        wallet: state.home.wallet || 0,
        savingsWallet: state.home.savingsWallet || 0,
        agentWallet: state.home.agentWallet || 0,
    };
};
const mapDispatchToProps = {
    showToast
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

