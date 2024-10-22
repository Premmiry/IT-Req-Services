import React, { useEffect, useState } from 'react';
import { Box, Button, Alert, AspectRatio, IconButton, Typography, LinearProgress } from '@mui/joy';
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
import Check from '@mui/icons-material/Check';
import Close from '@mui/icons-material/Close';

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
    const [successAlert, setSuccessAlert] = useState<boolean>(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [rsCode, setRsCode] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isEditMode) {
            const fetchRequestData = async () => {
                setIsLoading(true);
                try {
                    // const response = await fetch(`http://10.200.240.2:1234/it-requests?req_id=${id}`);
                    const response = await fetch(`http://10.200.240.2:1234/it-requests?req_id=${id}`);
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

    const currentUser = () => ({
        username: 'sitp014',
        position: 's',
    });

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

    // ในส่วนของ handleSubmit ให้แก้ไขเป็น:
// ในส่วนของ handleSubmit ให้แก้ไขเป็น:
const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
        const formData = new FormData();
        const { username, position } = currentUser();

        formData.append('rs_code', isEditMode ? rsCode : generateRsCode(selectedTypeId));
        formData.append('id_department', selectedDepartment ? selectedDepartment.key.toString() : '');
        formData.append('user_req', username);
        formData.append('position', position);
        formData.append('name_req', name);
        formData.append('phone', phone);
        formData.append('type_id', selectedTypeId ? selectedTypeId.toString() : '');
        formData.append('topic_id', selectedTopicId ? selectedTopicId.toString() : '');
        formData.append('title_req', title);
        formData.append('detail_req', details);
        formData.append('id_program', selectedProgram ? selectedProgram.key.toString() : '');

        // แก้ไขการจัดการไฟล์
        if (uploadedFiles.length > 0) {
            const existingFiles: ExistingFileInfo[] = []; // กำหนดประเภทของตัวแปร existingFiles

            uploadedFiles.forEach((file) => {
                if (file instanceof File) {
                    formData.append('new_files', file);
                } else {
                    // เพิ่มข้อมูลไฟล์เดิมเข้าไปในรายการ
                    existingFiles.push({
                        file_path: file.file_path,
                        file_name: file.file_name,
                        file_old_name: file.file_old_name,
                        file_new_name: file.file_new_name
                    });
                }
            });

            // เพิ่มรายการของไฟล์เดิมเข้าไปใน formData
            if (existingFiles.length > 0) {
                formData.append('existing_files', JSON.stringify(existingFiles));
            }
        }

        console.log('Form Data:', formData);

        const response = await fetch(
            isEditMode ? `http://10.200.240.1:1234/it-requests/${id}` : 'http://10.200.240.1:1234/it-requests',
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
            navigate('/');
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
        navigate('/');
    };

    return (
        <React.Fragment>
            <CssBaseline />
            <Container maxWidth="lg">
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
                                <Typography level="title-lg" sx={{ color: 'white' }}>บันทึกข้อมูลสําเร็จ</Typography>
                                <Typography level="body-sm" sx={{ color: 'white' }}>
                                    กรุณารอสักครู่... ก่อนกลับหน้าหลัก
                                </Typography>
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