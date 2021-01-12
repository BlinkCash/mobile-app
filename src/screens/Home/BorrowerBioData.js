import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ActivityIndicator, Animated
} from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import SlideInView from '../../components/AnimatedComponents/SlideInView'
import SlideOutView from '../../components/AnimatedComponents/SlideOutView'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ButtonWithBackgroundBottom, ButtonWithBackgroundText } from "../../components/Button/Buttons";
import { postBuyAirtime, postPayFull, postPayPartial } from "../../lib/api/url";
import { apiRequest } from "../../lib/api/api";
import SelectPopup from "../../components/SelectPopUp/SelectPopUp";

import { connect } from "react-redux";

import { showToast } from "../../components/Toast/actions/toastActions";


import { withNavigationFocus } from "react-navigation";
import Header from '../../components/Header/OtherHeader';

import { scale } from "../../lib/utils/scaleUtils";
import { LoaderText } from "../../components/Loader/Loader";
import { formatAmount } from "../../lib/utils/helpers";


class BorrowerBioData extends React.Component {
    static navigationOptions = {
        header: null,
    };
    state = {}

    componentDidMount() {

    }



    render() {
        return (
            <View style={{flex: 1, backgroundColor: 'green'}}>
            </View>
        )

    }
}

const mapStateToProps = (state, ownProps) => {
    return {};
};
const mapDispatchToProps = {
    showToast
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withNavigationFocus(BorrowerBioData));


