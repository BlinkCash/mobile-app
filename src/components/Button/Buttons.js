import React from 'react';
import {TouchableOpacity, Text} from 'react-native'
import styles from './styles';
import _TouchItem from '../TouchItem/_TouchItem';

export const ButtonWithBackgroundBottom =  (props) => {
    return (
        <_TouchItem {...props} style={[styles.buttonWithBackground,props.style]}>
            {props.children}
        </_TouchItem>)
};

export const ButtonWithBackgroundText =  (props) => {
    return (
        <Text {...props} style={[styles.buttonText,props.style]} >
            {props.children}
        </Text>)
};
