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
import FileUpload from '../FileUpload/file-upload';
import { NameInput, PhoneInput, TitleInput, DetailsTextarea } from '../Input/input-requestform';
import { useNavigate, useParams } from 'react-router-dom';


// เพิ่ม interface สำหรับ ExistingFileInfo
interface ExistingFileInfo {
    file_path: string;
    file_name?: string;
}

export default function RequestFormEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [uploadedFiles, setUploadedFiles] = useState<(File | ExistingFileInfo)[]>([]);

    // เก็บสถานะของฟิลด์ต่าง ๆ
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedTypeId, setSelectedTypeId] = useState(null);
    const [selectedTopicId, setSelectedTopicId] = useState(null);
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [rsCode, setRsCode] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [title, setTitle] = useState('');
    const [details, setDetails] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRequestData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`http://localhost:1234/it-requests?req_id=${id}`);
                const { data } = await response.json();
                console.log("Received data from API:", data);

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

                    // ปรับการ parse ข้อมูลไฟล์
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

        fetchRequestData();
    }, [id]);

    const handleSubmit = async () => {
        if (!selectedDepartment || !name || !phone || !selectedTypeId) {
            setError('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const form = new FormData();
            const { username, position } = currentUser();

            form.append('rs_code', rsCode);
            form.append('id_department', selectedDepartment?.key.toString() || '');
            form.append('user_req', username);
            form.append('position', position);
            form.append('name_req', name);
            form.append('phone', phone);
            form.append('type_id', selectedTypeId?.toString() || '');
            form.append('topic_id', selectedTopicId?.toString() || '');
            form.append('title_req', title);
            form.append('detail_req', details);
            form.append('id_program', selectedProgram?.key.toString() || '');

            // จัดการไฟล์ที่อัปโหลด
            uploadedFiles.forEach((file) => {
                if (file instanceof File) {
                    // ตรวจสอบว่าไฟล์ไม่เป็น null ก่อน
                    if (file.name) {
                        form.append('files', file);
                    } else {
                        console.error('File name is null or undefined');
                    }
                } else {
                    // ตรวจสอบว่า file.file_path มีค่าก่อนทำการ split
                    if (file.file_path) {
                        form.append('existing_files[]', file.file_path);
                    } else {
                        console.error('file_path is null or undefined');
                    }
                }
            });

            // ส่งข้อมูลไปยัง API
            const response = await fetch(`http://localhost:1234/it-requests/${id}`, {
                method: 'PUT',
                body: form,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('IT request updated successfully:', result);
            navigate('/');

        } catch (error) {
            console.error('Error updating IT request:', error.message);
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
                <CssBaseline />
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
                                    <Input sx={{ width: 135, justifyItems: 'center' }} value={rsCode} readOnly />
                                </FormLabel>
                            </Box>
                        </Grid>
                    </Grid>
                    <hr />
                    <br />
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <SelectDepartment
                                onDepartmentChange={setSelectedDepartment}
                                initialValue={selectedDepartment || null}
                            />
                            <NameInput value={name} onChange={(e) => setName(e.target.value)} />
                            <PhoneInput value={phone} onChange={(e) => setPhone(e.target.value)} />
                            <SelectTypeRequest
                                onSelectType={setSelectedTypeId}
                                initialValue={selectedTypeId}
                            />
                        </Grid>
                        <Grid item xs={8}>
                            <SelectTopic
                                selectedTypeId={selectedTypeId}
                                onSelectTopic={setSelectedTopicId}
                                initialValue={selectedTopicId}
                            />
                            {selectedTopicId === 2 ? (
                                <SelectProgram
                                    onProgramChange={setSelectedProgram}
                                    initialValue={selectedProgram}
                                />
                            ) : (
                                <TitleInput
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            )}
                            <DetailsTextarea value={details} onChange={(e) => setDetails(e.target.value)} />

                            <FileUpload
                                onFilesChange={(newFiles) => setUploadedFiles(newFiles)}
                                reqId={id}
                                initialFiles={uploadedFiles}
                            />


                        </Grid>
                    </Grid>
                    <Box sx={{ my: 2, p: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Button
                            startDecorator={<SaveIcon />}
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
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </Paper>
            </Container>
        </React.Fragment>
    );
}

// ฟังก์ชันจำลองสำหรับดึงข้อมูลผู้ใช้ปัจจุบัน
function currentUser() {
    return {
        username: 'JohnDoe',
        position: 'Software Engineer',
    };
}
