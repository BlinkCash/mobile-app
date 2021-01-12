import React from "react";
import { Animated } from "react-native";

class SlideInView extends React.Component {
    state = {
        fadeAnim: new Animated.Value(0),  // Initial value for opacity: 0
        x: new Animated.Value(-500),
    }

    componentDidMount() {
        Animated.timing(                  // Animate over time
            this.state.fadeAnim,            // The animated value to drive
            {
                toValue: 1,                   // Animate to opacity: 1 (opaque)
                duration: 200,              // Make it take a while
                useNativeDriver: true
            }
        ).start();

        this.slideIn();
        // Starts the animation
    }

    slideIn = () => {
        Animated.spring(this.state.x, {
            toValue: 0,
            useNativeDriver: true
        }).start();
        this.setState({
            visible: true,
        });
    };
    render() {
        let { fadeAnim } = this.state;

        return (
            <Animated.View                 // Special animatable View
                style={[this.props.style,{
                    opacity: fadeAnim,
                    transform: [
                        {
                            translateX: this.state.x
                        }
                    ]
                }]}
            >
                {this.props.children}
            </Animated.View>
        );
    }
}


export default SlideInView
