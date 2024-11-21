import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
    Avatar, 
    AvatarGroup, 
    Menu, 
    MenuItem, 
    Typography, 
    Box, 
    ListItemAvatar, 
    ListItemText, 
    TextField, 
    Snackbar, 
    Alert,
    IconButton
} from '@mui/material';
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
    nickname?: string;
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
}

const AssigneeEmpSelector: React.FC<AssigneeEmpSelectorProps> = ({ 
    requestId, 
    readOnly = false
}) => {
    // State Management
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
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

    // User Authentication Check
    const isITStaff = useMemo(() => {
        return userData?.id_section === 28 ||
            userData?.id_division_competency === 86 ||
            userData?.id_section_competency === 28;
    }, [userData]);

    // Lifecycle Hooks
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

    // Fetch Assignments
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

    // Fetch Employees
    const fetchEmployees = useCallback(async () => {
        if (!userData) {
            showNotification('User data is not available', 'error');
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
            showNotification('This employee is already assigned', 'error');
            handleCloseMenu();
            return;
        }

        try {
            const response = await fetch(
                `${URLAPI}/assign_employee/${requestId}?id_emp=${employee.id_emp}&username=${userData.username}`,
                { method: 'POST' }
            );
            if (!response.ok) throw new Error('Error assigning employee');

            await fetchAssignments();
            showNotification('Employee assigned successfully');
            handleCloseMenu();
        } catch (error) {
            showNotification('Failed to assign employee', 'error');
        }
    };

    // Employee Removal
    const handleRemoveEmployee = async (id_req_emp: number) => {
        if (readOnly) return;

        try {
            const response = await fetch(`${URLAPI}/assign_employee/${id_req_emp}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to remove employee');
            }

            await fetchAssignments();
            showNotification('Employee removed successfully');
        } catch (error) {
            showNotification('Failed to remove employee', 'error');
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
            
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                {/* Add Employee Trigger */}
                {!readOnly && isITStaff && (
                    <Typography 
                        onClick={handleOpenMenu}
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            cursor: 'pointer', 
                            color: 'primary.main' 
                        }}
                    >
                        <PersonAddIcon sx={{ mr: 1, fontSize: 20 }} />
                        เพิ่มเจ้าหน้าที่
                    </Typography>
                )}
                {/* Assigned Employees Avatar Group */}
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
                                alignItems: 'center' 
                            }}
                        >
                            <Avatar 
                                sx={{ 
                                    bgcolor: randomColor(), 
                                    width: 32, 
                                    height: 32,
                                    fontSize: '0.875rem' 
                                }}
                            >
                                {emp.emp_name?.[0]?.toUpperCase()}
                            </Avatar>
                            {!readOnly && isITStaff && (
                                <IconButton
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
                                    primary={employee.nickname} 
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