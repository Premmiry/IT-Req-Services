import React, { useState, useEffect } from 'react';
import { Box, Button, Alert, AspectRatio, IconButton, Typography, LinearProgress, Input } from '@mui/joy';
import { Container, Paper, Grid, CssBaseline } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ReplyIcon from '@mui/icons-material/Reply';
import FormLabel from '@mui/joy/FormLabel';
import Check from '@mui/icons-material/Check';
import Close from '@mui/icons-material/Close';
import SelectDepartment from '../Select/select-department';
import SelectTypeRequest from '../Select/select-typerequest';
import SelectProgram from '../Select/select-program';
import SelectTopic from '../Select/select-topic';
import Fileupload from '../FileUpload/file-upload';
import { NameInput, PhoneInput, TitleInput, DetailsTextarea } from '../Input/input-requestform';
import { useNavigate, useParams } from 'react-router-dom';

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
    file_name?: string;
}

export default function RequestForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isEditMode, setIsEditMode] = useState<boolean>(!!id);

    const [selectedDepartment, setSelectedDepartment] = useState<DepartmentOption | null>(null);
    const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
    const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
    const [selectedProgram, setSelectedProgram] = useState<ProgramOption | null>(null);
    const [rsCode, setRsCode] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [details, setDetails] = useState<string>('');
    const [uploadedFiles, setUploadedFiles] = useState<(File | ExistingFileInfo)[]>([]);
    const [successAlert, setSuccessAlert] = useState<boolean>(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isEditMode) {
            fetchRequestData();
        }
    }, [id, isEditMode]);

    const fetchRequestData = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://10.200.240.2:1234/it-requests?req_id=${id}`);
            if (!response.ok) throw new Error(`Error fetching request data: ${response.statusText}`);

            const { data } = await response.json();
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
            console.error('Error:', error.message);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

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
            case 1: return `IT${dateCode}`;
            case 2: return `IS${dateCode}`;
            case 3: return `DEV${dateCode}`;
            default: return `UNK${dateCode}`;
        }
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!selectedDepartment) newErrors.department = 'กรุณาเลือกแผนก';
        if (!selectedTypeId) newErrors.typeId = 'กรุณาเลือกประเภทคำร้อง';
        if (!name) newErrors.name = 'กรุณากรอกชื่อ';
        if (!phone) newErrors.phone = 'กรุณากรอกเบอร์โทรศัพท์';
        if (!details) newErrors.details = 'กรุณากรอกรายละเอียด';
        if (uploadedFiles.length === 0) newErrors.files = 'กรุณาอัพโหลดไฟล์';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        setError(null);

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

            uploadedFiles.forEach((file) => {
                if (file instanceof File) {
                    formData.append('files', file);
                } else if (file.file_path) {
                    formData.append('existing_files[]', file.file_path);
                }
            });

            const url = isEditMode
                ? `http://10.200.240.2:1234/it-requests/${id}`
                : 'http://10.200.240.2:1234/it-requests';
            const method = isEditMode ? 'POST' : 'POST';

            const response = await fetch(url, {
                method: method,
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('IT request submitted successfully:', result);

            setSuccessAlert(true);
            if (!isEditMode) clearForm();

            setTimeout(() => {
                setSuccessAlert(false);
                navigate('/');
            }, 2000);
        } catch (error) {
            console.error('Error submitting IT request:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
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

    // ฟังก์ชันจำลองสำหรับดึงข้อมูลผู้ใช้ปัจจุบัน
    const currentUser = () => ({
        username: 'sitp014',
        position: 's',
    });

    return (
        <React.Fragment>
            <CssBaseline />
            <Container maxWidth="lg">
                {successAlert && (
                    <Box sx={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 1300 }}>
                        <Alert
                            size="lg"
                            color="success"
                            variant="solid"
                            invertedColors
                            startDecorator={
                                <AspectRatio variant="solid" ratio="1" sx={{ minWidth: 40, borderRadius: '50%', boxShadow: '0 2px 12px 0 rgb(0 0 0/0.2)' }}>
                                    <div><Check /></div>
                                </AspectRatio>
                            }
                            endDecorator={
                                <IconButton variant="plain" sx={{ '--IconButton-size': '32px', transform: 'translate(0.5rem, -0.5rem)' }}>
                                    <Close />
                                </IconButton>
                            }
                            sx={{ alignItems: 'flex-start', overflow: 'hidden' }}
                        >
                            <div>
                                <Typography level="title-lg">บันทึกข้อมูลสําเร็จ</Typography>
                                <Typography level="body-sm">กรุณารอสักครู่... ก่อนกลับหน้าหลัก</Typography>
                            </div>
                            <LinearProgress variant="solid" color="success" value={40} sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, borderRadius: 0 }} />
                        </Alert>
                    </Box>
                )}

                <Paper sx={{ width: '100%', padding: 2, boxShadow: 10 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Box sx={{ padding: 2 }}>
                                <h2>{isEditMode ? 'แก้ไขคำขอ' : 'สร้างคำขอใหม่'}</h2>
                            </Box>
                        </Grid>
                        {isEditMode && (
                            <Grid item xs={6}>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <FormLabel>
                                        <h5>Request No.</h5>
                                        <Input sx={{ width: 135, justifyItems: 'center' }} value={rsCode} readOnly />
                                    </FormLabel>
                                </Box>
                            </Grid>
                        )}
                    </Grid>
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