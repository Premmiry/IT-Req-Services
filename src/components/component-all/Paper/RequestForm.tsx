import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Box, Button, Typography } from '@mui/joy';
import SelectDepartment from '../Select/select-department';
import SelectTypeRequest from '../Select/select-typerequest';
import SelectProgram from '../Select/select-program';
import SelectTopic from '../Select/select-topic';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Paper, Grid } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import Fileupload from '../FileUpload/file-upload';
import { NameInput, PhoneInput, TitleInput, DetailsTextarea, ITManagerTextarea, ITDirectorTextarea } from '../Input/input-requestform';
import { useNavigate, useParams } from 'react-router-dom';
import ReplyIcon from '@mui/icons-material/Reply';
import { SaveAlert } from '../Alert/alert';
import { BoxDirectorApprove, BoxManagerApprove } from '../ContentTypeR/boxmdapprove';
import { BoxITDirectorApprove, BoxITManagerApprove } from '../ContentTypeR/boxitmdapprove';
import URLAPI from '../../../URLAPI';

interface ApproveProps {
    name: string;
    status: string;
    req_id: string;
    level_job?: number | null;
}

interface UserApproveProps {
    name: string;
    status: string;
    req_id: string;
}

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
    const [isEditMode] = useState(!!id);
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
    const [managerApprove, setManagerApprove] = useState<UserApproveProps | null>(null);
    const [directorApprove, setDirectorApprove] = useState<UserApproveProps | null>(null);
    const [itmanagerApprove, setITManagerApprove] = useState<ApproveProps | null>(null);
    const [itdirectorApprove, setITDirectorApprove] = useState<ApproveProps | null>(null);
    const [itmanagerNote, setITManagerNote] = useState<string>('');
    const [itdirectorNote, setITDirectorNote] = useState<string>('');
    const [levelJob, setLevelJob] = useState<number | null>(null); // State for levelJob

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
                        setITManagerApprove({
                            name: requestData.it_m_name || '',
                            status: requestData.it_m_status || '',
                            req_id: id || '',
                            level_job: requestData.level_job || null
                        });
                        setITManagerNote(requestData.it_m_note || '');
                        setITDirectorApprove({
                            name: requestData.it_d_name || '',
                            status: requestData.it_d_status || '',
                            req_id: id || '',
                            level_job: requestData.level_job || null
                        });
                        setITDirectorNote(requestData.it_d_note || '');
                        setLevelJob(requestData.level_job || null); // Set initial levelJob
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

    // Memoize complex calculations
    const isITStaff = useMemo(() => {
        return userData?.id_section === 28 ||
            userData?.id_division_competency === 86 ||
            userData?.id_section_competency === 28;
    }, [userData]);

    const handleDepartmentChange = useCallback((department: DepartmentOption | null) => {
        setSelectedDepartment(department);
        setErrors(prev => ({ ...prev, department: '' }));
    }, []);

    const handleTypeChange = useCallback((typeId: number | null) => {
        setSelectedTypeId(typeId);
        if (typeId === null) {
            setSelectedTopicId(null);
        }
        setErrors(prev => ({ ...prev, typeId: '' }));
    }, []);

    const handleTopicChange = useCallback((topicId: number | null) => {
        setSelectedTopicId(topicId);
        setTitle('');
        setErrors(prev => ({ ...prev, topicId: '' }));
    }, []);

    const handleProgramChange = useCallback((program: ProgramOption | null) => {
        setSelectedProgram(program);
        setErrors(prev => ({ ...prev, program: '' }));
    }, []);

    const handleFilesChange = useCallback((files: (File | ExistingFileInfo)[]) => {
        setUploadedFiles(files);
        setErrors(prev => ({ ...prev, files: '' }));
    }, []);

    const generateRsCode = useCallback(async (selectedTypeId: number | null): Promise<string> => {
        const getFallbackCode = (prefix: string) => {
            const currentYearBE = new Date().getFullYear() + 543; // แปลงปี ค.ศ. เป็น พ.ศ.
            const shortYear = String(currentYearBE).slice(-2); // เอาเฉพาะ 2 หลักสุดท้ายของ พ.ศ.
            return `${prefix}${shortYear}/001`; // ใช้รูปแบบ Prefix+Year/001
        };

        try {
            const response = await fetch(`${URLAPI}/generatecode`);
            if (!response.ok) {
                throw new Error('Failed to fetch data from API');
            }

            const data = await response.json();
            if (data && data.length > 0) {
                const { years, total_requests } = data[0];
                const incrementedTotal = total_requests + 1; // เพิ่มค่า total_requests ขึ้น 1
                const formattedTotal = String(incrementedTotal).padStart(3, '0'); // Padding เป็น 3 หลัก
                const dateCode = `${years}/${formattedTotal}`;

                // กำหนด prefix ตามประเภทที่เลือก
                const prefix = selectedTypeId === 1 ? 'IT' :
                    selectedTypeId === 2 ? 'IS' :
                        selectedTypeId === 3 ? 'DEV' : 'UNK';

                return `${prefix}${dateCode}`; // Generate รหัสที่ไม่ซ้ำโดยเพิ่มเลข request ขึ้น 1
            } else {
                throw new Error('No data received from the API');
            }
        } catch (error) {
            console.error('Error generating code:', error);
            const prefix = selectedTypeId === 1 ? 'IT' :
                selectedTypeId === 2 ? 'IS' :
                    selectedTypeId === 3 ? 'DEV' : 'UNK';
            return getFallbackCode(prefix);
        }
    }, []);


    const validateForm = useCallback(() => {
        const newErrors: { [key: string]: string } = {};

        if (!selectedDepartment) newErrors.department = 'กรุณาเลือกแผนก';
        if (!selectedTypeId) newErrors.typeId = 'กรุณาเลือกประเภทคำร้อง';
        if (!name) newErrors.name = 'กรุณากรอกชื่อ';
        if (!phone) newErrors.phone = 'กรุณากรอกเบอร์โทรศัพท์';
        if (!details) newErrors.details = 'กรุณากรอกรายละเอียด';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [selectedDepartment, selectedTypeId, name, phone, details]);

    const handleSubmit = useCallback(async () => {
        if (!validateForm()) return;

        try {
            const formData = new FormData();

            const rsCodeToUse = isEditMode ? rsCode : await generateRsCode(selectedTypeId);
            formData.append('rs_code', rsCodeToUse);
            formData.append('id_department', selectedDepartment ? selectedDepartment.key.toString() : '');
            formData.append('id_division', userData ? userData.id_division : '');
            formData.append('id_section', userData ? userData.id_section : '');
            formData.append('id_job_description', userData ? userData.id_job_description : '');
            formData.append('id_division_competency', userData ? userData.id_division_competency : '');
            formData.append('id_section_competency', userData ? userData.id_section_competency : '');
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
                if (userData?.id_section === 28 || userData?.id_division_competency === 86 || userData?.id_section_competency === 28) {
                    navigate('/request-list-it');
                } else {
                    navigate('/request-list');
                }
            }, 2000);
        } catch (error) {
            console.error(isEditMode ? 'Error updating IT request:' : 'Error submitting IT request:', error);
        }
    }, [isEditMode, rsCode, selectedDepartment, userData, name, phone, selectedTypeId, selectedTopicId, title, details, selectedProgram, uploadedFiles, validateForm, generateRsCode, navigate]);

    const clearForm = useCallback(() => {
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
    }, []);

    const handleCancel = useCallback(() => {
        if (userData?.id_section === 28 || userData?.id_division_competency === 86 || userData?.id_section_competency === 28) {
            navigate('/request-list-it');
        } else {
            navigate('/request-list');
        }
    }, [userData, navigate]);

    return (
        <React.Fragment>
            <CssBaseline />
            <Container maxWidth="lg">
                {successAlert && <SaveAlert onClose={() => setSuccessAlert(false)} />}

                <Paper sx={{ width: '100%', padding: 2, boxShadow: 10 }}>
                    <Typography
                        sx={{
                            mt: 2,
                            mb: 4,
                            fontWeight: 'bold',
                            fontSize: 25,
                            color: '#1976d2',
                            textAlign: 'left',
                            textDecoration: 'underline',
                            textDecorationThickness: 2,
                            textUnderlineOffset: 6,
                            textDecorationColor: '#1976d2',
                            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                        }}
                    >
                        {isEditMode ? 'Request Edit' : 'Request Form'}
                    </Typography>
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
                                                <BoxManagerApprove managerApprove={managerApprove} id_division_competency={userData.id_division_competency} />
                                            ) : (
                                                <BoxManagerApprove managerApprove={{ name: '', status: '', req_id: '', m_name: '' }} id_division_competency={userData.id_division_competency} />
                                            )}
                                            {directorApprove !== null ? (
                                                <BoxDirectorApprove directorApprove={directorApprove} m_name={managerApprove?.name ?? null} id_section_competency={userData.id_section_competency} />
                                            ) : (
                                                <BoxDirectorApprove directorApprove={{ name: '', status: '', req_id: '', m_name: '' }} m_name={null} id_section_competency={userData.id_section_competency} />
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
                    {
                        userData && ((['m', 'd'].includes(userData.position) || admin === 'ADMIN') && selectedTypeId !== 2 && (isITStaff)) && (
                            <Box
                                sx={{
                                    backgroundColor: '#fff',
                                    padding: 2,
                                    borderRadius: 2,
                                    marginTop: 4,
                                    border: '1px dashed',
                                    borderColor: 'lightblue',

                                    // boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                                }}
                            >

                                <Typography
                                    sx={{
                                        mt: 2,
                                        mb: 4,
                                        fontWeight: 'bold',
                                        fontSize: 20,
                                        color: '#1976d2',
                                        textAlign: 'left',
                                        textDecoration: 'underline',
                                        textDecorationThickness: 2,
                                        textUnderlineOffset: 6,
                                        textDecorationColor: '#1976d2',
                                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                                    }}
                                >
                                    IT Approve
                                </Typography>

                                <Grid container spacing={4}>
                                    <Grid item xs={12} sm={6}>
                                        {itmanagerApprove !== null ? (
                                            <BoxITManagerApprove
                                                itmanagerApprove={{
                                                    name: itmanagerApprove.name,
                                                    status: itmanagerApprove.status,
                                                    req_id: itmanagerApprove.req_id,
                                                    level_job: itmanagerApprove.level_job ?? null
                                                }}
                                                id_division_competency={userData.id_division_competency}
                                                it_m_note={itmanagerNote}
                                                onLevelJobChange={(newLevelJob) => setLevelJob(newLevelJob)} // Pass callback to update levelJob
                                            />
                                        ) : (
                                            <BoxITManagerApprove
                                                itmanagerApprove={{
                                                    name: '',
                                                    status: '',
                                                    req_id: '',
                                                    level_job: null
                                                }}
                                                id_division_competency={userData.id_division_competency}
                                                it_m_note={null}
                                                onLevelJobChange={(newLevelJob) => setLevelJob(newLevelJob)} // Pass callback to update levelJob
                                            />
                                        )}
                                        <ITManagerTextarea
                                            value={itmanagerNote}
                                            onChange={(e) => setITManagerNote(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        {itdirectorApprove !== null ? (
                                            <BoxITDirectorApprove
                                                itdirectorApprove={{
                                                    name: itdirectorApprove.name,
                                                    status: itdirectorApprove.status,
                                                    req_id: itdirectorApprove.req_id,
                                                    level_job: itdirectorApprove.level_job ?? null
                                                }}
                                                it_m_name={itmanagerApprove?.name ?? null}
                                                id_section_competency={userData.id_section_competency}
                                                it_d_note={itdirectorNote}
                                                levelJob={levelJob} // Pass levelJob as prop
                                            />
                                        ) : (
                                            <BoxITDirectorApprove
                                                itdirectorApprove={{
                                                    name: '',
                                                    status: '',
                                                    req_id: '',
                                                    level_job: null
                                                }}
                                                it_m_name={null}
                                                id_section_competency={userData.id_section_competency}
                                                it_d_note={null}
                                                levelJob={levelJob} // Pass levelJob as prop
                                            />
                                        )}
                                        <Box sx={{ mb: 9 }}>

                                        </Box>
                                        <ITDirectorTextarea
                                            value={itdirectorNote}
                                            onChange={(e) => setITDirectorNote(e.target.value)}
                                        />
                                    </Grid>

                                </Grid>
                            </Box>

                        )
                    }
                    <Grid item xs={12}>
                        <Box sx={{ my: 2, p: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            {
                                userData && (
                                    (
                                        // Condition 1: status_id = 2 and position is m or d and not type 2
                                        (status_id === 2 && ['m', 'd'].includes(userData.position) && selectedTypeId !== 2) ||

                                        // Condition 2: status_id = 3 and position is d and not type 2
                                        (status_id === 3 && userData.position === 'd' && selectedTypeId !== 2) ||

                                        // Condition 3: status_id = 4 and position is m or d and not type 2 and is IT staff
                                        (status_id === 4 && ['m', 'd'].includes(userData.position) && selectedTypeId !== 2 && isITStaff) ||

                                        // Condition 4: status_id = 5 and position is d and not type 2 and is IT staff
                                        (status_id === 5 && userData.position === 'd' && selectedTypeId !== 2 && isITStaff) ||

                                        // Condition 6: status_id = 1 or not in edit mode
                                        (status_id === 1 || !isEditMode)
                                    ) && (
                                        <Button
                                            color="primary"
                                            startDecorator={<SaveIcon />}
                                            onClick={handleSubmit}
                                        >
                                            {isEditMode ? 'Update' : 'บันทึก'}
                                        </Button>
                                    )
                                )
                            }
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