import React, { useState, useEffect, useCallback } from 'react';
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
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import URLAPI from '../../../URLAPI';

const AssigneeEmpSelector = ({ requestId, selectedAssignees = [], onAssigneeChange }) => {
    const [open, setOpen] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const storedUserData = sessionStorage.getItem('userData');
        if (storedUserData) {
            setUserData(JSON.parse(storedUserData));
        }
    }, []);

    const fetchEmployees = useCallback(async () => {
        if (!userData) {
            console.error('User data is not available');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${URLAPI}/employee`);
            if (!response.ok) throw new Error('Failed to fetch employees');
            const data = await response.json();
            setEmployees(data);
        } catch (error) {
            setError('Error fetching employees');
            console.error('Error fetching employees:', error);
        } finally {
            setLoading(false);
        }
    }, [URLAPI, userData]);

    const handleClickOpen = () => {
        if (userData) {
            setOpen(true);
            fetchEmployees();
        } else {
            console.error('User data is not available');
        }
    };

    const handleClose = () => {
        setOpen(false);
        setSearchQuery('');
    };

    const handleSelectEmployee = async (employee) => {
        if (!userData) {
            console.error('User data is not available');
            return;
        }
    
        if (!employee.id_emp) {
            console.error('Employee ID is missing');
            return; // Skip if employee doesn't have an ID
        }
    
        if (selectedAssignees.some((a) => a.id_emp === employee.id_emp)) {
            console.log('Employee already assigned');
            return;
        }
    
        try {
            const response = await fetch(
                `${URLAPI}/assign_employee/${requestId}?id_emp=${employee.id_emp}&username=${userData.username}`,
                { method: 'POST' }
            );
            if (!response.ok) throw new Error('Error assigning employee');
    
            // Directly update the selectedAssignees
            onAssigneeChange((prevAssignees) => [...prevAssignees, { ...employee, id: employee.id_emp }]);
            handleClose();
        } catch (error) {
            console.error('Error adding employee:', error);
        }
    };
    
    

    const handleRemoveEmployee = async (employee) => {
        try {
            const response = await fetch(`${URLAPI}/assign_employee/${employee.id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Error removing employee');
            onAssigneeChange(selectedAssignees.filter((emp) => emp.id !== employee.id));
        } catch (error) {
            console.error('Error removing employee:', error);
        }
    };

    const filteredEmployees = employees.filter((employee) =>
        employee.emp_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Box>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                <Chip
                    icon={<PersonAddIcon sx={{ fontSize: 16 }} />}
                    label="Add Employee"
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
            </Stack>

            <Dialog open={open} onClose={handleClose} PaperProps={{ sx: { width: '100%', maxWidth: 500 } }}>
                <DialogTitle>Select Employee</DialogTitle>
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
                        {loading && <Typography variant="body2">Loading...</Typography>}
                        {error && <Typography variant="body2" color="error">{error}</Typography>}
                        {filteredEmployees.length === 0 && !loading && !error ? (
                            <Typography variant="body2">No employees available</Typography>
                        ) : (
                            <List>
                                {filteredEmployees.map((employee) => (
                                    <ListItem button key={employee.id_emp} onClick={() => handleSelectEmployee(employee)}>
                                        <ListItemAvatar>
                                            <Avatar>{employee.emp_name[0]?.toUpperCase()}</Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={employee.emp_name} />
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

           
        </Box>
    );
};

export default AssigneeEmpSelector;