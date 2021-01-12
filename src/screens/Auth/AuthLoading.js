import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage, ImageBackground,
    StatusBar,
    StyleSheet,
    Dimensions,
    View,
} from 'react-native';
import {connect} from "react-redux";
import { withNavigationFocus } from "react-navigation";

const ACCESS_TOKEN = 'access_token';


class AuthLoadingScreen extends React.Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this._bootstrapAsync();
    }

    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = async () => {
        const userToken = await AsyncStorage.getItem(ACCESS_TOKEN);
        const userName = this.props.auth.username;
        const activated = this.props.auth.activated;

        console.log(this.props.auth.password)

        // this.props.navigation.navigate("Home");
        // if(userToken && userName){
        if(userToken && activated){
            this.props.navigation.navigate("Home");
        } else{
            if(this.props.auth.password){
                this.props.navigation.navigate('Login');
                return
            }
            this.props.navigation.navigate('Auth');
        }

        // This will switch to the App screen or Auth screen and this loading
        // screen will be unmounted and thrown away.
        // this.props.navigation.navigate('Auth');
        // this.props.navigation.navigate(userToken && userName ? 'Main' : 'Auth');
        // this.props.navigation.navigate('Auth');
    };

    // Render any loading content that you like here
    render() {

        return (
            <ImageBackground source={require('../../../assets/splash.png')}
                             style={
                                 {
                                     width: '100%',
                                     // height,
                                     flex: 1
                                 }}>
            </ImageBackground>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        auth: state.authentication,
    };
};

const mapDispatchToProps = {
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withNavigationFocus(AuthLoadingScreen));
