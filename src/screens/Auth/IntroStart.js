import React from 'react';
import {StyleSheet, View, Text, ImageBackground, Dimensions} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {connect} from "react-redux";
import { withNavigationFocus } from 'react-navigation';



class IntroScreen extends React.Component {
    static navigationOptions = {
        header: null
    }

    componentDidMount(){
        let isLoggedIn = this.props.auth.isLoggedIn;
        if (!!isLoggedIn) {
            this.props.navigation.navigate('Main');
        } else {
            if(this.props.isFocused){
                this.props.navigation.navigate('IntroScreen');
            }
        }
    }


    render() {
        var {height, width} = Dimensions.get('window');
        return (
            <ImageBackground source={require('../../../assets/images/splash.png')} style={
                {
                    width: '100%',
                    // height,
                    flex:1,
                }}>
            </ImageBackground>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        auth: state.authentication
    };
};

export default connect(
    mapStateToProps,
    null
)(withNavigationFocus(IntroScreen));
