import React from 'react';
import { Box, Container, Typography, Button, Chip } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

// Function to get the color for the status chip
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
      case 'Success':
        return 'success';
      case 'Cancel':
        return 'error';
      default:
        return 'default';
    }
  };

// Columns definition for DataGrid
const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 100 },
  {
    field: 'name',
    headerName: 'Name',
    width: 553,
    editable: true,
    renderCell: (params: GridRenderCellParams) => {
      const navigate = useNavigate();
      
      const handleClick = () => {
        navigate(`/service/${params.row.id}`);
      };

      return (
        <Button color="primary" onClick={handleClick}>
          {params.value}
        </Button>
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
        size="small"
      />
    ),
  },
  {
    field: 'assignee',
    headerName: 'Assignee',
    width: 150,
    editable: true,
  },
  {
    field: 'datecreated',
    headerName: 'Date Created',
    width: 150,
    editable: true,
  },
];

// Rows of data for DataGrid
const rows = [
  { id: 'IT67001', name: 'โครงการลด 50%(โปรแกรมลงชื่อเจ้าหน้าที่ที่ร่วมโครงการ)', status: 'Request', assignee: 'thaweep', datecreated: '2024-10-01' },
  { id: 'IT67002', name: 'โครงการปรับปรุงระบบ IT', status: 'IT Admin', assignee: 'somchai', datecreated: '2024-10-02' },
  { id: 'IT67003', name: 'โครงการอบรม IT Security', status: 'Manager Approve', assignee: 'wanchai', datecreated: '2024-10-03' },
  { id: 'IT67004', name: 'โครงการพัฒนา Mobile App', status: 'Director Approved', assignee: 'siriwan', datecreated: '2024-10-04' },
  { id: 'IT67005', name: 'โครงการลด 50%(โปรแกรมลงชื่อเจ้าหน้าที่ที่ร่วมโครงการ)', status: 'Process', assignee: 'thaweep', datecreated: '2024-10-01' },
  { id: 'IT67006', name: 'โครงการปรับปรุงระบบ IT', status: 'IT Admin', assignee: 'somchai', datecreated: '2024-10-02' },
  { id: 'IT67007', name: 'โครงการอบรม IT Security', status: 'Manager Approve', assignee: 'wanchai', datecreated: '2024-10-03' },
  { id: 'IT67008', name: 'โครงการพัฒนา Mobile App', status: 'Director Approved', assignee: 'siriwan', datecreated: '2024-10-04' },
  { id: 'IT67009', name: 'โครงการลด 50%(โปรแกรมลงชื่อเจ้าหน้าที่ที่ร่วมโครงการ)', status: 'Request', assignee: 'thaweep', datecreated: '2024-10-01' },
  { id: 'IT67010', name: 'โครงการปรับปรุงระบบ IT', status: 'IT Admin', assignee: 'somchai', datecreated: '2024-10-02' },
  { id: 'IT67011', name: 'โครงการอบรม IT Security', status: 'Manager Approve', assignee: 'wanchai', datecreated: '2024-10-03' },
  { id: 'IT67012', name: 'โครงการพัฒนา Mobile App', status: 'Director Approved', assignee: 'siriwan', datecreated: '2024-10-04' },
];

export default function ListServices() {
  const navigate = useNavigate();

  // Handler for the request button
  const handleRequest = () => {
    console.log('Request button clicked');
    navigate('/it-services');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1">
            Request List
          </Typography>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleRequest}>
            Request
          </Button>
        </Box>
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
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
