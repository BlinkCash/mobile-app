import TOAST from './toast_types';
import NavigationService from '../../../../NavigationService';

let redirectPath;

export function showToast(message, type, timeout = 5000, path) {
    if (path) {
        redirectPath = path;
    }
    return function(dispatch) {
        let timeoutRef = setTimeout( () => {
            dispatch(hideToast());
            if (path) {
                NavigationService.navigate(path);
            }
        }, timeout);

        dispatch({
            type: TOAST.SHOW_TOAST,
            message: message,
            boxType: type,
            timeout: timeoutRef
        });
    }
}

export function hideToast() {
    
    if (redirectPath) {
        setTimeout(() => {
            NavigationService.goBack(redirectPath);
            redirectPath = '';
        }, 50);
    }
    return {
        type: TOAST.HIDE_TOAST
    }
}



export function showPersistentToast(message, type) {
    return function(dispatch) {
        dispatch({
            type: TOAST.SHOW_TOAST,
            message: message,
            boxType: type,
        });
    }
}
