import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { List, ListItem } from '@mui/joy';
import URLAPI from '../../../URLAPI';

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
    'id_department-it': number;
    'name_department-it': string;
    'code_department-it': string;
}

interface AssignedDepartment extends AssignedEntity {
    id_req_dep: string;
    req_id: string;
    id_department: string;
    departmentName?: string;
}

interface AssignedEmployee extends AssignedEntity {
    id_req_emp: string;
    req_id: string;
    id_emp: string;
    emp_name?: string;
}

// Component
export default function RequestDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // State
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [requestData, setRequestData] = useState<RequestData | null>(null);
    const [departmentName, setDepartmentName] = useState<string>('');
    const [uploadedFiles, setUploadedFiles] = useState<FileInfo[]>([]);
    const [assignedDepartments, setAssignedDepartments] = useState<AssignedDepartment[]>([]);
    const [assignedEmployees, setAssignedEmployees] = useState<AssignedEmployee[]>([]);
    const [itDepartments, setItDepartments] = useState<ITDepartment[]>([]);

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
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An error occurred');
        }
    }, [id]);

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

    const fetchITDepartments = useCallback(async (deptIds: number[]) => {
        try {
            const uniqueDeptIds = [...new Set(deptIds)];
            const departmentsData = await Promise.all(
                uniqueDeptIds.map(async (deptId) => {
                    const response = await fetch(`${URLAPI}/departments-it?id_dep=${deptId}`);
                    if (!response.ok) throw new Error(`Error fetching IT department data for ID ${deptId}`);
                    const data = await response.json();
                    return data[0];
                })
            );
            setItDepartments(departmentsData.filter(Boolean));
            console.log(departmentsData)
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

            const departments: AssignedDepartment[] = await departmentsRes.json();
            const employees: AssignedEmployee[] = await employeesRes.json();

            // Fetch IT department details
            const departmentIds = departments.map(dept => parseInt(dept.id_department));
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

    useEffect(() => {
        if (assignedDepartments.length > 0 && itDepartments.length > 0) {
            const updatedDepartments = assignedDepartments.map(dept => ({
                ...dept,
                departmentName: itDepartments.find(
                    itDept => itDept['id_department-it'] === parseInt(dept.id_department)
                )?.[`name_department-it`]
            }));
            setAssignedDepartments(updatedDepartments);
        }
    }, [itDepartments]);

    // Handlers
    const handleEdit = () => navigate(`/edit-request/${id}`);

    // Render helpers
    const renderApprovalInfo = () => (
        <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Approval Information</Typography>
            {requestData?.m_name && (
                <Box sx={{ mb: 1 }}>
                    <Typography><strong>Manager:</strong> {requestData.m_name}</Typography>
                    <Typography color="text.secondary">
                        Status: {requestData.m_status} / {requestData.mapp}
                    </Typography>
                </Box>
            )}
            {requestData?.d_name && (
                <Box sx={{ mb: 1 }}>
                    <Typography><strong>Director:</strong> {requestData.d_name}</Typography>
                    <Typography color="text.secondary">
                        Status: {requestData.d_status} / {requestData.dapp}
                    </Typography>
                </Box>
            )}
            {requestData?.it_m_name && (
                <Box sx={{ mb: 1 }}>
                    <Typography><strong>IT Manager:</strong> {requestData.it_m_name}</Typography>
                    <Typography color="text.secondary">
                        Status: {requestData.it_m_status} / {requestData.itmapp}
                    </Typography>
                    {requestData.it_m_note && (
                        <Typography><strong>Note:</strong> {requestData.it_m_note}</Typography>
                    )}
                </Box>
            )}
            {requestData?.it_d_name && (
                <Box sx={{ mb: 1 }}>
                    <Typography><strong>IT Director:</strong> {requestData.it_d_name}</Typography>
                    <Typography color="text.secondary">
                        Status: {requestData.it_d_status} / {requestData.itdapp}
                    </Typography>
                    {requestData.it_d_note && (
                        <Typography><strong>Note:</strong> {requestData.it_d_note}</Typography>
                    )}
                </Box>
            )}
        </Paper>
    );

    const renderAssignedDepartments = () => (
        <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Assigned Departments</Typography>
            {assignedDepartments.length > 0 ? (
                <List>
                    {assignedDepartments.map((dept, index) => (
                        <ListItem
                            key={index}
                            sx={{
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 1,
                                mb: 1,
                                p: 2
                            }}
                        >
                            <Box>
                                <Typography variant="subtitle1" gutterBottom>
                                    {dept.departmentName || 'Loading department name...'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Assigned to: {dept.user_assigned}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Date: {new Date(dept.assigned_date).toLocaleDateString()}
                                </Typography>
                            </Box>
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Typography color="text.secondary">No departments assigned</Typography>
            )}
        </Paper>
    );

    const renderAssignedEmployees = () => (
        <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Assigned Employees</Typography>
            {assignedEmployees.length > 0 ? (
                <List>
                    {assignedEmployees.map((emp, index) => (
                        <ListItem
                            key={index}
                            sx={{
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 1,
                                mb: 1,
                                p: 2
                            }}
                        >
                            <Box>
                                <Typography variant="subtitle1">
                                    Employee ID: {emp.id_emp}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Employee Name: {emp.emp_name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Assigned to: {emp.user_assigned}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Date: {new Date(emp.assigned_date).toLocaleDateString()}
                                </Typography>
                            </Box>
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Typography color="text.secondary">No employees assigned</Typography>
            )}
        </Paper>
    );

    const renderFiles = () => (
        <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Uploaded Files</Typography>
            {uploadedFiles.length > 0 ? (
                <List>
                    {uploadedFiles.map((file, index) => (
                        <ListItem
                            key={index}
                            sx={{
                                border: '1px dashed',
                                borderColor: 'primary.light',
                                borderRadius: 1,
                                mb: 1
                            }}
                        >
                            <a
                                href={`${URLAPI}/${file.file_path}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                                {file.file_old_name || file.file_name}
                            </a>
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Typography color="text.secondary">No files uploaded</Typography>
            )}
        </Paper>
    );

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
        <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
            <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
                <Typography variant="h5" gutterBottom>Request Information</Typography>
                <Box sx={{ display: 'grid', gap: 2 }}>
                    <Typography><strong>Department:</strong> {departmentName || 'Loading...'}</Typography>
                    <Typography><strong>Type:</strong> {requestData.type_id} - {requestData.type}</Typography>
                    <Typography><strong>Topic:</strong> {requestData.topic_id} - {requestData.topic}</Typography>
                    <Typography><strong>Name:</strong> {requestData.name_req}</Typography>
                    <Typography><strong>Phone:</strong> {requestData.phone}</Typography>
                    {
                        requestData.id_program ? (
                            <Typography><strong>Program:</strong> {requestData.id_program} {requestData.program_name}</Typography>
                        ) : (
                            <Typography><strong>Title:</strong> {requestData.title_req}</Typography>
                        )
                    }


                    <Typography><strong>Details:</strong> {requestData.detail_req}</Typography>
                    <Typography><strong>RS Code:</strong> {requestData.rs_code}</Typography>
                    <Typography><strong>Status:</strong> {requestData.status_name}</Typography>
                </Box>
            </Paper>

            {renderApprovalInfo()}
            {renderAssignedDepartments()}
            {renderAssignedEmployees()}
            {renderFiles()}

            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleEdit}
                sx={{ mt: 2 }}
            >
                Edit Request
            </Button>
        </Box>
    );
}