import { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonCheckedSharpIcon from '@mui/icons-material/RadioButtonCheckedSharp';
import DeleteIcon from '@mui/icons-material/Delete';
import { Alert, AspectRatio, IconButton, LinearProgress, Typography as JoyTypography } from '@mui/joy';
import Close from '@mui/icons-material/Close';
import Check from '@mui/icons-material/Check';

export default function List_Request() {
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [successAlert, setSuccessAlert] = useState(false);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const buddhistYear = date.getFullYear() + 543;
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${day}/${month}/${buddhistYear}`;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Request':
                return '#2196F3';
            case 'Manager Approve':
                return '#7abf7d';
            case 'Director Approve':
                return '#7abf7d';
            case 'IT Manager Approve':
                return '#fcba58';
            case 'IT Director Approve':
                return '#fcba58';
            case 'Wait For Assigned':
                return '#B0BEC5';
            case 'In Progress':
                return '#3a08a6';
            case 'Complete':
                return '#4CAF50';
            case 'Cancel':
                return '#F44336';
            default:
                return '#81b1c9';
        }
    };

    const handleRequest = () => {
        navigate('/request');
    };

    const fetchRequests = async () => {
        try {
            // const response = await fetch('http://10.200.240.2:1234/it-requests');
            const response = await fetch('http://127.0.0.1:1234/it-requests');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            const mappedData = data.data.map((item: any) => ({
                id: item.id,
                name: `${item.rs_code} ${item.title_req || (item.program_name ? `พัฒนาโปรแกรมต่อเนื่อง (${item.program_name})` : 'พัฒนาโปรแกรมต่อเนื่อง')}`,
                status: item.status_name,
                assignee: item.assign_name || '',
                datecreated: formatDate(item.created_at),
            }));
            setRows(mappedData);
        } catch (error) {
            console.error('Error fetching requests:', error);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleDeleteClick = (id: number) => {
        setSelectedId(id);
        setOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedId) {
            try {
                // const response = await fetch(`http://10.200.240.2:1234/it-requests/${selectedId}`, 
                const response = await fetch(`http://127.0.0.1:1234/it-requests/${selectedId}`, 
                {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                setRows(rows.filter((row: any) => row.id !== selectedId));
                setSuccessAlert(true);
                setTimeout(() => {
                    setSuccessAlert(false);
                }, 3000);
            } catch (error) {
                console.error('Error deleting request:', error);
            } finally {
                setOpen(false);
            }
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'No.',
            width: 55,
            renderCell: (params: GridRenderCellParams) => (
                <span>{params.api.getSortedRowIds().indexOf(params.id) + 1}</span>
            ),
        },
        {
            field: 'name',
            headerName: 'หัวข้อ Request',
            width: 800,
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
            field: 'status',
            headerName: 'สถานะดำเนินการ',
            width: 200,
            editable: true,
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
            width: 150,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params: GridRenderCellParams) => (
                <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteClick(params.row.id)}
                >
                    Delete
                </Button>
            ),
        },
    ];

    return (
        <Container maxWidth={'xl'}>
            {successAlert && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: '1rem',
                        right: '1rem',
                        zIndex: 1300,
                    }}
                >
                    <Alert
                        size="lg"
                        color="success"
                        variant="solid"
                        invertedColors
                        startDecorator={
                            <AspectRatio
                                variant="solid"
                                ratio="1"
                                sx={{
                                    minWidth: 40,
                                    borderRadius: '50%',
                                    boxShadow: '0 2px 12px 0 rgb(0 0 0/0.2)',
                                }}
                            >
                                <div>
                                    <Check />
                                </div>
                            </AspectRatio>
                        }
                        endDecorator={
                            <IconButton
                                variant="plain"
                                sx={{
                                    '--IconButton-size': '32px',
                                    transform: 'translate(0.5rem, -0.5rem)',
                                }}
                            >
                                <Close />
                            </IconButton>
                        }
                        sx={{ alignItems: 'flex-start', overflow: 'hidden' }}
                    >
                        <div>
                            <JoyTypography level="title-lg" sx={{ color: 'white' }}>ลบข้อมูลสำเร็จ</JoyTypography>
                            <JoyTypography level="body-sm" sx={{ color: 'white' }}>
                                กรุณารอสักครู่...
                            </JoyTypography>
                        </div>
                        <LinearProgress
                            variant="solid"
                            color="success"
                            value={40}
                            sx={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                borderRadius: 0,
                            }}
                        />
                    </Alert>
                </Box>
            )}
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
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Confirm Delete"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this request?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error" autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}