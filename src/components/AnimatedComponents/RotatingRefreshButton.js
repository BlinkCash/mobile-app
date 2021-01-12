import React from "react";
import { Animated, Easing, TouchableOpacity} from "react-native";
import { Icon } from "expo";
import { scale } from '../../lib/utils/scaleUtils';

class RotatingRefreshButton extends React.Component {
    state = {
        spinValue: new Animated.Value(0),  // Initial value for opacity: 0
    }

    // componentDidMount() {
    //     // this.spin();
    // }

    // componentDidUpdate(prevProps){
    //     // if(!prevProps.loading && this.props.loading){
    //     //     this.spin();
    //     // }
        
    //     if(prevProps.loading && !this.props.loading){
    //         Animated.timing(this.state.spinValue).stop()
    //     }

    //     console.log(this.props)
    //     console.log(prevProps);
    // }

    spin = () => {
        this.state.spinValue.setValue(0);
        
        Animated.timing(
            this.state.spinValue,
            {
                toValue: 4,
                duration: 2000,
                easing: Easing.linear,
                useNativeDriver: true
            }
        ).start();
    };

    render() {
        const rotate = this.state.spinValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg'],
        })
        const animatedStyle = {
            transform: [
                { rotate }
            ]
        }

        return (
            <TouchableOpacity onPress={() => this.spin()}>
                <Animated.View                 // Special animatable View
                    style={[this.props.style, animatedStyle]}
                >
                    {this.props.children}
                </Animated.View>
            </TouchableOpacity>
        );
    }
}


export {RotatingRefreshButton}
