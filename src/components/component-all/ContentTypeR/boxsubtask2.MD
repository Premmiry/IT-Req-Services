import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton, Select, MenuItem, TextField, Snackbar, Alert } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
    AddCircleOutline as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Save as SaveIcon
} from '@mui/icons-material';
import dayjs from 'dayjs';
import URLAPI from '../../../URLAPI';

interface SubtaskProps {
    req_id: number;
}

interface SubtaskData {
    id: number;
    sub_id: number;
    req_id: number;
    name: string;
    startdate: string | null;
    duedate: string | null;
    status: number;
    id_priority?: number | null;
}

interface StatusOption {
    status_id: number;
    status_name: string;
}

interface PriorityOption {
    id_priority: number;
    name_priority: string;
}

const SUBTASK: React.FC<SubtaskProps> = ({ req_id }) => {
    const [rows, setRows] = useState<SubtaskData[]>([]);
    const [statusOptions, setStatusOptions] = useState<StatusOption[]>([]);
    const [priorityOptions, setPriorityOptions] = useState<PriorityOption[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const fetchSubtasks = async () => {
        try {
            const response = await fetch(`${URLAPI}/subtask/${req_id}`);
            const data = await response.json();
            const formattedData = data.map((item: any, index: number) => ({
                ...item,
                id: index + 1,
            }));
            setRows(formattedData);
        } catch (error) {
            console.error('Error fetching subtasks:', error);
        }
    };

    const fetchStatusOptions = async () => {
        try {
            const response = await fetch(`${URLAPI}/mt_status`);
            const data = await response.json();
            setStatusOptions(data);
        } catch (error) {
            console.error('Error fetching status options:', error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchSubtasks();
        fetchStatusOptions();
        fetchPriorityOptions();
    }, [req_id]);

    const fetchPriorityOptions = async () => {
        try {
            const response = await fetch(`${URLAPI}/priorities`);
            const data = await response.json();
            setPriorityOptions(data);
            console.log(data);
        } catch (error) {
            console.error('Error fetching priority options:', error);
        }
        setIsLoading(false);
    };

    const handleAddRow = () => {
        const newRow: SubtaskData = {
            id: rows.length + 1,
            sub_id: 0,
            req_id: req_id,
            name: '',
            startdate: null,
            duedate: null,
            status: statusOptions.length > 0 ? statusOptions[0].status_id : 18, // Set default status
            id_priority: null // Set default priority
        };
        setRows([...rows, newRow]);
    };

    const updateSubtask = async (row: SubtaskData, field: keyof SubtaskData, value: string | null) => {
        if (!value) return;

        setIsLoading(true);
        const updateData = { [field]: value };

        try {
            const response = await fetch(`${URLAPI}/subtask/${row.sub_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                const errorMessage = errorData?.detail || 'Failed to update subtask';
                throw new Error(errorMessage);
            }

            const data = await response.json();
            console.log(`${field} updated successfully:`, data);
        } catch (error) {
            console.error('Error updating subtask:', error);
            setSnackbarMessage('An error occurred while updating the subtask');
            setSnackbarOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveRow = async (row: SubtaskData) => {
        if (!row.name.trim()) {
            setSnackbarMessage('Please enter a name for the subtask');
            setSnackbarOpen(true);
            return;
        }

        if (row.startdate && row.duedate && dayjs(row.startdate).isAfter(dayjs(row.duedate))) {
            setSnackbarMessage('Start date cannot be after due date');
            setSnackbarOpen(true);
            return;
        }

        // Ensure status is valid
        const validStatus = statusOptions.find(option => option.status_id === row.status);
        if (!validStatus) {
            setSnackbarMessage('Invalid status selected');
            setSnackbarOpen(true);
            return;
        }

        try {
            if (row.sub_id === 0) {
                // Create new subtask
                const response = await fetch(`${URLAPI}/subtask/${req_id}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: row.name,
                        status: row.status,
                        req_id: req_id,
                        id_priority: row.id_priority
                    })
                });
                const data = await response.json();
                if (data.status === 'success') {
                    fetchSubtasks(); // Refresh the list
                    setSnackbarMessage('Subtask created successfully');
                    setSnackbarOpen(true);
                }
            } else {
                // Update existing subtask
                const response = await fetch(`${URLAPI}/subtask/${row.sub_id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: row.name,
                        id_priority: row.id_priority
                    })
                });
                const data = await response.json();
                if (data.status === 'success') {
                    fetchSubtasks(); // Refresh the list
                    setSnackbarMessage('Subtask updated successfully');
                    setSnackbarOpen(true);
                }
            }
        } catch (error) {
            console.error('Error saving subtask:', error);
            setSnackbarMessage('Error saving subtask');
            setSnackbarOpen(true);
        }
    };

    const handleDeleteRow = async (row: SubtaskData) => {
        if (row.sub_id === 0) {
            // Remove unsaved row directly
            setRows(rows.filter(r => r.id !== row.id));
            return;
        }

        // Confirm before deleting saved row
        if (!window.confirm('Are you sure you want to delete this subtask?')) {
            return;
        }

        try {
            const response = await fetch(`${URLAPI}/subtask/${row.sub_id}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (data.status === 'success') {
                fetchSubtasks(); // Refresh the list
            }
        } catch (error) {
            console.error('Error deleting subtask:', error);
            setSnackbarMessage('Error deleting subtask');
            setSnackbarOpen(true);
        }
    };

    const handleDateStartChange = (row: SubtaskData, newValue: dayjs.Dayjs | null) => {
        if (!newValue) return;
        const updatedRows = rows.map(r =>
            r.id === row.id ? { ...r, startdate: newValue.toISOString() } : r
        );
        if (row.duedate && newValue.isAfter(dayjs(row.duedate))) {
            setSnackbarMessage('Start date cannot be more than the Due date');
            setSnackbarOpen(true);
            return;
        }
        setRows(updatedRows);
        updateSubtask(row, 'startdate', newValue.format('YYYY-MM-DD'));
        setSnackbarMessage('Start date updated successfully');
        setSnackbarOpen(true);
    };

    const handleDateEndChange = (row: SubtaskData, newValue: dayjs.Dayjs | null) => {
        if (!newValue) return;
        if (!row.startdate) {
            setSnackbarMessage('Please select a start date first');
            setSnackbarOpen(true);
            return;
        }
        if (newValue.isBefore(dayjs(row.startdate))) {
            setSnackbarMessage('Due date cannot be less than the start date');
            setSnackbarOpen(true);
            return;
        }
        const updatedRows = rows.map(r =>
            r.id === row.id ? { ...r, duedate: newValue.toISOString() } : r
        );
        setRows(updatedRows);
        updateSubtask(row, 'duedate', newValue.format('YYYY-MM-DD'));
        setSnackbarMessage('Due date updated successfully');
        setSnackbarOpen(true);
    };

    const handleStatusChange = (row: SubtaskData, newValue: number) => {
        const updatedRows = rows.map(r =>
            r.id === row.id ? { ...r, status: newValue } : r
        );
        setRows(updatedRows);
        updateSubtask(row, 'status', String(newValue));
        setSnackbarMessage('Status updated successfully');
        setSnackbarOpen(true);
    };

    const handlePriorityChange = (row: SubtaskData, newValue: number | null) => {
        const updatedRows = rows.map(r =>
            r.id === row.id ? { ...r, id_priority: newValue } : r
        );
        setRows(updatedRows);
        updateSubtask(row, 'id_priority', newValue === null ? null : String(newValue));
        setSnackbarMessage('Priority updated successfully');
        setSnackbarOpen(true);
    };

    const columns = [
        {
            field: 'id',
            headerName: 'No.',
            width: 70,
        },
        {
            field: 'name',
            headerName: 'Name',
            width: 300,
            renderCell: (params: any) => (
                <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginTop: '5px' }}>
                    <TextField
                        value={params.row.name || ''}
                        onChange={(e) => {
                            const updatedRows = rows.map(row =>
                                row.id === params.row.id ? { ...row, name: e.target.value } : row
                            );
                            setRows(updatedRows);
                        }}
                        size="small"
                        fullWidth
                    />
                    <IconButton
                        onClick={() => handleSaveRow(params.row)}
                        size="small"
                        color="primary"
                        sx={{ ml: 1 }}
                    >
                        {params.row.sub_id ? <EditIcon /> : <SaveIcon />}
                    </IconButton>
                </div>
            ),
        },
        {
            field: 'startdate',
            headerName: 'Start Date',
            width: 200,
            renderCell: (params: any) => (
                <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginTop: '5px' }}>
                    <DatePicker
                        value={params.row.startdate ? dayjs(params.row.startdate) : null}
                        onChange={(newValue) => handleDateStartChange(params.row, newValue)}
                        format='DD-MM-YYYY'
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                size: 'small',
                                disabled: isLoading
                            }
                        }}
                        disabled={isLoading}
                    />
                </div>
            ),
        },
        {
            field: 'duedate',
            headerName: 'Due Date',
            width: 200,
            renderCell: (params: any) => (
                <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginTop: '5px' }}>
                    <DatePicker
                        value={params.row.duedate ? dayjs(params.row.duedate) : null}
                        onChange={(newValue) => handleDateEndChange(params.row, newValue)}
                        format='DD-MM-YYYY'
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                size: 'small',
                                disabled: isLoading
                            }
                        }}
                        disabled={isLoading}
                    />
                </div>
            ),
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 150,
            renderCell: (params: any) => (
                <Select
                    value={params.row.status}
                    // onChange={(e) => {
                    //     const updatedRows = rows.map(row =>
                    //         row.id === params.row.id ? { ...row, status: e.target.value as number } : row
                    //     );
                    //     setRows(updatedRows);
                    // }}
                    onChange={(e) => handleStatusChange(params.row, e.target.value as number)}
                    size="small"
                    fullWidth
                >
                    {statusOptions.map((option) => (
                        <MenuItem key={option.status_id} value={option.status_id}>
                            {option.status_name}
                        </MenuItem>
                    ))}
                </Select>
            ),
        },
        {
            field: 'id_priority',
            headerName: `Priority`,
            width: 150,
            renderCell: (params: any) => (
                <Select
                    value={params.row.id_priority || ''}
                    // onChange={(e) => {
                    //     const updatedRows = rows.map(row =>
                    //         row.id === params.row.id ? { ...row, id_priority: e.target.value as number } : row
                    //     );
                    //     setRows(updatedRows);
                    // }}
                    onChange={(e) => handlePriorityChange(params.row, e.target.value as number)}
                    size="small"
                    fullWidth
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {priorityOptions.map((option) => (
                        <MenuItem key={option.id_priority} value={option.id_priority}>
                            {option.name_priority}
                        </MenuItem>
                    ))}
                </Select>
            ),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 120,
            renderCell: (params: any) => (
                <div>
                    <IconButton
                        onClick={() => handleDeleteRow(params.row)}
                        size="small"
                        color="error"
                    >
                        <DeleteIcon />
                    </IconButton>
                </div>
            ),
        },
    ];

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div>
                <div style={{ marginBottom: '1rem' }}>
                    <IconButton onClick={handleAddRow} color="primary">
                        <AddIcon />
                    </IconButton>
                </div>
                <div style={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 5 },
                            },
                        }}
                        pageSizeOptions={[5, 10]}
                    />
                </div>
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={2000}
                    onClose={() => setSnackbarOpen(false)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <Alert onClose={() => setSnackbarOpen(false)} severity="info" sx={{ width: '100%' }}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </div>
        </LocalizationProvider>
    );
};

export default SUBTASK;