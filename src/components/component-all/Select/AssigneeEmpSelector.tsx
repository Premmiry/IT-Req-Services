import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Avatar, AvatarGroup, Menu, MenuItem, Typography, Box, ListItemAvatar, ListItemText, TextField, Snackbar, Alert, IconButton, Tooltip } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CloseIcon from '@mui/icons-material/Close';
import URLAPI from '../../../URLAPI';

// Interfaces
interface Employee {
    id: number;
    id_emp: number;
    emp_name: string;
    name_department?: string;
    position?: string;
    phone?: string;
}

interface AssignedEmployee {
    id: number;
    id_req_emp: number;
    req_id: number;
    id_emp: number;
    emp_name?: string;
    name_department?: string;
    position?: string;
    user_assigned: string;
    assigned_date: string;
}

interface AssigneeEmpSelectorProps {
    requestId: number;
    readOnly?: boolean;
    typedata?: 'main' | 'subtask';
}

const AssigneeEmpSelector: React.FC<AssigneeEmpSelectorProps> = ({
    requestId,
    readOnly = false,
    typedata = 'main'
}) => {
    // State Management
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState<any | null>(null);
    const [admin, setAdmin] = useState<string | null>(null);
    const [assignedEmployees, setAssignedEmployees] = useState<AssignedEmployee[]>([]);

    // Notification State
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const getApiEndpoint = useCallback(() => {
        return typedata === 'subtask' 
            ? `${URLAPI}/assigned_employee_sub/${requestId}`
            : `${URLAPI}/assigned_employee/${requestId}`;
    }, [requestId, typedata]);

    const postApiEndpoint = useCallback((empId: number, username: string) => {
        return typedata === 'subtask'
            ? `${URLAPI}/assign_employee_sub/${requestId}?id_emp=${empId}&username=${username}`
            : `${URLAPI}/assign_employee/${requestId}?id_emp=${empId}&username=${username}`;
    }, [requestId, typedata]);

    const deleteApiEndpoint = useCallback((id_req_emp: number) => {
        return typedata === 'subtask'
            ? `${URLAPI}/assign_employee_sub/${id_req_emp}`
            : `${URLAPI}/assign_employee/${id_req_emp}`;
    }, [typedata]);
    // Utility Functions
    const showNotification = (message: string, severity: 'success' | 'error' = 'success') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    // User Authentication Check
    const isITStaff = useMemo(() => {
        return userData?.id_section === 28 ||
            userData?.id_division_competency === 86 ||
            userData?.id_section_competency === 28;
    }, [userData]);

    // Lifecycle Hooks
    useEffect(() => {
        const storedUserData = sessionStorage.getItem('userData');
        const storedAdmin = sessionStorage.getItem('admin');
        if (storedUserData) {
            setUserData(JSON.parse(storedUserData));
        }
        if (storedAdmin) {
            setAdmin(storedAdmin);
        }
    }, []);

    useEffect(() => {
        if (userData && requestId) {
            fetchAssignments();
        }
    }, [userData, requestId]);

    // Fetch Assignments
    const fetchAssignments = useCallback(async () => {
        try {
            const response = await fetch(getApiEndpoint());
            if (!response.ok) {
                throw new Error('Error fetching assignments');
            }

            const employees: AssignedEmployee[] = await response.json();
            setAssignedEmployees(Array.isArray(employees) ? employees : []);
        } catch (error) {
            console.error('Error fetching assignments:', error);
            showNotification('เรียกข้อมูลงานไม่สำเร็จ', 'error');
        }
    }, [getApiEndpoint]);


    // Fetch Employees
    const fetchEmployees = useCallback(async () => {
        if (!userData) {
            showNotification('ไม่มีข้อมูลผู้ใช้', 'error');
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`${URLAPI}/employee`);
            if (!response.ok) throw new Error('Failed to fetch employees');

            const data = await response.json();
            setEmployees(data);
        } catch (error) {
            showNotification('Error fetching employees', 'error');
        } finally {
            setLoading(false);
        }
    }, [userData]);

    // Menu Handlers
    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
        if (readOnly || !userData) return;
        setAnchorEl(event.currentTarget);
        fetchEmployees();
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
        setSearchQuery('');
    };

    // Employee Selection
    const handleSelectEmployee = async (employee: Employee) => {
        if (readOnly) return;

        if (!userData) {
            showNotification('User data is not available', 'error');
            return;
        }

        const isDuplicate = assignedEmployees.some(emp => emp.id_emp === employee.id_emp);
        if (isDuplicate) {
            showNotification('พนักงานคนนี้ได้รับมอบหมายแล้ว !!!', 'error');
            handleCloseMenu();
            return;
        }

        try {
            const response = await fetch(
                postApiEndpoint(employee.id_emp, userData.username),
                { method: 'POST' }
            );
            if (!response.ok) throw new Error('Error assigning employee');

            await fetchAssignments();
            showNotification('พนักงานที่ได้รับมอบหมายเรียบร้อยแล้ว');
            handleCloseMenu();
        } catch (error) {
            showNotification('ไม่สามารถมอบหมายพนักงานได้', 'error');
        }
    };

    // Update handleRemoveEmployee to use the correct endpoint
    const handleRemoveEmployee = async (id_req_emp: number) => {
        if (readOnly) return;

        try {
            const response = await fetch(deleteApiEndpoint(id_req_emp), {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('ไม่สามารถลบพนักงานได้');
            }

            await fetchAssignments();
            showNotification('ลบพนักงานเรียบร้อยแล้ว');
        } catch (error) {
            showNotification('ไม่สามารถลบพนักงานได้', 'error');
        }
    };

    // Utility Functions
    const randomColor = () => {
        const colors = ['#FF8A80', '#FFD180', '#FF9E80', '#E1BEE7', '#BBDEFB', '#C5E1A5'];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    // Filtering Employees
    const filteredEmployees = employees.filter((employee) =>
        employee.emp_name.toLowerCase().includes(searchQuery.toLowerCase()) && employee.id_emp
    );

    return (
        <>

            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, flexWrap: 'wrap' }}>
                {/* Add Employee Trigger */}
                {!readOnly && admin === 'ADMIN' && (
                    <Typography
                        onClick={handleOpenMenu}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            color: 'primary.main',
                            '& .MuiChip-label': { px: 1, fontSize: '0.75rem' },
                            '& .MuiChip-icon': { color: '#1976d2', ml: '4px' },
                            '&:hover': { backgroundColor: '#e3f2fd' }
                        }}
                    >
                        <PersonAddIcon sx={{ mr: 2, fontSize: 20 }} />

                    </Typography>
                )}
                {/* Assigned Employees Avatar Group */}
                {assignedEmployees.length > 0 ? (
                    <AvatarGroup
                        max={4}
                        sx={{ mr: 2 }}
                        total={assignedEmployees.length}
                    >
                        {assignedEmployees.slice(0, 4).map((emp) => (
                            <Box
                                key={emp.id_req_emp}
                                sx={{
                                    position: 'relative',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    '&:hover .remove-button': {
                                        visibility: 'visible',
                                    }
                                }}
                            >
                                <Tooltip title={emp.emp_name || ''} arrow>
                                    <Avatar
                                        sx={{
                                            bgcolor: randomColor(),
                                            width: 32,
                                            height: 32,
                                            fontSize: '0.875rem',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {emp.emp_name?.[0]?.toUpperCase()}
                                    </Avatar>
                                </Tooltip>
                                {!readOnly && admin === 'ADMIN' && (
                                    <IconButton
                                        className="remove-button"
                                        size="small"
                                        onClick={() => handleRemoveEmployee(emp.id_req_emp)}
                                        sx={{
                                            position: 'absolute',
                                            top: -8,
                                            right: -8,
                                            backgroundColor: 'error.main',
                                            color: 'white',
                                            width: 16,
                                            height: 16,
                                            visibility: 'hidden',
                                            '&:hover': {
                                                backgroundColor: 'error.dark'
                                            }
                                        }}
                                    >
                                        <CloseIcon sx={{ fontSize: 12 }} />
                                    </IconButton>
                                )}
                            </Box>
                        ))}
                    </AvatarGroup>
                ) : (
                    <Typography color="text.secondary" fontSize="0.777rem">
                        No Assignees
                    </Typography>
                )}

                {/* Employee Selection Menu */}
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleCloseMenu}
                    PaperProps={{
                        sx: {
                            width: 300,
                            maxHeight: 400
                        }
                    }}
                >
                    <Box sx={{ p: 2 }}>
                        <TextField
                            placeholder="ค้นหาชื่อพนักงาน..."
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                    </Box>

                    {loading ? (
                        <MenuItem disabled>กำลังโหลด...</MenuItem>
                    ) : filteredEmployees.length === 0 ? (
                        <MenuItem disabled>ไม่พบพนักงาน</MenuItem>
                    ) : (
                        filteredEmployees.map((employee) => (
                            <MenuItem
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
                                    secondary={employee.name_department || 'N/A'}
                                />
                            </MenuItem>
                        ))
                    )}
                </Menu>
            </Box>

            {/* Notification Snackbar */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
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