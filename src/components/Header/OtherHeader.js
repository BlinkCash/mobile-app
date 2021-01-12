import React from "react";
import { TouchableOpacity, View, StyleSheet, Text } from "react-native";
import * as Icon from '@expo/vector-icons'
import { Colors } from '../../lib/constants/Colors';
import { scale, verticalScale } from '../../lib/utils/scaleUtils'
import TouchItem from "../TouchItem/_TouchItem";

const Header = props => (
    <View style={styles.container}>
        <View style={styles.icons}>
            {props.leftIcon && (
                <TouchItem onPress={() => {
                    props.onPressLeftIcon ? props.onPressLeftIcon() : ''
                }} style={{paddingHorizontal: 12, paddingVertical: 8}}>
                    <Icon.Ionicons
                        name={props.leftIcon}
                        size={scale(25)}
                        style={styles.menu}
                        color={Colors.tintColor}
                    />
                </TouchItem>
            )}
            {!props.leftIcon && (
                <View/>
            )}
            {props.title && (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', maxWidth: 250}}>
                    <Text style={styles.title} numberOfLines={1}>{props.title}</Text>
                </View>
            )}
            {props.image && (
                <View style={{flex: 1, paddingLeft: scale(23), paddingBottom: verticalScale(10)}}>
                    <View style={styles.title}>{props.image}</View>
                </View>
            )}
            {props.rightIcon && (
                <TouchItem onPress={() => {
                    props.onPressRightIcon ? props.onPressRightIcon() : ''
                }} style={{paddingLeft: 8, paddingRight: 8}}>
                    <Text style={styles.right}>{props.rightIcon}</Text>
                </TouchItem>
            )}
            {!props.rightIcon && (
                <View style={{width: scale(25)}}/>
            )}
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        height: scale(56),
        alignItems: 'center',
        flexDirection: 'row',
        shadowColor: 'rgba(0, 0, 0, 0.08)',
        shadowOffset: {
            width: 0,
            height: scale(0)
        },
        shadowRadius: 4,
        shadowOpacity: 1.0,
        elevation: 2,
        zIndex:999

    },
    icons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 10,
        marginRight: scale(18),
        marginLeft: scale(12),
        flex: 1
    },
    title: {
        fontSize: scale(14),
        fontFamily: 'graphik-semibold',
        // paddingLeft: scale(19),
        color: Colors.greyText
    },
    right: {
        fontSize: scale(12),
        fontFamily: 'graphik-semibold',
        // paddingLeft: scale(19),
        color: Colors.tintColor
    }
});

export default Header;
