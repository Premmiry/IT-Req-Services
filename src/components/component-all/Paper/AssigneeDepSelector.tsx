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

const AssigneeDepSelector = ({ requestId, selectedAssigneesDep = [], onAssigneeDepChange }) => {
    const [open, setOpen] = useState(false);
    const [departments, setDepartments] = useState([]);
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
            console.error('Error fetching departments:', error);
        } finally {
            setLoading(false);
        }
    }, [userData]);

    const handleClickOpen = () => {
        if (userData) {
            setOpen(true);
            fetchDepartments();
        } else {
            console.error('User data is not available');
        }
    };

    const handleClose = () => {
        setOpen(false);
        setSearchQuery('');
    };

    const handleSelectDepartment = async (department) => {
        if (!userData) {
            console.error('User data is not available');
            return;
        }

        if (!department.id_department_it) {
            console.error('Department ID is missing');
            return; // Skip if department doesn't have an ID
        }

        if (selectedAssigneesDep.some((a) => a.id_department_it === department.id_department_it)) {
            console.log('Department already assigned');
            return;
        }

        try {
            const response = await fetch(
                `${URLAPI}/assign_department/${requestId}?id_department=${department.id_department_it}&username=${userData.username}`,
                { method: 'POST' }
            );
            if (!response.ok) throw new Error('Error assigning department');

            // Directly update the selectedAssigneesDep
            onAssigneeDepChange((prevAssignees) => [...prevAssignees, { ...department, id: department.id_department_it }]);
            handleClose();
        } catch (error) {
            console.error('Error adding department:', error);
        }
    };

    const handleRemoveDepartment = async (department) => {
        try {
            const response = await fetch(`${URLAPI}/assign_department/${department.id_department_it}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Error removing department');
            onAssigneeDepChange(selectedAssigneesDep.filter((dep) => dep.id_department_it !== department.id_department_it));
        } catch (error) {
            console.error('Error removing department:', error);
        }
    };

    const filteredDepartments = departments.filter((department) =>
        department.name_department_it.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Box>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                <Chip
                    icon={<PersonAddIcon sx={{ fontSize: 16 }} />}
                    label="Add department"
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
                <DialogTitle>Select department</DialogTitle>
                <DialogContent>
                    <Box sx={{ mb: 2, mt: 1 }}>
                        <TextField
                            autoFocus
                            placeholder="ค้นหาชื่อแผนก..."
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
                            <Typography variant="body2">No departments available</Typography>
                        ) : (
                            <List>
                                {filteredDepartments.map((department) => (
                                    <ListItem button key={department.id_department_it} onClick={() => handleSelectDepartment(department)}>
                                        <ListItemAvatar>
                                            <Avatar>{department.name_department_it[0]?.toUpperCase()}</Avatar>
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
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AssigneeDepSelector;
