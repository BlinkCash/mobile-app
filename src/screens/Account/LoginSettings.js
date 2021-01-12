import React, { Component } from "react";
import { connect } from 'react-redux'
// import { getBank } from './_duck/actions'
import { scale } from "../../lib/utils/scaleUtils";

import LoadingModal from '../../components/loadingModal';
import {
    StyleSheet,
    Text,
    View, Image, Switch, TouchableOpacity, ScrollView, Dimensions, AsyncStorage, Keyboard, Platform
} from 'react-native';
import Header from "../../components/Header/OtherHeader";
import { Colors } from "../../lib/constants/Colors";
import TouchItem from "../../components/TouchItem/_TouchItem";
import NavigationService from "../../../NavigationService";
import { logoutUserSuccess } from "../Auth/action/auth_actions";
import { axiosInstance } from "../../lib/api/axiosClient";
import { postAuthInit, postChangePassword, postPinResetOtp } from "../../lib/api/url";
import { LoaderText } from "../../components/Loader/Loader";
import { apiRequest } from "../../lib/api/api";
import { updateUserData } from "../Auth/action/auth_actions";
import SwitchToggle from '@dooboo-ui/native-switch-toggle';


const windowH = Dimensions.get('screen').height


class Settings extends Component {

    constructor(props) {

        super(props);

        this.state = {
            loading: false,
            settings: [
                {
                    title: 'Change Password',
                    urlName: 'ChangePassword',
                    index: 1
                },
                {
                    title: 'Change Authorization PIN',
                    urlName: 'ChangePIN',
                    index: 2
                },
                {
                    title: 'Forgot Authorization PIN?',
                    urlName: 'ForgotAuthPIN',
                    index: 3
                },
            ]
        };

    }


    componentDidMount() {


    }


    goToPage = (urlName) => {
        if (urlName === 'Logout') {
            this._signOutAsync();
            return
        }

        if (urlName === 'ForgotAuthPIN') {
            this.onhandleForgotPassword()
        }
        this.props.navigation.navigate(urlName)
    }

    _signOutAsync = () => {
        this.props.logoutUserSuccess();
        AsyncStorage.removeItem('access_token');
        NavigationService.navigate('Login');
    };


    onhandleForgotPassword = () => {
        Keyboard.dismiss();

        this.setState({
            loading: 'Sending OTP...',
            modalLoader: true
        }, () => {
            apiRequest(postPinResetOtp, 'post')
                .then(res => {
                    console.log(res)
                    this.setState({
                        loading: false
                    }, () => {

                        if (res.status === 'success') {
                            this.props.navigation.navigate('ChangePinOtp')
                        } else {
                            this.props.showToast(res.message, 'error')
                        }
                        // this.props.showToast('Registration Complete. Please check your email for a confirmation link', 'success')
                    })
                })
                .catch(error => {
                    console.log(error.response)
                    //
                    if (error.response) {
                        this.props.showToast(error.response.data.message, 'error')
                    } else {
                        this.props.showToast(error.message, 'error')
                    }
                    this.setState({
                        loading: false
                    })
                });
        })
    };

