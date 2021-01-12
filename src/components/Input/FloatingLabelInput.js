import React, { Component } from 'react';
import { View, StatusBar, TextInput, Animated } from 'react-native';
import { scale } from "../../lib/utils/scaleUtils";
import {Colors} from "../../lib/constants/Colors";

class FloatingLabelInput extends Component {
    state = {
        isFocused: false,
    };

    handleFocus = () => {
        this.setState({isFocused: true})
        this.props.onFocus && this.props.onFocus()
    };
    handleBlur = () => {
        this.setState({isFocused: false})
        this.props.onBlur && this.props.onBlur()
    };

    componentWillMount() {
        console.log(this.props.value)
        this._animatedIsFocused = new Animated.Value(!this.props.value ? 0 : 1);
    }

    componentDidUpdate() {
        Animated.timing(this._animatedIsFocused, {
            toValue: (!!this.state.isFocused || !!this.props.value) ? 1 : 0,
            duration: 200,
        }).start();
    }

    render() {
        const {label, ...props} = this.props;
        const labelStyle = {
            position: 'absolute',
            left: 0,
            fontFamily: 'graphik-regular',
            letterSpacing:scale(-0.3),
            top: this._animatedIsFocused.interpolate({
                inputRange: [0, 1],
                outputRange: [scale(30), 0],
            }),
            fontSize: this._animatedIsFocused.interpolate({
                inputRange: [0, 1],
                outputRange: [16, 12],
            }),
            color: this._animatedIsFocused.interpolate({
                inputRange: [0, 1],
                outputRange: [props.labelColor || '#979797', '#9AA5B1'],
            }),
        };
        return (
            <View style={{paddingTop: 18}}>
                <Animated.Text style={labelStyle}>
                    {label}
                </Animated.Text>
                <TextInput
                    {...props}
                    style={[{
                        height: scale(42),
                        fontSize: scale(16),
                        color: "#000",
                        borderBottomWidth: 1,
                        borderBottomColor: '#9AA5B1',
                        fontFamily: 'graphik-regular',
                        marginBottom: scale(20)
                    },props.style]}
                    editable={this.props.disabled ? false : true}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                    blurOnSubmit
                />
            </View>
        );
    }
}

export { FloatingLabelInput }
