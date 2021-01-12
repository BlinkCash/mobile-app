import React, { Component } from "react";
import { connect } from 'react-redux'
// import { getBank } from './_duck/actions'

import LoadingModal from '../../components/loadingModal';
import {
    StyleSheet,
    Text,
    View, Image, StatusBar, TouchableOpacity, ScrollView, Dimensions, AsyncStorage
} from 'react-native';
import Progress from 'react-native-progress/Bar';
import * as Icon from '@expo/vector-icons'
import { scale } from "../../lib/utils/scaleUtils";
import FadeInView from "../../components/AnimatedComponents/FadeInView";
import moment from "moment";
import _TouchItem from "../../components/TouchItem/_TouchItem";
import { Colors } from "../../lib/constants/Colors";
import Header from '../../components/Header/OtherHeader';
import { getUser } from "../Home/action/home_actions";
import NavigationService from "../../../NavigationService";


import {logoutUserSuccess} from "../Auth/action/auth_actions";

const windowW = Dimensions.get('window').width


class Profile extends Component {

    constructor(props) {

        super(props);

        this.state = {
            isModalVisible: false,
            profile: 0,
            img: 0,
            employment: 0,
            bank: 0,
            completion: 0,
            show: false
        };

    }


    componentDidMount() {

        this.props.getUser();
        // this.props.getBank(this.test)


    }


    // profileCheck() {
    //     if (this.props.profile.status) {
    //         this.setState({show: false, completion: this.props.profile.completed})
    //     } else {
    //         this.setState({show: true, completion: this.props.profile.completed})
    //     }
    // }

    // componentDidUpdate(prevProps, prevState) {
    //
    //     if (prevProps.user !== this.props.user) {
    //         this.profileCheck();
    //     }
    //
    // }

    static navigationOptions = {
        header: null
    };


    _signOutAsync = async () => {
        this.props.logoutUserSuccess();
        AsyncStorage.removeItem('access_token');
        NavigationService.navigate('Login');
    };

