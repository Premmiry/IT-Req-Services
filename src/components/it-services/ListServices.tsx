import React, { useState } from 'react';
import { Box, Container, Typography, IconButton, Menu, MenuItem, Button, Chip } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonCheckedSharpIcon from '@mui/icons-material/RadioButtonCheckedSharp';
import MoreVertIcon from '@mui/icons-material/MoreVert';

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

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    {
      field: 'name',
      headerName: 'Name',
      width: 750,
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
              setAnchorEl(null); // Close the menu
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
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}
              >
                  <Button color="primary" onClick={handleNavigate}>
                      {params.value}
                      {selectedDepartments.length > 0 && (
                          <Chip
                              label={selectedDepartments.join(', ')}
                              size="small"
                              color={getStatusColor(params.value as string)}
                              sx={{ marginLeft: 1 }}
                          />
                      )}
                  </Button>
                  {showIcon && (
                      <>
                          <IconButton onClick={handleClickIcon}>
                              <MoreVertIcon />
                          </IconButton>
                          <Menu
                              anchorEl={anchorEl}
                              open={open}
                              onClose={handleClose}
                          >
                              {departments.map((dept) => (
                                  <MenuItem
                                      key={dept}
                                      onClick={() => handleDepartmentSelect(dept)}
                                      disabled={selectedDepartments.includes(dept)} // Disable if already selected
                                  >
                                      {dept}
                                  </MenuItem>
                              ))}
                          </Menu>
                      </>
                  )}
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
        width: 150,
        editable: true,
    }
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
        navigate('/it-services');
    };

    return (
        <Container maxWidth={'lg'}>
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
