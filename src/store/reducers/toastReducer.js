import {HIDE_TOAST, SHOW_TOAST} from "../actions/toastActions";

const initialState = {
    message: '',
    type: 'info',
    isVisible: false
};

const toastReducer = (state = initialState, action) => {
    switch (action.type) {
        case SHOW_TOAST:
            return {
                ...state,
                message: action.payload.message,
                type: action.payload.type,
                isVisible: true
            };
        case HIDE_TOAST:
            return {
                ...state,
                isVisible: false
            };
        default:
            return state;
    }
};

export default toastReducer;