import React, { useState } from 'react';
import { Box, Button, Alert, Stack, AspectRatio, IconButton, Typography, LinearProgress } from '@mui/joy';
import SelectDepartment from '../Select/select-department';
import SelectTypeRequest from '../Select/select-typerequest';
import SelectProgram from '../Select/select-program';
import SelectTopic from '../Select/select-topic';
import { SelectWithApi } from '../Select/select-statusapprove';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Paper, Grid } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import Fileupload from '../FileUpload/file-upload';
import { NameInput, PhoneInput, TitleInput, DetailsTextarea } from '../Input/input-requestform';
import { useNavigate } from 'react-router-dom';
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

export default function RequestForm() {
    const [selectedDepartment, setSelectedDepartment] = useState<DepartmentOption | null>(null);
    const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
    const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
    const [selectedProgram, setSelectedProgram] = useState<ProgramOption | null>(null);
    const [name, setName] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [details, setDetails] = useState<string>('');
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [successAlert, setSuccessAlert] = useState<boolean>(false);

    const handleDepartmentChange = (department: DepartmentOption | null) => {
        setSelectedDepartment(department);
    };

    const handleTypeChange = (typeId: number | null) => {
        setSelectedTypeId(typeId);
        if (typeId === null) {
            setSelectedTopicId(null);
        }
    };

    const handleTypeAChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const typeId = e.target.value ? parseInt(e.target.value, 10) : null; // Parse the value to an integer or set to null
        setSelectedTypeId(typeId);
        if (typeId === null) {
            setSelectedTopicId(null);
        }
    };

    const handleTopicChange = (topicId: number | null) => {
        setSelectedTopicId(topicId);
        setTitle('');
    };

    const handleProgramChange = (program: ProgramOption | null) => {
        setSelectedProgram(program);
    };

    const handleFilesChange = (files: File[]) => {
        setUploadedFiles(files);
    };

    const generateRsCode = (selectedTypeId: number | null): string => {
        const date = new Date();
        const year = String(date.getFullYear()).substring(2);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        // const hours = String(date.getHours()).padStart(2, '0');
        // const minutes = String(date.getMinutes()).padStart(2, '0');
        // const seconds = String(date.getSeconds()).padStart(2, '0');
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

    // Example of retrieving current user info
    const currentUser = () => ({
        username: 'sitp014',
        position: 's',
    });


    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            const { username, position } = currentUser();

            // Append all form fields to formData
            formData.append('rs_code', generateRsCode(selectedTypeId));
            formData.append('department_req_id', selectedDepartment ? selectedDepartment.key.toString() : '');
            formData.append('user_req', username);
            formData.append('position', position);
            formData.append('name_req', name);
            formData.append('phone', phone);
            formData.append('type_id', selectedTypeId ? selectedTypeId.toString() : '');
            formData.append('topic_id', selectedTopicId ? selectedTopicId.toString() : '');
            formData.append('title_req', title);
            formData.append('detail_req', details);
            formData.append('id_program', selectedProgram ? selectedProgram.key.toString() : '');

            // Append files
            uploadedFiles.forEach((file) => {
                formData.append('files', file);
            });

            const response = await fetch('http://127.0.0.1:1234/it-requests', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorBody = await response.text();
                console.error('Error response body:', errorBody);
                throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
            }

            const result = await response.json();
            console.log('IT request created successfully:', result);

            // Show success alert and clear the form
            setSuccessAlert(true);
            clearForm(); // Clear form fields

            // Navigate to the main page after a short delay
            setTimeout(() => {
                setSuccessAlert(false); // Auto-hide after 2 seconds
                navigate('/');
            }, 2000); // 2 seconds delay before navigating
        } catch (error) {
            console.error('Error submitting IT request:', error);

            // Handle errors here, e.g., show an error message to the user
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
    };

    const handleCancel = () => {
        navigate('/');
    };

    const navigate = useNavigate();



    return (
        <React.Fragment>
            <CssBaseline />
            <Container maxWidth="lg">
                {successAlert && (
                    <Box
                        sx={{
                            position: 'fixed', // ให้เป็นตำแหน่ง fixed
                            top: '1rem', // ระยะห่างจากด้านบน
                            right: '1rem', // ระยะห่างจากด้านขวา
                            zIndex: 1300, // ให้ซ้อนเหนือ element อื่นๆ
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
                                        <Check fontSize="xl2" />
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
                        <h2>Request Form</h2>
                    </Box>
                    <hr />

                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <Box sx={{ pl: 2, mt: 4 }}>
                                <SelectDepartment onDepartmentChange={handleDepartmentChange} />
                            </Box>
                            <NameInput value={name} onChange={(e) => setName(e.target.value)} />
                            <PhoneInput value={phone} onChange={(e) => setPhone(e.target.value)} />
                            <Box sx={{ pl: 2, mt: 2 }}>
                                <SelectTypeRequest onSelectType={handleTypeChange} />
                            </Box>
                        </Grid>
                        <Grid item xs={8}>
                            <Box sx={{ pl: 2, mt: 4 }}>
                                <SelectTopic selectedTypeId={selectedTypeId} onSelectTopic={handleTopicChange} />
                            </Box>

                            {selectedTopicId === 2 ? (
                                <Box sx={{ pl: 2, mt: 2 }}>
                                    <SelectProgram onProgramChange={handleProgramChange} />
                                </Box>
                            ) : (
                                <TitleInput value={title} onChange={(e) => setTitle(e.target.value)} />
                            )}

                            <DetailsTextarea value={details} onChange={(e) => setDetails(e.target.value)} />
                            <Fileupload onFilesChange={handleFilesChange} />
                        </Grid>
                    </Grid>
                    <Box sx={{ pl: 2, mt: 2 }}>
                        <SelectWithApi type="m" value={selectedTypeId?.toString() || ''} onChange={handleTypeAChange} />
                    </Box>
                    <Grid item xs={12}>
                        <Box sx={{ my: 2, p: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Button color="primary" startDecorator={<SaveIcon />} onClick={handleSubmit}>
                                บันทึก
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
