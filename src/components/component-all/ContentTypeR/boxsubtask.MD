import React, { useEffect, useState, useCallback, memo } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { IconButton, Select, MenuItem, TextField, Snackbar, Alert } from '@mui/material';
import { DateRangePicker } from '@mui/x-date-pickers-pro';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
    AddCircleOutline as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Save as SaveIcon
} from '@mui/icons-material';
import dayjs from 'dayjs';
import URLAPI from '../../../URLAPI';

// Types
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
    id_priority: number | null;
}

interface StatusOption {
    status_id: number;
    status_name: string;
}

interface PriorityOption {
    id_priority: number;
    name_priority: string;
}

// Memoized Cell Components
const NameCell = memo(({ row, rows, setRows, onSave }: any) => (
    <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginTop: '5px' }}>
        <TextField
            value={row.name || ''}
            onChange={(e) => {
                const updatedRows = rows.map((r: SubtaskData) =>
                    r.id === row.id ? { ...r, name: e.target.value } : r
                );
                setRows(updatedRows);
            }}
            size="small"
            fullWidth
        />
        <IconButton
            onClick={() => onSave(row)}
            size="small"
            color="primary"
            sx={{ ml: 1 }}
        >
            {row.sub_id ? <EditIcon /> : <SaveIcon />}
        </IconButton>
    </div>
));

const DateRangeCell = memo(({ startDate, endDate, onStartChange, onEndChange, disabled }: any) => {
    const handleDateRangeChange = (newValue: any) => {
        const [newStart, newEnd] = newValue;
        
        if (newStart) {
            onStartChange(newStart);
        }
        if (newEnd) {
            onEndChange(newEnd);
        }
    };

    return (
        <DateRangePicker
            value={[startDate ? dayjs(startDate) : null, endDate ? dayjs(endDate) : null]}
            onChange={handleDateRangeChange}
            slots={{ field: SingleInputDateRangeField }}
            slotProps={{
                textField: {
                    size: 'small',
                    fullWidth: true,
                    disabled
                }
            }}
            format="DD-MM-YYYY"
        />
    );
});

const StatusCell = memo(({ value, onChange, options }: any) => (
    <Select
        value={value}
        onChange={onChange}
        size="small"
        fullWidth
    >
        {options.map((option: StatusOption) => (
            <MenuItem key={option.status_id} value={option.status_id}>
                {option.status_name}
            </MenuItem>
        ))}
    </Select>
));

const PriorityCell = memo(({ value, onChange, options }: any) => (
    <Select
        value={value || ''}
        onChange={onChange}
        size="small"
        fullWidth
    >
        <MenuItem value="">
            <em>None</em>
        </MenuItem>
        {options.map((option: PriorityOption) => (
            <MenuItem key={option.id_priority} value={option.id_priority}>
                {option.name_priority}
            </MenuItem>
        ))}
    </Select>
));

