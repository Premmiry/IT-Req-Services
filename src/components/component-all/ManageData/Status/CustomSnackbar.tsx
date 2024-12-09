import { Snackbar, Alert } from '@mui/material';
import { SnackbarProps } from './types';

export default function CustomSnackbar({ open, message, severity, onClose }: SnackbarProps) {
    return (
        <Snackbar 
            open={open} 
            autoHideDuration={3000} 
            onClose={onClose}
        >
            <Alert severity={severity}>
                {message}
            </Alert>
        </Snackbar>
    );
}
