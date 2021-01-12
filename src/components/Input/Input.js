import React from 'react';
import { TouchableOpacity, Text, TextInput, View } from 'react-native'
import styles from './styles'

export default (props) => {
    return (
        <View style={props.style}>
            <Text style={styles.label}>{props.label}</Text>
            <TextInput
                underlineColorAndroid={'transparent'}
                placeholder={props.placeholder}
                onChangeText={text => props.onChangeText(text)}
                value={props.value}
                keyboardType={props.keyboardType}
                style={[styles.textInput,props.inputStyle]}
                secureTextEntry={props.secureTextEntry}
            >
            </TextInput>
            <Text style={styles.error}>{props.errorText}</Text>
        </View>
    )
};
