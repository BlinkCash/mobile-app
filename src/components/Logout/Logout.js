import React from 'react';
import {TouchableOpacity, Text} from 'react-native';

export default (props) => {
    return (
        <TouchableOpacity onPress={() => props.logout()}>
            <Text
                style={{
                    color: '#304d66',
                    fontSize: 15,
                    marginTop: 20,
                    textDecorationLine: 'underline'
                }}
            >Log Out
            </Text>
        </TouchableOpacity>
    )
};
