import { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonCheckedSharpIcon from '@mui/icons-material/RadioButtonCheckedSharp';
import DeleteIcon from '@mui/icons-material/Delete';
import { SaveAlert } from '../Alert/alert';
import URLAPI from '../../../URLAPI';

export default function List_Request() {
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [successAlert, setSuccessAlert] = useState(false);
    const [userData, setUserData] = useState<any | null>(null);
    const [admin, setAdmin] = useState<string | null>(null);
    // const [apiUrl, setApiUrl] = useState<string>('');

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const buddhistYear = date.getFullYear() + 543;
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${day}/${month}/${buddhistYear}`;
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'Service':
                return '#fc836a';
            case 'Develop':
                return '#9d42f9';
            case 'Issue':
                return '#27e16d';
            default:
                return '#81b1c9';
        }
    }

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

    // const fetchRequests = async () => {
    //     try {
    //         console.log("Fetching Requests...");
    //         let apiUrl = 'http://127.0.0.1:1234/it-requests';
    //         console.log("Admin Check:", admin, userData && userData.id_department);
    //         console.log("Admin Value:", admin);
    //         console.log("User Data:", userData);

    //         if (admin === 'USER' && userData && userData.id_department) {
    //             apiUrl += `?department=${userData.id_department}`;
    //             console.log("API URL:", apiUrl); // แสดง API URL ที่ถูกสร้าง
    //         }

    //         const response = await fetch(apiUrl);
    //         console.log(apiUrl)
    //         if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //         }
    //         const data = await response.json();
    //         const mappedData = data.data.map((item: any) => ({
    //             id: item.id,
    //             req_no: item.rs_code,
    //             name: `${item.title_req || (item.program_name ? `พัฒนาโปรแกรมต่อเนื่อง (${item.program_name})` : 'พัฒนาโปรแกรมต่อเนื่อง')}`,
    //             status: item.status_name,
    //             type_id: item.type_id,
    //             type: item.type,
    //             assignee: item.assign_name || '',
    //             datecreated: formatDate(item.created_at),
    //         }));
    //         setRows(mappedData);
    //     } catch (error) {
    //         console.error('Error fetching requests:', error);
    //     }
    // };

    // useEffect(() => {
    //     const storedUserData = sessionStorage.getItem('userData');
    //     const storedAdmin = sessionStorage.getItem('admin');

    //     if (storedUserData) {
    //         const userDataParsed = JSON.parse(storedUserData); // Make sure this is defined
    //         setUserData(userDataParsed);
    //         console.log("UserData:", userDataParsed);
    //     }

    //     if (storedAdmin) {
    //         setAdmin(storedAdmin);
    //         console.log("Admin:", storedAdmin);
    //     }

    //     // Call fetchRequests after setting userData and admin
    //     if (storedUserData && storedAdmin) {
    //         fetchRequests();
    //     }
    // }, []);
    useEffect(() => {
        const storedUserData = sessionStorage.getItem('userData');
        const storedAdmin = sessionStorage.getItem('admin');
    
        console.log("Stored UserData:", storedUserData);
        console.log("Stored Admin:", storedAdmin);
    
        if (storedUserData) {
            const userDataParsed = JSON.parse(storedUserData);
            setUserData(userDataParsed);
            console.log("UserData:", userDataParsed);
        }
    
        if (storedAdmin) {
            setAdmin(storedAdmin);
            console.log("Admin:", storedAdmin);
        }
    }, []);
    
    // Call fetchRequests when userData or admin changes
    useEffect(() => {
        if (userData && userData.username && admin) {
            fetchRequests();
        } else {
            console.log("UserData or department is not set. Aborting fetch.");
        }
    }, [userData, admin]);
    
    const fetchRequests = async () => {
        if (!userData || !userData.username) return; // Make sure userData and department are set
    
        try {
            console.log("Fetching Requests...");
            let apiUrl = `${URLAPI}/it-requests`;
            console.log("Admin Check:", admin);
            console.log("Admin Value:", admin);
            console.log("User Data:", userData);
    
            if (admin === 'USER') {
                if (userData.position === 's' || userData.position === 'h') {
                    apiUrl += `?position=${userData.position}&department=${userData.id_department}`;
                    console.log("API URLsh:", apiUrl);
                } else if (userData.position === 'm') {
                    apiUrl += `?position=${userData.position}&division_competency=${userData.id_division_competency}`;
                    console.log("API URLm:", apiUrl);
                } else if (userData.position === 'd') {
                    apiUrl += `?position=${userData.position}&section_competency=${userData.id_section_competency}`;
                    console.log("API URLd:", apiUrl);
                }

                console.log("API URL:", apiUrl);
            }
    
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            const mappedData = data.data.map((item: any) => ({
                id: item.id,
                req_no: item.rs_code,
                name: `${item.title_req || (item.program_name ? `พัฒนาโปรแกรมต่อเนื่อง (${item.program_name})` : 'พัฒนาโปรแกรมต่อเนื่อง')}`,
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
    };    

    const handleDeleteClick = (id: number) => {
        setSelectedId(id);
        setOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedId) {
            try {
                const response = await fetch(`${URLAPI}/it-requests/${selectedId}`, {
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
            editable: false,
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
            editable: false,
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
        {
            field: 'actions',
            headerName: 'Actions',
            width: 90,
            renderCell: (params: GridRenderCellParams) => (
                <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteClick(params.row.id)}
                    sx={{ width: 25, justifyContent: 'center' }}
                >
                </Button>
            ),
        },
    ];

    return (
        <Container maxWidth={'xl'}>
            {successAlert && <SaveAlert onClose={() => setSuccessAlert(false)} />}
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