// Main Component
const SUBTASK: React.FC<SubtaskProps> = ({ req_id }) => {
    const [rows, setRows] = useState<SubtaskData[]>([]);
    const [statusOptions, setStatusOptions] = useState<StatusOption[]>([]);
    const [priorityOptions, setPriorityOptions] = useState<PriorityOption[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({ open: false, message: '' });

    // Snackbar handler
    const showSnackbar = useCallback((message: string) => {
        setSnackbar({ open: true, message });
    }, []);

    // API calls
    const fetchData = useCallback(async () => {
        try {
            const [subtasksRes, statusRes, priorityRes] = await Promise.all([
                fetch(`${URLAPI}/subtask/${req_id}`),
                fetch(`${URLAPI}/mt_status`),
                fetch(`${URLAPI}/priorities`)
            ]);

            const [subtasksData, statusData, priorityData] = await Promise.all([
                subtasksRes.json(),
                statusRes.json(),
                priorityRes.json()
            ]);

            setRows(subtasksData.map((item: any, index: number) => ({
                ...item,
                id: index + 1,
            })));
            setStatusOptions(statusData);
            setPriorityOptions(priorityData);
        } catch (error) {
            console.error('Error fetching data:', error);
            showSnackbar('Error loading data');
        } finally {
            setIsLoading(false);
        }
    }, [req_id, showSnackbar]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Event Handlers
    const handleAddRow = useCallback(() => {
        const newRow: SubtaskData = {
            id: rows.length + 1,
            sub_id: 0,
            req_id,
            name: '',
            startdate: null,
            duedate: null,
            status: statusOptions[0]?.status_id ?? 18,
            id_priority: null
        };
        setRows(prev => [...prev, newRow]);
    }, [rows.length, req_id, statusOptions]);

    const updateSubtask = useCallback(async (row: SubtaskData, field: keyof SubtaskData, value: any) => {
        if (!value) return;

        try {
            const response = await fetch(`${URLAPI}/subtask/${row.sub_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [field]: value }),
            });

            if (!response.ok) throw new Error('Update failed');

            showSnackbar(`${field} updated successfully`);
        } catch (error) {
            console.error('Error updating subtask:', error);
            showSnackbar('Error updating subtask');
        }
    }, [showSnackbar]);

    const handleSaveRow = async (row: SubtaskData) => {
        if (!row.name.trim()) {
            showSnackbar('Please enter a name for the subtask');
            return;
        }

        if (row.startdate && row.duedate && dayjs(row.startdate).isAfter(dayjs(row.duedate))) {
            showSnackbar('Start date cannot be after due date');
            return;
        }

        const validStatus = statusOptions.find(option => option.status_id === row.status);
        if (!validStatus) {
            showSnackbar('Invalid status selected');
            return;
        }

        try {
            if (row.sub_id === 0) {
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
                    fetchData(); // Refresh the list
                    showSnackbar('Subtask created successfully');
                }
            } else {
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
                    fetchData(); // Refresh the list
                    showSnackbar('Subtask updated successfully');
                }
            }
        } catch (error) {
            console.error('Error saving subtask:', error);
            showSnackbar('Error saving subtask');
        }
    };

    const handleDeleteRow = async (row: SubtaskData) => {
        if (row.sub_id === 0) {
            setRows(rows.filter(r => r.id !== row.id));
            return;
        }

        if (!window.confirm('Are you sure you want to delete this subtask?')) {
            return;
        }

        try {
            const response = await fetch(`${URLAPI}/subtask/${row.sub_id}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (data.status === 'success') {
                fetchData(); // Refresh the list
            }
        } catch (error) {
            console.error('Error deleting subtask:', error);
            showSnackbar('Error deleting subtask');
        }
    };

    const handleDateStartChange = (row: SubtaskData, newValue: dayjs.Dayjs | null) => {
        if (!newValue) return;
        const updatedRows = rows.map(r =>
            r.id === row.id ? { ...r, startdate: newValue.toISOString() } : r
        );
        if (row.duedate && newValue.isAfter(dayjs(row.duedate))) {
            showSnackbar('Start date cannot be more than the Due date');
            return;
        }
        setRows(updatedRows);
        updateSubtask(row, 'startdate', newValue.format('YYYY-MM-DD'));
        showSnackbar('Start date updated successfully');
    };

    const handleDateEndChange = (row: SubtaskData, newValue: dayjs.Dayjs | null) => {
        if (!newValue) return;
        if (!row.startdate) {
            showSnackbar('Please select a start date first');
            return;
        }
        if (newValue.isBefore(dayjs(row.startdate))) {
            showSnackbar('Due date cannot be less than the start date');
            return;
        }
        const updatedRows = rows.map(r =>
            r.id === row.id ? { ...r, duedate: newValue.toISOString() } : r
        );
        setRows(updatedRows);
        updateSubtask(row, 'duedate', newValue.format('YYYY-MM-DD'));
        showSnackbar('Due date updated successfully');
    };

    const handleStatusChange = (row: SubtaskData, newValue: number) => {
        const updatedRows = rows.map(r =>
            r.id === row.id ? { ...r, status: newValue } : r
        );
        setRows(updatedRows);
        updateSubtask(row, 'status', newValue);
        showSnackbar('Status updated successfully');
    };

    const handlePriorityChange = (row: SubtaskData, newValue: number | null) => {
        const updatedRows = rows.map(r =>
            r.id === row.id ? { ...r, id_priority: newValue } : r
        );
        setRows(updatedRows);
        updateSubtask(row, 'id_priority', newValue);
        showSnackbar('Priority updated successfully');
    };

    // Column Definitions
    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'No.',
            width: 70,
        },
        {
            field: 'name',
            headerName: 'Name',
            width: 300,
            renderCell: (params) => (
                <NameCell
                    row={params.row}
                    rows={rows}
                    setRows={setRows}
                    onSave={handleSaveRow}
                />
            ),
        },
        {
            field: 'dates',
            headerName: 'Date Range',
            width: 300,
            renderCell: (params) => (
                <DateRangeCell
                    startDate={params.row.startdate}
                    endDate={params.row.duedate}
                    onStartChange={(date: dayjs.Dayjs | null) => handleDateStartChange(params.row, date)}
                    onEndChange={(date: dayjs.Dayjs | null) => handleDateEndChange(params.row, date)}
                    disabled={isLoading}
                />
            ),
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 150,
            renderCell: (params) => (
                <StatusCell
                    value={params.row.status}
                    onChange={(e: any) => handleStatusChange(params.row, e.target.value as number)}
                    options={statusOptions}
                />
            ),
        },
        {
            field: 'id_priority',
            headerName: 'Priority',
            width: 150,
            renderCell: (params) => (
                <PriorityCell
                    value={params.row.id_priority}
                    onChange={(e: any) => handlePriorityChange(params.row, e.target.value as number)}
                    options={priorityOptions}
                />
            ),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 120,
            renderCell: (params) => (
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

    if (isLoading) return <div>Loading...</div>;

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
                    open={snackbar.open}
                    autoHideDuration={2000}
                    onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <Alert
                        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                        severity="info"
                        sx={{ width: '100%' }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </div>
        </LocalizationProvider>
    );
};

export default memo(SUBTASK);