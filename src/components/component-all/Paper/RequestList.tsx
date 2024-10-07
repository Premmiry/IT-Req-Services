import { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Container, Typography, IconButton, Menu, MenuItem, Button, Chip, ListSubheader } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonCheckedSharpIcon from '@mui/icons-material/RadioButtonCheckedSharp';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import Avatar from '@mui/joy/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import Tooltip from '@mui/material/Tooltip';





const getChipColor = (dept: string) => {
    switch (dept) {
        case 'แผนกพัฒนาโปรแกรม':
            return '#ffdb9b'; // สีที่กำหนดสำหรับแผนกพัฒนาโปรแกรม
        case 'แผนกซ่อมบำรุงคอมพิวเตอร์':
            return '#b0fbf2'; // สีที่กำหนดสำหรับแผนกซ่อมบำรุงคอมพิวเตอร์
        case 'แผนกควบคุมระบบปฏิบัติงาน':
            return '#d1fbb0'; // สีที่กำหนดสำหรับแผนกควบคุมระบบปฏิบัติงาน
        default:
            return '#d8d8d8'; // สีเริ่มต้น
    }
};

const options = [
    { value: '1', label: 'พี่พล', position: 'หัวหน้าแผนก', dep: 'พัฒนาโปรแกรม', src: '/static/images/avatar/1.jpg' },
    { value: '2', label: 'เปรม', position: 'เจ้าหน้าที่', dep: 'พัฒนาโปรแกรม', src: '/static/images/avatar/2.jpg' },
    { value: '3', label: 'วิค', position: 'เจ้าหน้าที่', dep: 'พัฒนาโปรแกรม', src: '/static/images/avatar/3.jpg' },
    { value: '4', label: 'ท็อป', position: 'เจ้าหน้าที่', dep: 'พัฒนาโปรแกรม', src: '/static/images/avatar/3.jpg' },
    { value: '5', label: 'พี่จเด็ด', position: 'หัวหน้าแผนก', dep: 'ซ่อมบำรุงคอมพิวเตอร์', src: '/static/images/avatar/1.jpg' },
    { value: '6', label: 'พี่เหน่ง', position: 'เจ้าหน้าที่', dep: 'ซ่อมบำรุงคอมพิวเตอร์', src: '/static/images/avatar/2.jpg' },
    { value: '7', label: 'พี่แจ็ค', position: 'เจ้าหน้าที่', dep: 'ซ่อมบำรุงคอมพิวเตอร์', src: '/static/images/avatar/3.jpg' },
    { value: '8', label: 'พี่ต้า', position: 'เจ้าหน้าที่', dep: 'ซ่อมบำรุงคอมพิวเตอร์', src: '/static/images/avatar/3.jpg' },
    { value: '9', label: 'เอิร์ท', position: 'เจ้าหน้าที่', dep: 'ซ่อมบำรุงคอมพิวเตอร์', src: '/static/images/avatar/3.jpg' },
    { value: '10', label: 'ปูน', position: 'เจ้าหน้าที่', dep: 'ซ่อมบำรุงคอมพิวเตอร์', src: '/static/images/avatar/3.jpg' },
    { value: '11', label: 'พี่นิด', position: 'หัวหน้าแผนก', dep: 'ควมคุมระบบคอมพิวเตอร์', src: '/static/images/avatar/3.jpg' },
    { value: '12', label: 'พี่ตา', position: 'เจ้าหน้าที่', dep: 'ควมคุมระบบคอมพิวเตอร์', src: '/static/images/avatar/3.jpg' },
];

