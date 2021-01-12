import React from "react";
import { TouchableOpacity, View, StyleSheet, Text, ImageBackground } from "react-native";
import * as Icon from '@expo/vector-icons'
import { scale, verticalScale } from '../../lib/utils/scaleUtils'
import { Colors } from "../../lib/constants/Colors";

const Header = props => (
    <ImageBackground
        style={{
            width: '100%',
            height: scale(61)
        }}
        resizeMode={'contain'}
        source={require('../../../assets/images/lines2.png')}
    >
        <View style={styles.container}>
            <View style={styles.icons}>
                {props.leftIcon && (
                    <TouchableOpacity onPress={() => {
                        props.onPressLeftIcon?props.onPressLeftIcon():''
                    }} style={{paddingLeft: 8,paddingRight: 8}}>
                        <Icon.Ionicons
                            name={props.leftIcon}
                            size={scale(25)}
                            style={styles.menu}
                            color={props.color?props.color:Colors.tintColor}
                        />
                    </TouchableOpacity>
                )}
                {!props.leftIcon && (
                    <View/>
                )}
                {props.title && (
                    <View style={{flex: 1,justifyContent: 'center',alignItems:'center'}}>
                        <Text style={styles.title}>{props.title}</Text>
                    </View>
                )}
                {props.image && (
                    <View style={{flex: 1,paddingLeft: scale(23)}}>
                        <View style={styles.title}>{props.image}</View>
                    </View>
                )}
                {props.rightIcon && (
                    <Icon.MaterialIcons
                        name={props.rightIcon}
                        size={scale(25)}
                        style={styles.search}
                        color="white"
                    />
                )}
                {!props.rightIcon && (
                    <View style={{width: scale(25)}}/>
                )}
            </View>
        </View>
    </ImageBackground>
);

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        alignItems: 'center',
        height:scale(61),
        flexDirection: 'row',
        // shadowColor: 'rgba(0, 0, 0, 0.4)',
        // shadowOffset: {
        //     width: 0,
        //     height: scale(7)
        // },
        // shadowRadius: 5,
        // shadowOpacity: 0.7,
        // elevation: 1,
    },
    icons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 10,
        marginRight: scale(18),
        marginLeft: scale(16),
        flex: 1
    },
    title:{
        fontSize:scale(14),
        fontFamily:'graphik-semibold',
        // paddingLeft: scale(19),
        color:Colors.greyText
    }
});

export default Header;
