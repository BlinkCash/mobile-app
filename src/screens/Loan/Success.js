import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    AsyncStorage, Platform,
    Switch,
    Dimensions,
    KeyboardAvoidingView,
    Keyboard,
    Modal, TouchableWithoutFeedback, Image, StyleSheet
} from 'react-native';
import { connect } from 'react-redux';
import NavigationService from "../../../NavigationService";
import { FloatingLabelInput } from "../../components/Input/FloatingLabelInput";
import Header from '../../components/Header/LoansHeader';
import TouchItem from '../../components/TouchItem/_TouchItem'
import { NavigationActions, StackActions } from 'react-navigation';


import {
    ButtonWithBackgroundText,
    ButtonWithBackgroundBottom
} from '../../components/Button/Buttons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { axiosInstance } from "../../lib/api/axiosClient";
import { postLogin, postRegister, checkfull_names, postAuthInit } from "../../lib/api/url";
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { withNavigationFocus } from 'react-navigation';
import { formStyles } from "../../../assets/styles/styles";
import { HeaderText } from "../../components/HeaderText/HeaderText";
import { showToast, hideToast } from "../../components/Toast/actions/toastActions";
import { scale } from "../../lib/utils/scaleUtils";
import * as WebBrowser from "expo-web-browser";
import { Colors } from "../../lib/constants/Colors";
import { LoaderText } from "../../components/Loader/Loader";


const ACCESS_TOKEN = 'access_token';

class Login extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);

        const {navigation} = this.props;
        const email = navigation.getParam('email', this.props.auth.email);

        this.state = {
            phone: ''
        }
    }


    componentDidMount() {
    }

    goToDashboard = () => {
        const redirect = this.props.navigation.getParam('redirect', {})

        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName: redirect})],
        });

        if (redirect === 'Wallet') {
            this.props.navigation.popToTop();
            this.props.navigation.navigate(redirect);
            return
        } else if (redirect === 'Login') {
            this.props.navigation.navigate(redirect);
            return
        } else if (redirect === 'Home') {
            this.props.navigation.popToTop();
            this.props.navigation.navigate(redirect);
            return
        }
        this.props.navigation.navigate(redirect);
        this.props.navigation.popToTop();

        // this.props.navigation.dispatch(resetAction);
    }

    renderButton = () => {
        const {loading} = this.state;
        const buttonText = this.props.navigation.getParam('buttonText', {})
        const redirect = this.props.navigation.getParam('redirect', {})
        return (
            <ButtonWithBackgroundBottom
                disabled={loading}
                onPress={() => this.goToDashboard()}
                style={{width: '100%'}}

            >
                {loading && (<ActivityIndicator size="large" color="#fff"/>)}
                {!loading && (<ButtonWithBackgroundText>{buttonText}</ButtonWithBackgroundText>)}
            </ButtonWithBackgroundBottom>
        );
    };

    render() {
        const {navigate} = this.props.navigation;
        const title = this.props.navigation.getParam('title', {})
        const description = this.props.navigation.getParam('description', {})
        return (

            <View>
                <View>
                    {/*<Header onPressLeftIcon={() => this.props.navigation.goBack()}/>*/}

                    <View style={{
                        width: '100%',
                        // justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: scale(150),
                        marginBottom: scale(8),
                        paddingHorizontal: scale(20),
                    }}>
                        <Image
                            style={{width: scale(91), height: scale(60)}}
                            source={require('../../../assets/images/Loans/success.png')}
                            resizeMode={'contain'}
                        />
                    </View>
                    <View>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.subtitle}>{description}</Text>
                    </View>
                    <View style={{paddingHorizontal: scale(20)}}>
                        {this.renderButton()}
                    </View>
                </View>
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
    showToast,

    hideToast,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withNavigationFocus(Login));

const styles = StyleSheet.create({
    title: {
        fontSize: scale(24),
        color: Colors.greyText,
        textAlign: 'center',
        fontFamily: "graphik-semibold",
        lineHeight: scale(32)
        // marginTop: scale(24),
    },
    subtitle: {
        fontSize: scale(16),
        color: Colors.greyText,
        textAlign: 'center',
        marginTop: scale(10),
        fontFamily: "graphik-regular",
        lineHeight: scale(24),
        maxWidth: scale(260),
        alignSelf: 'center',
        marginBottom: scale(45)
        // marginTop: scale(24),
    },
})