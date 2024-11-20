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
}

interface FileInfo {
    file_path: string;
    file_name: string;
    file_old_name: string;
    file_new_name: string;
}

interface AssignedEntity {
    user_assigned: string;
    assigned_date: string;
}

interface AssignedDepartment extends AssignedEntity {
    id: number;
    id_req_dep: number;
    req_id: number;
    id_department: number;
    name_department?: string;
}

interface AssignedEmployee extends AssignedEntity {
    id: number;
    id_req_emp: number;
    req_id: number;
    id_emp: number;
    emp_name?: string;
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
    const [assignedDepartments, setAssignedDepartments] = useState<AssignedDepartment[]>([]);
    const [assignedEmployees, setAssignedEmployees] = useState<AssignedEmployee[]>([]);
    const [selectedAssignees, setSelectedAssignees] = useState<any[]>([]);
    const [selectedDepartments, setSelectedDepartments] = useState<any[]>([]);

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

    const fetchAssignments = useCallback(async () => {
        if (!id) return;

        try {
            const [departmentsRes, employeesRes] = await Promise.all([
                fetch(`${URLAPI}/assigned_department/${id}`),
                fetch(`${URLAPI}/assigned_employee/${id}`)
            ]);

            if (!departmentsRes.ok || !employeesRes.ok) {
                throw new Error('Error fetching assignments');
            }

            let departments: AssignedDepartment[] = await departmentsRes.json();
            let employees: AssignedEmployee[] = await employeesRes.json();

            console.log(departments, employees);

            if (!Array.isArray(departments)) {
                departments = [];
                console.warn('departments ไม่เป็น array');
            }
            if (!Array.isArray(employees)) {
                employees = [];
                console.warn('employees ไม่เป็น array');
            }

            setAssignedDepartments(departments);
            setAssignedEmployees(employees);
        } catch (error) {
            console.error('Error fetching assignments:', error);
        }
    }, [id]);

    // Effects
    useEffect(() => {
        const fetchAllData = async () => {
            setIsLoading(true);
            try {
                await Promise.all([
                    fetchRequestData(),
                    fetchAssignments()
                ]);
            } catch (error) {
                setError(error instanceof Error ? error.message : 'An error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllData();
    }, [fetchRequestData, fetchAssignments]);

    // Handlers
    const handleEdit = () => navigate(`/edit-request/${id}`);

    const handleRemoveDepartment = async (id_req_dep: number) => {
        try {
            const response = await fetch(`${URLAPI}/assign_department/${id_req_dep}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to remove department');
            }

            setAssignedDepartments((prevDepartments) =>
                prevDepartments.filter((department) => department.id_req_dep !== id_req_dep)
            );
            console.log(`Department with id_req_dep ${id_req_dep} removed successfully.`);
        } catch (error) {
            console.error('Error removing department:', error);
        }
    };

    const handleRemoveEmployee = async (id_req_emp: number) => {
        try {
            const response = await fetch(`${URLAPI}/assign_employee/${id_req_emp}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to remove employee');
            }

            setAssignedEmployees((prevEmployees) =>
                prevEmployees.filter((employee) => employee.id_req_emp !== id_req_emp)
            );
            console.log(`Employee with id_req_emp ${id_req_emp} removed successfully.`);
        } catch (error) {
            console.error('Error removing employee:', error);
        }
    };

    useEffect(() => {
        if (selectedDepartments.length > 0) {
            setAssignedDepartments((prevDepartments) => [
                ...prevDepartments,
                ...selectedDepartments.filter((department) =>
                    !prevDepartments.some((deptId) => deptId.id_department === department.id)
                )
            ]);
        }
    }, [selectedDepartments]);

    useEffect(() => {
        if (selectedAssignees.length > 0) {
            setAssignedEmployees((prevEmployees) => [
                ...prevEmployees,
                ...selectedAssignees.filter((assignee) =>
                    !prevEmployees.some((emp) => emp.id === assignee.id)
                )
            ]);
        }
    }, [selectedAssignees]);

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
                                <AssigneeDepSelector
                                    requestId={requestData.id}
                                    selectedAssigneesDep={selectedDepartments}
                                    onAssigneeDepChange={setSelectedDepartments}
                                    setAssignedDepartments={setAssignedDepartments} // ส่งฟังก์ชันนี้ไป
                                />

                                {assignedDepartments.length > 0 ? (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {assignedDepartments.map((dept, index) => (
                                            <Chip
                                                key={index}
                                                color={getRandomColor()}
                                                deleteIcon={<DeleteIcon />}
                                                variant="outlined"
                                                icon={<LocalOfferIcon sx={{ fontSize: 16 }} />}
                                                label={dept.name_department}
                                                onClick={() => console.info(`You clicked the Chip for ${dept.name_department}`)}
                                                onDelete={isITStaff ? () => handleRemoveDepartment(dept.id_req_dep) : undefined}
                                            />
                                        ))}
                                    </Box>
                                ) : (
                                    <Typography color="text.secondary">No departments assigned</Typography>
                                )}
                            </Box>
                        </Stack>
                        {/* Section: ผู้รับผิดชอบ */}
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2 }}>
                            <Typography gutterBottom variant="body2" sx={{ fontWeight: 'bold', minWidth: 120 }}>
                                ผู้รับผิดชอบ
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                                <AssigneeEmpSelector
                                    requestId={requestData.id}
                                    selectedAssignees={selectedAssignees}
                                    onAssigneeChange={setSelectedAssignees}
                                />
                                {assignedEmployees.length > 0 ? (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {assignedEmployees.map((emp, index) => (
                                            <Chip
                                                key={index}
                                                color="primary"
                                                variant="outlined"
                                                avatar={<Avatar alt={emp.emp_name} src="" />}
                                                label={emp.emp_name}
                                                onClick={() => console.info(`You clicked the Chip for ${emp.emp_name}`)}
                                                onDelete={isITStaff ? () => handleRemoveEmployee(emp.id_req_emp) : undefined}
                                                deleteIcon={<DeleteIcon />}
                                                sx={{
                                                    '& .MuiChip-deleteIcon': {
                                                        color: '#f44336',
                                                        ml: '4px'
                                                    }
                                                }}
                                            />
                                        ))}
                                    </Box>
                                ) : (
                                    <Typography color="text.secondary">No employees assigned</Typography>
                                )}
                            </Box>
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2 }}>
                            <Typography gutterBottom variant="body2" sx={{ fontWeight: 'bold', minWidth: 120 }}>
                                ระดับความสำคัญ
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                                <SelectPriority id={requestData.id} id_priority={requestData.id_priority} />
                                    
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