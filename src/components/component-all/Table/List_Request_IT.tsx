import { useState, useEffect, useCallback, useMemo } from 'react';
import { Modal, Box, Container, Typography, Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonCheckedSharpIcon from '@mui/icons-material/RadioButtonCheckedSharp';
import DeleteIcon from '@mui/icons-material/Delete';
import { SaveAlert } from '../Alert/alert';
import URLAPI from '../../../URLAPI';
import RequestDetail from '../Paper/RequestDetail';

// แยก Type ออกมาเพื่อความชัดเจน
interface RequestData {
    id: number;
    req_no: string;
    name: string;
    status: string;
    type_id: number;
    type: string;
    assignee: string;
    datecreated: string;
}

interface ListRequestITProps {
    tab: number;
}

export default function ListRequestIT({ tab }: ListRequestITProps) {
    const navigate = useNavigate();
    const [rows, setRows] = useState<RequestData[]>([]);
    const [open, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [successAlert, setSuccessAlert] = useState(false);
    const [userData, setUserData] = useState<any | null>(null);
    const [admin, setAdmin] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);

    // แยก utility functions ออกมาและใช้ useMemo เพื่อ cache ค่า
    const formatDate = useCallback((dateString: string) => {
        const date = new Date(dateString);
        const buddhistYear = date.getFullYear() + 543;
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${day}/${month}/${buddhistYear}`;
    }, []);

    const getTypeColor = useMemo(() => {
        const colorMap = {
            'Service': '#fc836a',
            'Develop': '#9d42f9',
            'Issue': '#27e16d'
        };
        return (type: string) => colorMap[type as keyof typeof colorMap] || '#81b1c9';
    }, []);

    const getStatusColor = useMemo(() => {
        const colorMap = {
            'Request': '#2196F3',
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
            'Complete': '#4CAF50',
            'Cancel': '#F44336'
        };
        return (status: string) => colorMap[status as keyof typeof colorMap] || '#81b1c9';
    }, []);

    // ใช้ useCallback สำหรับ handlers
    const handleRequest = useCallback(() => {
        navigate('/request');
    }, [navigate]);

    const handleDeleteClick = useCallback((id: number) => {
        setSelectedId(id);
        setOpen(true);
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        if (!selectedId) return;

        try {
            const response = await fetch(`${URLAPI}/it-requests/${selectedId}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Network response was not ok');

            setRows(prevRows => prevRows.filter(row => row.id !== selectedId));
            setSuccessAlert(true);
            setTimeout(() => setSuccessAlert(false), 3000);
        } catch (error) {
            console.error('Error deleting request:', error);
        } finally {
            setOpen(false);
        }
    }, [selectedId]);

    const handleClose = useCallback(() => {
        setOpen(false);
    }, []);

    const handleOpenModal = useCallback((id: number) => {
        setSelectedRequestId(id);
        setModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setModalOpen(false);
    }, []);

    // แยก fetchRequests ออกมาและใช้ useCallback
    const fetchRequests = useCallback(async () => {
        if (!userData?.username) return;

        setIsLoading(true);
        try {
            const response = await fetch(`${URLAPI}/it-requests?tab=${tab}`);
            if (!response.ok) throw new Error('Network response was not ok');

            const { data } = await response.json();
            const mappedData: RequestData[] = data.map((item: any) => ({
                id: item.id,
                req_no: item.rs_code,
                name: item.title_req || (item.program_name ? `พัฒนาโปรแกรมต่อเนื่อง (${item.program_name})` : 'พัฒนาโปรแกรมต่อเนื่อง'),
                status: item.status_name,
                type_id: item.type_id,
                type: item.type,
                assignee: item.assign_name || '',
                datecreated: formatDate(item.created_at),
            }));
            setRows(mappedData);
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setIsLoading(false);
        }
    }, [userData, tab, formatDate]);

    // ใช้ useMemo สำหรับ columns definition
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
            field: 'name',
            headerName: 'หัวข้อ Request',
            width: 740,
            renderCell: (params: GridRenderCellParams) => (
                <span
                    style={{ cursor: 'pointer', color: '#1976d2', textDecoration: 'underline' }}
                    onClick={() => handleOpenModal(params.row.id)}
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
                />
            ),
        },
    ], [handleOpenModal, getTypeColor, getStatusColor, handleDeleteClick]);

    // Load user data on mount
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

    // Fetch requests when dependencies change
    useEffect(() => {
        if (userData?.username && admin) {
            fetchRequests();
        }
    }, [userData, admin, fetchRequests]);

    return (
        <Container maxWidth="xl">
            {successAlert && <SaveAlert onClose={() => setSuccessAlert(false)} />}
            <Box sx={{ my: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4" component="h1">
                        Request List IT
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleRequest}
                    >
                        Request
                    </Button>
                </Box>
                <Box sx={{ height: 580, width: '100%' }}>
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
                        loading={isLoading}
                        getRowId={(row) => row.id}
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
                        คุณต้องการจะลบรายการนี้หรือไม่?
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
                    {selectedRequestId && <RequestDetail id={selectedRequestId} />}
                </Box>
            </Modal>


        </Container>
    );
}