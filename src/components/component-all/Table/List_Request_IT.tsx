import { useState, useEffect, useCallback, useMemo } from "react";
import { Modal, Box, Container, Typography, Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, IconButton, Tooltip } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonCheckedSharpIcon from "@mui/icons-material/RadioButtonCheckedSharp";
import DeleteIcon from "@mui/icons-material/Delete";
import { SaveAlert } from "../Alert/alert";
import URLAPI from "../../../URLAPI";
import RequestDetail from "../Paper/RequestDetail";
import TaskIcon from "@mui/icons-material/Task";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import 'dayjs/locale/th';
import FilterListIcon from '@mui/icons-material/FilterList';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import Swal from 'sweetalert2';
import BackupTableIcon from '@mui/icons-material/BackupTable';

dayjs.extend(buddhistEra);
dayjs.locale('th');

// แยก Type ออกมาเพื่อความชัดเจน
interface RequestData {
    id: number;
    req_no: string;
    name: string;
    status_id: number;
    status: string;
    type_id: number;
    type: string;
    assignee: string;
    datecreated: string;
    topic: string;
}

interface ListRequestITProps {
    tab: number;
}

export default function ListRequestIT({ tab }: ListRequestITProps) {
    const navigate = useNavigate();
    const [rows, setRows] = useState<RequestData[]>([]);
    const [open, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [successAlert, setSuccessAlert] = useState(false);
    const [userData, setUserData] = useState<any | null>(null);
    const [admin, setAdmin] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
    const [actionType, setActionType] = useState<"delete" | "receive" | null>(null);
    const [filterType, setFilterType] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<string>('');
    const [filterDate, setFilterDate] = useState<Date | null>(null);
    const [showFilters, setShowFilters] = useState(false);

    // แยก utility functions ออกมาและใช้ useMemo เพื่อ cache ค่า
    const formatDate = useCallback((dateString: string) => {
        if (!dateString) return '';
        if (dateString.includes('/')) {
            return dateString;
        }
        return dayjs(dateString).format('DD/MM/BBBB');
    }, []);

    const getTypeColor = useMemo(() => {
        const colorMap = {
            Service: "#fc836a",
            Develop: "#9d42f9",
            Issue: "#27e16d",
        };
        return (type: string) => colorMap[type as keyof typeof colorMap] || "#81b1c9";
    }, []);

    // ใช้ useCallback สำหรับ handlers
    const handleRequest = useCallback(() => {
        navigate("/request");
    }, [navigate]);

    const handleRecieveClick = useCallback((id: number) => {
        setSelectedId(id);
        setActionType("receive");
        setOpen(true);
    }, []);

    const handleDeleteClick = useCallback((id: number) => {
        setSelectedId(id);
        setActionType("delete");
        setOpen(true);
    }, []);

    const fetchRequests = useCallback(async () => {
        if (!userData?.username || tab === undefined) return;

        setIsLoading(true);
        try {
            const response = await fetch(`${URLAPI}/it-requests?tab=${tab}`);
            if (!response.ok) throw new Error("Network response was not ok");

            const { data } = await response.json();
            const mappedData: RequestData[] = data.map((item: any) => ({
                id: item.id,
                req_no: item.rs_code,
                name: item.title_req ||
                    (item.program_name
                        ? `พัฒนาโปรแกรมต่อเนื่อง (${item.program_name})`
                        : "พัฒนาโปรแกรมต่อเนื่อง"),
                status_id: item.status_id,
                status: item.status_name,
                type_id: item.type_id,
                type: item.type,
                assignee: item.assign_name || '',
                detail_req: item.detail_req || '',
                datecreated: formatDate(item.created_at),
                topic: item.topic || '',
            }));
            setRows(mappedData);
        } catch (error) {
            console.error("Error fetching requests:", error);
        } finally {
            setIsLoading(false);
        }
    }, [userData, tab, formatDate]);

    const handleRecieve = useCallback(async () => {
        if (!selectedId) return;

        try {
            const selectedRow = rows.find(row => row.id === selectedId);
            if (!selectedRow) {
                throw new Error("ไม่พบข้อมูลที่เลือก");
            }

            let response;
            
            if ([1, 3].includes(selectedRow.type_id)) {
                response = await fetch(
                    `${URLAPI}/change_status/${selectedId}?change=admin&username=${userData?.username}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
            } else if (selectedRow.type_id === 2) {
                response = await fetch(
                    `${URLAPI}/change_status/${selectedId}?change=todo&username=${userData?.username}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
            }

            if (!response || !response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            console.log("รับงานสำเร็จ:", data);

            Swal.fire({
                title: 'รับงานสำเร็จ!',
                icon: 'success',
                confirmButtonText: 'OK',
                customClass: {
                    title: 'alert-title',
                    confirmButton: 'alert-button'
                },
                buttonsStyling: false,
            });

            fetchRequests();

        } catch (error) {
            console.error("Error receiving job:", error);
            Swal.fire({
                title: 'Error!',
                html: 'เกิดข้อผิดพลาดในการรับงาน',
                icon: 'error',
                confirmButtonText: 'OK',
                customClass: {
                    title: 'alert-title',
                    confirmButton: 'alert-button'
                },
                buttonsStyling: false,
            });
        } finally {
            setOpen(false);
        }
    }, [selectedId, rows, userData?.username, fetchRequests]);

    const handleConfirmDelete = useCallback(async () => {
        if (!selectedId) return;

        try {
            const response = await fetch(`${URLAPI}/it-requests/${selectedId}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Network response was not ok");

            setRows((prevRows) => prevRows.filter((row) => row.id !== selectedId));
            setSuccessAlert(true);
            setTimeout(() => setSuccessAlert(false), 3000);

            // Custom alert notification for successful deletion
            Swal.fire({
                title: 'ลบรายการสำเร็จ!',
                icon: 'success',
                confirmButtonText: 'OK',
                customClass: {
                    title: 'alert-title',
                    confirmButton: 'alert-button'
                },
                buttonsStyling: false,
            });
        } catch (error) {
            console.error("Error deleting request:", error);
            // Custom alert notification for error
            Swal.fire({
                title: 'Error!',
                html: 'เกิดข้อผิดพลาดในการลบรายการ หรือ รายการนี้ถูกลบไปแ้ว',
                icon: 'error',
                confirmButtonText: 'OK',
                customClass: {
                    title: 'alert-title',
                    confirmButton: 'alert-button'
                },
                buttonsStyling: false,
            });
        } finally {
            setOpen(false);
        }
    }, [selectedId]);

    const handleClose = useCallback(() => {
        setOpen(false);
    }, []);

    const handleOpenModal = useCallback((id: number) => {
        setSelectedRequestId(id);
        setModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setModalOpen(false);
    }, []);

    const handleEdit = useCallback((id: number) => {
        navigate(`/edit-request/${id}`);
    }, [navigate]);

    // ใช้ useMemo สำหรับ columns definition
    const columns = useMemo<GridColDef[]>(() => {
        const getTypeStyle = (type: string) => {
            const styles = {
                Service: {
                    backgroundColor: '#ff7043',
                    icon: '🔧'
                },
                Develop: {
                    backgroundColor: '#9575cd',
                    icon: '💻'
                },
                Issue: {
                    backgroundColor: '#4caf50',
                    icon: '⚠️'
                }
            };
            return styles[type as keyof typeof styles] || { backgroundColor: '#81b1c9', icon: '📋' };
        };

        const getStatusStyle = (status: string) => {
            const styles = {
                "Request": {
                    backgroundColor: '#42a5f5',
                    icon: <RadioButtonCheckedSharpIcon sx={{ fontSize: '1rem' }} />
                },
                "Manager Approve": {
                    backgroundColor: '#66bb6a',
                    icon: <CheckCircleIcon sx={{ fontSize: '1rem' }} />
                },
                "Manager Unapprove": {
                    backgroundColor: '#ef5350',
                    icon: <RadioButtonCheckedSharpIcon sx={{ fontSize: '1rem' }} />
                },
                "Director Approve": {
                    backgroundColor: '#66bb6a',
                    icon: <CheckCircleIcon sx={{ fontSize: '1rem' }} />
                },
                "Director Unapprove": {
                    backgroundColor: '#ef5350',
                    icon: <RadioButtonCheckedSharpIcon sx={{ fontSize: '1rem' }} />
                },
                "IT Manager Approve": {
                    backgroundColor: '#ffa726',
                    icon: <CheckCircleIcon sx={{ fontSize: '1rem' }} />
                },
                "IT Manager Unapprove": {
                    backgroundColor: '#ef5350',
                    icon: <RadioButtonCheckedSharpIcon sx={{ fontSize: '1rem' }} />
                },
                "IT Director Approve": {
                    backgroundColor: '#ffa726',
                    icon: <CheckCircleIcon sx={{ fontSize: '1rem' }} />
                },
                "IT Director Unapprove": {
                    backgroundColor: '#ef5350',
                    icon: <RadioButtonCheckedSharpIcon sx={{ fontSize: '1rem' }} />
                },
                "Admin Recieve": {
                    backgroundColor: '#90a4ae',
                    icon: <RadioButtonCheckedSharpIcon sx={{ fontSize: '1rem' }} />
                },
                "In Progress": {
                    backgroundColor: '#5c6bc0',
                    icon: <RadioButtonCheckedSharpIcon sx={{ fontSize: '1rem' }} />
                },
                "Complete": {
                    backgroundColor: '#66bb6a',
                    icon: <CheckCircleIcon sx={{ fontSize: '1rem' }} />
                },
                "Cancel": {
                    backgroundColor: '#ef5350',
                    icon: <RadioButtonCheckedSharpIcon sx={{ fontSize: '1rem' }} />
                },
                "UAT": {
                    backgroundColor: '#8de134',
                    icon: <CheckCircleIcon sx={{ fontSize: '1rem' }} />
                }

            };
            return styles[status as keyof typeof styles] || { backgroundColor: '#81b1c9', icon: <RadioButtonCheckedSharpIcon sx={{ fontSize: '1rem' }} /> };
        };

        const baseColumns: GridColDef[] = [
            {
                field: "id",
                headerName: "No.",
                width: 50,
                align: 'center',
                headerAlign: 'center',
                renderCell: (params: GridRenderCellParams) => (
                    <span style={{ fontSize: '0.875rem' }}>
                        {params.api.getSortedRowIds().indexOf(params.id) + 1}
                    </span>
                ),
            },
            {
                field: "topic",
                headerName: "Request Detail",
                flex: 1,
                minWidth: 400,
                renderCell: (params: GridRenderCellParams) => (
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                        padding: "4px 0",
                    }}>
                        <span
                            data-tooltip-id={`tooltip-${params.row.id}`}
                            data-tooltip-html={`<div style="max-width: 400px; padding: 8px;"><div style="font-weight: bold; margin-bottom: 4px;">${params.value}</div><div style="white-space: pre-wrap; color: #666; font-size: 0.875rem;">${params.row.detail_req || ''}</div></div>`}
                            style={{
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                flex: 1,
                            }}
                            onClick={() => navigate(`/edit-request/${params.row.id}`)}
                        >
                            <span style={{
                                color: "#2196F3",
                                fontWeight: 600,
                                fontSize: "0.875rem",
                                minWidth: "110px",
                            }}>
                                {params.row.req_no}
                            </span>
                            <span style={{
                                color: "#666",
                                fontWeight: 600,
                                fontSize: "0.875rem"
                            }}>:</span>
                            <span style={{
                                color: "#1976d2",
                                fontWeight: 600,
                                fontSize: "0.875rem",
                                flexGrow: 1,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: "550px",
                            }}>
                                {params.value}
                            </span>
                        </span>

                        <ReactTooltip
                            id={`tooltip-${params.row.id}`}
                            place="top"
                            variant="light"
                            border="1px solid #e0e0e0"
                            style={{
                                backgroundColor: "#fff",
                                color: "#333",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                borderRadius: "4px",
                                zIndex: 9999,
                                padding: "8px",
                                maxWidth: "400px",
                                fontSize: "0.875rem"
                            }}
                        />

                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            {admin === "ADMIN" &&
                                (([1, 3].includes(params.row.type_id) && params.row.status_id == 3) ||
                                    (params.row.type_id == 2 && params.row.status_id == 1)) && (
                                    <Tooltip title="Receive Task" arrow>
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRecieveClick(params.row.id);
                                            }}
                                            sx={{
                                                padding: '4px',
                                                borderRadius: "6px",
                                                boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
                                                backgroundColor: "#fff",
                                                "&:hover": {
                                                    backgroundColor: "#f5f5f5",
                                                    transform: "translateY(-1px)",
                                                },
                                                "& .MuiSvgIcon-root": {
                                                    fontSize: "1.1rem",
                                                },
                                            }}
                                        >
                                            <TaskIcon />
                                        </IconButton>
                                    </Tooltip>
                                )}

                            <Tooltip title="View Details" arrow>
                                <IconButton
                                    size="small"
                                    color="default"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenModal(params.row.id);
                                    }}
                                    sx={{
                                        padding: '4px',
                                        borderRadius: "6px",
                                        boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
                                        backgroundColor: "#fff",
                                        "&:hover": {
                                            backgroundColor: "#f5f5f5",
                                            transform: "translateY(-1px)",
                                        },
                                        "& .MuiSvgIcon-root": {
                                            fontSize: "1.1rem",
                                        },
                                    }}
                                >
                                    <BackupTableIcon />
                                </IconButton>
                            </Tooltip>
                        </div>
                    </div>
                ),
            },
            {
                field: "type",
                headerName: "Type",
                width: 120,
                align: 'center',
                headerAlign: 'center',
                renderCell: (params: GridRenderCellParams) => {
                    const style = getTypeStyle(params.value);
                    return (
                        <Chip
                            label={
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    px: 0.5
                                }}>
                                    <span>{style.icon}</span>
                                    <span>{params.value}</span>
                                </Box>
                            }
                            sx={{
                                backgroundColor: style.backgroundColor,
                                color: "#fff",
                                width: '100px',
                                height: '28px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                '& .MuiChip-label': {
                                    padding: '0 4px'
                                },
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                transition: 'transform 0.2s ease',
                                '&:hover': {
                                    transform: 'translateY(-1px)',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                                }
                            }}
                        />
                    );
                }
            },
            {
                field: "status",
                headerName: "Status",
                width: 180,
                align: 'center',
                headerAlign: 'center',
                renderCell: (params: GridRenderCellParams) => {
                    const style = getStatusStyle(params.value);
                    return (
                        <Chip
                            icon={style.icon}
                            label={params.value}
                            sx={{
                                backgroundColor: style.backgroundColor,
                                color: "#fff",
                                minWidth: '140px',
                                height: '28px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                '& .MuiChip-icon': {
                                    color: '#fff',
                                    marginLeft: '4px'
                                },
                                '& .MuiChip-label': {
                                    padding: '0 8px'
                                },
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                transition: 'transform 0.2s ease',
                                '&:hover': {
                                    transform: 'translateY(-1px)',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                                }
                            }}
                        />
                    );
                }
            },
            {
                field: "datecreated",
                headerName: "Request Date",
                width: 110,
                align: 'center',
                headerAlign: 'center',
                renderCell: (params: GridRenderCellParams) => (
                    <span style={{ fontSize: '0.875rem' }}>
                        {params.value}
                    </span>
                ),
            },
        ];

        // Conditionally add actions column if admin
        if (admin === "ADMIN") {
            baseColumns.push({
                field: "actions",
                headerName: "Actions",
                width: 80,
                align: 'center',
                headerAlign: 'center',
                renderCell: (params: GridRenderCellParams) => (
                    <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(params.row.id);
                        }}
                        sx={{
                            minWidth: 'unset',
                            p: '3px 8px',
                            "& .MuiSvgIcon-root": {
                                fontSize: "1.1rem",
                            },
                        }}
                    >
                        <DeleteIcon />
                    </Button>
                ),
            });
        }

        return baseColumns;
    }, [
        handleEdit,
        getTypeColor,
        handleDeleteClick,
        handleRecieveClick,
        admin,
        handleOpenModal,
    ]);

    // Load user data on mount
    useEffect(() => {
        const storedUserData = sessionStorage.getItem("userData");
        const storedAdmin = sessionStorage.getItem("admin");

        if (storedUserData) {
            setUserData(JSON.parse(storedUserData));
        }
        if (storedAdmin) {
            setAdmin(storedAdmin);
        }
    }, []);

    // Fetch requests when dependencies change
    useEffect(() => {
        if (userData?.username && admin && tab !== undefined) {
            fetchRequests();
        }
    }, [userData, admin, tab, fetchRequests]);

    useEffect(() => {
        if (modalOpen === false) {
            fetchRequests();
        }
    }, [modalOpen, fetchRequests]);

    // Get unique types and statuses for filter options
    const typeOptions = useMemo(() => {
        const types = Array.from(new Set(rows.map(row => row.type)));
        return types.sort();
    }, [rows]);

    const statusOptions = useMemo(() => {
        const statuses = Array.from(new Set(rows.map(row => row.status)));
        return statuses.sort();
    }, [rows]);

    // เพิ่มฟังก์ชันสำหรับเปรียบเทียบวันที่
    const compareDates = useCallback((date1: string, date2: any) => {
        if (!date1 || !date2) return false;

        // แปลงวันที่ที่ใช้ filter
        const filterDate = dayjs(date2).format('DD/MM/BBBB');

        console.log('Comparing dates:', {
            date1,
            filterDate,
            isMatch: date1 === filterDate
        });

        // เปรียบเทียบวันที่โดยตรง
        return date1 === filterDate;
    }, []);

    // เพิ่ม console.log ใน useEffect เพื่อดูข้อมูลที่ได้จาก API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${URLAPI}/it-requests?tab=${tab}`);
                const { data } = await response.json();
                // console.log('API Response:', data);

                const mappedData = data.map((item: any) => ({
                    ...item,
                    datecreated: item.created_at,
                }));
                // console.log('Mapped Data:', mappedData);

                setRows(mappedData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [tab]);

    // Filter function
    const filteredRows = useMemo(() => {
        // console.log('Current filter date:', filterDate ? dayjs(filterDate).format('DD/MM/BBBB') : null);

        return rows.filter(row => {
            const matchesType = !filterType || row.type === filterType;
            const matchesStatus = !filterStatus || row.status === filterStatus;
            const matchesDate = !filterDate || compareDates(row.datecreated, filterDate);

            // console.log('Row check:', {
            //     datecreated: row.datecreated,
            //     filterDate: filterDate ? dayjs(filterDate).format('DD/MM/BBBB') : null,
            //     matchesDate
            // });

            return matchesType && matchesStatus && matchesDate;
        });
    }, [rows, filterType, filterStatus, filterDate, compareDates]);

    // Reset filters
    const handleResetFilters = () => {
        setFilterType('');
        setFilterStatus('');
        setFilterDate(null);
    };

    // ฟังก์ชันสำหรับ format วันที่ให้เป็น พ.ศ.
    const formatDateForPicker = useCallback((date: any) => {
        if (!date) return '';
        const year = dayjs(date).year() + 543;
        return dayjs(date).format('DD/MM/') + year;
    }, []);

    return (
        <Container maxWidth="xl">
            {successAlert && <SaveAlert onClose={() => setSuccessAlert(false)} />}
            <Box sx={{ my: 2 }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1,
                }}>
                    <Typography
                        variant="h4"
                        component="h1"
                        sx={{
                            fontWeight: "bold",
                            fontSize: 24,
                            color: "#1976d2",
                        }}
                    >
                        Request List IT
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            variant="outlined"
                            startIcon={<FilterListIcon />}
                            onClick={() => setShowFilters(!showFilters)}
                            size="small"
                        >
                            Filters
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleRequest}
                            size="small"
                        >
                            Request
                        </Button>
                    </Box>
                </Box>

                {showFilters && (
                    <Box sx={{
                        mb: 2,
                        p: 2,
                        backgroundColor: '#f8f9fa',
                        borderRadius: 1,
                        display: 'flex',
                        gap: 2,
                        alignItems: 'center',
                        flexWrap: 'wrap'
                    }}>
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                            <InputLabel>Type</InputLabel>
                            <Select
                                value={filterType}
                                label="Type"
                                onChange={(e) => setFilterType(e.target.value)}
                            >
                                <MenuItem value="">
                                    <em>All</em>
                                </MenuItem>
                                {typeOptions.map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl size="small" sx={{ minWidth: 120 }}>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={filterStatus}
                                label="Status"
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <MenuItem value="">
                                    <em>All</em>
                                </MenuItem>
                                {statusOptions.map((status) => (
                                    <MenuItem key={status} value={status}>
                                        {status}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <LocalizationProvider
                            dateAdapter={AdapterDayjs}
                            adapterLocale="th"
                        >
                            <DatePicker
                                label="Request Date"
                                value={filterDate ? dayjs(filterDate) : null}
                                onChange={(newValue) => setFilterDate(newValue ? dayjs(newValue).toDate() : null)}
                                format="DD/MM/YYYY"  // เปลี่ยนจาก BBBB เป็น YYYY
                                formatDensity="spacious"
                                slotProps={{
                                    textField: {
                                        size: 'small',
                                        sx: { width: 200 },
                                        // ใช้ inputProps เพื่อ format ค่าที่แสดง
                                        inputProps: {
                                            value: filterDate ? formatDateForPicker(filterDate) : ''
                                        }
                                    },
                                    field: {
                                        shouldRespectLeadingZeros: true
                                    }
                                }}
                            />
                        </LocalizationProvider>

                        <Button
                            variant="outlined"
                            size="small"
                            onClick={handleResetFilters}
                            sx={{ height: 40 }}
                        >
                            Clear Filters
                        </Button>
                    </Box>
                )}

                <Box sx={{
                    height: 'calc(100vh - 180px)',
                    width: '100%',
                    '& .MuiDataGrid-root': {
                        border: 'none',
                    },
                    '& .MuiDataGrid-cell': {
                        borderBottom: '1px solid #f0f0f0',
                    },
                    '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: '#f5f5f5',
                        borderBottom: '1px solid #ddd',
                    },
                    '& .MuiDataGrid-row': {
                        '&:hover': {
                            backgroundColor: '#f8f8f8',
                        },
                    },
                    '& .MuiDataGrid-footerContainer': {
                        borderTop: '1px solid #ddd',
                    },
                }}>
                    <DataGrid
                        rows={filteredRows}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 100,
                                },
                            },
                        }}
                        pageSizeOptions={[100, 200, 400, 600, 800, 1000]}
                        disableRowSelectionOnClick
                        loading={isLoading}
                        getRowId={(row) => row.id}
                        rowHeight={45}
                        columnHeaderHeight={45}
                        sx={{
                            '& .MuiDataGrid-virtualScroller': {
                                overflow: 'hidden auto',
                            },
                        }}
                    />
                </Box>
            </Box>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                sx={{
                    '& .MuiDialog-paper': {
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                    },
                }}
            >
                <DialogTitle id="alert-dialog-title" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    {actionType === "delete" ? "Confirm Delete" : "Confirm Receive"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description" sx={{ fontSize: '1rem', color: '#555' }}>
                        {actionType === "delete"
                            ? "คุณต้องการจะลบรายการนี้หรือไม่?"
                            : "คุณต้องการจะรับงานนี้ใช่หรือไม่?"}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={actionType === "delete" ? handleConfirmDelete : handleRecieve}
                        variant="contained"
                        color="primary"
                        sx={{
                            backgroundColor: '#1976d2',
                            '&:hover': {
                                backgroundColor: '#115293',
                            },
                            borderRadius: '8px',
                        }}
                        autoFocus
                    >
                        Confirm
                    </Button>
                    <Button
                        onClick={handleClose}
                        color="error"
                        variant="outlined"
                        sx={{
                            borderRadius: '8px',
                            borderColor: '#f44336',
                            color: '#f44336',
                            '&:hover': {
                                backgroundColor: '#f44336',
                                color: '#fff',
                            },
                        }}
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            <Modal
                open={modalOpen}
                onClose={handleCloseModal}
                aria-labelledby="request-detail-modal-title"
                aria-describedby="request-detail-modal-description"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "800",
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        zIndex: 1300,
                    }}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="request-detail-modal-title"
                    aria-describedby="request-detail-modal-description"
                >
                    {selectedRequestId && (
                        <RequestDetail id={selectedRequestId} onClose={handleCloseModal} />
                    )}
                </Box>
            </Modal>
        </Container>
    );
}