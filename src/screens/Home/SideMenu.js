import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    AsyncStorage,
    Linking,
    Image as ReactNativeImage, ImageBackground
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppLink from 'react-native-app-link';

import { scale } from "../../lib/utils/scaleUtils";
import { connect } from "react-redux";
import NavigationService from '../../../NavigationService';
import { logoutUserSuccess } from "../Auth/action/auth_actions";
// import AccountSvg from '../../../assets/svgs/account'
import TouchItem from "../../components/TouchItem/_TouchItem";
import { Colors } from '../../lib/constants/Colors'
import { changeUserType } from "./action/home_actions";
import AnimatedLoader from "react-native-animated-loader";
import { Image } from "react-native-expo-image-cache";
import { LinearGradient } from "expo-linear-gradient";

const preview = {uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        // backgroundColor: '#EFF2F7'
        backgroundColor: Colors.deepBlue
    },
    separator: {
        width: '100%',
        height: scale(1),
        backgroundColor: '#ededed',
        marginVertical: scale(20)
    },
    version: {
        fontSize: scale(9),
        textAlign: 'center',
        letterSpacing: -0.23,
        color: '#fff',
        marginTop: scale(11),
    },
    topBar: {
        width: '100%',
        height: scale(100),
        backgroundColor: 'transparent',
        // paddingBottom: scale(16),
        paddingLeft: scale(40),
        paddingRight: scale(10),
        marginBottom: scale(30),
        borderBottomColor: Colors.secondaryColor,
        borderBottomWidth: scale(1)
    },
    avatar:{
        height: 70, width: 70, borderRadius: 35, marginRight: scale(10),
        borderColor: Colors.secondaryColor,
        borderWidth: scale(1)
    },
    name: {
        fontFamily: 'AvenirLTStd-Light',
        fontSize: scale(18),
        color: Colors.secondaryColor,
        marginBottom: scale(3),
        maxWidth: scale(120)
    },
    email: {
        fontFamily: 'graphik-regular',
        fontSize: scale(14),
        color: 'white',
        maxWidth: scale(120)
    },
    itemContainer: {
        // marginLeft: scale(40),
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: scale(45),
        // borderBottomColor: '#00425f33',
        // borderBottomWidth: 1,
        paddingLeft: scale(40)
    },
    optionText: {
        // color:'rgba(0, 0, 0, 0.8700000047683716)',
        color: Colors.white,
        fontFamily: 'graphik-regular',
        fontSize: scale(18),
        marginTop: scale(5)
        // marginLeft: scale(20)
    },
    signout: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        paddingLeft: scale(40),
        paddingBottom: scale(40),
        // flexDirection:'row',

    },
    sideBarIcon: {
        width: scale(30),
        marginRight: scale(6)
    }
});

const menu = [
    {
        name: "Dashboard",
        id: 1,
        urlName: "Dashboard",
        icon: <ReactNativeImage
            style={styles.sideBarIcon}
            //{/*{...{preview, ...background}}*/}
            source={require('../../../assets/images/SideMenu/dashboard-icon.png')}
            resizeMode={"contain"}
        />
    },
    {
        name: "Loan Market",
        id: 1,
        urlName: "Market",
        icon: <ReactNativeImage
            style={styles.sideBarIcon}
            //{/*{...{preview, ...background}}*/}
            source={require('../../../assets/images/SideMenu/market-icon.png')}
            resizeMode={"contain"}
        />
    },
    {
        name: "Portfolio",
        id: 3,
        urlName: "Portfolio",
        icon: <ReactNativeImage
            style={styles.sideBarIcon}
            //{/*{...{preview, ...background}}*/}
            source={require('../../../assets/images/SideMenu/briefcase-icon.png')}
            resizeMode={"contain"}
        />
    },
    {
        name: "More",
        id: 4,
        urlName: "More",
        icon: <ReactNativeImage
            style={styles.sideBarIcon}
            //{/*{...{preview, ...background}}*/}
            source={require('../../../assets/images/SideMenu/settings-icon.png')}
            resizeMode={"contain"}
        />
    },
    {
        name: "Logout",
        id: 5,
        urlName: "Logout",
        icon: <ReactNativeImage
            style={styles.sideBarIcon}
            //{/*{...{preview, ...background}}*/}
            source={require('../../../assets/images/SideMenu/logout-icon.png')}
            resizeMode={"contain"}
        />
    },
]

class SideMenu extends React.Component {

    constructor(props) {
        super(props);

        let appMenu = [...menu]

        this.state = {
            menuOptions: appMenu,
            switching: false
        }

    }


    componentDidUpdate(prevProps) {
        // if (prevProps.home.userType !== this.props.home.userType) {
        //     this.refreshSideBar()
        // }
    }

    goToScreen = (urlName) => {
        this.props.navigation.closeDrawer();
        if (urlName === 'Logout') {
            this._signOutAsync();
            return
        }
        NavigationService.navigate(urlName)
    }

    goToSettings = () => {
        this.props.navigation.closeDrawer();
        NavigationService.navigate('MyAccount');
    }


    render() {
        let {username, email} = this.props.auth;
        return (
            <LinearGradient
                style={styles.container}
                colors={['#3F3F97', '#20204C']}
                // start={[0.01, 0.01]}
                // locations={[0.0, 0.2]}
            >
                <TouchItem style={styles.topBar} onPress={() => {
                    // this.goToSettings();
                }}>
                    <ImageBackground
                        source={require('../../../assets/images/Home/fund-colony-header.png')}
                        style={{
                            width: '100%', height: '100%', alignItems: 'center',
                            flexDirection: 'row',
                        }}>
                        <Image style={styles.avatar} {...{
                            preview,
                            uri: this.props.auth.avatar
                        }} />

                        <View>
                            <Text style={styles.name} numberOfLines={1}>Bayo</Text>
                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                <Text style={styles.email} numberOfLines={1}>{email}</Text>
                            </View>
                        </View>
                    </ImageBackground>
                </TouchItem>
                <View>
                    {this.state.menuOptions.map(item => (
                        <View style={styles.itemContainer} key={item.id}>
                            <TouchableOpacity onPress={() => this.goToScreen(item.urlName)}>
                                <View style={styles.listItem}>
                                    {item.icon ? item.icon : <View/>}
                                    <Text style={styles.optionText}>{item.name}</Text>
                                    {/*<Ionicons*/}
                                    {/*name="ios-arrow-forward"*/}
                                    {/*size={25}*/}
                                    {/*style={styles.itemArrow}*/}
                                    {/*color="rgba(0, 0, 0, 0.25)"*/}
                                    {/*/>*/}
                                </View>
                                {item.id === 7 && (<View style={styles.separator}/>)}
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
                <View style={styles.signout}>
                    <Text style={[styles.optionText]}>FundColony 2019</Text>
                </View>
            </LinearGradient>
        );
    }

    _signOutAsync = async () => {
        this.props.logoutUserSuccess();
        AsyncStorage.removeItem('access_token');
        NavigationService.navigate('Login');
    };

}

const mapStateToProps = (state, ownProps) => {
    return {
        auth: state.authentication,
        home: state.home
    };
};

const mapDispatchToProps = {logoutUserSuccess, changeUserType};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SideMenu);
