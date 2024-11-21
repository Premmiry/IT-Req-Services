import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Divider, Grid, Link, Stepper, Step, StepLabel } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import URLAPI from '../../../URLAPI';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import DeleteIcon from '@mui/icons-material/Delete';
import AssigneeDepSelector from '../Select/AssigneeDepSelector';
import AssigneeEmpSelector from '../Select/AssigneeEmpSelector';
import UAT from '../ContentTypeR/boxUAT'; // นำเข้า PrioritySelector
import { SelectPriority } from '../Select/select-priority';
import DateWork from '../DatePicker/datework';

// ฟังก์ชันสุ่มสี
type ChipColor = 'primary' | 'success' | 'secondary' | 'error' | 'warning' | 'info' | 'default';

// แก้ไข function getRandomColor ให้ return type ที่ถูกต้อง
const getRandomColor = (): ChipColor => {
    const colors: ChipColor[] = ['primary', 'success', 'secondary', 'error', 'warning', 'info'];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
};

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1100,
    maxHeight: '100vh',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    overflowY: 'auto',
};

// Interfaces
interface RequestData {
    id: number;
    id_department: number;
    name_department: string;
    type_id: number | null;
    type: string;
    topic_id: number | null;
    topic: string;
    id_program?: number;
    program_name?: string;
    name_req: string;
    phone: string;
    title_req: string;
    detail_req: string;
    rs_code: string;
    created_at: string;
    status_id: number | null;
    status_name: string;
    files?: string;
    // Approval fields
    m_name?: string;
    m_status?: string;
    mapp?: string;
    d_name?: string;
    d_status?: string;
    dapp?: string;
    it_m_name?: string;
    it_m_status?: string;
    itmapp?: string;
    it_m_note?: string;
    it_d_name?: string;
    it_d_status?: string;
    itdapp?: string;
    it_d_note?: string;
    id_priority?: number | null;
    name_priority?: string | null;
    date_start?: Date | null;
    date_end?: Date | null;
}

interface FileInfo {
    file_path: string;
    file_name: string;
    file_old_name: string;
    file_new_name: string;
}

interface RequestDetailProps {
    id: number;
    isModal?: boolean;
    onClose?: () => void;
}

