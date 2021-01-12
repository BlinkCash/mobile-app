import React, { Component } from 'react';
import {
	View,
	Platform,
	TouchableNativeFeedback,
	TouchableOpacity,
} from 'react-native';

export default class TouchItem extends Component {
	renderiOS() {
		return (
			<TouchableOpacity activeOpacity={this.props.noFeedback ? 1 : 0.6} {...this.props}>{this.props.children}</TouchableOpacity>
		)
	}

	renderAndroid() {
		let feedback = this.props.ripple ? TouchableNativeFeedback.Ripple('rgba(0,0,0,0.3)', true) : TouchableNativeFeedback.SelectableBackground()
		return (
			<TouchableNativeFeedback {...this.props} background={feedback}>
				<View {...this.props}>
					{this.props.children}
				</View>
			</TouchableNativeFeedback >
		)
	}

	render() {
		return Platform.OS === 'ios' ? this.renderiOS() : this.renderAndroid()
	}

}