const groupedOptions = options.reduce((acc, curr) => {
    if (!acc[curr.dep]) {
        acc[curr.dep] = [];
    }
    acc[curr.dep].push(curr);
    return acc;
}, {} as { [dep: string]: typeof options });

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    {
        field: 'name',
        headerName: 'Name',
        flex: 1, // ให้คอลัมน์นี้ปรับขนาดตามเนื้อหาภายใน
        editable: true,
        renderCell: (params: GridRenderCellParams) => {
            const navigate = useNavigate();
            const [showIcon, setShowIcon] = useState(false);
            const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
            const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
            const open = Boolean(anchorEl);
            const departments = ['แผนกพัฒนาโปรแกรม', 'แผนกซ่อมบำรุงคอมพิวเตอร์', 'แผนกควบคุมระบบปฏิบัติงาน'];

            const handleMouseEnter = () => {
                setShowIcon(true);
            };

            const handleMouseLeave = () => {
                setShowIcon(false);
            };

            const handleClickIcon = (event: React.MouseEvent<HTMLElement>) => {
                setAnchorEl(event.currentTarget);
            };

            const handleDepartmentSelect = (dept: string) => {
                if (!selectedDepartments.includes(dept)) {
                    setSelectedDepartments((prev) => [...prev, dept]);
                }
                setAnchorEl(null); // ปิดเมนู
            };

            const handleChipDelete = (dept: string) => {
                // ลบแผนกออกจาก selectedDepartments
                setSelectedDepartments((prev) => prev.filter((d) => d !== dept));
            };

            const handleClose = () => {
                setAnchorEl(null);
            };

            const handleNavigate = () => {
                navigate(`/service/${params.row.id}`);
            };

            return (
                <Box
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    sx={{ display: 'flex', alignItems: 'center', width: '100%' }} // ปรับให้เต็มความกว้าง
                >
                    {/* ส่วนแสดงชื่อ */}
                    <Box>
                        <Button color="primary" onClick={handleNavigate}>
                            {params.value}
                        </Button>
                    </Box>

                    {/* ส่วนแสดง Chip ที่ถูกเลือก */}
                    <Box sx={{ display: 'flex' }}>
                        {selectedDepartments.length > 0 && selectedDepartments.map((dept, index) => (
                            <Chip
                                key={index}
                                label={dept}
                                size="small"
                                onDelete={() => handleChipDelete(dept)}
                                style={{
                                    backgroundColor: getChipColor(dept),
                                    color: 'black',
                                    marginLeft: 2,
                                }}
                            />
                        ))}
                    </Box>

                    {/* ส่วนแสดงไอคอนที่ขวาสุด */}
                    <Box sx={{ marginLeft: 'auto' }}> {/* ใช้ marginLeft: 'auto' เพื่อดันไอคอนไปทางขวา */}
                        {showIcon && (
                            <>
                                <IconButton sx={{ boxShadow: 2 }} onClick={handleClickIcon}>
                                    <LocalOfferIcon />
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                >
                                    {/* แสดงแผนกที่ยังไม่ได้เลือก */}
                                    {departments
                                        .filter((dept) => !selectedDepartments.includes(dept))
                                        .map((dept) => (
                                            <MenuItem
                                                key={dept}
                                                onClick={() => handleDepartmentSelect(dept)}
                                            >
                                                {dept}
                                            </MenuItem>
                                        ))}
                                </Menu>
                            </>
                        )}
                    </Box>
                </Box>
            );
        },
    },
    {
        field: 'status',
        headerName: 'Status',
        width: 180,
        editable: true,
        renderCell: (params: GridRenderCellParams) => (
            <Chip
                label={params.value}
                color={getStatusColor(params.value as string)}
                size="medium"
                icon={params.value === 'Complete' ? <CheckCircleIcon /> : <RadioButtonCheckedSharpIcon />}
            />
        ),
    },
    {
        field: 'assignee',
        headerName: 'Assigned',
        width: 100,
        editable: true,
        renderCell: (params: any) => {
            const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
            const [selectedAssignees, setSelectedAssignees] = React.useState<typeof options>([]);
            const open = Boolean(anchorEl);

            const handleClickRow = (event: React.MouseEvent<HTMLElement>) => {
                setAnchorEl(event.currentTarget);
            };

            const handleClose = () => {
                setAnchorEl(null);
            };

            const handleAssigneeSelect = (option: typeof options[0]) => {
                setSelectedAssignees((prev) => [...prev, option]);
                handleClose(); // ปิดเมนูเมื่อเลือกเจ้าหน้าที่
            };

            const handleAssigneeRemove = (optionToRemove: typeof options[0]) => {
                setSelectedAssignees((prev) => prev.filter((option) => option.value !== optionToRemove.value));
            };

            return (
                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }} onClick={handleClickRow}>
                    {/* แสดง AvatarGroup หรือ PlaceHolder */}
                    {selectedAssignees.length > 0 ? (
                        <AvatarGroup max={4} spacing="small">
                            {selectedAssignees.map((assignee) => (
                                <Tooltip key={assignee.value} title={`${assignee.label} - ${assignee.position}`} arrow>
                                    <Avatar
                                        src={assignee.src}
                                        sx={{ width: 32, height: 32 }}
                                        style={{ cursor: 'pointer' }}
                                        onClick={(e) => {
                                            e.stopPropagation(); // ป้องกันไม่ให้เมนูเปิดเมื่อคลิกที่ Avatar
                                            handleAssigneeRemove(assignee);
                                        }}
                                    />
                                </Tooltip>
                            ))}
                        </AvatarGroup>
                    ) : (
                        // Placeholder แสดงข้อความเมื่อยังไม่มีการเลือกพนักงาน
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%',
                                height: '100%' // ปรับความสูงเพื่อให้กลาง
                            }}
                        >
                            <PersonAddAlt1Icon />
                        </Box>
                    )}

                    {/* เมนูพนักงานแบ่งตามแผนก */}
                    <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                        {Object.entries(groupedOptions).map(([dep, employees]) => (
                            <React.Fragment key={dep}>
                                <ListSubheader>{dep}</ListSubheader> {/* หัวข้อแผนก */}
                                {employees
                                    .filter((employee) => !selectedAssignees.some((assignee) => assignee.value === employee.value)) // กรองพนักงานที่ถูกเลือกแล้ว
                                    .map((employee) => (
                                        <MenuItem key={employee.value} onClick={() => handleAssigneeSelect(employee)}>
                                            <ListItemDecorator>
                                                <Avatar size="sm" src={employee.src} />
                                            </ListItemDecorator>
                                            {employee.label} - {employee.position}
                                        </MenuItem>
                                    ))}
                            </React.Fragment>
                        ))}
                    </Menu>
                </div>
            );
        },
    },
];



