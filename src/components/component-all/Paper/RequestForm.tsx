import React, { useState } from 'react';
import { Box, Button } from '@mui/joy';
import SelectDepartment from '../Select/select-department';
import SelectTypeRequest from '../Select/select-typerequest';
import SelectProgram from '../Select/select-program';
import SelectTopic from '../Select/select-topic';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Paper, Grid } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import Fileupload from '../FileUpload/file-upload';
import { NameInput, PhoneInput, TitleInput, DetailsTextarea } from '../Input/input-requestform';
import { useNavigate } from 'react-router-dom';
import ReplyIcon from '@mui/icons-material/Reply';

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

    const handleDepartmentChange = (department: DepartmentOption | null) => {
        setSelectedDepartment(department);
    };

    const handleTypeChange = (typeId: number | null) => {
        setSelectedTypeId(typeId);
        if (typeId === null) {
            setSelectedTopicId(null);
        }
    };

    const handleTopicChange = (topicId: number | null) => {
        setSelectedTopicId(topicId);
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
        const dateCode = `${year}${month}${day}`;

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
        const formData = new FormData();
        const { username, position } = currentUser(); // Retrieve current user information

        const requestData = {
            rs_code: generateRsCode(selectedTypeId),
            date_req: new Date().toISOString(),
            department_req_id: selectedDepartment ? selectedDepartment.key : null,
            user: username,
            position: position,
            name_req: name,
            phone: phone,
            type_id: selectedTypeId,
            topic_id: selectedTopicId,
            title_req: title,
            detail_req: details,
            id_program: selectedProgram ? selectedProgram.key : null,
            uploadedFiles:uploadedFiles
        };

        formData.append('req_data', JSON.stringify(requestData));
        console.log(requestData);

        // uploadedFiles.forEach((file) => {
        //     formData.append('files', file);
        // });

        // try {
        //     const response = await fetch('http://your-fastapi-server/req_master', {
        //         method: 'POST',
        //         body: formData,
        //     });

        //     if (!response.ok) {
        //         throw new Error('Failed to submit request');
        //     }

        //     const result = await response.json();
        //     console.log('Response:', result);
        //     alert(`Request submitted successfully! Request ID: ${result.req_id}`);
        // } catch (error) {
        //     console.error('Error submitting request:', error);
        //     alert('Error submitting request');
        // }
    };

    const navigate = useNavigate();

    const handleCancel = () => {
        navigate('/');
    };

    return (
        <React.Fragment>
            <CssBaseline />
            <Container maxWidth="lg">
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
