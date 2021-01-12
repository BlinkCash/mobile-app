import React from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    AsyncStorage, StyleSheet, Image, Dimensions
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { connect } from "react-redux";
import {
    ButtonWithBackgroundText,
    ButtonWithBackgroundBottom
} from '../../components/Button/Buttons';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';

import { scale } from "../../lib/utils/scaleUtils";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import Header from '../../components/Header/OtherHeader';
import { axiosInstance } from "../../lib/api/axiosClient";
import { editProfile } from "../../lib/api/url";
import { apiRequest } from "../../lib/api/api";
import { updateUserData } from "../Auth/action/auth_actions";
import TouchItem from '../../components/TouchItem/_TouchItem';
import { FloatingLabelInput } from "../../components/Input/FloatingLabelInput";
import { formStyles } from "../../../assets/styles/styles";
import { Colors } from "../../lib/constants/Colors";
import BorrowerNextOfKin from './BorrowerNextOfKin';
import BorrowerLoanHistory from './BorrowerLoanHistory';
import BorrowerBioData from './BorrowerBioData';


class BorrowerProfile extends React.Component {
    static navigationOptions = {
        header: null
    };

    state = {
        modalLoader: false,
        username: this.props.auth.username,
        firstName: this.props.auth.firstName,
        lastName: this.props.auth.lastName,
        phoneNumber: this.props.auth.phoneNumber,
        password: "",
        passwordShow: false,
        index: 0,
        routes: [
            {key: 'first', title: 'Bio Data'},
            {key: 'second', title: 'Next of Kin'},
            {key: 'third', title: 'Loan History'}
        ],
    };

    componentDidMount() {

    }

    _renderScene = SceneMap({
        first: BorrowerBioData,
        second: BorrowerNextOfKin,
        third: BorrowerLoanHistory
    });


    render() {
        const {goBack} = this.props.navigation;
        const {username, password, lastName, phoneNumber, firstName} = this.state;

        let profileImage = ''
        if (this.props.auth.profileImage) {
            profileImage = {uri: this.props.auth.profileImage}
        }


        const renderTabBar = props => (
            <TabBar
                {...props}
                indicatorStyle={{
                    backgroundColor: Colors.tintColor,
                }}
                getLabelText={({route}) => {
                    return route.title
                }}
                style={{
                    backgroundColor: '#fff',
                    shadowColor: 'rgba(0, 0, 0, 0.4)',
                    shadowOffset: {
                        width: 0,
                        height: scale(2)
                    },
                    shadowRadius: 5,
                    shadowOpacity: 1.0,
                    elevation: 2,
                }}
                labelStyle={styles.label}
            />
        )

        return (
            <View style={{flex: 1}}>
                <Header title={"Borrower Profile"} leftIcon={"md-arrow-back"}
                        onPressLeftIcon={() => this.props.navigation.goBack()}/>
                <View style={styles.headerSection}>
                    <View>
                        {!!profileImage && (
                            <Image
                                style={{
                                    width: scale(58),
                                    height: scale(58),
                                    borderRadius: scale(29)
                                }}
                                //{/*{...{preview, ...background}}*/}
                                source={profileImage}
                                borderRadius={scale(79)}
                                resizeMode={"cover"}
                            />
                        )}
                        {!profileImage && (
                            <View style={styles.profilePicture}>
                            </View>
                        )}
                    </View>
                    <View style={{flex: 1, marginLeft: scale(40)}}>
                        <Text style={styles.name}>Chika</Text>
                        <View style={styles.topLine}>
                            <Text style={styles.topTitle}>Principal</Text>
                            <Text style={styles.topValue}>N1200</Text>
                        </View>
                        <View style={styles.topLine}>
                            <Text style={styles.topTitle}>Duration</Text>
                            <Text style={styles.topValue}>2 Months</Text>
                        </View>
                        <View style={styles.topLine}>
                            <Text style={styles.topTitle}>Lenders</Text>
                            <Text style={styles.topValue}>2</Text>
                        </View>
                    </View>
                </View>
                <TabView
                    navigationState={this.state}
                    renderTabBar={renderTabBar}
                    renderScene={this._renderScene}
                    onIndexChange={index => this.setState({index})}
                    initialLayout={{width: Dimensions.get('window').width}}
                />



            </View>

        );
    }

}

const mapStateToProps = (state, ownProps) => {
    return {
        auth: state.authentication
    };
};

const mapDispatchToProps = {
    updateUserData
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BorrowerProfile);

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        paddingBottom: scale(70),
        width: '100%',
        minHeight: Dimensions.get('window').height
    },
    error: {
        fontSize: scale(10),
        color: "#ff3726",
        bottom: scale(3),
        position: "absolute",
        fontFamily: 'graphik-regular',
        right: 0
    },
    topTitle: {
        color: '#fff',
        fontFamily: 'graphik-medium',
        fontSize: scale(12),
    },
    topValue: {
        color: '#fff',
        fontFamily: 'AvenirLTStd-Heavy',
        fontSize: scale(15),
    },
    topLine: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: scale(5),
        alignItems: 'center'
    },
    name: {
        fontSize: scale(20),
        color: "#fff",
        fontFamily: 'graphik-medium',
        marginBottom: scale(10)
    },

    profilePicture: {
        width: scale(58),
        height: scale(58),
        backgroundColor: '#7e7e7e',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: scale(29)
    },
    headerSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: Colors.tintColor,
        width: '100%',
        paddingTop: scale(10),
        paddingHorizontal: scale(25),
        minHeight: scale(150)
    },
    title: {
        fontFamily: 'graphik-medium',
        fontSize: scale(32),
        textAlign: 'left',
        color: '#000'
    },
    label: {
        fontSize: scale(13),
        fontFamily: 'AvenirLTStd-Heavy',
        color:Colors.tintColor
        // textTransform:'capitalize'
        // color: route.title !== routes[props.navigationState.index] ? 'rgba(255, 255, 255, 0.699999988079071)' : '#FFFFFF',
    }

});
