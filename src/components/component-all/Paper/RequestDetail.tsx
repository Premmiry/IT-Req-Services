import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FormLabel, Box, IconButton, Typography } from '@mui/material';
import { Button, List, ListItem } from '@mui/joy';
import URLAPI from '../../../URLAPI';

interface ProgramOption {
    key: number;
    label: string;
}

interface DepartmentOption {
    key: number;
    label: string;
}

interface ExistingFileInfo {
    file_path: string;
    file_name: string;
    file_old_name: string;
    file_new_name: string;
}

interface ApprovalInfo {
    name: string;
    status: string;
    req_id: string;
    m_name?: string;
    it_m_name?: string;
}

export default function RequestDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [userData, setUserData] = useState<any | null>(null);
    const [admin, setAdmin] = useState<string | null>(null);
    const [uploadedFiles, setUploadedFiles] = useState<(File | ExistingFileInfo)[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        selectedDepartment: null as DepartmentOption | null,
        TypeId: null as number | null,
        TypeName: '',
        TopicId: null as number | null,
        TopicName: '',
        selectedProgram: null as ProgramOption | null,
        name: '',
        phone: '',
        title: '',
        details: '',
        rsCode: '',
        status_id: null as number | null,
        status: '',
    });

    const [approvalData, setApprovalData] = useState({
        managerApprove: null as ApprovalInfo | null,
        directorApprove: null as ApprovalInfo | null,
        itmanagerApprove: null as ApprovalInfo | null,
        itmanagerNote: '',
        itdirectorApprove: null as ApprovalInfo | null,
        itdirectorNote: '',
    });

    const [departmentName, setDepartmentName] = useState<string | null>(null);

    const fetchRequestData = useCallback(async () => {
        if (!id) return;
        setIsLoading(true);
        try {
            const response = await fetch(`${URLAPI}/it-requests?req_id=${id}`);
            if (!response.ok) throw new Error(`Error fetching request data: ${response.statusText}`);

            const { data } = await response.json();
            if (!data?.[0]) return;

            const requestData = data[0];

            setFormData(prev => ({
                ...prev,
                selectedDepartment: { key: requestData.id_department, label: '' },
                TypeId: requestData.type_id || null,
                TypeName: requestData.type || '',
                TopicId: requestData.topic_id || null,
                TopicName: requestData.topic || '',
                selectedProgram: requestData.id_program && requestData.program_name
                    ? { key: requestData.id_program, label: requestData.program_name }
                    : null,
                name: requestData.name_req || '',
                phone: requestData.phone || '',
                title: requestData.title_req || '',
                details: requestData.detail_req || '',
                rsCode: requestData.rs_code || '',
                status_id: requestData.status_id || null,
                status: requestData.status_name || '',
            }));

            setApprovalData(prev => ({
                ...prev,
                managerApprove: requestData.m_name ? {
                    name: requestData.m_name,
                    status: requestData.m_status,
                    req_id: id
                } : null,
                directorApprove: requestData.d_name ? {
                    name: requestData.d_name,
                    status: requestData.d_status,
                    req_id: id
                } : null,
                itmanagerApprove: requestData.it_m_name ? {
                    name: requestData.it_m_name,
                    status: requestData.it_m_status,
                    req_id: id
                } : null,
                itmanagerNote: requestData.it_m_note || '',
                itdirectorApprove: requestData.it_d_name ? {
                    name: requestData.it_d_name,
                    status: requestData.it_d_status,
                    req_id: id
                } : null,
                itdirectorNote: requestData.it_d_note || '',
            }));

            if (requestData.files) {
                const parsedFiles = JSON.parse(requestData.files);
                setUploadedFiles(Array.isArray(parsedFiles) ? parsedFiles : []);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    const fetchDepartmentName = useCallback(async (departmentId: number) => {
        try {
            const response = await fetch(`${URLAPI}/departments?id_dep=${departmentId}`);
            if (!response.ok) throw new Error(`Error fetching department data: ${response.statusText}`);

            const data = await response.json();
            if (data && data.length > 0) {
                setDepartmentName(data[0].name_department);
            }
        } catch (error) {
            console.error('Error fetching department name:', error);
        }
    }, []);



    

    useEffect(() => {
        fetchRequestData();
        const storedUserData = sessionStorage.getItem('userData');
        const storedAdmin = sessionStorage.getItem('admin');

        if (storedUserData) {
            const userDataParsed = JSON.parse(storedUserData);
            setUserData(userDataParsed);

            setFormData(prev => ({
                ...prev,
                selectedDepartment: { key: userDataParsed.id_department, label: '' },
                name: userDataParsed.name_employee
            }));
        }

        if (storedAdmin) {
            setAdmin(storedAdmin);
        }
    }, [fetchRequestData]);

    useEffect(() => {
        if (formData.selectedDepartment?.key) {
            fetchDepartmentName(formData.selectedDepartment.key);
        }
    }, [formData.selectedDepartment, fetchDepartmentName]);

    const getFileName = useCallback((file: File | ExistingFileInfo) => {
        if (file instanceof File) {
            return { fileName: file.name, filePath: '' };
        } else if (file.file_path) {
            return {
                fileName: file.file_old_name || file.file_path.split('/').pop() || 'ไม่มีไฟล์',
                filePath: file.file_path
            };
        }
        return { fileName: 'ไม่มีไฟล์', filePath: '' };
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Request Detail</h1>
            <div>
                <h2>Request Information</h2>
                <p><strong>Department:</strong> {departmentName || 'Loading...'}</p>
                <p><strong>Type ID:</strong> {formData.TypeId}</p>
                <p><strong>Type Name:</strong> {formData.TypeName}</p>
                <p><strong>Topic ID:</strong> {formData.TopicId}</p>
                <p><strong>Topic Name:</strong> {formData.TopicName}</p>
                {
                    !formData.selectedProgram ? (
                        <p><strong>Title:</strong> {formData.title}</p>
                    ) : (
                        <p><strong>Program:</strong> {formData.selectedProgram?.key} {formData.selectedProgram?.label}</p>
                        
                    )
                }
                <p><strong>Name:</strong> {formData.name}</p>
                <p><strong>Phone:</strong> {formData.phone}</p>

                <p><strong>Details:</strong> {formData.details}</p>
                <p><strong>RS Code:</strong> {formData.rsCode}</p>
                <p><strong>Status ID:</strong> {formData.status_id} </p>
                <p><strong>Status Name:</strong>{formData.status}</p>
            </div>
            <div>
                <h2>Approval Information</h2>
                <p><strong>Manager Approval:</strong> {approvalData.managerApprove?.name} - {approvalData.managerApprove?.status}</p>
                <p><strong>Director Approval:</strong> {approvalData.directorApprove?.name} - {approvalData.directorApprove?.status}</p>
                <p><strong>IT Manager Approval:</strong> {approvalData.itmanagerApprove?.name} - {approvalData.itmanagerApprove?.status}</p>
                <p><strong>IT Manager Note:</strong> {approvalData.itmanagerNote}</p>
                <p><strong>IT Director Approval:</strong> {approvalData.itdirectorApprove?.name} - {approvalData.itdirectorApprove?.status}</p>
                <p><strong>IT Director Note:</strong> {approvalData.itdirectorNote}</p>
            </div>
            <div>
                <h2>Uploaded Files</h2>
                <List>
                    {uploadedFiles.length === 0 ? (
                        <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', marginTop: 2 }}>
                            ไม่มีไฟล์แนบ
                        </Typography>
                    ) : (
                        uploadedFiles.map((file, index) => {
                            const { fileName, filePath } = getFileName(file);
                            return (
                                <ListItem
                                    sx={{
                                        border: '1px dashed',
                                        borderColor: 'lightblue',
                                        borderRadius: 'sm',
                                        padding: 1,
                                    }}
                                    key={index}
                                >
                                    {file instanceof File ? (
                                        <Typography variant="body2" color="primary">
                                            {fileName}
                                        </Typography>
                                    ) : (
                                        <a href={`${URLAPI}/${filePath}`} target="_blank" rel="noopener noreferrer">
                                            {fileName}
                                        </a>
                                    )}
                                </ListItem>
                            );
                        })
                    )}
                </List>
            </div>
        </div>
    );
}