    render() {
        let profileImage = ''
        if (this.props.user.profileImage) {
            profileImage = {uri: this.props.user.profileImage}
        }
        return (

            <ScrollView style={styles.container}>
                {/* <View style={styles.container}> */}
                <LoadingModal isModalVisible={this.state.isModalVisible}/>

                <View>
                    <Header title={"Settings ( TODO )"}
                            onPressLeftIcon={() => this.props.navigation.navigate('Home')}/>


                    <TouchableOpacity style={styles.links}
                                      onPress={() => this._signOutAsync()}>
                        <View style={{flexDirection: 'row', backgroundColor: '#fff', alignItems: 'center'}}>
                         <Text>Sign Out</Text>
                        </View>
                    </TouchableOpacity>


                    {/*{this.props.user.avatar === 'https://quickcredit.com.ng/app/assets/img/profile.png' &&*/}
                    {/*<View style={styles.warning}>*/}
                    {/*<Image*/}
                    {/*style={{width: 20, height: 20, marginRight: 20}}*/}
                    {/*source={require('../../../assets/images/icons/danger.png')}/>*/}
                    {/*<Text style={{}}>You are yet to upload a passport</Text>*/}
                    {/*</View>}*/}


                    {/*{this.props.user.completed !== 1 &&*/}
                    {/*<View style={styles.profileAlert}>*/}
                    {/*<View>*/}
                    {/*<Text style={styles.navText}>You wont be able to apply for a loan, view your history, or make any purchases until your profile is*/}
                    {/*completed.</Text>*/}
                    {/*</View>*/}
                    {/*<Text style={styles.label}>Profile Completion</Text>*/}
                    {/*<Progress progress={this.props.user.completed} color="#10c341" borderColor="#fff"*/}
                    {/*unfilledColor="#f2f2f2" borderRadius={8} height={10} width={windowW * 0.8}/>*/}
                    {/*</View>*/}
                    {/*}*/}


                    {/*<TouchableOpacity style={styles.links}*/}
                    {/*onPress={() => this.props.navigation.navigate('userDetails', {navigation: this.props.navigation})}>*/}
                    {/*<View style={{flexDirection: 'row', backgroundColor: '#fff', alignItems:'center'}}>*/}
                    {/*<Image*/}
                    {/*style={styles.img}*/}
                    {/*source={require('../../../assets/images/icons/profile.png')}*/}
                    {/*/>*/}
                    {/*<View style={{flexGrow: 1}}>*/}
                    {/*<Text style={styles.navText}>Personal Details</Text>*/}
                    {/*</View>*/}
                    {/*{this.props.user.first_name ? <Image*/}
                    {/*style={{width: 20, height: 20, marginTop: 20, marginRight: 10}}*/}
                    {/*source={require('../../../assets/images/icons/checked.png')}*/}
                    {/*/> :*/}
                    {/*<Image*/}
                    {/*style={{width: 20, height: 20, marginTop: 20, marginRight: 10}}*/}
                    {/*source={require('../../../assets/images/icons/cancel.png')}*/}
                    {/*/>}*/}
                    {/*</View>*/}
                    {/*</TouchableOpacity>*/}
                    {/*<TouchableOpacity style={styles.links}*/}
                    {/*onPress={() => this.props.navigation.navigate('employmentInfo', {navigation: this.props.navigation})}>*/}
                    {/*<View style={{flexDirection: 'row', backgroundColor: '#fff',alignItems:'center'}}>*/}
                    {/*<Image*/}
                    {/*style={styles.img}*/}
                    {/*source={require('../../../assets/images/icons/job.png')}*/}
                    {/*/>*/}
                    {/*<View style={{flexGrow: 1}}>*/}
                    {/*<Text style={styles.navText}>Employment Details</Text>*/}
                    {/*</View>*/}
                    {/*{this.props.user.name_of_company ? <Image*/}
                    {/*style={{width: 20, height: 20, marginTop: 20, marginRight: 10}}*/}
                    {/*source={require('../../../assets/images/icons/checked.png')}*/}
                    {/*/> :*/}
                    {/*<Image*/}
                    {/*style={{width: 20, height: 20, marginTop: 20, marginRight: 10}}*/}
                    {/*source={require('../../../assets/images/icons/cancel.png')}*/}
                    {/*/>}*/}
                    {/*</View>*/}
                    {/*</TouchableOpacity>*/}
                    {/*<TouchableOpacity style={styles.links}*/}
                    {/*onPress={() => this.props.navigation.navigate('bankInfo', {navigation: this.props.navigation})}>*/}
                    {/*<View style={{flexDirection: 'row', backgroundColor: '#fff',alignItems:'center'}}>*/}
                    {/*<Image*/}
                    {/*style={styles.img}*/}
                    {/*source={require('../../../assets/images/icons/bank.png')}*/}
                    {/*/>*/}
                    {/*<View style={{flexGrow: 1}}>*/}
                    {/*<Text style={styles.navText}>Bank Details</Text>*/}
                    {/*</View>*/}
                    {/*{this.props.user.card_verification_status === 'VERIFIED' ? <Image*/}
                    {/*style={{width: 20, height: 20, marginTop: 20, marginRight: 10}}*/}
                    {/*source={require('../../../assets/images/icons/checked.png')}*/}
                    {/*/> :*/}
                    {/*<Image*/}
                    {/*style={{width: 20, height: 20, marginTop: 20, marginRight: 10}}*/}
                    {/*source={require('../../../assets/images/icons/cancel.png')}*/}
                    {/*/>}*/}
                    {/*</View>*/}
                    {/*</TouchableOpacity>*/}


                </View>

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
    img: {
        width: 50,
        height: 50,
        marginRight: 10
        // alignSelf: 'center'
    },
    profileImg: {
        height: 70,
        width: 70,
        borderRadius: 35
    }

});

const mapStateToProps = state => ({
    // user: state.homeReducer.user.data,
    user: state.authentication,

    // banks: state.profileReducer.bank.data,
    // profile: state.homeReducer.profile.data,
    // profileCheck: state.homeReducer.profileCheck.data
})

const mapDispatchToProps = {
    getUser,
    logoutUserSuccess
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
