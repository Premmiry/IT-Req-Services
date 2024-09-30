import React, { useState } from 'react';
import { Box, Container, Typography, IconButton, Menu, MenuItem, Button, Chip } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const getStatusColor = (status : string) => {
  switch (status.toLowerCase()) {
    case 'complete':
      return 'success';
    case 'wait for approve':
      return 'warning';
    case 'cancelled':
      return 'error';
    case 'in progress':
      return 'info';
    default:
      return 'default';
  }
};

const getStatusIcon = (status : string) => {
  switch (status.toLowerCase()) {
    case 'complete':
      return '✅';
    case 'wait for approve':
      return '⏳';
    case 'cancelled':
      return '❌';
    case 'in progress':
      return '🔄';
    default:
      return '•';
  }
};


const DepartmentDropdown = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const departments = ['แผนกไอที', 'แผนกบัญชี', 'แผนกการตลาด'];

  return (
    <div>
      <Button
        aria-controls={open ? 'department-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        เลือกแผนก
      </Button>
      <Menu
        id="department-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {departments.map((dept) => (
          <MenuItem key={dept} onClick={handleClose}>
            {dept}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};


const columns: GridColDef[] = [
  { 
    field: 'name', 
    headerName: 'Name', 
    width: 500,
    renderCell: (params: GridRenderCellParams) => (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography color="primary" sx={{ mr: 1 }}>{getStatusIcon(params.row.status)}</Typography>
        {params.value}
      </Box>
    ),
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 150,
    renderCell: (params: GridRenderCellParams) => (
      <Chip
        label={params.value}
        color={getStatusColor(params.value)}
        size="small"
      />
    ),
  },
  {
    field: 'assignee',
    headerName: 'Assignee',
    width: 120,
    renderCell: (params: GridRenderCellParams) => (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box
          sx={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            backgroundColor: 'grey.300',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mr: 1,
          }}
        >
          {params.value.charAt(0).toUpperCase()}
        </Box>
        {params.value}
      </Box>
    ),
  },
];

const rows = [
  { id: 'IT67115', name: 'แผนก : WNH(WARD 14) เรื่อง : ติดตั้งสัญญาณ wifi', status: 'In Progress', assignee: 'John' },
  { id: 'IT67156', name: 'แผนก: IT Online เรื่อง: แก้ไขโปรแกรมค่ารักษา', status: 'In Progress', assignee: 'TP' },
  { id: 'IT67204', name: 'แผนก: ศัลยกรรมตกแต่ง เรื่อง: เพิ่มจุดสัญญาณ wifi', status: 'In Progress', assignee: 'Alice' },
  { id: 'IT67210', name: 'แผนก: ศูนย์ผู้สูงอายุ (ชั้น 14) เรื่อง: ขอเครื่องสแกนพริ้นเตอร์', status: 'In Progress', assignee: 'Bob' },
  { id: 'IT67232', name: 'แผนก: บุคคล เรื่อง: ปรับแก้โปรแกรมประเมินพฤติกรรมเจ้าหน้าที่', status: 'In Progress', assignee: 'Charlie' },
  { id: 'IT67237', name: 'แผนก: พัฒนาคุณภาพ JCI เรื่อง: ขอเปิดสิทธิ์ โปรแกรม KM', status: 'In Progress', assignee: 'David' },
  { id: 'IT67242', name: 'แผนก: บุคคล เรื่อง: ขอให้ทำแบบสอบถามความพึงพอใจ', status: 'In Progress', assignee: 'Eve' },
];

export default function ITServicesComponent() {
  const navigate = useNavigate();

  const handleAddTask = () => {
    console.log('Add Task button clicked');
    // Navigate to add task page or open modal
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h1">
            IT Services Dashboard
          </Typography>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddTask}>
            Add Task
          </Button>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Chip label="COMPLETE (191)" color="success" sx={{ mr: 1 }} />
          <Chip label="WAIT FOR APPROVE (18)" color="warning" sx={{ mr: 1 }} />
          <Chip label="CANCELLED (27)" color="error" sx={{ mr: 1 }} />
          <Chip label="IN PROGRESS (7)" color="info" />
        </Box>
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
          />
        </Box>
      </Box>
    </Container>
  );
}