export default function ListServices() {
    const navigate = useNavigate();

    const handleRequest = () => {
        navigate('/request');
    };


    // State สำหรับเก็บข้อมูล rows ที่ดึงมาจาก API
    const [rows, setRows] = useState([]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        // เปลี่ยนปีเป็นพุทธศักราช
        const buddhistYear = date.getFullYear() + 543;
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // เดือนเริ่มต้นจาก 0
        return `${day}/${month}/${buddhistYear}`; // รูปแบบ DD/MM/YYYY
    };

    const getStatusColor = (status) => {
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
    
    

    // ฟังก์ชันดึงข้อมูลจาก API
    const fetchRequests = async () => {
        try {
            const response = await axios.get('http://localhost:1234/it-requests');
            const data = response.data.data.map((item) => ({
                id: item.id,
                name: `${item.rs_code} ${item.title_req || (item.program_name ? `พัฒนาโปรแกรมต่อเนื่อง (${item.program_name})` : 'พัฒนาโปรแกรมต่อเนื่อง')}`,
                status: item.status_name,
                assignee: item.assign_name,
                datecreated: formatDate(item.created_at),
            }));
            setRows(data);
        } catch (error) {
            console.error('Error fetching requests:', error);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const columns = [
        { field: 'id', headerName: 'ID', width: 50 },
        {
            field: 'name',
            headerName: 'Request Name',
            width: 630,
            renderCell: (params) => (
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
            headerName: 'Status',
            width: 200,
            editable: true,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    style={{ backgroundColor: getStatusColor(params.value), color: '#fff' }} // ตั้งค่าพื้นหลังและข้อความ
                    size="medium"
                    icon={params.value === 'Complete' ? <CheckCircleIcon /> : <RadioButtonCheckedSharpIcon />}
                />
            ),
        },
        
        { field: 'assignee', headerName: 'Assignee', width: 200 },
        { field: 'datecreated', headerName: 'Date Created', width: 150 },
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
