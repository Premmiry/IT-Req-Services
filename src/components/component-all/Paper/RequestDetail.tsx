import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Paper, Divider, Grid, Link, Stepper, Step, StepLabel, IconButton, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import URLAPI from '../../../URLAPI';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import React from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import DeleteIcon from '@mui/icons-material/Delete';
import AssigneeDepSelector from './AssigneeDepSelector';
import AssigneeEmpSelector from './AssigneeEmpSelector';
import DoneIcon from '@mui/icons-material/Done';
import { ChevronsLeftIcon } from 'lucide-react';






const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1100,
    maxHeight: '100vh', // กำหนดความสูงสูงสุดของกล่อง
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    overflowY: 'auto', // เพิ่ม scroll เมื่อข้อมูลมีจำนวนมาก
};





// Interfaces
interface RequestData {
    id_department: number;
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

interface ITDepartment {
    id_department_it: number;
    name_department_it: string;
    code_department_it: string;
}

interface AssignedDepartment extends AssignedEntity {
    id_req_dep: number;
    req_id: number;
    id_department: number; // id ที่ใช้แมพกับ id_department_it
    name_department_it?: string; // เพิ่ม field สำหรับเก็บชื่อแผนก
}

interface AssignedEmployee extends AssignedEntity {
    id_req_emp: number;
    req_id: number;
    id_emp: number;
    emp_name?: string;
}

interface RequestDetailProps {
    id: string;
    isModal?: boolean;
}

// Component
export default function RequestDetail({ id, isModal }: RequestDetailProps) {
    const navigate = useNavigate();

    // State declarations (no changes here)
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [requestData, setRequestData] = useState<RequestData | null>(null);
    const [departmentName, setDepartmentName] = useState<string>('');
    const [uploadedFiles, setUploadedFiles] = useState<FileInfo[]>([]);
    const [userData, setUserData] = useState<any | null>(null);
    const [admin, setAdmin] = useState<string | null>(null);
    const [assignedDepartments, setAssignedDepartments] = useState<AssignedDepartment[]>([]);
    const [assignedEmployees, setAssignedEmployees] = useState<AssignedEmployee[]>([]);
    const [itDepartments, setItDepartments] = useState<ITDepartment[]>([]);


    // Selection state (no changes here)
    const [selectedAssignees, setSelectedAssignees] = useState([]);
    const [selectedDepartments, setSelectedDepartments] = useState([]);



    // Helper function to format dates
    const formatDate = useCallback((dateString: string) => {
        const date = new Date(dateString);
        const buddhistYear = date.getFullYear() + 543;
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${day}/${month}/${buddhistYear}`;
    }, []);



    // Fetch Functions
    const fetchRequestData = useCallback(async () => {
        if (!id) return;
        try {
            const response = await fetch(`${URLAPI}/it-requests?req_id=${id}`);
            if (!response.ok) throw new Error(`Error fetching request data: ${response.statusText}`);

            const { data } = await response.json();
            if (!data?.[0]) throw new Error('No request data found');

            setRequestData(data[0]);

            // Handle files
            if (data[0].files) {
                try {
                    const parsedFiles = JSON.parse(data[0].files);
                    setUploadedFiles(Array.isArray(parsedFiles) ? parsedFiles : []);
                } catch (e) {
                    console.error('Error parsing files:', e);
                }
            }

            console.log('Request data:', data[0]);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An error occurred');
        }
    }, [id]);

    useEffect(() => {
        fetchRequestData();
    }, [fetchRequestData]);


    // Fetch department name
    const fetchDepartmentName = useCallback(async (departmentId: number) => {
        try {
            const response = await fetch(`${URLAPI}/departments?id_dep=${departmentId}`);
            if (!response.ok) throw new Error('Error fetching department data');

            const data = await response.json();
            if (data?.[0]?.name_department) {
                setDepartmentName(data[0].name_department);
            }
        } catch (error) {
            console.error('Error fetching department name:', error);
        }
    }, []);


    // Fetch IT departments assignee
    const fetchITDepartments = useCallback(async (deptIds: number[]) => {
        try {
            const uniqueDeptIds = [...new Set(deptIds)];
            
            // เรียก API ครั้งเดียวโดยไม่ใส่ filter
            const response = await fetch(`${URLAPI}/departments_it`);
            if (!response.ok) {
                throw new Error('Error fetching IT departments');
            }
            
            const allDepartments = await response.json();
            
            // filter ข้อมูลหลังจากได้ response
            const filteredDepartments = allDepartments.filter(
                dept => uniqueDeptIds.includes(dept.id_department_it)
            );
    
            // ตรวจสอบว่าได้ข้อมูลครบ
            const missingIds = uniqueDeptIds.filter(
                id => !filteredDepartments.some(dept => dept.id_department_it === id)
            );
            
            if (missingIds.length > 0) {
                console.warn('Missing departments for IDs:', missingIds);
            }
    
            setItDepartments(filteredDepartments);
            console.log('Filtered IT Departments:', filteredDepartments);
            
        } catch (error) {
            console.error('Error fetching IT departments:', error);
        }
    }, []);

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

            // ตรวจสอบว่า departments และ employees เป็น array ก่อนใช้งาน
            if (!Array.isArray(departments)) {
                departments = []; // หรือ handle error
                console.warn('departments ไม่เป็น array');
            }
            if (!Array.isArray(employees)) {
                employees = []; // หรือ handle error
                console.warn('employees ไม่เป็น array');
            }

            // Fetch IT department details
            const departmentIds = departments.map(deptId => parseInt(deptId.id_department));
            await fetchITDepartments(departmentIds);

            setAssignedDepartments(departments);
            setAssignedEmployees(employees);
        } catch (error) {
            console.error('Error fetching assignments:', error);
        }
    }, [id, fetchITDepartments]);

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

    useEffect(() => {
        if (requestData?.id_department) {
            fetchDepartmentName(requestData.id_department);
        }
    }, [requestData?.id_department, fetchDepartmentName]);

// 1. แยก effect สำหรับการ fetch ข้อมูล
useEffect(() => {
    // เช็คว่ามี assigned departments ก่อน
    if (assignedDepartments.length > 0) {
        const deptIds = assignedDepartments.map(dept => Number(dept.id_department));
        fetchITDepartments(deptIds);
    }
}, [assignedDepartments, fetchITDepartments]); // dependency เฉพาะที่จำเป็น

// 2. แยก effect สำหรับการแมปข้อมูล
useEffect(() => {
    // เช็คว่ามีข้อมูลพร้อมก่อนทำการแมป
    if (assignedDepartments.length > 0 && itDepartments.length > 0) {
        const needsUpdate = assignedDepartments.some(dept => !dept.name_department_it);
        
        if (needsUpdate) {
            const updatedDepartments = assignedDepartments.map(dept => {
                const matchingDept = itDepartments.find(
                    itDept => itDept.id_department_it === Number(dept.id_department)
                );
                
                // ถ้ามีชื่อแผนกอยู่แล้ว ให้ใช้ของเดิม
                if (dept.name_department_it) {
                    return dept;
                }
                
                return {
                    ...dept,
                    name_department_it: matchingDept?.name_department_it || 'Unnamed Department'
                };
            });
            
            setAssignedDepartments(updatedDepartments);
        }
    }
}, [itDepartments]); // เอา assignedDepartments ออกจาก dependency



// 4. เพิ่ม Debug logging เพื่อตรวจสอบการแมพข้อมูล
useEffect(() => {
    if (!itDepartments?.length) {
        console.log('IT Departments not loaded yet');
        return;
    }
    if (!assignedDepartments?.length) {
        console.log('Assigned Departments not loaded yet');
        return;
    }
    if (assignedDepartments.length > 0 && itDepartments.length > 0) {

        
        console.log('Assigned Departments:', assignedDepartments);
        console.log('IT Departments:', itDepartments);
    }
}, [assignedDepartments, itDepartments]);


useEffect(() => {
    console.log('Debug Data:', {
        assignedDepartments: assignedDepartments.map(d => ({
            id: d.id_department,
            mapped_name: d.name_department_it
        })),
        itDepartments: itDepartments.map(d => ({
            id: d.id_department_it,
            name: d.name_department_it
        }))
    });
}, [assignedDepartments, itDepartments]);

    // .............................ฟังก์ชันสำหรับการลบแผนก.................................................................................
    const handleRemoveDepartment = async (id_req_dep: number) => {
        try {
            // ส่งคำขอ DELETE โดยใช้ id_req_dep
            const response = await fetch(`${URLAPI}/assign_department/${id_req_dep}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to remove department');
            }

            // อัปเดต UI หลังจากลบแผนกสำเร็จ
            setAssignedDepartments((prevDepartments) =>
                prevDepartments.filter((department) => department.id_req_dep !== id_req_dep)
            );
            console.log(`Department with id_req_dep ${id_req_dep} removed successfully.`);
        } catch (error) {
            console.error('Error removing department:', error);
        }
    };

