import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { List, ListItem } from '@mui/joy';
import URLAPI from '../../../URLAPI';

// Type definitions
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
    // Approval related fields
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
    req_id: string;
    user_assigned: string;
    assigned_date: string;
}

interface AssignedDepartment extends AssignedEntity {
    id_req_dep: string;
}

interface AssignedEmployee extends AssignedEntity {
    id_req_emp: string;
    id_emp: string;
}

export default function RequestDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Main state
    const [requestData, setRequestData] = useState<RequestData | null>(null);
    const [departmentName, setDepartmentName] = useState<string>('');
    const [uploadedFiles, setUploadedFiles] = useState<FileInfo[]>([]);
    const [assignedDepartments, setAssignedDepartments] = useState<AssignedDepartment[]>([]);
    const [assignedEmployees, setAssignedEmployees] = useState<AssignedEmployee[]>([]);

    // Fetch request data
    const fetchRequestData = useCallback(async () => {
        if (!id) return;

        try {
            const response = await fetch(`${URLAPI}/it-requests?req_id=${id}`);
            if (!response.ok) throw new Error(`Error fetching request data: ${response.statusText}`);

            const { data } = await response.json();
            if (!data?.[0]) throw new Error('No data found');

            setRequestData(data[0]);

            // Handle files if they exist
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

    // Fetch department name
    const fetchDepartmentName = useCallback(async (departmentId: number) => {
        try {
            const response = await fetch(`${URLAPI}/departments?id_dep=${departmentId}`);
            if (!response.ok) throw new Error(`Error fetching department data`);

            const data = await response.json();
            if (data?.[0]?.name_department) {
                setDepartmentName(data[0].name_department);
            }
        } catch (error) {
            console.error('Error fetching department name:', error);
        }
    }, []);

    // Fetch assigned departments and employees
    const fetchAssignments = useCallback(async () => {
        if (!id) return;

        try {
            const [departmentsRes, employeesRes] = await Promise.all([
                fetch(`${URLAPI}/assigned_department/${id}`),
                fetch(`${URLAPI}/assigned_employee/${id}`)
            ]);

            if (!departmentsRes.ok) throw new Error('Error fetching department assignments');
            if (!employeesRes.ok) throw new Error('Error fetching employee assignments');

            const departments = await departmentsRes.json();
            const employees = await employeesRes.json();

            setAssignedDepartments(departments);
            console.log(setAssignedDepartments);
            setAssignedEmployees(employees);
        } catch (error) {
            console.error('Error fetching assignments:', error);
        }
    }, [id]);

    // Initial data fetch
    useEffect(() => {
        const fetchData = async () => {
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

        fetchData();
    }, [fetchRequestData, fetchAssignments]);

    // Fetch department name when request data is loaded
    useEffect(() => {
        if (requestData?.id_department) {
            fetchDepartmentName(requestData.id_department);
        }
    }, [requestData?.id_department, fetchDepartmentName]);

    if (isLoading) {
        return <Box sx={{ p: 3 }}><Typography>Loading...</Typography></Box>;
    }

    if (error) {
        return <Box sx={{ p: 3 }}><Typography color="error">{error}</Typography></Box>;
    }

    if (!requestData) {
        return <Box sx={{ p: 3 }}><Typography>No request data found</Typography></Box>;
    }

    const handleEdit = () => navigate(`/edit-request/${id}`);

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>Request Detail</Typography>

            {/* Request Information */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom>Request Information</Typography>
                <Typography><strong>Department:</strong> {departmentName || 'Loading...'}</Typography>
                <Typography><strong>Type:</strong> {requestData.type_id} - {requestData.type}</Typography>
                <Typography><strong>Topic:</strong> {requestData.topic_id} - {requestData.topic}</Typography>
                <Typography><strong>Name:</strong> {requestData.name_req}</Typography>
                <Typography><strong>Phone:</strong> {requestData.phone}</Typography>
                <Typography><strong>Title:</strong> {requestData.title_req}</Typography>
                <Typography><strong>Details:</strong> {requestData.detail_req}</Typography>
                <Typography><strong>RS Code:</strong> {requestData.rs_code}</Typography>
                <Typography><strong>Status:</strong> {requestData.status_name}</Typography>
            </Box>

            {/* Approval Information */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom>Approval Information</Typography>
                {requestData.m_name && (
                    <Typography>
                        <strong>Manager:</strong> {requestData.m_name} - {requestData.m_status} / {requestData.mapp}
                    </Typography>
                )}
                {requestData.d_name && (
                    <Typography>
                        <strong>Director:</strong> {requestData.d_name} - {requestData.d_status} / {requestData.dapp}
                    </Typography>
                )}
                {requestData.it_m_name && (
                    <>
                        <Typography>
                            <strong>IT Manager:</strong> {requestData.it_m_name} - {requestData.it_m_status} / {requestData.itmapp}
                        </Typography>
                        <Typography><strong>Note:</strong> {requestData.it_m_note}</Typography>
                    </>
                )}
                {requestData.it_d_name && (
                    <>
                        <Typography>
                            <strong>IT Director:</strong> {requestData.it_d_name} - {requestData.it_d_status} / {requestData.itdapp}
                        </Typography>
                        <Typography><strong>Note:</strong> {requestData.it_d_note}</Typography>
                    </>
                )}
            </Box>

            {/* Assignments */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom>Assignments</Typography>

                <Typography variant="h6" gutterBottom>Departments</Typography>
                {assignedDepartments.length > 0 ? (
                    <List>
                        {assignedDepartments.map((dept, index) => (
                            <ListItem key={index}>
                                <Typography>
                                    {dept.user_assigned} (Assigned: {dept.assigned_date})
                                </Typography>
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Typography>No departments assigned</Typography>
                )}

                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Employees</Typography>
                {assignedEmployees.length > 0 ? (
                    <List>
                        {assignedEmployees.map((emp, index) => (
                            <ListItem key={index}>
                                <Typography>
                                    {emp.user_assigned} (ID: {emp.id_emp}, Assigned: {emp.assigned_date})
                                </Typography>
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Typography>No employees assigned</Typography>
                )}
            </Box>

            {/* Files */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom>Uploaded Files</Typography>
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
                                >
                                    {file.file_old_name || file.file_name}
                                </a>
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Typography>No files uploaded</Typography>
                )}
            </Box>

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