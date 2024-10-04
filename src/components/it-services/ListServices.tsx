import React, { useState } from 'react';
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

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Request':
            return 'info';
        case 'IT Admin':
            return 'warning';
        case 'Manager Approve':
            return 'secondary';
        case 'Director Approved':
            return 'success';
        case 'Process':
            return 'primary';
        case 'Pending':
            return 'info';
        case 'Complete':
            return 'success';
        case 'Cancel':
            return 'error';
        default:
            return 'default';
    }
};

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

const rows = [
    { id: 'IT67001', name: 'โครงการลด 50%(โปรแกรมลงชื่อเจ้าหน้าที่ที่ร่วมโครงการ) ', status: 'Request', assignee: 'thaweep', datecreated: '2024-10-01' },
    { id: 'IT67002', name: 'โครงการปรับปรุงระบบ IT [ซ่อมบำรุงคอมพิวเตอร์]', status: 'IT Admin', assignee: 'somchai', datecreated: '2024-10-02' },
    { id: 'IT67003', name: 'โครงการอบรม IT Security', status: 'Manager Approve', assignee: 'wanchai', datecreated: '2024-10-03' },
    { id: 'IT67004', name: 'โครงการพัฒนา Mobile App', status: 'Director Approved', assignee: 'siriwan', datecreated: '2024-10-04' },
    { id: 'IT67005', name: 'โครงการลด 50%(โปรแกรมลงชื่อเจ้าหน้าที่ที่ร่วมโครงการ)', status: 'Process', assignee: 'thaweep', datecreated: '2024-10-01' },
    { id: 'IT67006', name: 'โครงการปรับปรุงระบบ IT', status: 'IT Admin', assignee: 'somchai', datecreated: '2024-10-02' },
    { id: 'IT67007', name: 'โครงการอบรม IT Security', status: 'Manager Approve', assignee: 'wanchai', datecreated: '2024-10-03' },
    { id: 'IT67008', name: 'โครงการพัฒนา Mobile App', status: 'Complete', assignee: 'siriwan', datecreated: '2024-10-04' },
    { id: 'IT67009', name: 'โครงการลด 50%(โปรแกรมลงชื่อเจ้าหน้าที่ที่ร่วมโครงการ)', status: 'Request', assignee: 'thaweep', datecreated: '2024-10-01' },
    { id: 'IT67010', name: 'โครงการปรับปรุงระบบ IT', status: 'IT Admin', assignee: 'somchai', datecreated: '2024-10-02' },
    { id: 'IT67011', name: 'โครงการอบรม IT Security', status: 'Complete', assignee: 'wanchai', datecreated: '2024-10-03' },
    { id: 'IT67012', name: 'โครงการพัฒนา Mobile App', status: 'Director Approved', assignee: 'siriwan', datecreated: '2024-10-04' },
];

export default function ListServices() {
    const navigate = useNavigate();

    const handleRequest = () => {
        navigate('/request');
    };

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
