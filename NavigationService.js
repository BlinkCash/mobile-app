// NavigationService.js

import { NavigationActions, StackActions } from 'react-navigation';
import {hideToast} from "./src/components/Toast/actions/toastActions";
import { store } from "./App";


let _navigator;

function setTopLevelNavigator(navigatorRef) {
    _navigator = navigatorRef;
}

function navigate(routeName, params) {
    store.dispatch(hideToast());
    _navigator.dispatch(
        NavigationActions.navigate({
            routeName,
            params,
        })
    );
}


function reset(routeName, params) {
    store.dispatch(hideToast());
    _navigator.dispatch(
        StackActions.reset({
            index: 0,
            key: null,
            actions: [NavigationActions.navigate({ routeName })]
        })
    );
}

function goBack(routeName) {
    _navigator.dispatch(
        NavigationActions.navigate({
            routeName
        })
    )
}

// add other navigation functions that you need and export them

export default {
    navigate,
    goBack,
    setTopLevelNavigator,
    reset
};