// Component
const RequestDetail: React.FC<RequestDetailProps> = ({ id, isModal, onClose }: RequestDetailProps) => {
    const navigate = useNavigate();

    // State declarations
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [requestData, setRequestData] = useState<RequestData | null>(null);
    const [uploadedFiles, setUploadedFiles] = useState<FileInfo[]>([]);
    const [userData, setUserData] = useState<any | null>(null);
    const [admin, setAdmin] = useState<string | null>(null);


    // Helper function to format dates
    const formatDate = useCallback((dateString: string): string => {
        const date = new Date(dateString);
        const buddhistYear = date.getFullYear() + 543;
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${day}/${month}/${buddhistYear}`;
    }, []);

    const isITStaff = useMemo(() => {
        return userData?.id_section === 28 ||
            userData?.id_division_competency === 86 ||
            userData?.id_section_competency === 28;
    }, [userData]);

    // Fetch Functions
    const fetchRequestData = useCallback(async () => {
        if (!id) return;
        try {
            const response = await fetch(`${URLAPI}/it-requests?req_id=${id}`);
            if (!response.ok) throw new Error(`Error fetching request data: ${response.statusText}`);

            const { data } = await response.json();
            console.log("ข้อมูลที่ได้จาก API:", data);

            if (data && data.length > 0) {
                const requestData = data[0];
                setRequestData(requestData);
            }

            if (data[0].files) {
                try {
                    const parsedFiles = JSON.parse(data[0].files);
                    setUploadedFiles(Array.isArray(parsedFiles) ? parsedFiles : []);
                } catch (e) {
                    console.error('Error parsing files:', e);
                }
            }

            // console.log('Request data:', data[0]);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An error occurred');
        }
    }, [id]);

    // Effects
    useEffect(() => {
        const fetchAllData = async () => {
            setIsLoading(true);
            try {
                await Promise.all([
                    fetchRequestData(),
                ]);
            } catch (error) {
                setError(error instanceof Error ? error.message : 'An error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllData();
    }, [fetchRequestData]);

    // Handlers
    const handleEdit = () => navigate(`/edit-request/${id}`);

    

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

    // Render helpers
    if (isLoading) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography>Loading...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    if (!requestData) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography>No request data found</Typography>
            </Box>
        );
    }

    return (
        <Box sx={style}>
            <Typography variant="h5" gutterBottom>
                {requestData.rs_code} : {requestData.topic} {requestData.id_program ? requestData.program_name : requestData.title_req}
            </Typography>

            <Box>
                <Card variant="outlined" sx={{ maxWidth: 1200 }}>
                    <Box sx={{ p: 2 }}>
                        <Stack direction="column">
                            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography gutterBottom component="div">
                                    ชื่อผู้ร้องขอ:{" "}
                                    <Box component="span" sx={{ fontSize: "0.875rem", color: "blue" }}>
                                        {requestData.name_req}
                                    </Box>
                                </Typography>
                                <Typography gutterBottom component="div">
                                    วันที่ร้องขอ:{" "}
                                    <Box component="span" sx={{ fontSize: "0.875rem", color: "blue" }}>
                                        {formatDate(requestData.created_at)}
                                    </Box>
                                </Typography>
                            </Stack>

                            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography gutterBottom component="div">
                                    แผนก:{" "}
                                    <Box component="span" sx={{ fontSize: "0.875rem", color: "blue" }}>
                                        {requestData.name_department || 'Loading...'}
                                    </Box>
                                </Typography>
                                <Typography gutterBottom component="div">
                                    เบอร์ติดต่อ:{" "}
                                    <Box component="span" sx={{ fontSize: "0.875rem", color: "blue" }}>
                                        {requestData.phone}
                                    </Box>
                                </Typography>
                            </Stack>

                            <Stack direction="column" spacing={0.5}>
                                <Typography gutterBottom component="div">
                                    ประเภท: <Box component="span" sx={{ fontSize: "0.875rem", color: "blue" }}>{requestData.type}</Box>
                                </Typography>
                                <Typography gutterBottom component="div">
                                    รายละเอียด: <Box component="span" sx={{ fontSize: "0.875rem", color: "blue" }}>{requestData.detail_req}</Box>
                                </Typography>
                            </Stack>

                            <Box sx={{ p: 1 }}>
                                {(requestData?.m_name || requestData?.d_name) && (
                                    <Grid container spacing={2} justifyContent="center" alignItems="center">
                                        <Grid item xs={12} sm={6} md={8}>
                                            <Stack spacing={2} sx={{ width: '100%' }}>
                                                <Stepper activeStep={-1} sx={{
                                                    '.MuiStepLabel-root': {
                                                        fontSize: '0.8rem', // ลดขนาดฟอนต์ของ StepLabel
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    },
                                                }}>
                                                    {requestData.m_name && (
                                                        <Step>
                                                            <StepLabel
                                                                color="neutral"
                                                                StepIconComponent={() => (
                                                                    <CheckCircleIcon sx={{ color: 'primary.main', fontSize: '1.5rem' }} />
                                                                )}
                                                            >
                                                                Manager
                                                            </StepLabel>
                                                        </Step>
                                                    )}
                                                    {requestData.d_name && (
                                                        <Step>
                                                            <StepLabel
                                                                StepIconComponent={() => (
                                                                    <CheckCircleIcon sx={{ color: 'secondary.main', fontSize: '1.5rem' }} />
                                                                )}
                                                            >
                                                                Director
                                                            </StepLabel>
                                                        </Step>
                                                    )}
                                                </Stepper>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                )}

                                <Grid container spacing={1} justifyContent="center">
                                    {requestData?.m_name && (
                                        <Grid item xs={12} sm={6} md={4}>
                                            <List>
                                                <ListItem alignItems="center" sx={{ padding: 0.1 }}>
                                                    <ListItemAvatar>
                                                        <Avatar
                                                            alt="Manager"
                                                            src=""
                                                            sx={{
                                                                width: 20,
                                                                height: 20,
                                                                bgcolor: 'primary.main',
                                                            }}
                                                        />
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={
                                                            <>
                                                                <span >{requestData.m_name} : </span>
                                                                <span style={{ color: 'green' }}>{requestData.mapp}</span>
                                                            </>
                                                        }
                                                    />
                                                </ListItem>
                                                <Divider variant="inset" component="li" />
                                            </List>
                                        </Grid>
                                    )}

                                    {requestData?.d_name && (
                                        <Grid item xs={12} sm={6} md={4}>
                                            <List>
                                                <ListItem alignItems="center" sx={{ padding: 0.1 }}>
                                                    <ListItemAvatar>
                                                        <Avatar
                                                            alt="IT Director"
                                                            src=""
                                                            sx={{
                                                                width: 20,
                                                                height: 20,
                                                                bgcolor: 'secondary.main',
                                                            }}
                                                        />
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={
                                                            <>
                                                                <span >{requestData.d_name} : </span>
                                                                <span style={{ color: 'green' }}>{requestData.dapp}</span>
                                                            </>
                                                        }
                                                    />
                                                </ListItem>
                                                <Divider variant="inset" component="li" />
                                            </List>
                                        </Grid>
                                    )}
                                </Grid>
                            </Box>
                        </Stack>
                    </Box>
                    <Divider />
                    <Box sx={{ p: 1 }}>
                        <Typography gutterBottom variant="body2">เอกสารแนบ</Typography>
                        <Stack direction="column">
                            {uploadedFiles.length > 0 ? (
                                <Stack direction="row" spacing={1} flexWrap="wrap">
                                    {uploadedFiles.map((file, index) => (
                                        <Link
                                            key={index}
                                            href={`${URLAPI}/${file.file_path}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{ textDecoration: 'none', color: 'inherit' }}
                                        >
                                            <Chip
                                                label={file.file_old_name || file.file_name}
                                                color="primary"
                                                variant="outlined"
                                                clickable
                                                sx={{ fontWeight: 'bold' }}
                                                size="small"
                                            />
                                        </Link>
                                    ))}
                                </Stack>
                            ) : (
                                <Typography color="text.secondary">No files uploaded</Typography>
                            )}
                        </Stack>
                    </Box>
                </Card>
                <br />
                <Card variant="outlined" sx={{ maxWidth: 1200 }}>
                    <Box sx={{ p: 2 }}>
                        {(requestData?.it_m_name || requestData?.it_d_name) && (
                            <Grid container spacing={2} justifyContent="center" alignItems="center">
                                <Grid item xs={12} sm={6} md={8}>
                                    <Stack spacing={2} sx={{ width: '100%' }}>
                                        <Stepper activeStep={-1} sx={{
                                            '.MuiStepLabel-root': {
                                                fontSize: '0.8rem', // ลดขนาดฟอนต์ของ StepLabel
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            },
                                        }}>
                                            {requestData.it_m_name && (
                                                <Step>
                                                    <StepLabel
                                                        color="neutral"
                                                        StepIconComponent={() => (
                                                            <CheckCircleIcon sx={{ color: 'warning.main', fontSize: '1.5rem' }} />
                                                        )}
                                                    >
                                                        Manager
                                                    </StepLabel>
                                                </Step>
                                            )}
                                            {requestData.it_d_name && (
                                                <Step>
                                                    <StepLabel
                                                        StepIconComponent={() => (
                                                            <CheckCircleIcon sx={{ color: 'success.main', fontSize: '1.5rem' }} />
                                                        )}
                                                    >
                                                        Director
                                                    </StepLabel>
                                                </Step>
                                            )}
                                        </Stepper>
                                    </Stack>
                                </Grid>
                            </Grid>
                        )}
                        <Grid container spacing={2} justifyContent="center">
                            {requestData?.it_m_name && (
                                <Grid item xs={12} sm={6} md={4}>
                                    <List >
                                        <ListItem alignItems="center" sx={{ padding: 0.1 }}>
                                            <ListItemAvatar>
                                                <Avatar alt="Manager"
                                                    src=""
                                                    sx={{
                                                        width: 20,
                                                        height: 20,
                                                        bgcolor: 'warning.main',
                                                    }} />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <>
                                                        <span>{requestData.it_m_name} : </span>
                                                        <span style={{ color: 'green' }}>{requestData.itmapp}</span>
                                                    </>
                                                }
                                                secondary={
                                                    <React.Fragment>
                                                        <Typography
                                                            component="span"
                                                            variant="body2"
                                                            sx={{ color: 'text.primary', display: 'inline' }}
                                                        >
                                                            ความเห็น:
                                                        </Typography>
                                                        {requestData.it_m_note && <> {requestData.it_m_note} </>}
                                                    </React.Fragment>
                                                }
                                            />
                                        </ListItem>
                                        <Divider variant="inset" component="li" />
                                    </List>
                                </Grid>
                            )}
                            {requestData?.it_d_name && (
                                <Grid item xs={12} sm={6} md={4}>
                                    <List >
                                        <ListItem alignItems="center" sx={{ padding: 0.1 }}>
                                            <ListItemAvatar>
                                                <Avatar alt="Manager"
                                                    src=""
                                                    sx={{
                                                        width: 20,
                                                        height: 20,
                                                        bgcolor: 'success.main',
                                                    }} />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <>
                                                        <span>{requestData.it_d_name} : </span>
                                                        <span style={{ color: 'green' }}>{requestData.itdapp}</span>

                                                    </>
                                                }

                                                secondary={
                                                    <React.Fragment>
                                                        <Typography
                                                            component="span"
                                                            variant="body2"
                                                            sx={{ color: 'text.primary', display: 'inline' }}
                                                        >
                                                            ความเห็น:
                                                        </Typography>
                                                        {requestData.it_d_note && <> {requestData.it_d_note} </>}
                                                    </React.Fragment>
                                                }
                                            />
                                        </ListItem>
                                        <Divider variant="inset" component="li" />
                                    </List>
                                </Grid>
                            )}
                        </Grid>
                    </Box>
                    <Divider />
                    <Box sx={{ p: 1 }}>
                        {/* Section: มอบหมายงานแผนก */}
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Typography gutterBottom variant="body2" sx={{ fontWeight: 'bold', minWidth: 120 }}>
                                มอบหมายงานแผนก
                            </Typography>

                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                                <AssigneeDepSelector requestId={requestData.id}/>

                                
                            </Box>
                        </Stack>
                        {/* Section: ผู้รับผิดชอบ */}
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2 }}>
                            <Typography gutterBottom variant="body2" sx={{ fontWeight: 'bold', minWidth: 120 }}>
                                ผู้รับผิดชอบ
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                                <AssigneeEmpSelector requestId={requestData.id} />
                            </Box>
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2 }}>
                            <Typography gutterBottom variant="body2" sx={{ fontWeight: 'bold', minWidth: 120 }}>
                                ระยะเวลาที่ทำ
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                                <DateWork req_id={requestData.id} date_start={requestData.date_start} date_end={requestData.date_end} />
                            </Box>
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2 }}>
                            <Typography gutterBottom variant="body2" sx={{ fontWeight: 'bold', minWidth: 120 }}>
                                ระดับความสำคัญ
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                                <SelectPriority id={requestData.id} id_priority={requestData?.id_priority ?? null} />
                            </Box>
                        </Stack>
                    </Box>
                </Card>
                <br />
                <Card variant="outlined" sx={{ maxWidth: 1200 }}>
                    <Box sx={{ p: 2 }}>
                        {requestData.status_id === 5 && requestData.type_id === 3 ? (
                            <>
                                <UAT id={requestData.id} username={userData.username} department={userData.id_department} status={requestData.status_id} onClose={onClose} />
                            </>
                        ) : (
                            <Typography variant="h6">Confirm งาน</Typography>
                        )}
                    </Box>
                </Card>
            </Box>
            {!isModal && (

                <Button
                    variant="contained"
                    endIcon={<SendIcon />}
                    onClick={handleEdit}
                    sx={{ mt: 2, mb: 2, width: '100%' }}
                >
                    Request Form
                </Button>
            )}
        </Box>
    );
};

export default RequestDetail;