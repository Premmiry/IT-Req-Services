import React, { useEffect, useState } from 'react';
import { Button, Box, Input } from '@mui/joy';
import { Container, Paper, Grid, CssBaseline } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ReplyIcon from '@mui/icons-material/Reply';
import FormLabel from '@mui/joy/FormLabel';
import SelectDepartment from '../Select/select-department';
import SelectTypeRequest from '../Select/select-typerequest';
import SelectProgram from '../Select/select-program';
import SelectTopic from '../Select/select-topic';
import Fileupload from '../FileUpload/file-upload';
import { NameInput, PhoneInput, TitleInput, DetailsTextarea } from '../Input/input-requestform';
import { useNavigate, useParams } from 'react-router-dom';

export default function RequestFormEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        selectedDepartment: null,
        selectedTypeId: null,
        selectedTopicId: null,
        selectedProgram: null,
        rs_code: '',
        name: '',
        phone: '',
        title: '',
        details: '',
        uploadedFiles: [],
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRequestData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`http://localhost:1234/it-requests?req_id=${id}`);
                if (!response.ok) throw new Error(`Error fetching request data: ${response.statusText}`);

                const { message, data } = await response.json();
                console.log("ข้อมูลที่ได้จาก API:", data);

                if (data && data.length > 0) {
                    const requestData = data[0];
                    setFormData({
                        selectedDepartment: { key: requestData.id_department, label: '' }, // ต้องการการแปลงจาก id_department ไปยัง DepartmentOption
                        selectedTypeId: requestData.type_id || null,
                        selectedTopicId: requestData.topic_id || null,
                        selectedProgram: requestData.id_program && requestData.program_name
                            ? { key: requestData.id_program, label: requestData.program_name }
                            : null,
                        rs_code: requestData.rs_code || '',
                        name: requestData.name_req || '',
                        phone: requestData.phone || '',
                        title: requestData.title_req || '',
                        details: requestData.detail_req || '',
                        uploadedFiles: requestData.files ? JSON.parse(requestData.files) : [],
                    });
                }

            } catch (error) {
                console.error('เกิดข้อผิดพลาด:', error.message);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRequestData();
    }, [id]);




    const handleSubmit = async () => {
        if (!formData.selectedDepartment || !formData.name || !formData.phone || !formData.selectedTypeId) {
            setError('Please fill in all required fields.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const form = new FormData();
            const { username, position } = currentUser();

            form.append('rs_code', formData.rs_code);
            form.append('id_department', formData.selectedDepartment?.key.toString() || '');
            form.append('user_req', username);
            form.append('position', position);
            form.append('name_req', formData.name);
            form.append('phone', formData.phone);
            form.append('type_id', formData.selectedTypeId?.toString() || '');
            form.append('topic_id', formData.selectedTopicId?.toString() || '');
            form.append('title_req', formData.title);
            form.append('detail_req', formData.details);
            form.append('id_program', formData.selectedProgram?.key.toString() || '');

            formData.uploadedFiles.forEach(file => {
                form.append('files', file);
            });

            const response = await fetch(`http://127.0.0.1:1234/it-requests/${id}`, {
                method: 'POST',
                body: form,
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
            }

            const result = await response.json();
            console.log('IT request updated successfully:', result);
            navigate('/');

        } catch (error) {
            if (error instanceof Error) {
                console.error('Error submitting IT request:', error.message);
                setError(error.message);
            } else {
                console.error('An unexpected error occurred');
            }
        }
    };

    const handleCancel = () => {
        navigate('/');
    };

    const handleInputChange = (key : any, value : any) => {
        setFormData(prevData => ({ ...prevData, [key]: value }));
    };

    return (
        <React.Fragment>
            <CssBaseline />
            <Container maxWidth="lg">
                <Paper sx={{ width: '100%', padding: 2, boxShadow: 10 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Box sx={{ padding: 2 }}>
                                <h2>Request Edit</h2>
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <FormLabel>
                                    <h5>Request No.</h5>
                                    <Input sx={{ width: 135, justifyItems: 'center' }} value={formData.rs_code} readOnly />
                                </FormLabel>
                            </Box>
                        </Grid>
                    </Grid>
                    <hr />
                    <br />
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <SelectDepartment
                                onDepartmentChange={(value) => handleInputChange('selectedDepartment', value)}
                                initialValue={formData.selectedDepartment || null} // ตรวจสอบให้แน่ใจว่ามีค่าเป็น DepartmentOption
                            />

                            <NameInput value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} />
                            <PhoneInput value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} />
                            <SelectTypeRequest
                                onSelectType={(value) => handleInputChange('selectedTypeId', value)}
                                initialValue={formData.selectedTypeId}
                            />
                        </Grid>
                        <Grid item xs={8}>
                            <SelectTopic
                                selectedTypeId={formData.selectedTypeId}
                                onSelectTopic={(value) => handleInputChange('selectedTopicId', value)}
                                initialValue={formData.selectedTopicId}
                            />
                            {formData.selectedTopicId === 2 ? (
                                <Box>
                                    <SelectProgram
                                        onProgramChange={(value) => handleInputChange('selectedProgram', value)}
                                        initialValue={formData.selectedProgram}
                                    />
                                </Box>
                            ) : (
                                <TitleInput
                                    value={formData.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                />
                            )}

                            <DetailsTextarea value={formData.details} onChange={(e) => handleInputChange('details', e.target.value)} />

                            <Box>
                                <Fileupload
                                    onFilesChange={(files) => handleInputChange('uploadedFiles', files)}
                                    initialFiles={formData.uploadedFiles || []} // ตรวจสอบให้แน่ใจว่าค่าเป็น array
                                />

                            </Box>
                        </Grid>
                    </Grid>


                    <Box sx={{ my: 2, p: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Button
                            startIcon={<SaveIcon />}
                            color="success"
                            loading={isLoading}
                            onClick={handleSubmit}
                        >
                            Update
                        </Button>
                        <Button sx={{ ml: 2 }} color="danger" startDecorator={<ReplyIcon />} onClick={handleCancel}>
                                ย้อนกลับ
                            </Button>
                    </Box>
                </Paper>
            </Container>
        </React.Fragment>
    );
}

function currentUser(): { username: any; position: any; } {
    throw new Error('Function not implemented.');
}
