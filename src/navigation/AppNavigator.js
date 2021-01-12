import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import AuthStack from './AuthNavigator';
import AuthLoadingScreen from '../screens/Auth/AuthLoading';
import { NetInfo, SafeAreaView, View, PanResponder } from 'react-native'
import { hideToast, showToast, showPersistentToast } from "../components/Toast/actions/toastActions";
import { connect } from 'react-redux'

import NavigationService from "../../NavigationService";
import Toast from '../components/Toast/Toast'
import StatusBar from "../components/StatusBar/StatusBar";
// import { Analytics, PageHit } from "expo-analytics";

// const analytics = new Analytics('UA-156102127-1', null, {debug: true});

const AppContainer = createAppContainer(createSwitchNavigator({
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    Main: MainTabNavigator,
    Auth: AuthStack,
    AuthLoading: AuthLoadingScreen,
}, {
    initialRouteName: 'AuthLoading',
    headerMode: 'none'
}));


class App extends React.Component {
    state = {
        inactive: false
    }


    render() {
        console.log(this.props.toastShow)
        return (
            <View style={{flex: 1, backgroundColor: '#fff'}}>
                <StatusBar/>
                <View style={{flex: 1}}>
                    {this.props.toastShow && <Toast
                        show={this.props.toastShow}
                        type={this.props.toastType}

                        message={this.props.toastMessage ? this.props.toastMessage.toString() : ''}
                        onClickHandler={this.props.hideToast}
                    />}
                    <AppContainer
                        ref={navigatorRef => {
                            NavigationService.setTopLevelNavigator(navigatorRef);
                        }}
                        onNavigationStateChange={(prevState, currentState) => {
                            const currentScreen = getCurrentRouteName(currentState);
                            const prevScreen = getCurrentRouteName(prevState);

                            if (prevScreen !== currentScreen) {
                                // the line below uses the Google Analytics tracker
                                // change the tracker here to use other Mobile analytics SDK.
                                // tracker.trackScreenView(currentScreen);

                                console.log(currentScreen)
                                // analytics.hit(new PageHit(currentScreen))
                                //     .then(() => console.log("success"))
                                //     .catch(e => console.log(e.message));
                            }
                        }}

                    />
                </View>
            </View>)
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        auth: state.authentication,
        toastType: state.toast.boxType,
        toastShow: state.toast.show,
        toastMessage: state.toast.message,
    };
};

const mapDispatchToProps = {
    hideToast,
    showToast,
    showPersistentToast
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);


// gets the current screen from navigation state
const getCurrentRouteName = (navigationState) => {
    if (!navigationState) {
        return null;
    }
    const route = navigationState.routes[navigationState.index];
    // dive into nested navigators
    if (route.routes) {
        return getCurrentRouteName(route);
    }
    return route.routeName;
}

