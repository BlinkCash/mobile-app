import React, {Component} from 'react';
import {View, Text, StyleSheet, Platform, StatusBar} from 'react-native';
import Constants from 'expo-constants';
import { Colors } from "../../lib/constants/Colors";

class StatusBarBackground extends Component{
    render(){
        return(
            <View style={styles.statusBarBackground}>
                <StatusBar
                    backgroundColor={Colors.darkBlue}
                    barStyle="light-content"
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    statusBarBackground:{
        // height: Platform.OS === 'ios'?Constants.statusBarHeight:0,
        height: Constants.statusBarHeight,
        // height: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
        backgroundColor: Colors.darkBlue,
    }

})

export default StatusBarBackground
