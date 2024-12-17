import { useDispatch, useSelector } from 'react-redux';
import {hideToast, showToast} from "../actions/toastActions";

const useToast = () => {
    const dispatch = useDispatch();
    const toast = useSelector(state => state.toast);

    const showToastMessage = (message, type = 'info') => {
        dispatch(showToast(message, type));
        setTimeout(() => {
            dispatch(hideToast());
        }, 3000);
    };

    return {
        toast,
        showToastMessage
    };
};

export default useToast;