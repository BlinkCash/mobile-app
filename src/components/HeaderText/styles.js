import { StyleSheet } from "react-native";
import { scale } from "../../lib/utils/scaleUtils";


const styles = StyleSheet.create({
    text: {
        fontSize: scale(16),
        letterSpacing: scale(-0.3),
        color: '#00425F',
        fontFamily: 'sf-bold'
    }
})

export default styles
