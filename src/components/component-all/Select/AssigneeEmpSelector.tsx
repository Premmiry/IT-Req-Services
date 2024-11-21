import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Chip, 
    Avatar, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Button, 
    Typography, 
    Box, 
    List, 
    ListItem,
    ListItemAvatar, 
    ListItemText, 
    TextField, 
    Stack, 
    Snackbar, 
    Alert
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import URLAPI from '../../../URLAPI';
// URL Configuration

// TypeScript Interfaces
interface Employee {
    id: number;
    id_emp: number;
    emp_name: string;
    department?: string;
    position?: string;
}

interface AssignedEntity {
    user_assigned: string;
    assigned_date: string;
}

interface AssignedEmployee extends AssignedEntity {
    id: number;
    id_req_emp: number;
    req_id: number;
    id_emp: number;
    emp_name?: string;
    department?: string;
    position?: string;
}

interface AssigneeEmpSelectorProps {
    requestId: number;
    readOnly?: boolean;
}

// Main Component
const AssigneeEmpSelector: React.FC<AssigneeEmpSelectorProps> = ({ 
    requestId, 
    readOnly = false
}) => {
    // State Management
    const [open, setOpen] = useState(false);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userData, setUserData] = useState<any | null>(null);
    const [assignedEmployees, setAssignedEmployees] = useState<AssignedEmployee[]>([]);

    // Notification State
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    // Utility Functions
    const showNotification = (message: string, severity: 'success' | 'error' = 'success') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    // User Authentication Check
    const isITStaff = useMemo(() => {
        return userData?.id_section === 28 ||
            userData?.id_division_competency === 86 ||
            userData?.id_section_competency === 28;
    }, [userData]);

    // Lifecycle and Data Fetching
    useEffect(() => {
        const storedUserData = sessionStorage.getItem('userData');
        if (storedUserData) {
            setUserData(JSON.parse(storedUserData));
        }
    }, []);

    useEffect(() => {
        if (userData && requestId) {
            fetchAssignments();
        }
    }, [userData, requestId]);

    // Fetch Assigned Employees
    const fetchAssignments = useCallback(async () => {
        try {
            const response = await fetch(`${URLAPI}/assigned_employee/${requestId}`);
            if (!response.ok) {
                throw new Error('Error fetching assignments');
            }

            const employees: AssignedEmployee[] = await response.json();
            setAssignedEmployees(Array.isArray(employees) ? employees : []);
            showNotification('Assignments fetched successfully');
        } catch (error) {
            console.error('Error fetching assignments:', error);
            showNotification('Failed to fetch assignments', 'error');
        }
    }, [requestId]);

    // Fetch All Employees
    const fetchEmployees = useCallback(async () => {
        if (!userData) {
            showNotification('User data is not available', 'error');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${URLAPI}/employee`);
            if (!response.ok) throw new Error('Failed to fetch employees');

            const data = await response.json();
            setEmployees(data);
            setLoading(false);
        } catch (error) {
            showNotification('Error fetching employees', 'error');
            setLoading(false);
        }
    }, [userData]);

    // Dialog Handlers
    const handleClickOpen = () => {
        if (readOnly) return;
        if (userData) {
            setOpen(true);
            fetchEmployees();
        } else {
            showNotification('User data is not available', 'error');
        }
    };

    const handleClose = () => {
        setOpen(false);
        setSearchQuery('');
    };

    // Employee Selection and Removal
    const handleSelectEmployee = async (employee: Employee) => {
        if (readOnly) return;

        if (!userData) {
            showNotification('User data is not available', 'error');
            return;
        }

        // Check for duplicate employee
        const isDuplicate = assignedEmployees.some(emp => emp.id_emp === employee.id_emp);
        if (isDuplicate) {
            showNotification('This employee is already assigned', 'error');
            handleClose();
            return;
        }

        try {
            const response = await fetch(
                `${URLAPI}/assign_employee/${requestId}?id_emp=${employee.id_emp}&username=${userData.username}`,
                { method: 'POST' }
            );
            if (!response.ok) throw new Error('Error assigning employee');

            // Fetch updated assignments
            await fetchAssignments();
            showNotification('Employee assigned successfully');
            handleClose();
        } catch (error) {
            showNotification('Failed to assign employee', 'error');
        }
    };

    const handleRemoveEmployee = async (id_req_emp: number) => {
        if (readOnly) return;

        try {
            const response = await fetch(`${URLAPI}/assign_employee/${id_req_emp}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to remove employee');
            }

            // Fetch updated assignments
            await fetchAssignments();
            showNotification('Employee removed successfully');
        } catch (error) {
            showNotification('Failed to remove employee', 'error');
        }
    };

    // UI Helpers
    const filteredEmployees = employees.filter((employee) =>
        employee.emp_name.toLowerCase().includes(searchQuery.toLowerCase()) && employee.id_emp
    );

    const randomColor = () => {
        const colors = ['#FF8A80', '#FFD180', '#FF9E80', '#E1BEE7', '#BBDEFB', '#C5E1A5'];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    return (
        <>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2 }}>
                <Box>
                    {!readOnly && isITStaff && (
                        <Chip
                            icon={<PersonAddIcon sx={{ fontSize: 16 }} />}
                            label="เพิ่มเจ้าหน้าที่"
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

                    {assignedEmployees.length > 0 ? (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                            {assignedEmployees.map((emp) => (
                                <Chip
                                    key={emp.id_req_emp}
                                    color="primary"
                                    variant="outlined"
                                    avatar={
                                        <Avatar sx={{ bgcolor: randomColor() }}>
                                            {emp.emp_name?.[0]?.toUpperCase()}
                                        </Avatar>
                                    }
                                    label={`${emp.emp_name} (${emp.department || 'N/A'})`}
                                    onDelete={
                                        !readOnly && isITStaff 
                                            ? () => handleRemoveEmployee(emp.id_req_emp) 
                                            : undefined
                                    }
                                    deleteIcon={
                                        !readOnly && isITStaff 
                                            ? <DeleteIcon /> 
                                            : undefined
                                    }
                                    sx={{
                                        '& .MuiChip-deleteIcon': {
                                            color: '#f44336',
                                            ml: '4px'
                                        }
                                    }}
                                />
                            ))}
                        </Box>
                    ) : (
                        <Typography color="text.secondary">ยังไม่มีเจ้าหน้าที่ ที่ได้รับมอบหมาย</Typography>
                    )}

                    {/* Employee Selection Dialog */}
                    <Dialog 
                        open={open} 
                        onClose={handleClose} 
                        PaperProps={{ sx: { width: '100%', maxWidth: 500 } }}
                    >
                        <DialogTitle>เลือกพนักงาน</DialogTitle>
                        <DialogContent>
                            <Box sx={{ mb: 2, mt: 1 }}>
                                <TextField
                                    autoFocus
                                    placeholder="ค้นหาชื่อพนักงาน..."
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </Box>

                            <Box>
                                {loading && <Typography variant="body2">กำลังโหลด...</Typography>}
                                {error && <Typography variant="body2" color="error">{error}</Typography>}
                                {filteredEmployees.length === 0 && !loading && !error ? (
                                    <Typography variant="body2">ไม่พบพนักงาน</Typography>
                                ) : (
                                    <List>
                                        {filteredEmployees.map((employee) => (
                                            <ListItem 
                                                component={Button}
                                                key={employee.id_emp} 
                                                onClick={() => handleSelectEmployee(employee)}
                                            >
                                                <ListItemAvatar>
                                                    <Avatar sx={{ bgcolor: randomColor() }}>
                                                        {employee.emp_name?.[0]?.toUpperCase()}
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText 
                                                    primary={employee.emp_name} 
                                                    secondary={`${employee.department || 'N/A'} | ${employee.position || 'N/A'}`} 
                                                />
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
            </Stack>

            {/* Notification Snackbar */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert 
                    onClose={handleSnackbarClose} 
                    severity={snackbarSeverity} 
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default AssigneeEmpSelector;