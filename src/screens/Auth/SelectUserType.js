import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    AsyncStorage, Image, Keyboard
} from 'react-native';

import { connect } from 'react-redux';
import {
    ButtonWithBackgroundBottom,
    ButtonWithBackgroundText

} from '../../components/Button/Buttons';
import { scale } from "../../lib/utils/scaleUtils";
import { Colors } from "../../lib/constants/Colors";
import Header from "../../components/Header/Header";
import { axiosInstance } from "../../lib/api/axiosClient";
import { postRegister } from "../../lib/api/url";
import { LoaderText } from "../../components/Loader/Loader";
import { showToast, hideToast } from "../../components/Toast/actions/toastActions";


class Welcome extends React.Component {
    static navigationOptions = {
        header: null
    };

    state = {
        modalLoader: false
    };

    onhandleRegister = (mode = 'lender') => {
        if(mode !== "lender"){
            this.props.showToast('Buyer endpoints not available', 'error')
            return
        }
        let signUpDetails = this.props.navigation.getParam('signUpDetails', '')
        Keyboard.dismiss();
        let {email, password, is_individual, name} = signUpDetails;

        // if (this.validate()) return;

        this.setState({
            loading: true,
            modalLoader: true
        }, () => {
            axiosInstance
                .post(postRegister, {
                        "name": name,
                        "email": email.toLowerCase(),
                        "password": password,
                        is_individual
                    }, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    if(res.data.status){
                        this.props.navigation.navigate('Login')
                        this.props.showToast('Registration Complete. Please check your email for a confirmation link', 'success')
                    }else{
                        this.props.showToast(res.data.message, 'error')
                    }
                    this.setState({
                        loading: false,
                        modalLoader: false
                    }, () => {
                    })
                })
                .catch(error => {
                    console.log(error)
                    //
                    if (error.response) {
                        this.props.showToast("Error", 'error')
                        console.log(error.response)
                    } else {
                        this.props.showToast(error.message, 'error')
                    }
                    this.setState({
                        loading: false,
                        modalLoader: false
                    })
                });
        })
    };

    render() {
        const {navigate} = this.props.navigation;
        return (
            <View>
                <LoaderText visible={this.state.loading} desciption={'Registering User'}/>
                <Header leftIcon={"md-arrow-back"}
                        onPressLeftIcon={() => this.props.navigation.goBack()} image={<Image
                    style={{
                        // height: scale(30),
                        width: scale(150),
                        alignSelf: 'center',
                    }} resizeMode={'contain'}
                    source={require('../../../assets/logo.png')}
                />}/>


                <View style={{marginBottom: scale(60), marginTop: scale(50),paddingHorizontal:scale(20)}}>
                    <Text
                        style={styles.title}
                    >
                        Are you a Lender or Borrower?
                    </Text>
                    <Text
                        style={styles.signUp}
                    >
                        Please specify how you would like to use the app.
                    </Text>
                </View>

                <View style={{paddingHorizontal: scale(45)}}>
                    <ButtonWithBackgroundBottom
                        onPress={() => this.onhandleRegister('lender')}
                        style={{marginBottom: scale(15)}}
                    >
                        <Text style={[styles.buttonText, styles.white]}>Continue as Lender</Text>
                    </ButtonWithBackgroundBottom>
                    <ButtonWithBackgroundBottom
                        onPress={() => this.onhandleRegister('borrower')}
                    >
                        <Text style={[styles.buttonText, styles.white]}>Continue as Borrower</Text>
                    </ButtonWithBackgroundBottom>

                </View>


            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.authentication
    };
};

const mapDispatchToProps = {showToast};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Welcome);

const styles = StyleSheet.create({
    buttonText: {
        fontFamily: 'graphik-medium'
    },
    white: {
        color: 'white',
    },
    signUp: {
        // marginTop: scale(17),
        color: Colors.tintColor,
        fontSize: scale(15),
        fontFamily: 'graphik-medium',
        textAlign: 'center'
    },
    title: {
        marginBottom: scale(10),
        color: Colors.greyText,
        fontSize: scale(24),
        fontFamily: 'graphik-medium',
        textAlign: 'center'
    }
});
