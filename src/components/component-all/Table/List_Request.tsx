import { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Container, Typography, Button, Chip, Modal, Tooltip, IconButton } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonCheckedSharpIcon from '@mui/icons-material/RadioButtonCheckedSharp';
import URLAPI from '../../../URLAPI';
import RequestDetail from '../Paper/RequestDetail';
import TaskIcon from "@mui/icons-material/Task";
import InfoIcon from '@mui/icons-material/Info';

// แยก Type Colors และ Status Colors ออกมาเป็น Constants
const TYPE_COLORS = {
    Service: '#fc836a',
    Develop: '#9d42f9',
    Issue: '#27e16d',
    default: '#81b1c9'
} as const;

const STATUS_COLORS = {
    Request: '#2196F3',
    'Manager Approve': '#7abf7d',
    'Manager Unapprove': '#7abf7d',
    'Director Approve': '#7abf7d',
    'Director Unapprove': '#7abf7d',
    'IT Manager Approve': '#fcba58',
    'IT Manager Unapprove': '#fcba58',
    'IT Director Approve': '#fcba58',
    'IT Director Unapprove': '#fcba58',
    'Wait For Assigned': '#B0BEC5',
    'In Progress': '#3a08a6',
    Complete: '#4CAF50',
    Cancel: '#F44336',
    default: '#81b1c9'
} as const;

// แยก Type ของ Row Data
interface RowData {
    id: number;
    req_no: string;
    name: string;
    status: string;
    type_id: number;
    type: string;
    assignee: string;
    datecreated: string;
}

