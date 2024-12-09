import { useState } from 'react';
import {  Table, TableBody, TableCell, TableRow, TableHead, TextField, IconButton, TablePagination } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { StatusData } from './types';

interface StatusTableProps {
    statusList: StatusData[];
    onUpdateStatus: (statusId: number, newName: string) => Promise<void>;
}

export default function StatusTable({ statusList, onUpdateStatus }: StatusTableProps) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editValue, setEditValue] = useState<string>('');
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(5);

    const handleStartEdit = (status: StatusData) => {
        setEditingId(status.status_id);
        setEditValue(status.status_name);
    };

    const handleSave = async (statusId: number) => {
        if (editValue.trim()) {
            await onUpdateStatus(statusId, editValue.trim());
            setEditingId(null);
            setEditValue('');
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditValue('');
    };

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    // คำนวณข้อมูลที่จะแสดงในหน้าปัจจุบัน
    const currentPageData = statusList.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ลำดับ</TableCell>
                        <TableCell>ชื่อสถานะ</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {currentPageData.map((status) => (
                        <TableRow key={status.status_id}>
                            <TableCell>{status.order_num}</TableCell>
                            <TableCell>
                                {editingId === status.status_id ? (
                                    <TextField
                                        fullWidth
                                        size="small"
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        autoFocus
                                    />
                                ) : (
                                    status.status_name
                                )}
                            </TableCell>
                            <TableCell align="right">
                                {editingId === status.status_id ? (
                                    <>
                                        <IconButton 
                                            color="primary"
                                            onClick={() => handleSave(status.status_id)}
                                            disabled={!editValue.trim() || editValue === status.status_name}
                                        >
                                            <SaveIcon />
                                        </IconButton>
                                        <IconButton 
                                            color="error"
                                            onClick={handleCancel}
                                        >
                                            <CancelIcon />
                                        </IconButton>
                                    </>
                                ) : (
                                    <IconButton 
                                        color="primary"
                                        onClick={() => handleStartEdit(status)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <TablePagination
                component="div"
                count={statusList.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[5]} // กำหนดให้แสดงเฉพาะตัวเลือก 5 แถวต่อหน้า
            />
        </>
    );
}
