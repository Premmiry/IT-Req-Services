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
}

const AssigneeDepSelector: React.FC<AssigneeDepSelectorProps> = ({ requestId }) => {
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
                message: 'This department is already assigned',
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
                message: 'Department assigned successfully',
                severity: 'success'
            });

            handleClose();
        } catch (error) {
            console.error('Error adding department:', error);
            setSnackbar({
                open: true,
                message: 'Failed to assign department',
                severity: 'error'
            });
        }
    };

    const handleRemoveDepartment = async (id_req_dep: number) => {
        try {
            const response = await fetch(`${URLAPI}/assign_department/${id_req_dep}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to remove department');
            }

            // Refresh assignments after successful deletion
            await fetchAssignments(requestId);

            setSnackbar({
                open: true,
                message: 'Department removed successfully',
                severity: 'success'
            });
        } catch (error) {
            console.error('Error removing department:', error);
            setSnackbar({
                open: true,
                message: 'Failed to remove department',
                severity: 'error'
            });
        }
    };

    const handleClickOpen = () => {
        setOpen(true);
        fetchDepartments();
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

    const randomColor = () => {
        const colors = ['#FF8A80', '#FFD180', '#FF9E80', '#E1BEE7', '#BBDEFB', '#C5E1A5'];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    return (
        <Box>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                <Chip
                    icon={<LocalOfferIcon sx={{ fontSize: 16 }} />}
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
            {assignedDepartments.length > 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {assignedDepartments.map((dept) => (
                        <Chip
                            key={dept.id_req_dep}
                            color="primary"
                            deleteIcon={<DeleteIcon />}
                            variant="outlined"
                            icon={<LocalOfferIcon sx={{ fontSize: 16 }} />}
                            label={`${dept.name_department} (${dept.user_assigned})`}
                            onDelete={() => handleRemoveDepartment(dept.id_req_dep)}
                        />
                    ))}
                </Box>
            ) : (
                <Typography color="text.secondary">No departments assigned</Typography>
            )}

            <Dialog open={open} onClose={handleClose} PaperProps={{ sx: { width: '100%', maxWidth: 500 } }}>
                <DialogTitle>Select department</DialogTitle>
                <DialogContent>
                    <Box sx={{ mb: 2, mt: 1 }}>
                        <TextField
                            autoFocus
                            placeholder="Search department..."
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
                                    <ListItem 
                                        component={Button} 
                                        key={department.id_department_it} 
                                        onClick={() => handleSelectDepartment(department)}
                                    >
                                        <ListItemAvatar>
                                            <Avatar sx={{ bgcolor: randomColor() }}>
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
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

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
        </Box>
    );
};

export default AssigneeDepSelector;