    render() {
        console.log(this.props.auth)

        let {photo_url, first_name, last_name, email, bvn, phone} = this.props.auth
        return (

            <View style={{flex: 1}}>
                <LoaderText visible={this.state.loading} desciption={this.state.loading}/>
                <ScrollView style={styles.container} contentContainerStyle={{flex: 1}}>

                    {/*<LoadingModal isModalVisible={this.state.isModalVisible}/>*/}



                    {/*<StatusBar*/}
                    {/*backgroundColor="#234d82"*/}
                    {/*barStyle="light-content"*/}
                    {/*/>*/}


                    <Header title={"Login & Security"} leftIcon={"ios-arrow-back"}
                            onPressLeftIcon={() => this.props.navigation.goBack()}/>

                    <View style={{
                        width: '100%',
                        flex: 1,
                        paddingHorizontal: scale(16),
                        // paddingTop: scale(24)
                    }}>
                        <View style={[
                            styles.roundCard, {
                                marginVertical: scale(24)
                            }
                        ]}>


                            {
                                this.state.settings.map(item => {
                                    return <TouchItem style={styles.listItem} key={item.index}
                                                      onPress={() => this.goToPage(item.urlName)}>
                                        <Text
                                            style={[styles.innerValue, item.index === 5 ? {color: Colors.error} : {}]}>{item.title}</Text>
                                    </TouchItem>
                                })
                            }
                        </View>

                        <Text style={styles.title}>FINGERPRINT</Text>

                        <View style={[
                            styles.roundCard, {
                                marginVertical: scale(24)
                            }
                        ]}>


                            <View style={styles.secondaryListItem}>
                                <View>
                                    <Text style={styles.otherTitle}>Login with biometrics</Text>
                                    <Text style={styles.innerTitle}>This app will use the fingerprints saved on this
                                        device
                                        to log you in</Text>
                                </View>
                                <SwitchToggle
                                    containerStyle={{
                                        width: scale(44),
                                        height: scale(24),
                                        borderRadius: scale(12),
                                        backgroundColor: '#ccc',
                                        padding: scale(2),
                                    }}
                                    circleStyle={{
                                        width: scale(20),
                                        height: scale(20),
                                        borderRadius: scale(10),
                                        backgroundColor: 'white', // rgb(102,134,205)
                                    }}
                                    switchOn={this.props.auth.useLoginBiometrics}
                                    onPress={() => this.props.updateUserData({
                                        useLoginBiometrics: !this.props.auth.useLoginBiometrics
                                    })}
                                    backgroundColorOn={Colors.tintColor}
                                    backgroundColorOff={'#ECECEC'}
                                    circleColorOff="white"
                                    circleColorOn="white"
                                    duration={100}
                                />
                            </View>
                            {/*<View style={styles.secondaryListItem}>*/}
                                {/*<View>*/}
                                    {/*<Text style={styles.otherTitle}>Complete transactions with fingerprint </Text>*/}
                                    {/*<Text style={styles.innerTitle}>This app will use the fingerprints saved in this*/}
                                        {/*device*/}
                                        {/*to log you in</Text>*/}
                                {/*</View>*/}
                                {/*<View>*/}
                                    {/*<SwitchToggle*/}
                                        {/*containerStyle={{*/}
                                            {/*width: scale(44),*/}
                                            {/*height: scale(24),*/}
                                            {/*borderRadius: scale(12),*/}
                                            {/*backgroundColor: '#ccc',*/}
                                            {/*padding: scale(2),*/}
                                        {/*}}*/}
                                        {/*circleStyle={{*/}
                                            {/*width: scale(20),*/}
                                            {/*height: scale(20),*/}
                                            {/*borderRadius: scale(10),*/}
                                            {/*backgroundColor: 'white', // rgb(102,134,205)*/}
                                        {/*}}*/}
                                        {/*switchOn={this.props.auth.useFingerprintForTransactions}*/}
                                        {/*onPress={() => this.props.updateUserData({*/}
                                            {/*useFingerprintForTransactions: !this.props.auth.useFingerprintForTransactions*/}
                                        {/*})}*/}
                                        {/*backgroundColorOn={Colors.tintColor}*/}
                                        {/*backgroundColorOff={'#ECECEC'}*/}
                                        {/*circleColorOff="white"*/}
                                        {/*circleColorOn="white"*/}
                                        {/*duration={100}*/}
                                    {/*/>*/}
                                {/*</View>*/}
                            {/*</View>*/}
                        </View>
                    </View>


                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        minHeight: Dimensions.get('screen').height
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
    roundCard: {
        width: '100%',
        borderRadius: scale(6),
        borderColor: Platform.OS === 'ios' ? 'rgba(98, 149, 218, 0.15)' : 'transparent',
        borderWidth: Platform.OS === 'ios' ? scale(1) : 0,
        shadowColor: 'rgba(18, 22, 121, 0.05)',
        shadowOffset: {
            width: 0,
            height: scale(6)
        },
        shadowRadius: 10,
        shadowOpacity: 1.0,
        elevation: 1,
        backgroundColor: 'white'
    },
    tapToChange: {
        color: Colors.greyText,
        fontFamily: 'graphik-regular',
        fontSize: scale(10),
        marginTop: scale(17),
        opacity: 0.5
    },
    name: {
        color: '#000',
        fontFamily: 'graphik-regular',
        fontSize: scale(14),
        marginTop: scale(24),
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
        marginBottom: scale(8),
        maxWidth: scale(233)

    },
    innerValue: {
        color: '#193152',
        fontFamily: 'graphik-regular',
        fontSize: scale(14),
    },
    title: {
        fontSize: scale(12),
        color: Colors.greyText,
        // textAlign: 'center',
        fontFamily: "graphik-medium",
        // lineHeight: scale(32),
        opacity: 0.5,
        marginTop: scale(20)
        // marginTop: scale(24),
    },
    listItem: {
        height: scale(64),
        justifyContent: 'center',
        borderBottomWidth: scale(1),
        borderBottomColor: ' rgba(18, 22, 121, 0.07)',
        paddingHorizontal: scale(16)
    },
    secondaryListItem: {
        height: scale(100),
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        borderBottomWidth: scale(1),
        borderBottomColor: ' rgba(18, 22, 121, 0.07)',
        paddingHorizontal: scale(16)
    },
    profileText: {
        flex: 3,
        justifyContent: "center",
        flexDirection: 'column'
    },
    topLinks: {
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#10c341'
    },
    links: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        justifyContent: 'center',
        marginLeft: 20,
        marginRight: 20,
        marginTop: 10
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
    otherTitle: {
        color: Colors.greyText,
        fontFamily: 'graphik-medium',
        fontSize: scale(12),
        marginBottom: scale(10)
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
    // banks: state.profileReducer.bank.data
})

const mapDispatchToProps = {
    logoutUserSuccess,
    updateUserData
}


export default connect(mapStateToProps, mapDispatchToProps)(Settings)
