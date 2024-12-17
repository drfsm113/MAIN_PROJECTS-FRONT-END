import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import {useToast} from "react-toastify";

const Toast = () => {
    const { toast, showToastMessage } = useToast();

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        showToastMessage('');
    };

    return (
        <Snackbar open={toast.isVisible} autoHideDuration={3000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={toast.type} sx={{ width: '100%' }}>
                {toast.message}
            </Alert>
        </Snackbar>
    );
};

export default Toast;