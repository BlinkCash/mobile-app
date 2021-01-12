import { Dimensions, StyleSheet } from "react-native";
import { scale, verticalScale } from "../../src/lib/utils/scaleUtils";
import { Colors } from "../../src/lib/constants/Colors";

const formStyles = StyleSheet.create({
    container: {
        alignItems: 'center',
        // paddingTop: scale(20),
        backgroundColor: 'transparent',
        minHeight: Dimensions.get('window').height
    },
    containerNoHeight: {
        // alignItems: 'center',
        // paddingTop: scale(20),
        backgroundColor: 'transparent',
        // flex:1
        // minHeight: Dimensions.get('window').height
    },
    auth_form: {
        width: '100%',
        padding: scale(24),
        backgroundColor: 'white',
        borderRadius:scale(16),
        marginTop:scale(20),
        minHeight: verticalScale(300)
    },
    signup: {
        color: '#fff',
        fontFamily: 'graphik-semibold',
        fontSize:scale(14),
    },

    title: {
        fontSize: scale(32),
        color: Colors.white,
        // textAlign: 'center',
        fontFamily: "graphik-semibold",
        lineHeight: scale(32),
        marginBottom:scale(15)
        // marginTop: scale(24),
    },
    subtitle:{
        fontSize: scale(12),
        color: Colors.white,
        // textAlign: 'center',
        fontFamily: "graphik-regular",
        lineHeight: scale(17),
        // marginBottom:scale(15)
        // marginTop: scale(24),
    },
    textInput: {
        height: scale(42),
        fontSize: scale(16),
        width: '100%',
        marginBottom: scale(20),
        color: '#fff',
        fontFamily: 'graphik-regular',
        borderWidth: 0,
        borderBottomColor:'#fff',
        borderBottomWidth: scale(2)
        // borderRadius: scale(5),
        // paddingLeft: scale(10),
        // paddingRight: scale(10),
        // backgroundColor: '#EFF2F7',
        // letterSpacing: scale(-.3),
        // alignItems: 'center',
        // justifyContent: 'center',
    },

    flexContainer: {
        justifyContent: 'space-between',
    },
    showpassword: {
        position: 'absolute',
        alignItems: 'flex-end',
        right: scale(18),
        top: scale(25)
    },
    otherText: {
        color: Colors.white,
        fontSize: scale(14),
        fontFamily: "graphik-semibold",
    },
    forgotPasswordSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center'
    },
    forgotPasswordText: {
        textAlign: 'center',
        marginTop: scale(18),
        width: '100%',
        paddingLeft: scale(20),
        paddingRight: scale(20)
    },
    fingerPrintSection: {justifyContent: 'center', alignItems: 'center', flexDirection: 'row'},
    closeModal: {
        zIndex: 200,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: '100%',
        paddingLeft: scale(20),
        marginBottom: scale(5)
    },
    error: {
        fontSize: scale(10),
        color: '#e73624',
        bottom: scale(3),
        position: 'absolute',
        fontFamily: 'graphik-medium',
        right: 0
    },
    formError: {
        fontSize: scale(16),
        color: '#CA5C55',
        marginTop: scale(30),
        // position: 'absolute',
        fontFamily: 'graphik-medium',
        right: 0,
        width:'100%',
        textAlign: 'center'
    },
    facebook:{
        flexDirection:'row',
        width:'100%',
        justifyContent:'space-between',
        paddingHorizontal:scale(30),
        alignItems:'center'
    },
    fingerprintTitle:{
        color: '#777',
        fontSize: scale(18),
        fontFamily: 'graphik-medium',
        // letterSpacing: scale(-.3),
        marginBottom:scale(10)
    },
    fingerprintDescription:{
        color: '#aaa',
        fontSize: scale(13),
        fontFamily: 'graphik-regular',
        // letterSpacing: scale(-.3),
        marginBottom:scale(10)
    }

});

export { formStyles }
