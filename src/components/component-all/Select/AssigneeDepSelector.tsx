import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Chip, Avatar, Dialog, DialogTitle, DialogContent,
    DialogActions, Button, Typography, Box, List,
    ListItem, ListItemAvatar, ListItemText, TextField,
    Stack, Snackbar, Alert
} from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import DeleteIcon from '@mui/icons-material/Delete';
import URLAPI from '../../../URLAPI';

interface Department {
    id_department_it: number;
    name_department_it: string;
}

interface AssignedDepartment {
    id: number;
    id_req_dep: number;
    req_id: number;
    id_department: number;
    name_department?: string;
    user_assigned: string;
    assigned_date: string;
}

interface AssigneeDepSelectorProps {
    requestId: number;
    readOnly?: boolean;
}

const AssigneeDepSelector: React.FC<AssigneeDepSelectorProps> = ({ requestId, readOnly = false }) => {
    const [open, setOpen] = useState(false);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userData, setUserData] = useState<any | null>(null);
    const [assignedDepartments, setAssignedDepartments] = useState<AssignedDepartment[]>([]);

    // New state for managing snackbar notifications
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });

    useEffect(() => {
        const storedUserData = sessionStorage.getItem('userData');
        if (storedUserData) {
            setUserData(JSON.parse(storedUserData));
            fetchAssignments(requestId);
        }
    }, [requestId]);

    const fetchAssignments = useCallback(async (id: number) => {
        try {
            const response = await fetch(`${URLAPI}/assigned_department/${id}`);
            if (!response.ok) {
                throw new Error('Error fetching assignments');
            }

            let departments: AssignedDepartment[] = await response.json();

            if (!Array.isArray(departments)) {
                departments = [];
                console.warn('departments is not an array');
            }
            setAssignedDepartments(departments);
        } catch (error) {
            console.error('Error fetching assignments:', error);
            setSnackbar({
                open: true,
                message: 'Failed to fetch assigned departments',
                severity: 'error'
            });
        }
    }, []);

    const fetchDepartments = useCallback(async () => {
        if (!userData) {
            console.error('User data is not available');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${URLAPI}/departments_it`);
            if (!response.ok) throw new Error('Failed to fetch departments');

            const data = await response.json();
            setDepartments(data);
        } catch (error) {
            setError('Error fetching departments');
            setSnackbar({
                open: true,
                message: 'Failed to fetch departments',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    }, [userData]);

    const handleSelectDepartment = async (department: Department) => {
        if (readOnly) return;
        if (!userData) {
            console.error('User data is not available');
            return;
        }

        // Check for duplicate department
        const isDuplicate = assignedDepartments.some(
            assigned => assigned.id_department === department.id_department_it
        );

        if (isDuplicate) {
            setSnackbar({
                open: true,
                message: 'แผนกนี้ได้รับมอบหมายแล้ว',
                severity: 'error'
            });
            return;
        }

        try {
            const response = await fetch(
                `${URLAPI}/assign_department/${requestId}?id_department=${department.id_department_it}&username=${userData.username}`,
                { method: 'POST' }
            );
            if (!response.ok) throw new Error('Error assigning department');

            // Refresh assignments after successful addition
            await fetchAssignments(requestId);

            setSnackbar({
                open: true,
                message: 'แผนกที่ได้รับมอบหมายเรียบร้อยแล้ว',
                severity: 'success'
            });

            handleClose();
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการเพิ่มแผนก:', error);
            setSnackbar({
                open: true,
                message: 'ไม่สามารถมอบหมายแผนกได้',
                severity: 'error'
            });
        }
    };

    const handleRemoveDepartment = async (id_req_dep: number) => {
        if (readOnly) return;
        try {
            const response = await fetch(`${URLAPI}/assign_department/${id_req_dep}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('ไม่สามารถลบแผนกได้');
            }

            // Refresh assignments after successful deletion
            await fetchAssignments(requestId);

            setSnackbar({
                open: true,
                message: 'ลบแผนกเรียบร้อยแล้ว',
                severity: 'success'
            });
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการลบแผนก:', error);
            setSnackbar({
                open: true,
                message: 'ไม่สามารถลบแผนกได้',
                severity: 'error'
            });
        }
    };

    const handleClickOpen = () => {
        if (readOnly) return;
        if (userData) {
            setOpen(true);
            fetchDepartments();
        } else {
            setSnackbar({
                open: true,
                message: 'ไม่มีข้อมูลผู้ใช้',
                severity: 'error'
            });
        }
    };

    const handleClose = () => {
        setOpen(false);
        setSearchQuery('');
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const filteredDepartments = departments.filter((department) =>
        department.name_department_it.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const randomColor = (id: number) => {
        const colors = ['#FF8A80', '#FFD180', '#FF9E80', '#E1BEE7', '#BBDEFB', '#C5E1A5'];
        return colors[id % colors.length];
    };

    // User Authentication Check
    const isITStaff = useMemo(() => {
        return userData?.id_section === 28 ||
            userData?.id_division_competency === 86 ||
            userData?.id_section_competency === 28;
    }, [userData]);

    return (
        <>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 ,  flexWrap: 'wrap'}}>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                {!readOnly && isITStaff && (
                    <Chip
                        icon={<LocalOfferIcon sx={{ fontSize: 16 }} />}
                        // label="Tags"
                        onClick={handleClickOpen}
                        size="small"
                        sx={{
                            backgroundColor: 'transparent',
                            height: '24px',
                            cursor: 'pointer',
                            '& .MuiChip-label': { px: 1, fontSize: '0.75rem' },
                            '& .MuiChip-icon': { color: '#1976d2', ml: '4px' },
                            '&:hover': { backgroundColor: '#e3f2fd' }
                        }}
                    />
                )}
            </Stack>
            {assignedDepartments.length > 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {assignedDepartments.map((dept) => (
                        <Chip
                            key={dept.id_req_dep}
                            color="primary"
                            variant="outlined"
                            icon={<LocalOfferIcon sx={{ fontSize: 16 }} />}
                            label={`${dept.name_department}`}
                            onDelete={
                                !readOnly && isITStaff
                                    ? () => handleRemoveDepartment(dept.id_req_dep)
                                    : undefined
                            }
                            deleteIcon={
                                !readOnly && isITStaff
                                    ? <DeleteIcon />
                                    : undefined
                            }
                            sx={{
                                backgroundColor: randomColor(dept.id_department),
                                '& .MuiChip-deleteIcon': {
                                    color: '#f44336',
                                    ml: '4px'
                                }
                            }}
                        />
                    ))}
                </Box>
            ) : (
                <Typography 
                color="text.secondary"
                fontSize="0.777rem"
                >No Tags</Typography>
            )}

            <Dialog open={open} onClose={handleClose} PaperProps={{ sx: { width: '100%', maxWidth: 500 } }}>
                <DialogTitle>เลือกแผนก</DialogTitle>
                <DialogContent>
                    <Box sx={{ mb: 2, mt: 1 }}>
                        <TextField
                            autoFocus
                            placeholder="ค้นหาแผนก..."
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </Box>
                    <Box>
                        {loading && <Typography variant="body2">Loading...</Typography>}
                        {error && <Typography variant="body2" color="error">{error}</Typography>}
                        {filteredDepartments.length === 0 && !loading && !error ? (
                            <Typography variant="body2">ไม่พบแผนก</Typography>
                        ) : (
                            <List>
                                {filteredDepartments.map((department) => (
                                    <ListItem
                                        component={Button}
                                        key={department.id_department_it}
                                        onClick={() => handleSelectDepartment(department)}
                                    >
                                        <ListItemAvatar>
                                            <Avatar sx={{ bgcolor: randomColor(department.id_department_it) }}>
                                                {department.name_department_it[0]?.toUpperCase()}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={department.name_department_it} />
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        ปิด
                    </Button>
                </DialogActions>
            </Dialog>
            </Box>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default AssigneeDepSelector;