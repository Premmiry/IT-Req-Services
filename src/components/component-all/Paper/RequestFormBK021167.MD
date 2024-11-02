import React, { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/joy';
import SelectDepartment from '../Select/select-department';
import SelectTypeRequest from '../Select/select-typerequest';
import SelectProgram from '../Select/select-program';
import SelectTopic from '../Select/select-topic';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Paper, Grid } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import Fileupload from '../FileUpload/file-upload';
import { NameInput, PhoneInput, TitleInput, DetailsTextarea } from '../Input/input-requestform';
import { useNavigate, useParams } from 'react-router-dom';
import ReplyIcon from '@mui/icons-material/Reply';
import { SaveAlert } from '../Alert/alert';
import { BoxDirectorApprove, BoxManagerApprove } from '../ContentTypeR/boxmdapprove';
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

export default function RequestForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isEditMode, setIsEditMode] = useState(!!id);
    const [selectedDepartment, setSelectedDepartment] = useState<DepartmentOption | null>(null);
    const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
    const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
    const [selectedProgram, setSelectedProgram] = useState<ProgramOption | null>(null);
    const [name, setName] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [details, setDetails] = useState<string>('');
    const [uploadedFiles, setUploadedFiles] = useState<(File | ExistingFileInfo)[]>([]);
    const [status_id, setStatusId] = useState<number | null>(null);
    const [successAlert, setSuccessAlert] = useState<boolean>(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [rsCode, setRsCode] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userData, setUserData] = useState<any | null>(null);
    const [admin, setAdmin] = useState<string | null>(null);
    const [managerApprove, setManagerApprove] = useState<{ name: string, status: string, req_id: string } | null>(null);
    const [directorApprove, setDirectorApprove] = useState<{ name: string, status: string, req_id: string } | null>(null);

    useEffect(() => {
        if (isEditMode) {
            const fetchRequestData = async () => {
                setIsLoading(true);
                try {
                    const response = await fetch(`${URLAPI}/it-requests?req_id=${id}`);
                    if (!response.ok) throw new Error(`Error fetching request data: ${response.statusText}`);

                    const { data } = await response.json();
                    console.log("ข้อมูลที่ได้จาก API:", data);

                    if (data && data.length > 0) {
                        const requestData = data[0];
                        setSelectedDepartment({ key: requestData.id_department, label: '' });
                        setSelectedTypeId(requestData.type_id || null);
                        setSelectedTopicId(requestData.topic_id || null);
                        setSelectedProgram(
                            requestData.id_program && requestData.program_name
                                ? { key: requestData.id_program, label: requestData.program_name }
                                : null
                        );
                        setRsCode(requestData.rs_code || '');
                        setName(requestData.name_req || '');
                        setPhone(requestData.phone || '');
                        setTitle(requestData.title_req || '');
                        setDetails(requestData.detail_req || '');
                        setStatusId(requestData.status_id || null);
                        setManagerApprove({ name: requestData.m_name || '', status: requestData.m_status || '', req_id: id || '' });
                        setDirectorApprove({ name: requestData.d_name || '', status: requestData.d_status || '', req_id: id || '' });

                        let parsedFiles: ExistingFileInfo[] = [];
                        try {
                            parsedFiles = JSON.parse(requestData.files);
                            if (!Array.isArray(parsedFiles)) {
                                parsedFiles = [];
                            }
                        } catch (error) {
                            console.error('Error parsing files:', error);
                        }
                        setUploadedFiles(parsedFiles);
                    }
                } catch (error) {
                    console.error('Error:', (error as Error).message);
                    setError((error as Error).message);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchRequestData();
        }
    }, [id, isEditMode]);

    useEffect(() => {
        const storedUserData = sessionStorage.getItem('userData');
        const storedAdmin = sessionStorage.getItem('admin');
    
        console.log("Stored UserData:", storedUserData);
        console.log("Stored Admin:", storedAdmin);
    
        if (storedUserData) {
            const userDataParsed = JSON.parse(storedUserData);
            setUserData(userDataParsed);
            console.log("UserData:", userDataParsed);

            // Set default values from sessionStorage
            setSelectedDepartment({ key: userDataParsed.id_department, label: '' });
            setName(userDataParsed.name_employee);
        }
    
        if (storedAdmin) {
            setAdmin(storedAdmin);
            console.log("Admin:", storedAdmin);
        }
    }, []);
    
    // Call fetchRequests when userData or admin changes
    useEffect(() => {
        if (userData && admin) {

        } else {
            console.log("UserData or department is not set. Aborting fetch.");
        }
    }, [userData, admin]);

    const handleDepartmentChange = (department: DepartmentOption | null) => {
        setSelectedDepartment(department);
        setErrors({ ...errors, department: '' });
    };

    const handleTypeChange = (typeId: number | null) => {
        setSelectedTypeId(typeId);
        if (typeId === null) {
            setSelectedTopicId(null);
        }
        setErrors({ ...errors, typeId: '' });
    };

    const handleTopicChange = (topicId: number | null) => {
        setSelectedTopicId(topicId);
        setTitle('');
        setErrors({ ...errors, topicId: '' });
    };

    const handleProgramChange = (program: ProgramOption | null) => {
        setSelectedProgram(program);
        setErrors({ ...errors, program: '' });
    };

    const handleFilesChange = (files: (File | ExistingFileInfo)[]) => {
        setUploadedFiles(files);
        setErrors({ ...errors, files: '' });
    };

    const generateRsCode = (selectedTypeId: number | null): string => {
        const date = new Date();
        const year = String(date.getFullYear()).substring(2);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
        const dateCode = `${year}${month}${day}${milliseconds}`;

        switch (selectedTypeId) {
            case 1:
                return `IT${dateCode}`;
            case 2:
                return `IS${dateCode}`;
            case 3:
                return `DEV${dateCode}`;
            default:
                return `UNK${dateCode}`;
        }
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!selectedDepartment) newErrors.department = 'กรุณาเลือกแผนก';
        if (!selectedTypeId) newErrors.typeId = 'กรุณาเลือกประเภทคำร้อง';
        if (!name) newErrors.name = 'กรุณากรอกชื่อ';
        if (!phone) newErrors.phone = 'กรุณากรอกเบอร์โทรศัพท์';
        if (!details) newErrors.details = 'กรุณากรอกรายละเอียด';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            const formData = new FormData();

            formData.append('rs_code', isEditMode ? rsCode : generateRsCode(selectedTypeId));
            formData.append('id_department', selectedDepartment ? selectedDepartment.key.toString() : '');
            formData.append('id_division', userData ? userData.id_division : '');
            formData.append('id_section', userData ? userData.id_section : '');
            formData.append('user_req', userData ? userData.username : '');
            formData.append('position', userData ? userData.position : '');
            formData.append('name_req', name);
            formData.append('phone', phone);
            formData.append('type_id', selectedTypeId ? selectedTypeId.toString() : '');
            formData.append('topic_id', selectedTopicId ? selectedTopicId.toString() : '');
            formData.append('title_req', title);
            formData.append('detail_req', details);
            formData.append('id_program', selectedProgram ? selectedProgram.key.toString() : '');

            if (uploadedFiles.length > 0) {
                const existingFiles: ExistingFileInfo[] = [];

                uploadedFiles.forEach((file) => {
                    if (file instanceof File) {
                        formData.append('new_files', file);
                    } else {
                        existingFiles.push({
                            file_path: file.file_path,
                            file_name: file.file_name,
                            file_old_name: file.file_old_name,
                            file_new_name: file.file_new_name
                        });
                    }
                });

                if (existingFiles.length > 0) {
                    formData.append('existing_files', JSON.stringify(existingFiles));
                }
            }

            console.log('Form Data:', formData);

            const response = await fetch(
                isEditMode ? `${URLAPI}/it-requests/${id}` : `${URLAPI}/it-requests`,
                {
                    method: isEditMode ? 'PUT' : 'POST',
                    body: formData,
                }
            );

            if (!response.ok) {
                const errorBody = await response.text();
                console.error('Error response body:', errorBody);
                throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
            }

            const result = await response.json();
            console.log(isEditMode ? 'IT request updated successfully:' : 'IT request created successfully:', result);

            setSuccessAlert(true);
            clearForm();

            setTimeout(() => {
                setSuccessAlert(false);
                navigate('/request-list');
            }, 2000);
        } catch (error) {
            console.error(isEditMode ? 'Error updating IT request:' : 'Error submitting IT request:', error);
        }
    };

    const clearForm = () => {
        setSelectedDepartment(null);
        setSelectedTypeId(null);
        setSelectedTopicId(null);
        setSelectedProgram(null);
        setName('');
        setPhone('');
        setTitle('');
        setDetails('');
        setUploadedFiles([]);
        setErrors({});
    };

    const handleCancel = () => {
        navigate('/request-list');
    };

    return (
        <React.Fragment>
            <CssBaseline />
            <Container maxWidth="lg">
                {successAlert && <SaveAlert onClose={() => setSuccessAlert(false)} />}

                <Paper sx={{ width: '100%', padding: 2, boxShadow: 10 }}>
                    <Box sx={{ padding: 2 }}>
                        <h2>{isEditMode ? 'Request Edit' : 'Request Form'}</h2>
                    </Box>
                    <hr />

                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <Box sx={{ mt: 4 }}>
                                <SelectDepartment onDepartmentChange={handleDepartmentChange} initialValue={selectedDepartment} />
                                {errors.department && <Typography color="danger">{errors.department}</Typography>}
                            </Box>
                            <NameInput value={name} onChange={(e) => setName(e.target.value)} />
                            {errors.name && <Typography color="danger">{errors.name}</Typography>}
                            <PhoneInput value={phone} onChange={(e) => setPhone(e.target.value)} />
                            {errors.phone && <Typography color="danger">{errors.phone}</Typography>}
                            <Box sx={{ mt: 2 }}>
                                <SelectTypeRequest onSelectType={handleTypeChange} initialValue={selectedTypeId} />
                                {errors.typeId && <Typography color="danger">{errors.typeId}</Typography>}
                            </Box>
                            <Box sx={{ mt: 2 }}>
                                {
                                    userData && ((userData.position === 'm' || userData.position === 'd' || admin === 'ADMIN') && selectedTypeId !== 2) && (
                                        <>
                                            {managerApprove !== null ? (
                                                <BoxManagerApprove managerApprove={managerApprove} />
                                            ) : (
                                                <BoxManagerApprove managerApprove={{ name: '', status: '', req_id: '' , m_name: '' }} />
                                            )}
                                            {directorApprove !== null ? (
                                                <BoxDirectorApprove directorApprove={directorApprove} m_name={null} />
                                            ) : (
                                                <BoxDirectorApprove directorApprove={{ name: '', status: '', req_id: '', m_name: '' }} m_name={null} />
                                            )}
                                        </>
                                    )
                                }
                            </Box>
                        </Grid>
                        <Grid item xs={8}>
                            <Box sx={{ mt: 4 }}>
                                <SelectTopic selectedTypeId={selectedTypeId} onSelectTopic={handleTopicChange} initialValue={selectedTopicId} />
                                {errors.topicId && <Typography color="danger">{errors.topicId}</Typography>}
                            </Box>

                            {selectedTopicId === 2 ? (
                                <Box sx={{ mt: 2 }}>
                                    <SelectProgram onProgramChange={handleProgramChange} initialValue={selectedProgram} />
                                </Box>
                            ) : (
                                <TitleInput value={title} onChange={(e) => setTitle(e.target.value)} />
                            )}

                            <DetailsTextarea value={details} onChange={(e) => setDetails(e.target.value)} />
                            {errors.details && <Typography color="danger">{errors.details}</Typography>}
                            <Fileupload onFilesChange={handleFilesChange} initialFiles={uploadedFiles} />
                            {errors.files && <Typography color="danger">{errors.files}</Typography>}
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Box sx={{ my: 2, p: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Button color="primary" startDecorator={<SaveIcon />} onClick={handleSubmit}>
                                {isEditMode ? 'Update' : 'บันทึก'}
                            </Button>
                            <Button sx={{ ml: 2 }} color="danger" startDecorator={<ReplyIcon />} onClick={handleCancel}>
                                ย้อนกลับ
                            </Button>
                        </Box>
                    </Grid>
                </Paper>
            </Container>
        </React.Fragment>
    );
}