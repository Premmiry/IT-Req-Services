import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
    IconButton,
    Select,
    MenuItem,
    TextField,
    Snackbar,
    Alert,
    Typography,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
    AddCircleOutline as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Save as SaveIcon,
} from "@mui/icons-material";
import dayjs from "dayjs";
import URLAPI from "../../../URLAPI";
import AssigneeEmpSelector from "../Select/AssigneeEmpSelector";
import AssigneeDepSelector from "../Select/AssigneeDepSubSelector";
import { Tooltip } from '@mui/material';
import EditCalendarRoundedIcon from '@mui/icons-material/EditCalendarRounded';
import { styled } from '@mui/material/styles';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';

const StyledButton = styled(IconButton)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius,
    size: 20,
}));

const StyledDay = styled(PickersDay)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius,
    color: theme.palette.primary.light,
    '&.Mui-selected': {
        color: theme.palette.warning.dark,
    },
}));

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
    id_priority?: string | null;
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
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [editingRowId, setEditingRowId] = useState<number | null>(null);
    const [hoveredRowId, setHoveredRowId] = useState<number | null>(null);

    const fetchSubtasks = async () => {
        try {
            const response = await fetch(`${URLAPI}/subtask/${req_id}`);
            const data = await response.json();

            // Check if data is an array before mapping
            if (Array.isArray(data)) {
                const formattedData = data.map((item: any, index: number) => ({
                    ...item,
                    id: index + 1,
                }));
                setRows(formattedData);
            } else {
                console.error("Fetched data is not an array:", data);
                setRows([]);
            }
        } catch (error) {
            console.error("Error fetching subtasks:", error);
            setRows([]);
        }
    };

    const fetchStatusOptions = async () => {
        try {
            const response = await fetch(`${URLAPI}/mt_status`);
            const data = await response.json();
            setStatusOptions(data);
        } catch (error) {
            console.error("Error fetching status options:", error);
        }
        setIsLoading(false);
    };

    const fetchPriorityOptions = async () => {
        try {
            const response = await fetch(`${URLAPI}/priorities`);
            const data = await response.json();
            setPriorityOptions(data);
            console.log(data);
        } catch (error) {
            console.error("Error fetching priority options:", error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchSubtasks();
        fetchStatusOptions();
        fetchPriorityOptions();
    }, [req_id]);

    const handleAddRow = () => {
        const newRow: SubtaskData = {
            id: rows.length + 1,
            sub_id: 0,
            req_id: req_id,
            name: "",
            startdate: null,
            duedate: null,
            status: statusOptions.length > 0 ? statusOptions[0].status_id : 18, // Set default status
            id_priority: null, // Set default priority
        };
        setRows([...rows, newRow]);
        setEditingRowId(newRow.id); // Set the new row to be in editing mode
    };

    const updateSubtask = async (
        row: SubtaskData,
        field: keyof SubtaskData,
        value: string | null
    ) => {
        setIsLoading(true);
        const updateData = { [field]: value };

        try {
            const response = await fetch(`${URLAPI}/subtask/${row.sub_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updateData),
            });
            console.log(updateData);

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                const errorMessage = errorData?.detail || "Failed to update subtask";
                throw new Error(errorMessage);
            }

            const data = await response.json();
            console.log(`${field} updated successfully:`, data);
        } catch (error) {
            console.error("Error updating subtask:", error);
            setSnackbarMessage("An error occurred while updating the subtask");
            setSnackbarOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveRow = async (row: SubtaskData) => {
        if (!row.name.trim()) {
            setSnackbarMessage("Please enter a name for the subtask");
            setSnackbarOpen(true);
            return;
        }

        if (
            row.startdate &&
            row.duedate &&
            dayjs(row.startdate).isAfter(dayjs(row.duedate))
        ) {
            setSnackbarMessage("Start date cannot be after due date");
            setSnackbarOpen(true);
            return;
        }

        const validStatus = statusOptions.find(
            (option) => option.status_id === row.status
        );
        if (!validStatus) {
            setSnackbarMessage("Invalid status selected");
            setSnackbarOpen(true);
            return;
        }

        try {
            if (row.sub_id === 0) {
                const response = await fetch(`${URLAPI}/subtask/${req_id}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: row.name,
                        status: row.status,
                        req_id: req_id,
                        id_priority: row.id_priority || null,
                    }),
                });
                const data = await response.json();
                if (data.status === "success") {
                    fetchSubtasks(); // Refresh the list
                    setSnackbarMessage("Subtask created successfully");
                    setSnackbarOpen(true);
                }
            } else {
                const response = await fetch(`${URLAPI}/subtask/${row.sub_id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: row.name
                    }),
                });
                const data = await response.json();
                if (data.status === "success") {
                    fetchSubtasks();
                    setSnackbarMessage("Subtask updated successfully");
                    setSnackbarOpen(true);
                }
            }
        } catch (error) {
            console.error("Error saving subtask:", error);
            setSnackbarMessage("Error saving subtask");
            setSnackbarOpen(true);
        }
    };

    const handleDeleteRow = async (row: SubtaskData) => {
        if (row.sub_id === 0) {
            setRows(rows.filter((r) => r.id !== row.id));
            return;
        }

        if (!window.confirm("Are you sure you want to delete this subtask?")) {
            return;
        }

        try {
            const response = await fetch(`${URLAPI}/subtask/${row.sub_id}`, {
                method: "DELETE",
            });
            const data = await response.json();
            if (data.status === "success") {
                fetchSubtasks(); // Refresh the list
            }
        } catch (error) {
            console.error("Error deleting subtask:", error);
            setSnackbarMessage("Error deleting subtask");
            setSnackbarOpen(true);
        }
    };

    const handleDateStartChange = (
        row: SubtaskData,
        newValue: dayjs.Dayjs | null
    ) => {
        if (!newValue) return;
        const updatedRows = rows.map((r) =>
            r.id === row.id ? { ...r, startdate: newValue.toISOString() } : r
        );
        if (row.duedate && newValue.isAfter(dayjs(row.duedate))) {
            setSnackbarMessage("Start date cannot be more than the Due date");
            setSnackbarOpen(true);
            return;
        }
        setRows(updatedRows);
        updateSubtask(row, "startdate", newValue.format("YYYY-MM-DD"));
        setSnackbarMessage("Start date updated successfully");
        setSnackbarOpen(true);
    };

    const handleDateEndChange = (
        row: SubtaskData,
        newValue: dayjs.Dayjs | null
    ) => {
        if (!newValue) return;
        if (!row.startdate) {
            setSnackbarMessage("Please select a start date first");
            setSnackbarOpen(true);
            return;
        }
        if (newValue.isBefore(dayjs(row.startdate))) {
            setSnackbarMessage("Due date cannot be less than the start date");
            setSnackbarOpen(true);
            return;
        }
        const updatedRows = rows.map((r) =>
            r.id === row.id ? { ...r, duedate: newValue.toISOString() } : r
        );
        setRows(updatedRows);
        updateSubtask(row, "duedate", newValue.format("YYYY-MM-DD"));
        setSnackbarMessage("Due date updated successfully");
        setSnackbarOpen(true);
    };

    const handleStatusChange = (row: SubtaskData, newValue: number) => {
        const updatedRows = rows.map((r) =>
            r.id === row.id ? { ...r, status: newValue } : r
        );
        setRows(updatedRows);
        updateSubtask(row, "status", String(newValue));
        setSnackbarMessage("Status updated successfully");
        setSnackbarOpen(true);
    };

    const handlePriorityChange = (row: SubtaskData, newValue: number | null) => {
        const updatedRows = rows.map((r) =>
            r.id === row.id ? { ...r, id_priority: newValue } : r
        );
        setRows(updatedRows as SubtaskData[]);
        updateSubtask(
            row,
            "id_priority",
            newValue === null ? null : String(newValue)
        );
        setSnackbarMessage("Priority updated successfully");
        setSnackbarOpen(true);
    };

    const truncateName = (name: string, maxLength: number = 20) => {
        return name.length > maxLength ? `${name.slice(0, maxLength)}...` : name;
    };

    const columns: GridColDef[] = [
        {
            field: "id",
            headerName: "No.",
            width: 60,
        },
        {
            field: "name",
            headerName: "Name",
            width: 300,
            renderCell: (params: any) => {
                const isEditing = editingRowId === params.row.id;
                const isHovered = hoveredRowId === params.row.id;
                const isNewRow = params.row.sub_id === 0;
                return (
                    <>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                                marginTop: "5px",
                                transition: "all 0.3s ease",
                                borderRadius: "4px",
                            }}
                            onMouseEnter={() => setHoveredRowId(params.row.id)}
                            onMouseLeave={() => setHoveredRowId(null)}
                        >
                            {isEditing ? (
                                <TextField
                                    value={params.row.name || ""}
                                    onChange={(e) => {
                                        const updatedRows = rows.map((row) =>
                                            row.id === params.row.id
                                                ? { ...row, name: e.target.value }
                                                : row
                                        );
                                        setRows(updatedRows);
                                    }}
                                    size="small"
                                    fullWidth
                                />
                            ) : (
                                <Tooltip
                                    title={params.row.name}
                                    placement="top-start"
                                    arrow
                                >
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            maxWidth: '100%',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {truncateName(params.row.name)}
                                    </Typography>
                                </Tooltip>
                            )}
                            {isHovered && (
                                <div
                                    style={{
                                        marginLeft: "5px",
                                        pointerEvents: isNewRow ? "none" : "auto",
                                        opacity: isNewRow ? 0.5 : 1,
                                    }}
                                >
                                    <AssigneeDepSelector
                                        requestId={params.row.sub_id}
                                        readOnly={isNewRow}
                                    />
                                </div>
                            )}

                            {isHovered && (
                                <IconButton
                                    onClick={() => {
                                        if (isEditing) {
                                            handleSaveRow(params.row);
                                            setEditingRowId(null);
                                        } else {
                                            setEditingRowId(params.row.id);
                                        }
                                    }}
                                    size="small"
                                    color="primary"
                                    sx={{
                                        ml: 1,
                                        borderRadius: "7px",
                                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                                        backgroundColor: "#fff",
                                        transition: "all 0.3s ease",
                                        width: 20,
                                        height: 20,
                                    }}
                                >
                                    {isEditing ? <SaveIcon /> : <EditIcon />}
                                </IconButton>
                            )}
                        </div>
                    </>
                );
            },
        },
        {
            field: "startdate",
            headerName: "Start Date",
            width: 150,
            renderCell: (params: any) => (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        marginTop: "5px",
                    }}
                >
                    <DatePicker
                        value={params.row.startdate ? dayjs(params.row.startdate) : null}
                        onChange={(newValue) => handleDateStartChange(params.row, newValue)}
                        format="DD-MM-YYYY"
                        slots={{
                            openPickerIcon: EditCalendarRoundedIcon,
                            openPickerButton: StyledButton,
                            day: StyledDay,
                        }}
                        slotProps={{
                            openPickerIcon: { fontSize: 'large' },
                            openPickerButton: { color: 'primary' },
                            textField: {
                                variant: 'standard',
                                focused: true,
                                color: 'primary',
                            },

                        }}
                        disabled={isLoading}
                    />
                </div>
            ),
        },
        {
            field: "duedate",
            headerName: "Due Date",
            width: 150,
            renderCell: (params: any) => (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        marginTop: "5px",
                    }}
                >
                    <DatePicker
                        value={params.row.duedate ? dayjs(params.row.duedate) : null}
                        onChange={(newValue) => handleDateEndChange(params.row, newValue)}
                        format="DD-MM-YYYY"
                        slots={{
                            openPickerIcon: EditCalendarRoundedIcon,
                            openPickerButton: StyledButton,
                            day: StyledDay,
                        }}
                        slotProps={{
                            openPickerIcon: { fontSize: 'large' },
                            openPickerButton: { color: 'secondary' },
                            textField: {
                                variant: 'standard',
                                focused: true,
                                color: 'secondary',
                            },
                        }}
                        disabled={isLoading}
                    />
                </div>
            ),
        },
        {
            field: "status",
            headerName: "Status",
            width: 150,
            renderCell: (params: any) => (
                <Select
                    value={params.row.status}
                    onChange={(e) =>
                        handleStatusChange(params.row, e.target.value as number)
                    }
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
            field: "id_priority",
            headerName: `Priority`,
            width: 130,
            renderCell: (params: any) => (
                <Select
                    value={params.row.id_priority || ""}
                    onChange={(e) =>
                        handlePriorityChange(params.row, e.target.value as number)
                    }
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
            field: "assignee",
            headerName: "Assignee",
            width: 150,
            renderCell: (params: any) => {
                const isNewRow = params.row.sub_id === 0;
                return (
                    <div
                        style={{
                            width: "100%",
                            pointerEvents: isNewRow ? "none" : "auto",
                            opacity: isNewRow ? 0.5 : 1,
                        }}
                    >
                        <AssigneeEmpSelector
                            requestId={params.row.sub_id}
                            readOnly={isNewRow}
                            typedata="subtask"
                        />
                    </div>
                );
            },
        },
        {
            field: "actions",
            headerName: "Actions",
            width: 80,
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
                <div style={{ marginBottom: "1rem" }}>
                    <IconButton onClick={handleAddRow} color="primary">
                        <AddIcon /> <Typography sx={{ ml: 1 }}>Add Subtask</Typography>
                    </IconButton>
                </div>
                <div style={{ height: 400, width: "100%" }}>
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
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                >
                    <Alert
                        onClose={() => setSnackbarOpen(false)}
                        severity="info"
                        sx={{ width: "100%" }}
                    >
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </div>
        </LocalizationProvider>
    );
};

export default SUBTASK;