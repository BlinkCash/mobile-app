import React, { Component } from "react";
import { connect } from 'react-redux'

import LoadingModal from '../../components/loadingModal';
import {
    StyleSheet,
    Text,
    View, Image, StatusBar, TouchableOpacity, ScrollView, Dimensions
} from 'react-native';
import { scale } from "../../lib/utils/scaleUtils";
import { Colors } from "../../lib/constants/Colors";
import Header from "../../components/Header/OtherHeader";
import * as WebBrowser from 'expo-web-browser';
import * as Icon from "@expo/vector-icons";


const windowH = Dimensions.get('screen').height


class Settings extends Component {

    constructor(props) {

        super(props);

        this.state = {};

    }


    _handleOpenLink = async (url) => {
        let result = await WebBrowser.openBrowserAsync(url);
        this.setState({ result });
    };

    componentDidMount() {


    }


    render() {
        return (

            <ScrollView style={styles.container}>

                <LoadingModal isModalVisible={this.state.isModalVisible}/>
                <Header title={"Support"} leftIcon={"md-arrow-back"}
                        onPressLeftIcon={() => this.props.navigation.navigate('Home')}/>

                <TouchableOpacity style={styles.links}
                                  onPress={() => this._handleOpenLink('https://quickcredit.com.ng/p.php')}>
                    <View style={{flexDirection: 'row', backgroundColor: '#fff', alignItems:'center'}}>
                        <Image
                            style={{
                                height: scale(30),
                                width: scale(30),
                                marginRight: scale(30)
                            }}
                            source={require('../../../assets/images/icons/privacy-policy.png')}
                        />
                        <View style={{width: windowH * 0.28}}>
                            <Text style={styles.navText}>Privacy Policy</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.links}
                                  onPress={() => this._handleOpenLink('https://quickcredit.com.ng/t.php')}>
                    <View style={{flexDirection: 'row', backgroundColor: '#fff', alignItems:'center'}}>
                        <Image
                            style={{
                                height: scale(30),
                                width: scale(30),
                                marginRight: scale(30)
                            }}
                            source={require('../../../assets/images/icons/terms-and-conditions.png')}
                        />
                        <View style={{width: windowH * 0.28}}>
                            <Text style={styles.navText}>Terms & Conditions</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.links,{marginTop:scale(20)}]}
                                  onPress={() => this.props.navigation.navigate('ChangePin', {navigation: this.props.navigation})}>
                    <View style={{flexDirection: 'row', backgroundColor: '#fff',alignItems:'center'}}>

                        <Icon.Ionicons
                            name="md-keypad"
                            size={scale(25)}
                            style={{
                                marginRight:scale(30),
                                marginLeft: scale(10)
                            }}
                            color={Colors.darkBlue}
                        />
                        <View style={{flexGrow: 1}}>
                            <Text style={styles.navText}>Change Pin</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                <View style={{marginBottom: 20}}></View>


                {/* </View> */}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    profileAlert: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: scale(20),
        marginVertical: scale(20),
        // alignItems: 'center',
    },
    profile: {
        flexDirection: 'row',

    },
    imgView: {
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20
    },
    profileText: {
        flex: 3,
        justifyContent: "center",
        flexDirection: 'column'
    },
    name: {
        fontSize: 20,
        paddingBottom: 5,
        textAlign: 'left',
        color: 'white'

    },
    title: {
        color: Colors.white,
        fontFamily: 'graphik-medium',
        fontSize: scale(14)
    },
    topLinks: {
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#10c341'
    },
    links: {
        backgroundColor: '#fff',
        padding: 10,
        justifyContent: 'center',
        marginTop: 10
    },
    warning: {
        backgroundColor: 'orange',
        padding: 20,
        fontFamily: 'graphik-medium',
        color: Colors.white,
        textAlign: "center",
        flexDirection: 'row'
    },
    initials: {
        color: Colors.greyText,
        fontFamily: 'graphik-medium',
        fontSize: scale(18),
    },
    profilePicture: {
        backgroundColor: 'white',
        height: scale(40),
        width: scale(40),
        borderRadius: scale(20),
        alignItems: 'center',
        justifyContent: 'center'
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
        fontFamily: 'graphik-medium',
        marginTop: 10
    },
    text: {
        fontSize: 18,
        textAlign: 'left',
        flexWrap: 'wrap'
    },
    topHeader: {
        // backgroundColor: '#055DA2',
        height: scale(60),
        paddingHorizontal: scale(15),
        // flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    navText: {
        fontSize: scale(18),
        textAlign: 'left',
        flexWrap: 'wrap',
        fontFamily: 'AvenirLTStd-Light',
        marginTop: scale(10)
    },


});

const mapStateToProps = state => ({
    user: state.authentication
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
