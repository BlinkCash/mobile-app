import TOAST from './actions/toast_types'
let initialState = {
    show: false,
    message: '',
    type: '',
    timeout: null
}

const toastReducer = (state = initialState, action) => {
    switch (action.type) {
        case TOAST.SHOW_TOAST:
            if(state.timeout){
                clearTimeout(state.timeout);
            }
            return {
                show: true,
                message: action.message,
                boxType: action.boxType,
                timeout: action.timeout
            }
        case TOAST.HIDE_TOAST:
            if(state.timeout){
                clearTimeout(state.timeout);
            }
            return {
                ...state,
                show: false
            }
        default:
            return state;
    }
}

export default toastReducer;