export default function ListRequest() {
    const navigate = useNavigate();
    const [rows, setRows] = useState<RowData[]>([]);
    const [userData, setUserData] = useState<any | null>(null);
    const [admin, setAdmin] = useState<string | null>(null);

    // State for Modal
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);

    // แยกฟังก์ชัน formatDate ออกมาเป็น memoized function
    const formatDate = useCallback((dateString: string) => {
        const date = new Date(dateString);
        const buddhistYear = date.getFullYear() + 543;
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${day}/${month}/${buddhistYear}`;
    }, []);

    // ใช้ useMemo สำหรับฟังก์ชันที่ return ค่าเหมือนเดิมเมื่อ input เหมือนเดิม
    const getTypeColor = useMemo(() => (type: string) => {
        return TYPE_COLORS[type as keyof typeof TYPE_COLORS] || TYPE_COLORS.default;
    }, []);

    const getStatusColor = useMemo(() => (status: string) => {
        return STATUS_COLORS[status as keyof typeof STATUS_COLORS] || STATUS_COLORS.default;
    }, []);

    // แยก API URL builder ออกมาเป็นฟังก์ชันแยก
    const buildApiUrl = useCallback(() => {
        if (!userData?.username) return null;

        let apiUrl = `${URLAPI}/it-requests`;

        if (admin === 'USER') {
            const { position, id_department, id_division_competency, id_section_competency } = userData;
            const params = new URLSearchParams();

            params.append('position', position);
            if (position === 's' || position === 'h') {
                params.append('department', id_department);
            } else if (position === 'm') {
                params.append('division_competency', id_division_competency);
            } else if (position === 'd') {
                params.append('section_competency', id_section_competency);
                params.append('division_competency', id_division_competency);
            }

            return `${apiUrl}?${params.toString()}`;
        }

        return apiUrl;
    }, [userData, admin]);

    // ใช้ useCallback สำหรับฟังก์ชันที่ pass เป็น prop หรือใช้ใน useEffect
    const fetchRequests = useCallback(async () => {
        const apiUrl = buildApiUrl();
        if (!apiUrl) return;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('Network response was not ok');

            const { data } = await response.json();
            const mappedData = data.map((item: any) => ({
                id: item.id,
                req_no: item.rs_code,
                name: item.title_req || `พัฒนาโปรแกรมต่อเนื่อง${item.program_name ? ` (${item.program_name})` : ''}`,
                status: item.status_name,
                type_id: item.type_id,
                type: item.type,
                assignee: item.assign_name || '',
                datecreated: formatDate(item.created_at),
            }));

            setRows(mappedData);
        } catch (error) {
            console.error('Error fetching requests:', error);
        }
    }, [buildApiUrl, formatDate]);

    // Memoize columns definition
    const columns = useMemo<GridColDef[]>(() => [
        {
            field: 'id',
            headerName: 'No.',
            width: 55,
            renderCell: (params: GridRenderCellParams) => (
                <span>{params.api.getSortedRowIds().indexOf(params.id) + 1}</span>
            ),
        },
        {
            field: 'req_no',
            headerName: 'Request No.',
            width: 120,
        },
        {
            field: 'name',
            headerName: 'หัวข้อ Request',
            width: 600,
            renderCell: (params: GridRenderCellParams) => (
                <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >

                <span
                style={{ cursor: 'pointer', color: '#1976d2', textDecoration: 'underline' }}
                onClick={() => navigate(`/edit-request/${params.row.id}`)}
                >
                    {params.value}
                </span>

                <Tooltip title="View Details" arrow>
                <IconButton
                  size="small"
                  color="warning"
                  onClick={() => handleOpenModal(params.row.id)}
                  sx={{
                    ml: 1,
                    borderRadius: "7px",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                    backgroundColor: "#fff",
                    transition: "all 0.3s ease",
                  }}
                >
                  <InfoIcon />
                </IconButton>
              </Tooltip>

                </div>
                



            ),
        },
        {
            field: 'type',
            headerName: 'ประเภท',
            width: 100,
            renderCell: (params: GridRenderCellParams) => (
                <Chip
                    label={params.value}
                    style={{ backgroundColor: getTypeColor(params.value), color: '#fff' }}
                    size="medium"
                    sx={{ width: 100 }}
                />
            ),
        },
        {
            field: 'status',
            headerName: 'สถานะดำเนินการ',
            width: 190,
            renderCell: (params: GridRenderCellParams) => (
                <Chip
                    label={params.value}
                    style={{ backgroundColor: getStatusColor(params.value), color: '#fff' }}
                    size="medium"
                    icon={params.value === 'Complete' ? <CheckCircleIcon /> : <RadioButtonCheckedSharpIcon />}
                />
            ),
        },
        {
            field: 'datecreated',
            headerName: 'วันที่ Request',
            width: 100,
        },
    ], [navigate, getTypeColor, getStatusColor]);

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

    return (
        <Container maxWidth="xl">
            <Box sx={{ my: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography
            variant="h4"
            component="h1"
            sx={{
              mt: 2,
              mb: 4,
              fontWeight: "bold",
              fontSize: 30,
              color: "#1976d2",
              textAlign: "left",
              textDecorationThickness: 2,
              textUnderlineOffset: 6,
              textDecorationColor: "#1976d2",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
            }}
          >
            Request List
          </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/request')}
                    >
                        Request
                    </Button>
                </Box>
                <Box sx={{ height: 600, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 10,
                                },
                            },
                        }}
                        pageSizeOptions={[5, 10, 25]}
                        disableRowSelectionOnClick
                    />
                </Box>
            </Box>
            {/* Modal for Request Detail */}
            <Modal
                open={modalOpen}
                onClose={handleCloseModal}
                aria-labelledby="request-detail-modal-title"
                aria-describedby="request-detail-modal-description"
                role="dialog"
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: {
                        xs: '90%',    // ใช้ความกว้าง 90% ของหน้าจอสำหรับขนาดเล็ก (มือถือ)
                        sm: '80%',    // สำหรับแท็บเล็ตเล็ก
                        md: '70%',    // สำหรับแท็บเล็ตและเดสก์ท็อปขนาดกลาง
                        lg: '60%',    // สำหรับเดสก์ท็อปขนาดใหญ่
                        xl: '50%',    // สำหรับจอขนาดใหญ่มาก
                    },
                    maxWidth: '800px',  // กำหนดขีดจำกัดความกว้างสูงสุดให้กับ Modal
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