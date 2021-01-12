import { StyleSheet } from "react-native";
import { scale } from "../../lib/utils/scaleUtils";


const styles = StyleSheet.create({
    textInput: {
        height: 48,
        fontSize: scale(14),
        width: '100%',
        marginBottom: 20,
        color: '#484848',
        fontFamily: 'graphik-regular',
        borderRadius: 5,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#EFF2F7',
        letterSpacing: scale(-.3),
        alignItems: 'center',
        justifyContent: 'center',
    },
    error: {
        fontSize: scale(10),
        color: '#ff3726',
        bottom: 3,
        position: 'absolute',
        fontFamily: 'graphik-regular'
    },
    label: {
        fontSize: scale(12),
        color: 'rgba(0, 66, 95, 0.800000011920929)',
        fontFamily: 'graphik-regular',
        marginBottom: 7,
        letterSpacing: scale(-.3)
    },
})

export default styles
