export interface StatusData {
    status_id: number;
    status_name: string;
    order_num: number;
}

export interface SnackbarProps {
    open: boolean;
    message: string;
    severity: 'success' | 'error';
    onClose: () => void;
}
