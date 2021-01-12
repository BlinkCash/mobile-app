import { Dimensions, StyleSheet } from "react-native";
import { scale } from "../../lib/utils/scaleUtils";
import { Colors } from "../../lib/constants/Colors";


const styles = StyleSheet.create({
    container: {
        backgroundColor:'rgba(0, 0, 0, 0.7)',
        flex:1,
        position:'absolute',
        zIndex:99999,
        top:scale(0),
        width:'100%',
        // paddingVertical:10,
        paddingHorizontal:scale(24),
        minHeight: Dimensions.get('window').height,
        justifyContent:'center',
        alignItems:'center',
        // alignSelf: 'center',
        // flexDirection: 'row',
        // shadowColor: 'rgba(0, 0, 0, 0.4)',
        // shadowOffset: {
        //     width: 0,
        //     height: scale(2)
        // },
        // shadowRadius: 5,
        // shadowOpacity: 1.0,
        // elevation: 2

    },
    text:{
        fontSize: scale(14),
        color: Colors.greyText,
        fontFamily: 'graphik-regular',
        maxWidth: scale(200),
        marginTop:scale(16),
        textAlign: 'center'
    },
    header:{
        fontSize: scale(20),
        color: Colors.greyText,
        fontFamily: 'graphik-semibold',
        marginTop:scale(16),
        textAlign: 'center'
    },
    success:{
        // backgroundColor: "#35a24e"
    },
    error:{
        // backgroundColor: "#E74E60"
    },
    notice:{
        backgroundColor:'#000',
        opacity:0.85
    }
})

export default styles
