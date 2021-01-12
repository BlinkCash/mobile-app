import React from 'react';
import { Text, TouchableOpacity, View, Animated, Image } from 'react-native';
import styles from './styles'
import { Ionicons } from '@expo/vector-icons';
import FadeInView from '../AnimatedComponents/FadeInView'
import { scale } from "../../lib/utils/scaleUtils";
import { ButtonWithBackgroundBottom, ButtonWithBackgroundText } from "../Button/Buttons";

const Toast = (props) => {
    return (
        <FadeInView style={[styles.container, styles[props.type]]}>
            <View style={{
                minWidth: scale(250),
                paddingVertical: scale(20),
                alignItems: 'center',
                backgroundColor:'white',
                borderRadius:scale(5)

            }}>
                {props.type === 'success' && ( <View>
                    <Image
                        style={{width: scale(91), height: scale(60)}}
                        source={require('../../../assets/images/Loans/success.png')}
                        resizeMode={'contain'}
                    />
                    <Text style={styles.header}>Success</Text>
                </View>)}
                {props.type === 'error' && ( <View>
                    <Image
                        style={{width: scale(40), height: scale(40)}}
                        source={require('../../../assets/images/Loans/error2.png')}
                        resizeMode={'contain'}
                    />
                    <Text style={styles.header}>Error</Text>
                </View>)}
                <Text style={styles.text}>
                    {props.message}
                </Text>

                <ButtonWithBackgroundBottom
                    onPress={() => props.onClickHandler()}
                    style={{marginTop: scale(16), height:scale(40), width:scale(200)}}

                ><ButtonWithBackgroundText style={{fontSize:scale(14)}}>{'Ok'}</ButtonWithBackgroundText>
                </ButtonWithBackgroundBottom>
            </View>

        </FadeInView>
    )
};

// class FadeInView extends React.Component {
//     state = {
//         fadeAnim: new Animated.Value(0),  // Initial value for opacity: 0
//     }
//
//     componentDidMount() {
//         Animated.timing(                  // Animate over time
//             this.state.fadeAnim,            // The animated value to drive
//             {
//                 toValue: 1,                   // Animate to opacity: 1 (opaque)
//                 duration: 500,              // Make it take a while
//             }
//         ).start();                        // Starts the animation
//     }
//
//     render() {
//         let { fadeAnim } = this.state;
//
//         return (
//             <Animated.View                 // Special animatable View
//                 style={[this.props.style,{opacity:fadeAnim}]}
//             >
//                 {this.props.children}
//             </Animated.View>
//         );
//     }
// }
export default Toast
