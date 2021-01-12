import React from 'react';
import { Platform, StatusBar, View, Text } from 'react-native';

import AppNavigator from './src/navigation/AppNavigator';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import { Asset } from 'expo-asset';

import { createStore, applyMiddleware } from 'redux';
import * as Icon from '@expo/vector-icons'

import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import rootReducer from './src/redux/reducers/index';
import {
    persistStore,
    persistReducer,
} from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
import { PersistGate } from 'redux-persist/lib/integration/react';
// import AsyncStorage from '@react-native-community/async-storage';
import { AsyncStorage } from 'react-native';
import { StyleSheet } from 'react-native';
// import { Analytics, PageHit, ScreenHit } from 'expo-analytics';


const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    // storage: storage
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(
    persistedReducer,
    // applyMiddleware(logger),
    applyMiddleware(thunk)
);
const persistor = persistStore(store);



export default class App extends React.Component {
    state = {
        isLoadingComplete: false,
    };

    constructor(properties) {
        super(properties);

    }

    render() {
        if (!this.state.isLoadingComplete) {
            return (
                <AppLoading
                    startAsync={this._loadResourcesAsync}
                    onError={this._handleLoadingError}
                    onFinish={this._handleFinishLoading}
                />
            );
        } else {
            return (
                <View style={styles.container}>
                    <PersistGate persistor={persistor}>
                        <Provider store={store}>
                            <AppNavigator />
                        </Provider>
                    </PersistGate>
                </View>
            );
        }
    }

    _loadResourcesAsync = async () => {
        return Promise.all([
            Font.loadAsync({
                ...Icon.Ionicons.font,
                ...Icon.SimpleLineIcons.font,
                'graphik-regular': require('./assets/fonts/Graphik-400-Regular.otf'),
                'graphik-medium': require('./assets/fonts/Graphik-500-Medium.otf'),
                // 'graphik-medium': require('./assets/fonts/AvenirNextLTPro-Demi.otf'),
                'graphik-semibold': require('./assets/fonts/Graphik-600-Semibold.otf'),
                'graphik-bold': require('./assets/fonts/Graphik-700-Bold.otf')
            }),
            Asset.loadAsync([
                require('./assets/images/Intro/Illustrations.png'),
                require('./assets/images/Intro/Illustrations-1.png'),
                require('./assets/images/Intro/Illustrations-2.png'),
                require('./assets/images/Login/Patterns.png'),
                require('./assets/images/Login/fingerprint.png'),
                require('./assets/images/Login/fingerprint_success.png'),
                require('./assets/images/Login/fingerprint_error.png'),
                require('./assets/images/Login/success.png'),
                require("./assets/images/starIcon/star.png"),
                require('./assets/images/Home/user.png'),
                require('./assets/images/Home/home_active.png'),
                require('./assets/images/Home/home_inactive.png'),
                require('./assets/images/Home/savings_inactive.png'),
                require('./assets/images/Home/savings_active.png'),
                require('./assets/images/Home/loans_inactive.png'),
                require('./assets/images/Home/loans_active.png'),
                require('./assets/images/Home/transactions_inactive.png'),
                require('./assets/images/Home/transactions_active.png'),
                require('./assets/images/lines.png'),
                require('./assets/images/lines2.png'),
                require('./assets/images/Vector.png'),
                require('./assets/images/Vector2.png'),
                require('./assets/images/Vector3.png'),
                require('./assets/images/Vector4.png'),
                require('./assets/images/Loans/empty.png'),
                require('./assets/images/Home/transfer.png'),
                require('./assets/images/Loans/error.png'),
                require('./assets/images/Loans/error2.png'),
                require('./assets/images/Loans/success.png'),
                require('./assets/images/Loans/loan.png'),
                require('./assets/images/Transactions/down_arrow.png'),
                require('./assets/images/Transactions/empty.png'),
                require('./assets/images/Transactions/up_arrow.png'),
                require('./assets/images/paystack.png'),
                require('./assets/images/selfie.png'),
                require('./assets/logo.png'),
                require('./assets/logo_white.png'),
                require('./assets/icon.png'),
                require('./assets/images/market_focused.png'),
                require('./assets/images/market.png'),
                require('./assets/images/cards/verve_white_red.png'),
                require('./assets/images/cards/visa.png'),
                require('./assets/images/cards/master.png'),
                require('./assets/images/Savings/regular.png'),
                require('./assets/images/Savings/halal.png'),
                require('./assets/images/Savings/fixed.png'),
                require('./assets/images/Savings/default.png'),
                require('./assets/images/Savings/empty.png'),
                require('./assets/images/Savings/rollover.png'),
                require('./assets/images/Savings/withdraw.png'),
                require('./assets/images/Savings/top_up.png'),
                require('./assets/images/Home/wallet1.png'),
                require('./assets/images/Home/savings1.png'),
                require('./assets/images/Home/loans1.png'),
                require('./assets/images/cards/empty.png'),
            ]),
        ]);
    };

    _handleLoadingError = error => {
        // In this case, you might want to report the error to your error
        // reporting service, for example Sentry
        console.warn(error);
    };

    _handleFinishLoading = () => {
        this.setState({isLoadingComplete: true});
    };



}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
});

