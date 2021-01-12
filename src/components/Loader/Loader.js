import React from 'react';
import { Image, View, Text, Platform, StatusBar, Dimensions, BackHandler } from 'react-native';
import { scale } from "../../lib/utils/scaleUtils";
import Modal from "react-native-modal";

export const LoaderText = ({visible, desciption,navigation}) => {
    const onBackPress = () => {
        return !!visible;

    };
    // let backHandler
    // if(visible){
    //      backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    // }else{
    //     BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    //     backHandler && backHandler.remove();
    // }

    if (visible) {

        return (
            <Modal
                transparent={true}
                onRequestClose={() => {
                }}

                isVisible={visible}
                backdropOpacity={0.6}
                backdropColor="rgba(0, 0, 0, 0.75)"
                // animationIn="fadeIn"
                // animationOut="fadeOut"
                coverScreen={false}
                style={{
                    margin: 0
                }}
                // deviceHeight={Dimensions.get('screen').height}

            >
                <View
                    style={{
                        backgroundColor: "rgba(0, 0, 0, 0.75)",
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingHorizontal: scale(30)
                    }}>
                    <StatusBar backgroundColor="rgba(0,0,0,0.4)"/>
                    <Text style={{
                        fontFamily: 'graphik-regular',
                        fontSize: scale(20),
                        color: 'white',
                        lineHeight: scale(22)
                    }}>{desciption}</Text>

                </View>
            </Modal>)
    }else{
        // BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        // backHandler && backHandler.remove();
        return null
    }

};
