import { useState, useEffect } from 'react';
import { Box, Container, Typography ,Button, Chip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonCheckedSharpIcon from '@mui/icons-material/RadioButtonCheckedSharp';
export default function List_Request() {
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);

    const formatDate = (dateString : string) => {
        const date = new Date(dateString);
        // เปลี่ยนปีเป็นพุทธศักราช
        const buddhistYear = date.getFullYear() + 543;
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // เดือนเริ่มต้นจาก 0
        return `${day}/${month}/${buddhistYear}`; // รูปแบบ DD/MM/YYYY
    };

    const getStatusColor = (status : string) => {
        switch (status) {
            case 'Request':
                return '#2196F3'; // Blue (HEX)
            case 'Manager Approve':
                return '#7abf7d'; // Yellow (HEX)
            case 'Director Approve':
                return '#7abf7d'; // Green (HEX)
            case 'IT Manager Approve':
                return '#fcba58'; // Green (HEX)
            case 'IT Director Approve':
                return '#fcba58'; // Green (HEX)
            case 'Wait For Assigned':
                return '#B0BEC5'; // Orange (HEX)
            case 'In Progress':
                return '#3a08a6'; // Orange (HEX)
            case 'Complete':
                return '#4CAF50'; // Green (HEX)
            case 'Cancel':
                return '#F44336'; // Red (HEX)
            default:
                return '#81b1c9'; // Grey (HEX)
        }
    };
    
    const handleRequest = () => {
        navigate('/request');
    };

    // ฟังก์ชันดึงข้อมูลจาก API
    const fetchRequests = async () => {
        try {
            // ดึงข้อมูลจาก API และแปลงผลลัพธ์เป็น JSON
            const response = await fetch('http://localhost:1234/it-requests');
            
            // ตรวจสอบว่า request สำเร็จหรือไม่
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json(); // แปลง response เป็น JSON
            
            // map ข้อมูลเพื่อนำมาใช้ใน state
            const mappedData = data.data.map((item : any) => ({
                id: item.id,
                name: `${item.rs_code} ${item.title_req || (item.program_name ? `พัฒนาโปรแกรมต่อเนื่อง (${item.program_name})` : 'พัฒนาโปรแกรมต่อเนื่อง')}`,
                status: item.status_name,
                assignee: item.assign_name || '', // ตรวจสอบว่า assign_name มีหรือไม่ ถ้าไม่มีให้เป็นค่า default
                datecreated: formatDate(item.created_at),
            }));
    
            setRows(mappedData); // อัพเดท state ด้วยข้อมูลใหม่
        } catch (error) {
            console.error('Error fetching requests:', error); // จัดการ error
        }
    };
    
    useEffect(() => {
        fetchRequests(); // เรียกใช้ฟังก์ชันเมื่อ component ถูก mount
    }, []);
    

    const columns = [
        { field: 'id', headerName: 'ID', width: 50 },
        {
            field: 'name',
            headerName: 'หัวข้อ Request',
            width: 630,
            renderCell: (params : any) => (
                <span
                    style={{ cursor: 'pointer', color: '#1976d2', textDecoration: 'underline' }} // Style for link
                    onClick={() => navigate(`/edit-request/${params.row.id}`)} // Navigate to edit form
                >
                    {params.value}
                </span>
            ),
        },
        {
            field: 'status',
            headerName: 'สถานะดำเนินการ',
            width: 200,
            editable: true,
            renderCell: (params : any) => (
                <Chip
                    label={params.value}
                    style={{ backgroundColor: getStatusColor(params.value), color: '#fff' }} // ตั้งค่าพื้นหลังและข้อความ
                    size="medium"
                    icon={params.value === 'Complete' ? <CheckCircleIcon /> : <RadioButtonCheckedSharpIcon />}
                />
            ),
        },
        
        // { field: 'assignee', headerName: 'Assignee', width: 200 },
        { field: 'datecreated', headerName: 'วันที่ Request', width: 150 },
    ];

    return (
        <Container maxWidth={'xl'}>
            <Box sx={{ my: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4" component="h1">
                        Request List
                    </Typography>
                    <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleRequest}>
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

