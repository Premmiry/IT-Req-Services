import { 
    Dialog, DialogTitle, DialogContent, 
    DialogActions, Button, Typography 
} from '@mui/material';
import { Admin } from './admin.types';

interface AdminDialogProps {
    open: boolean;
    admin: Admin | null;
    onClose: () => void;
    onConfirm: (admin: Admin) => Promise<void>;
}

export const AdminDialog = ({
    open,
    admin,
    onClose,
    onConfirm
}: AdminDialogProps) => {
    const handleConfirm = async () => {
        if (admin) {
            await onConfirm(admin);
        }
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            aria-labelledby="admin-dialog-title"
        >
            <DialogTitle id="admin-dialog-title">
                ยืนยันการเปลี่ยนสถานะ
            </DialogTitle>
            <DialogContent>
                <Typography>
                    คุณต้องการ{admin?.del_flag === 'N' ? 'ปิด' : 'เปิด'}การใช้งานผู้ใช้ {admin?.username} ใช่หรือไม่?
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button 
                    onClick={onClose}
                    color="inherit"
                >
                    ยกเลิก
                </Button>
                <Button
                    variant="contained"
                    onClick={handleConfirm}
                    color={admin?.del_flag === 'N' ? 'error' : 'success'}
                >
                    ยืนยัน
                </Button>
            </DialogActions>
        </Dialog>
    );
};
