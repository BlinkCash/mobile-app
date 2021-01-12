import React, { Component } from "react";
import { connect } from 'react-redux'
// import { getBank } from './_duck/actions'
import { scale } from "../../lib/utils/scaleUtils";

import LoadingModal from '../../components/loadingModal';
import {
    StyleSheet,
    Text,
    View, Image, StatusBar, TouchableOpacity, ScrollView, Dimensions, AsyncStorage, Platform,
    Linking
} from 'react-native';
import Header from "../../components/Header/OtherHeader";
import { Colors } from "../../lib/constants/Colors";
import TouchItem from "../../components/TouchItem/_TouchItem";
import NavigationService from "../../../NavigationService";
import { logoutUserSuccess } from "../Auth/action/auth_actions";
import AppLink from 'react-native-app-link';
import { getTheWhatsappNumber } from "./action/account_actions";
import * as WebBrowser from 'expo-web-browser'
import Constants from 'expo-constants';


const windowH = Dimensions.get('screen').height


class Settings extends Component {

    constructor(props) {

        super(props);

        this.state = {
            settings: [
                {
                    title: 'Banks and Cards',
                    urlName: 'BankCards',
                    index: 1
                },
                {
                    title: 'Login & Security',
                    urlName: 'LoginSettings',
                    index: 2
                },
                {
                    title: 'Chat support',
                    urlName: 'support',
                    index: 3
                },
                {
                    title: 'Terms & Privacy',
                    urlName: 'TermsAndConditions',
                    index: 4
                },
                {
                    title: 'FAQ',
                    urlName: 'faq',
                    index: 6
                },
                {
                    title: 'Log out',
                    urlName: 'Logout',
                    index: 5
                }
            ]
        };

    }


    componentDidMount() {


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

    openTerms = async () => {
        await WebBrowser.openBrowserAsync('https://www.blinkcash.ng/terms.html#privacy');
    };

    goToPage = (urlName) => {
        if (urlName === 'Logout') {
            this._signOutAsync();
            return
        }

        if (urlName === 'TermsAndConditions') {
            this.openTerms()
            return
        }

        if (urlName === 'support') {
            this.props.getTheWhatsappNumber();
            this._handleOpenWhatsapp();
            return
        }
        if (urlName === 'faq') {
            Linking.openURL('https://blinkcash.ng/faqs.html')
            return;
        }
        this.props.navigation.navigate(urlName)
    }

    _handleOpenWhatsapp = () => {
        // Linking.openURL('whatsapp://send?text=hello%20world');
        // AppLink.maybeOpenURL('whatsapp://send?text=hello%20world', {appName:'whatsapp', appStoreId:'310633997', appStoreLocale:'us', playStoreId:'com.whatsapp'})
        let whatsappNumber = this.props.whatsapp_number || '+2348163047983';
        AppLink.maybeOpenURL(`http://api.whatsapp.com/send?phone=${whatsappNumber}`, {
            appName: 'whatsapp',
            appStoreId: '310633997',
            appStoreLocale: 'us',
            playStoreId: 'com.whatsapp'
        })
            .then(() => {
                // do stuff
            })
            .catch((err) => {
                // handle error
            });
    }

    _signOutAsync = () => {
        this.props.logoutUserSuccess();
        AsyncStorage.removeItem('access_token');
        NavigationService.navigate('Login');
    };

    render() {
        console.log(this.props.auth)

        let {photo_url, first_name, last_name, email, bvn, phone} = this.props.auth
        return (

            <ScrollView style={styles.container}>

                <LoadingModal isModalVisible={this.state.isModalVisible}/>
                {/*<StatusBar*/}
                {/*backgroundColor="#234d82"*/}
                {/*barStyle="light-content"*/}
                {/*/>*/}


                <Header title={"Settings"} leftIcon={"ios-arrow-back"}
                        onPressLeftIcon={() => this.props.navigation.navigate('Home')}/>
                <TouchItem style={styles.topHeader} onPress={() => this.props.navigation.navigate('ChoosePicture')}>
                    {!photo_url && (
                        <View style={{
                            width: scale(88),
                            height: scale(88),
                            borderRadius: scale(44),
                            backgroundColor: Colors.tintColor,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Image
                                style={{
                                    // height: scale(30),
                                    width: scale(29),
                                }}
                                resizeMode={'contain'}
                                source={require('../../../assets/images/Home/user.png')}
                            />
                        </View>
                    )}


                    {!!photo_url && (

                        <Image
                            style={{
                                height: scale(88),
                                width: scale(88),
                                borderRadius: scale(44),
                                backgroundColor: Colors.tintColor,
                            }}
                            resizeMode={'cover'}
                            source={{uri: photo_url}}
                        />
                    )}

                    <Text style={styles.tapToChange}>Tap to change</Text>
                    <Text
                        style={styles.name}>{first_name.charAt(0).toUpperCase() + first_name.substring(1).toLowerCase()} {last_name.charAt(0).toUpperCase() + last_name.substring(1).toLowerCase()}</Text>
                    <Text style={styles.email}>{email}</Text>


                </TouchItem>

                <View style={{
                    width: '100%',
                    paddingHorizontal: scale(16),
                    paddingTop: scale(24)
                }}>
                    <View style={[
                        styles.roundCard,
                        {
                            padding: scale(16)
                        }
                    ]}>
                        <Text style={styles.title}>Profile Info</Text>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <View>
                                <Text style={styles.innerTitle}>Phone number</Text>
                                <Text style={styles.innerValue}>{phone}</Text>
                            </View>
                            <View>
                                <Text style={styles.innerTitle}>BVN</Text>
                                <Text style={styles.innerValue}>{bvn}</Text>
                            </View>
                        </View>
                    </View>
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
                </View>


                {/* <Text style={[styles.innerValue,{width:'100%', marginVertical:scale(10), textAlign:'center', marginBottom:scale(20)}]}>v{Constants.manifest.version}</Text> */}
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
    whatsapp_number: state.account.whatsapp_number || '',
    // banks: state.profileReducer.bank.data
})

const mapDispatchToProps = {
    logoutUserSuccess,
    getTheWhatsappNumber
}


export default connect(mapStateToProps, mapDispatchToProps)(Settings)
