import { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Container, Typography, Button, Chip, Modal, Tooltip, IconButton,
FormControl, InputLabel, Select, MenuItem, Tabs, Tab } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import 'dayjs/locale/th';
import FilterListIcon from '@mui/icons-material/FilterList';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonCheckedSharpIcon from '@mui/icons-material/RadioButtonCheckedSharp';
import URLAPI from '../../../URLAPI';
import RequestDetail from '../Paper/RequestDetail';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import BackupTableIcon from '@mui/icons-material/BackupTable';

dayjs.extend(buddhistEra);
dayjs.locale('th');

interface RowData {
    id: number;
    req_no: string;
    name: string;
    status: string;
    type_id: number;
    type: string;
    assignee: string;
    datecreated: string;
    topic: string;
    name_program: string;
}



export default function ListRequest() {
    const navigate = useNavigate();
    const [rows, setRows] = useState<RowData[]>([]);
    const [userData, setUserData] = useState<any | null>(null);
    const [admin, setAdmin] = useState<string | null>(null);

    // State for Modal
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);

    const [filterType, setFilterType] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<string>('');
    const [filterDate, setFilterDate] = useState<Date | null>(null);
    const [showFilters, setShowFilters] = useState(false);

    // Add new state for tabs
    const [activeTab, setActiveTab] = useState<number>(0);

    // แยกฟังก์ชัน formatDate ออกมาเป็น memoized function
    const formatDate = useCallback((dateString: string) => {
        if (!dateString) return '';
        // ถ้าวันที่มาในรูปแบบที่มี / อยู่แล้ว ให้ใช้ค่านั้นเลย
        if (dateString.includes('/')) {
            return dateString;
        }
        return dayjs(dateString).format('DD/MM/') + (dayjs(dateString).year() + 543);
    }, []);

    const compareDates = useCallback((date1: string, date2: any) => {
        if (!date1 || !date2) return false;
        
        // แปลงวันที่ที่ใช้ filter
        const filterDate = dayjs(date2).format('DD/MM/') + (dayjs(date2).year() + 543);
        
        return date1 === filterDate;
    }, []);

    // ฟังก์ชันสำหรับ format วันที่ให้เป็น พ.ศ.
    const formatDateForPicker = useCallback((date: any) => {
        if (!date) return '';
        const year = dayjs(date).year() + 543;
        return dayjs(date).format('DD/MM/') + year;
    }, []);

    // แยก API URL builder ออกมาเป็นฟังก์ชันแยก
    const buildApiUrl = useCallback(() => {
        if (!userData?.username) return null;

        let apiUrl = `${URLAPI}/it-requests`;

        const params = new URLSearchParams();

        // For "My Request" tab
        if (activeTab === 0) {
            params.append('user_req', userData.username);
            return `${apiUrl}?${params.toString()}`;
        }

        if (admin === 'USER') {
            const { position, id_department, id_division_competency, id_section_competency } = userData;

            if (typeof position === 'string') {
                params.append('position', position);

                switch (position) {
                    case 's':
                    case 'h':
                        if (id_department) {
                            const deptId = Number(id_department);
                            if (Number.isInteger(deptId) && deptId > 0) {
                                params.append('department', deptId.toString());
                            }
                        }
                        break;

                    case 'm':
                        if (id_division_competency) {
                            const divId = Number(id_division_competency);
                            if (Number.isInteger(divId) && divId > 0) {
                                params.append('division_competency', divId.toString());
                            }
                        }
                        break;

                    case 'd':
                        if (id_section_competency) {
                            const secId = Number(id_section_competency);
                            if (Number.isInteger(secId) && secId > 0) {
                                params.append('section_competency', secId.toString());
                            }
                        }
                        if (id_division_competency) {
                            const divId = Number(id_division_competency);
                            if (Number.isInteger(divId) && divId > 0) {
                                params.append('division_competency', divId.toString());
                            }
                        }
                        break;
                }
            }
        }

        const finalUrl = `${apiUrl}?${params.toString()}`;
        // console.log('Final URL:', finalUrl);
        return finalUrl;
    }, [userData, admin, activeTab]);

    // ใช้ useCallback สำหรับฟังก์ชันที่ pass เป็น prop หรือใช้ใน useEffect
    const fetchRequests = useCallback(async () => {
        const apiUrl = buildApiUrl();
        if (!apiUrl) return;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                // เพิ่มการ log response เพื่อดูรายละเอียดเพิ่มเติม
                const errorText = await response.text();
                console.error('API Error:', {
                    status: response.status,
                    statusText: response.statusText,
                    errorText
                });
                throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
            }

            const { data } = await response.json();
            // แสดงข้อมูลที่ได้จาก API
            // console.log('API Response:', data);
            
            const mappedData = data.map((item: any) => ({
                id: item.id,
                req_no: item.rs_code,
                name: item.title_req || '',
                name_program: item.program_name || '' ,
                status: item.status_name,
                type_id: item.type_id,
                type: item.type,
                assignee: item.assign_name || '',
                detail_req: item.detail_req || '',
                datecreated: formatDate(item.created_at),
                topic: item.topic || '',
            }));

            setRows(mappedData);
            console.log('mappedData:', mappedData);
        } catch (error) {
            console.error('Error fetching requests:', error);
        }
    }, [buildApiUrl, formatDate]);

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
                backgroundColor: '#42a5f5',  // สีฟ้า
                icon: <RadioButtonCheckedSharpIcon sx={{ fontSize: '1rem' }} />
            },
            "Manager Approve": {
                backgroundColor: '#66bb6a',  // สีเขียว
                icon: <CheckCircleIcon sx={{ fontSize: '1rem' }} />
            },
            "Manager Unapprove": {
                backgroundColor: '#ef5350',  // สีแดง
                icon: <RadioButtonCheckedSharpIcon sx={{ fontSize: '1rem' }} />
            },
            "Director Approve": {
                backgroundColor: '#4caf50',  // สีเขียวเข้ม
                icon: <CheckCircleIcon sx={{ fontSize: '1rem' }} />
            },
            "Director Unapprove": {
                backgroundColor: '#f44336',  // สีแดงเข้ม
                icon: <RadioButtonCheckedSharpIcon sx={{ fontSize: '1rem' }} />
            },
            "IT Manager Approve": {
                backgroundColor: '#8bc34a',  // สีเขียวอ่อน
                icon: <CheckCircleIcon sx={{ fontSize: '1rem' }} />
            },
            "IT Manager Unapprove": {
                backgroundColor: '#ff5722',  // สีส้มแดง
                icon: <RadioButtonCheckedSharpIcon sx={{ fontSize: '1rem' }} />
            },
            "IT Director / Director Deputy Approve": {
                backgroundColor: '#4db6ac',  // สีเขียวฟ้า
                icon: <CheckCircleIcon sx={{ fontSize: '1rem' }} />
            },
            "IT Director / Director Deputy Unapprove": {
                backgroundColor: '#ff7043',  // สีส้ม
                icon: <RadioButtonCheckedSharpIcon sx={{ fontSize: '1rem' }} />
            },
            "Admin Recieve": {
                backgroundColor: '#90a4ae',  // สีเทา
                icon: <RadioButtonCheckedSharpIcon sx={{ fontSize: '1rem' }} />
            },
            "In Progress": {
                backgroundColor: '#5c6bc0',  // สีน้ำเงิน
                icon: <RadioButtonCheckedSharpIcon sx={{ fontSize: '1rem' }} />
            },
            "Complete": {
                backgroundColor: '#2e7d32',  // สีเขียวเข้มมาก
                icon: <CheckCircleIcon sx={{ fontSize: '1rem' }} />
            },
            "Cancel": {
                backgroundColor: '#d32f2f',  // สีแดงเข้มมาก
                icon: <RadioButtonCheckedSharpIcon sx={{ fontSize: '1rem' }} />
            },
            "Revise": {
                backgroundColor: '#ffa726',  // สีส้มอ่อน
                icon: <RadioButtonCheckedSharpIcon sx={{ fontSize: '1rem' }} />
            },
            "Confirm Close": {
                backgroundColor: '#7cb342',  // สีเขียวอมเหลือง
                icon: <CheckCircleIcon sx={{ fontSize: '1rem' }} />
            },
            "Reject": {
                backgroundColor: '#c62828',  // สีแดงเลือดหมู
                icon: <RadioButtonCheckedSharpIcon sx={{ fontSize: '1rem' }} />
            },
            "To Do": {
                backgroundColor: '#9575cd',  // สีม่วง
                icon: <RadioButtonCheckedSharpIcon sx={{ fontSize: '1rem' }} />
            },
            "UAT": {
                backgroundColor: '#00acc1',  // สีฟ้าเขียว
                icon: <CheckCircleIcon sx={{ fontSize: '1rem' }} />
            }
        };
        return styles[status as keyof typeof styles] || { backgroundColor: '#81b1c9', icon: <RadioButtonCheckedSharpIcon sx={{ fontSize: '1rem' }} /> };
    };

    const columns = useMemo<GridColDef[]>(() => [
        {
            field: 'id',
            headerName: 'No.',
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
            field: 'topic',
            headerName: 'Request Detail',
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
                        data-tooltip-html={`
                            <div style="max-width: 400px; padding: 8px;">
                                <div style="font-weight: bold; margin-bottom: 4px;">
                                    ${params.value}
                                </div>
                                <div style="white-space: pre-wrap; color: #666; font-size: 0.875rem;">
                                    ${params.row.detail_req || ''}
                                </div>
                            </div>
                        `}
                        style={{
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
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
                            maxWidth: "700px",
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

                    <div style={{ display: "flex", gap: "4px" }}>
                        <Tooltip title="View Details" arrow>
                            <IconButton
                                size="small"
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
            field: 'type',
            headerName: 'Type',
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
            field: 'status',
            headerName: 'Status',
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
            field: 'datecreated',
            headerName: 'Request Date',
            width: 110,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params: GridRenderCellParams) => (
                <span style={{ fontSize: '0.875rem' }}>
                    {params.value}
                </span>
            ),
        },
    ], [navigate]);

    // Load initial data
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

    // Fetch data when dependencies change
    useEffect(() => {
        if (userData?.username && admin) {
            fetchRequests();
        }
    }, [userData, admin, fetchRequests]);

    // Handlers for Modal
    const handleOpenModal = useCallback((id: number) => {
        setSelectedRequestId(id);
        setModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setModalOpen(false);
    }, []);

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

    // Filter function
    const filteredRows = useMemo(() => {
        return rows.filter(row => {
            const matchesType = !filterType || row.type === filterType;
            const matchesStatus = !filterStatus || row.status === filterStatus;
            const matchesDate = !filterDate || compareDates(row.datecreated, filterDate);
            
            return matchesType && matchesStatus && matchesDate;
        });
    }, [rows, filterType, filterStatus, filterDate, compareDates]);

    // Reset filters
    const handleResetFilters = () => {
        setFilterType('');
        setFilterStatus('');
        setFilterDate(null);
    };

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    return (
        <Container maxWidth="xl">
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
                        Request List
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
                            onClick={() => navigate('/request')}
                            size="small"
                        >
                            Request
                        </Button>
                    </Box>
                </Box>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                    <Tabs 
                        value={activeTab} 
                        onChange={handleTabChange}
                        sx={{
                            '& .MuiTab-root': {
                                minWidth: 120,
                                fontWeight: 600,
                            }
                        }}
                    >
                        <Tab label="My Request" />
                        <Tab label="Department Request" />
                    </Tabs>
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
                                format="DD/MM/YYYY"
                                formatDensity="spacious"
                                slotProps={{ 
                                    textField: { 
                                        size: 'small',
                                        sx: { width: 200 },
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

            <Modal
                open={modalOpen}
                onClose={handleCloseModal}
                aria-labelledby="request-detail-modal-title"
                aria-describedby="request-detail-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: {
                        xs: '90%',
                        sm: '80%',
                        md: '70%',
                        lg: '60%',
                        xl: '50%',
                    },
                    maxWidth: '800px',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                }}>
                    {selectedRequestId && <RequestDetail id={selectedRequestId} onClose={handleCloseModal} />}
                </Box>
            </Modal>
        </Container>
    );
}