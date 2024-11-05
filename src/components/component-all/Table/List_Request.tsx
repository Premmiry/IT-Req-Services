import { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Container, Typography, Button, Chip } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonCheckedSharpIcon from '@mui/icons-material/RadioButtonCheckedSharp';
import URLAPI from '../../../URLAPI';

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
            width: 155,
        },
        {
            field: 'name',
            headerName: 'หัวข้อ Request',
            width: 700,
            renderCell: (params: GridRenderCellParams) => (
                <span
                    style={{ cursor: 'pointer', color: '#1976d2', textDecoration: 'underline' }}
                    onClick={() => navigate(`/edit-request/${params.row.id}`)}
                >
                    {params.value}
                </span>
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
            width: 130,
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

    return (
        <Container maxWidth="xl">
            <Box sx={{ my: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4" component="h1">
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
        </Container>
    );
}