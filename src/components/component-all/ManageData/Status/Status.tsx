import { useState, useEffect } from 'react';
import URLAPI from '../../../../URLAPI';
import { Paper, styled, Typography } from '@mui/material';
import StatusTable from './StatusTable';
import { StatusData } from './types';
import CustomSnackbar from './CustomSnackbar';
export default function Status() {
    const [statusList, setStatusList] = useState<StatusData[]>([]);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });

    const PageTitle = styled(Typography)(({ theme }) => ({
        fontWeight: 600,
        marginBottom: theme.spacing(2),
        color: theme.palette.primary.main
    }));

    const fetchStatus = async () => {
        try {
            const response = await fetch(`${URLAPI}/status`);
            const data = await response.json();
            setStatusList(data);
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'เกิดข้อผิดพลาดในการดึงข้อมูล',
                severity: 'error'
            });
        }
    };

    useEffect(() => {
        fetchStatus();
    }, []);

    const handleUpdateStatus = async (statusId: number, newName: string) => {
        try {
            const response = await fetch(`${URLAPI}/status/${statusId}?status_name=${newName}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error('Failed to update status');
            }

            const result = await response.json();
            
            if (result.status === 'success') {
                setSnackbar({
                    open: true,
                    message: 'อัพเดตสถานะสำเร็จ',
                    severity: 'success'
                });
                fetchStatus();
            } else {
                throw new Error(result.message || 'Failed to update status');
            }
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'เกิดข้อผิดพลาดในการอัพเดต',
                severity: 'error'
            });
        }
    };

    return (
        <Paper sx={{ p: 2 }}> 
            <PageTitle variant="h5">STATUS CONFIGURATION</PageTitle>
            <StatusTable 
                statusList={statusList}
                onUpdateStatus={handleUpdateStatus}
            />
            <CustomSnackbar 
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            />
        </Paper>
    );
}