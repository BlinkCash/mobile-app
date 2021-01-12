import React from 'react';
import { View, ActivityIndicator, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons, FontAwesome, Entypo } from '@expo/vector-icons';
import { ButtonWithBackgroundBottom, ButtonWithBackgroundText } from "../Button/Buttons";
import { scale, verticalScale } from "../../lib/utils/scaleUtils";
import TouchItem from "../TouchItem/_TouchItem";

class SuccessPage extends React.Component {
    static navigationOptions = {
        header: null
    };

    render() {
        const {navigation} = this.props;
        const title = navigation.getParam('title', '');
        const description = navigation.getParam('description', '');
        const buttonText = navigation.getParam('buttonText', '');
        const close = navigation.getParam('close', console.log);
        const redirect = navigation.getParam('redirect', console.log);
        return (
            <View style={styles.container}>
                <TouchItem onPress={() => close()}
                           style={{
                               paddingLeft: 15,
                               paddingRight: 15,
                               position: 'absolute',
                               top:scale(20),
                               right: scale(40)
                           }}>
                    <Ionicons name='ios-close'
                              size={scale(30)}
                              color={'rgba(0, 0, 0, 0.5400000214576721)'}/>
                </TouchItem>
                <View style={styles.innerContainer}>
                    <Ionicons name="ios-checkmark-circle-outline" size={72}
                              color={'#4FC655'}/>
                    <View style={{
                        borderBottomColor: '#ccc',
                        borderBottomWidth: 1, width: '100%'
                    }}>
                        <Text style={styles.title}>{title}</Text>
                    </View>
                    <Text style={styles.description}>{description}</Text>

                    <ButtonWithBackgroundBottom
                        onPress={() => redirect()}
                        activeOpacity={0.8}
                        style={{
                            width: '100%',
                            marginTop: verticalScale(70)
                        }}
                    >
                        <ButtonWithBackgroundText>{buttonText}</ButtonWithBackgroundText>
                    </ButtonWithBackgroundBottom>
                </View>
            </View>
        )
    }
}

export default SuccessPage;

const styles = StyleSheet.create({
    container: {
        // alignItems: 'center',
        // justifyContent: 'space-between',
        flex: 1,
        backgroundColor: '#fff',
        paddingLeft: scale(60),
        paddingRight: scale(60),
        paddingTop: verticalScale(70)
    },
    innerContainer: {
        alignItems: 'flex-start',
        // justifyContent: 'center',
        flex: 1
    },
    title: {
        color: '#4A4A4A',
        fontSize: 20,
        fontFamily: 'graphik-medium',
        paddingBottom: scale(40),
        marginTop: scale(46)
    },
    description: {
        color: '#4A4A4A',
        fontSize: scale(14),
        marginTop: 10,
        fontFamily: 'graphik-regular'
    },
});