    // Update assigned departments when new departments are selected
    useEffect(() => {
        if (selectedDepartments.length > 0) {
            // Update assigned departments when new assignees are selected
            setAssignedDepartments((prevDepartments) => [
                ...prevDepartments,
                ...selectedDepartments.filter((department) =>
                    !prevDepartments.some((deptId) => deptId.id_department_it === department.id)
                )
            ]);
        }
    }, [selectedDepartments]);

    // .............................end.................................................................................


    // ฟังก์ชันสำหรับการลบพนักงาน...........................................................................................

    const handleRemoveEmployee = async (id_req_emp: number) => {
        try {
            // Send DELETE request using id_req_emp
            const response = await fetch(`${URLAPI}/assign_employee/${id_req_emp}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to remove employee');
            }

            // Update the UI after successfully removing the employee
            setAssignedEmployees((prevEmployees) =>
                prevEmployees.filter((employee) => employee.id_req_emp !== id_req_emp)
            );
            console.log(`Employee with id_req_emp ${id_req_emp} removed successfully.`);
        } catch (error) {
            console.error('Error removing employee:', error);
        }
    };

    // Update assigned employees when new assignees are selected
    useEffect(() => {
        if (selectedAssignees.length > 0) {
            // Update assigned employees when new assignees are selected
            setAssignedEmployees((prevEmployees) => [
                ...prevEmployees,
                ...selectedAssignees.filter((assignee) =>
                    !prevEmployees.some((emp) => emp.id === assignee.id)
                )
            ]);
        }
    }, [selectedAssignees]);
    // ....................................................end............................................................................. //





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



    // Handlers
    const handleEdit = () => navigate(`/edit-request/${id}`);

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
                {requestData.rs_code} : {requestData.topic}
                {requestData.id_program ? requestData.program_name : requestData.title_req}
            </Typography>


            <Box >



                <Card variant="outlined" sx={{ maxWidth: 1200 }}>
                    <Box sx={{ p: 2 }}>
                        <Stack direction="column">
                            {/* ผู้ร้องขอและวันที่ร้องขอ */}
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

                            {/* แผนกและเบอร์ติดต่อ */}
                            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography gutterBottom component="div">
                                    แผนก:{" "}
                                    <Box component="span" sx={{ fontSize: "0.875rem", color: "blue" }}>
                                        {departmentName || 'Loading...'}
                                    </Box>
                                </Typography>
                                <Typography gutterBottom component="div">
                                    เบอร์ติดต่อ:{" "}
                                    <Box component="span" sx={{ fontSize: "0.875rem", color: "blue" }}>
                                        {requestData.phone}
                                    </Box>
                                </Typography>
                            </Stack>

                            {/* ประเภทและรายละเอียด */}
                            <Stack direction="column" spacing={0.5}>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    ประเภท: <Box component="span">{requestData.type}</Box>
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    รายละเอียด: <Box component="span">{requestData.detail_req}</Box>
                                </Typography>
                            </Stack>

                            {/* ผู้จัดการและผู้อำนวยการ */}
                            <Stack direction="column" spacing={1} sx={{ mt: 2 }}>
                                {requestData?.m_name && (
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        Manager: <Box component="span" sx={{ color: 'text.primary', fontWeight: 'bold' }}>{requestData.m_name}</Box>
                                        <Box component="span" sx={{ ml: 1 }}>Status: {requestData.mapp}</Box>
                                    </Typography>
                                )}
                                {requestData?.d_name && (
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        Director: <Box component="span" sx={{ color: 'text.primary', fontWeight: 'bold' }}>{requestData.d_name}</Box>
                                        <Box component="span" sx={{ ml: 1 }}>Status: {requestData.dapp}</Box>
                                    </Typography>
                                )}
                            </Stack>
                        </Stack>
                    </Box>

                    <Divider />

                    {/* เอกสารแนบ */}
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
                        {/* Conditionally render the Stepper based on requestData fields */}
                        {(requestData?.it_m_name || requestData?.it_d_name) && (
                            <Stepper alternativeLabel>
                                {/* Step 1: IT Manager */}
                                {requestData.it_m_name && (
                                    <Step completed={false}>
                                        <StepLabel>IT Manager</StepLabel>
                                    </Step>
                                )}
                                {/* Step 2: IT Director with Success Icon */}
                                {requestData.it_d_name && (
                                    <Step
                                        completed
                                        StepIconComponent={() => (
                                            <CheckCircleIcon sx={{ color: 'success.main' }} />
                                        )}
                                    >
                                        <StepLabel>IT Director</StepLabel>
                                    </Step>
                                )}
                            </Stepper>
                        )}

                        {/* Content Section */}
                        <Grid container spacing={2} justifyContent="center">
                            {/* IT Manager Section */}
                            {requestData?.it_m_name && (
                                <Grid item xs={12} sm={6} md={4}>
                                    <List sx={{ bgcolor: 'background.paper' }}>
                                        <ListItem alignItems="flex-start">
                                            <ListItemAvatar>
                                                <Avatar alt="IT Manager" src="" />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={`${requestData.it_m_name} : ${requestData.itmapp}`}
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

                            {/* IT Director Section */}
                            {requestData?.it_d_name && (
                                <Grid item xs={12} sm={6} md={4}>
                                    <List sx={{ bgcolor: 'background.paper' }}>
                                        <ListItem alignItems="flex-start">
                                            <ListItemAvatar>
                                                <Avatar alt="IT Director" src="" />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={`${requestData.it_d_name} : ${requestData.itdapp}`}
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

                        <Stack spacing={2}>
                            <Typography gutterBottom variant="body2">มอบหมายงานแผนก </Typography>

                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>



                                <AssigneeDepSelector
                                    requestId={requestData.id}
                                    selectedAssigneesDep={selectedDepartments}
                                    onAssigneeDepChange={setSelectedDepartments}
                                />




                                {/* แสดงแผนกที่ถูกมอบหมาย */}

                               
{assignedDepartments.length > 0 ? (
    assignedDepartments.map((dept, index) => (
        <Chip
            key={index}
            icon={<LocalOfferIcon sx={{ fontSize: 16 }} />}
            label={dept.name_department_it} // แสดงชื่อแผนกที่ได้จากการแมพ
            onClick={() => console.info(`You clicked the Chip for ${dept.name_department_it}`)}
            onDelete={() => handleRemoveDepartment(dept.id_req_dep)}
            size="small"
            sx={{
                backgroundColor: '#e3f2fd',
                border: '1px solid #90caf9',
                borderRadius: '4px',
                height: '24px',
                '& .MuiChip-label': {
                    px: 1,
                    fontSize: '0.75rem'
                },
                '& .MuiChip-icon': {
                    color: '#1976d2',
                    ml: '4px'
                },
                '& .MuiChip-deleteIcon': {
                    color: '#f44336',
                    fontSize: 18,
                    ml: '4px'
                }
            }}
        />
    ))
) : (
    <Typography color="text.secondary">No departments assigned</Typography>
)}


                            </Box>


                        </Stack>



                        <Typography gutterBottom variant="body2">
                            ผู้รับผิดชอบ
                        </Typography>

                        <AssigneeEmpSelector
                            requestId={requestData.id}
                            selectedAssignees={selectedAssignees}
                            onAssigneeChange={setSelectedAssignees}
                        />

                        {/* Assigned Employees Section */}
                        <Stack direction="column">
                            {assignedEmployees.length > 0 ? (
                                <Stack direction="row" spacing={1}>
                                    {assignedEmployees.map((emp, index) => (
                                        <Chip
                                            key={index}
                                            color="primary"
                                            variant="outlined"
                                            avatar={<Avatar alt={emp.emp_name} src="" />}
                                            label={emp.emp_name}
                                            onClick={() => console.info(`You clicked the Chip for ${emp.emp_name}`)}
                                            onDelete={() => handleRemoveEmployee(emp.id_req_emp)} // Pass id_req_emp here
                                            deleteIcon={<DeleteIcon />}
                                        />
                                    ))}
                                </Stack>
                            ) : (
                                <Typography color="text.secondary">No employees assigned</Typography>
                            )}
                        </Stack>





                    </Box>



                </Card>


            </Box>




            {!isModal && (
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleEdit}
                    sx={{ mt: 2 }}
                >
                    Edit Request
                </Button>
            )}
        </Box>

    );
}