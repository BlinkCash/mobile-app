import React from 'react';
import { Image, Text } from 'react-native';
import styles from './styles'

export const HeaderText =  (props) => {
    return (
        <Text style={styles.text} {...props}>
            {props.children}
        </Text>)
};
