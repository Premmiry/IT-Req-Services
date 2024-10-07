import React, { useEffect, useState } from 'react';
import { Box, Button, Input } from '@mui/joy';
import { Container, Paper, Grid, CssBaseline } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ReplyIcon from '@mui/icons-material/Reply';
import FormLabel from '@mui/joy/FormLabel';
import SelectDepartment from '../Select/select-department';
import SelectTypeRequest from '../Select/select-typerequest';
import SelectProgram from '../Select/select-program';
import SelectTopic from '../Select/select-topic';
import { SelectWithApi } from '../Select/select-statusapprove';
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

export default function RequestFormEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    // State management for form fields
    const [formData, setFormData] = useState({
        selectedDepartment: null as DepartmentOption | null,
        selectedTypeId: null as number | null,
        selectedTopicId: null as number | null,
        selectedProgram: null as ProgramOption | null,
        rs_code: '',
        name: '',
        phone: '',
        title: '',
        details: '',
        name_department: '',
        topic_name: '',
        name_program: '',
        type_name: '',
        uploadedFiles: [] as File[],
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch request data when component mounts
    useEffect(() => {
        const fetchRequestData = async () => {
            try {
                const response = await fetch(`http://localhost:1234/it-requests/${id}`);
                if (!response.ok) throw new Error(`Error fetching request data: ${response.statusText}`);

                const { message, data } = await response.json();
                console.log(message); // ตรวจสอบข้อความ
                console.log(data); // ตรวจสอบข้อมูลที่ดึงมา

                // ตั้งค่า formData ด้วยค่าจาก data
                setFormData(prevData => ({
                    ...prevData,
                    rs_code: data.rs_code,
                    department: data.name_department,
                    name: data.name_req,
                    phone: data.phone,
                    title: data.title_req,
                    type: data.type_name,
                    program: data.program_name,
                    topic: data.topic_name,
                    details: data.detail_req, 
                    uploadedFiles: [], 
                    status: data.status
                }));

                
            } catch (error) {
                console.error(error);
                setError(error.message);
            }
        };

        fetchRequestData();
    }, [id]);


    // Handle form input changes
    const handleInputChange = (key: keyof typeof formData, value: any) => {
        setFormData(prevData => ({ ...prevData, [key]: value }));
    };

    const handleDepartmentChange = (department: DepartmentOption | null) => {
        handleInputChange('selectedDepartment', department);
    };

    const handleTypeChange = (typeId: number | null) => {
        handleInputChange('selectedTypeId', typeId);
        if (typeId === null) {
            handleInputChange('selectedTopicId', null);
        }
    };

    const handleTopicChange = (topicId: number | null) => {
        handleInputChange('selectedTopicId', topicId);
        handleInputChange('title', ''); // Reset title when topic changes
    };

    const handleProgramChange = (program: ProgramOption | null) => {
        handleInputChange('selectedProgram', program);
    };

    const handleFilesChange = (files: File[]) => {
        handleInputChange('uploadedFiles', files);
    };



    const currentUser = () => ({
        username: 'sitp014',
        position: 's',
    });

    const handleSubmit = async () => {
        // Basic validation
        if (!formData.selectedDepartment || !formData.name || !formData.phone || !formData.selectedTypeId) {
            setError('Please fill in all required fields.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const form = new FormData();
            const { username, position } = currentUser();

            // Append all form fields to formData
            form.append('rs_code', formData.rs_code);
            form.append('department_req_id', formData.selectedDepartment?.key || '');
            form.append('user_req', username);
            form.append('position', position);
            form.append('name_req', formData.name);
            form.append('phone', formData.phone);
            form.append('type_id', formData.selectedTypeId);
            form.append('topic_id', formData.selectedTopicId);
            form.append('title_req', formData.title);
            form.append('detail_req', formData.details);
            form.append('id_program', formData.selectedProgram?.key || '');

            // Append files
            formData.uploadedFiles.forEach(file => {
                form.append('files', file);
            });

            const response = await fetch(`http://localhost:1234/it-requests/${id}`, {
                method: 'POST',
                body: form,
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
            }

            const result = await response.json();
            console.log('IT request updated successfully:', result);
            navigate('/'); // Redirect after successful submission
        } catch (error) {
            console.error('Error submitting IT request:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/');
    };

    return (
        <React.Fragment>
            <CssBaseline />
            <Container maxWidth="lg">
                <Paper sx={{ width: '100%', padding: 2, boxShadow: 10 }}>
                    <Box sx={{ padding: 2 }}>
                        <h2>Request Edit</h2>
                        <hr />
                        <br />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>

                            <FormLabel>
                                <h5>Request No.</h5>
                                <Input
                                    sx={{
                                        width: 140, '--Input-radius': '0px',
                                        borderBottom: '2px solid',
                                        borderColor: 'neutral.outlinedBorder',
                                        '&:hover': {
                                            borderColor: 'neutral.outlinedHoverBorder',
                                        },
                                        '&::before': {
                                            border: '1px solid var(--Input-focusedHighlight)',
                                            transform: 'scaleX(0)',
                                            left: 0,
                                            right: 0,
                                            bottom: '-2px',
                                            top: 'unset',
                                            transition: 'transform .15s cubic-bezier(0.1,0.9,0.2,1)',
                                            borderRadius: 0,
                                        },
                                        '&:focus-within::before': {
                                            transform: 'scaleX(1)',
                                        },
                                    }}
                                    variant="outlined" color="primary" type="text"
                                    value={formData.rs_code}
                                />
                            </FormLabel>
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                        </Box>
                    </Box>


                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <Box sx={{ pl: 2, mt: 4 }}>
                            <SelectDepartment onDepartmentChange={handleDepartmentChange} />
                            </Box>
                            <NameInput value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} />
                            <PhoneInput value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} />
                            <Box sx={{ pl: 2, mt: 2 }}>
                                <SelectTypeRequest
                                    onSelectType={handleTypeChange}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={8}>
                            <Box sx={{ pl: 2, mt: 4 }}>
                                <SelectTopic
                                    
                                    selectedTypeId={formData.selectedTypeId}
                                    onSelectTopic={handleTopicChange}
                                />
                            </Box>
                            {formData.selectedTopicId === 2 ? (
                                <Box sx={{ pl: 2, mt: 2 }}>
                                    <SelectProgram
                                        
                                        onProgramChange={handleProgramChange}
                                    />
                                </Box>
                            ) : (
                                <TitleInput value={formData.title} onChange={(e) => handleInputChange('title', e.target.value)} />
                            )}
                            <DetailsTextarea value={formData.details} onChange={(e) => handleInputChange('details', e.target.value)} />
                            <Fileupload onFilesChange={handleFilesChange} />
                        </Grid>
                    </Grid>
                    <Box sx={{ pl: 2, mt: 2 }}>
                        <SelectWithApi type="m" value={formData.selectedTypeId?.toString() || ''} onChange={handleTypeChange} />
                    </Box>
                    <Grid item xs={12}>
                        <Box sx={{ my: 2, p: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Button
                                color="primary"
                                startDecorator={<SaveIcon />}
                                onClick={handleSubmit}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Saving...' : 'บันทึก'}
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
