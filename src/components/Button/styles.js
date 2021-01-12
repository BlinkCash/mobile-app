import { StyleSheet } from "react-native";
import { scale } from "../../lib/utils/scaleUtils";
import {Colors} from "../../lib/constants/Colors";


const styles = StyleSheet.create({
    buttonWithBackground: {
        backgroundColor: Colors.tintColor,
        height: scale(56),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: scale(28)
    },
    buttonText: {
        color: Colors.white,
        fontSize: scale(17),
        fontFamily: 'graphik-semibold'
    }
})

export default styles
