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
    const [selectedDepartment, setSelectedDepartment] = useState<DepartmentOption | null>(null); // State สำหรับแผนก
    const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null); // State สำหรับประเภท
    const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);  // State สำหรับหัวข้อ
    const [selectedProgram, setSelectedProgram] = useState<ProgramOption | null>(null); // State สำหรับโปรแกรม
    const [name, setName] = useState<string>(''); // State สำหรับชื่อ
    const [phone, setPhone] = useState<string>(''); // State สำหรับเบอร์โทร
    const [title, setTitle] = useState<string>(''); // State สำหรับเรื่อง
    const [details, setDetails] = useState<string>(''); // State สำหรับรายละเอียด
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]); // State สำหรับแนบไฟล์

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

    const handleSubmit = async () => {
    const formData = new FormData();
    const requestData = {
        rs_code: generateRsCode(), // ฟังก์ชันสำหรับสร้าง rs_code
        date_req: new Date().toISOString(),
        department_req_id: selectedDepartment.id_department,
        user: currentUser.username, // สมมติว่ามีข้อมูลผู้ใช้ปัจจุบัน
        position: currentUser.position,
        name_req: name,
        phone: phone,
        type_id: selectedTypeId,
        topic_id: selectedTopicId,
        title_req: title,
        detail_req: details,
        level_urgent: selectedUrgentLevel, // ถ้ามี
        id_program: selectedProgram ? selectedProgram.id_program : null
    };

    formData.append('req_data', JSON.stringify(requestData));
    
    uploadedFiles.forEach((file, index) => {
        formData.append(`files`, file);
    });

    try {
        const response = await fetch('http://your-fastapi-server/req_master', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to submit request');
        }

        const result = await response.json();
        console.log('Response:', result);
        alert(`Request submitted successfully! Request ID: ${result.req_id}`);
    } catch (error) {
        console.error('Error submitting request:', error);
        alert('Error submitting request');
    }
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
