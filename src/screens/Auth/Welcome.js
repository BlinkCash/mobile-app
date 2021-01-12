import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    AsyncStorage, Image
} from 'react-native';

import {connect} from 'react-redux';
import {
   ButtonWithBackgroundBottom,
    ButtonWithBackgroundText

} from '../../components/Button/Buttons';
import { scale } from "../../lib/utils/scaleUtils";
import { Colors } from "../../lib/constants/Colors";


class Welcome extends React.Component {
    static navigationOptions = {
        header: null
    };

    state = {
        modalLoader: false
    };





    render() {
        const {navigate} = this.props.navigation;
        return (
            <View style={{flex:1, justifyContent: 'space-between'}}>

                <View style={{flex:1, justifyContent:'center',alignItems:'center'}}>
                    <Image
                        style={{
                            // height: scale(30),
                            width: scale(250),
                        }}
                        source={require('../../../assets/logo.png')}
                    />
                </View>



                <View style={{paddingHorizontal:scale(45)}}>
                    <ButtonWithBackgroundBottom
                        onPress={() => navigate('Intro')}
                    >
                        <Text style={[styles.buttonText, styles.white]}>Get Started</Text>
                    </ButtonWithBackgroundBottom>

                    <View style={{marginBottom:scale(60)}}>
                        <TouchableOpacity onPress={() => navigate('Login')} style={styles.signUp}>
                            <Text
                                style={{
                                    color: Colors.tintColor,
                                    fontSize: scale(15),
                                    fontFamily: 'graphik-medium',
                                    textDecorationLine: 'underline'
                                }}
                            >
                                Sign In
                            </Text>
                        </TouchableOpacity>
                    </View>
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

const mapDispatchToProps = {

};

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
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop:scale(17)
    }
});
