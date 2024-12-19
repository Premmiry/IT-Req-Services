import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Box, Button, Typography, Card } from '@mui/joy';
import Chip from "@mui/material/Chip";
import SelectDepartment from '../Select/select-department';
import SelectTypeRequest from '../Select/select-typerequest';
import SelectProgram from '../Select/select-program';
import SelectTopic from '../Select/select-topic';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Paper, Grid, FormLabel } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import Fileupload from '../FileUpload/file-upload';
import { NameInput, PhoneInput, TitleInput, DetailsTextarea, ITManagerTextarea, ITDirectorTextarea } from '../Input/input-requestform';
import { useNavigate, useParams } from 'react-router-dom';
import ReplyIcon from '@mui/icons-material/Reply';
import { SaveAlert } from '../Alert/alert';
import { BoxDirectorApprove, BoxManagerApprove } from '../ContentTypeR/boxmdapprove';
import { BoxITDirectorApprove, BoxITManagerApprove } from '../ContentTypeR/boxitmdapprove';
import URLAPI from '../../../URLAPI';
import AssigneeDepSelector from "../Select/AssigneeDepSelector";
import AssigneeEmpSelector from "../Select/AssigneeEmpSelector";
import { SelectPriority } from "../Select/select-priority";
import DateWork from "../DatePicker/datework";
import SUBTASK from "../ContentTypeR/boxsubtask";
import UAT from "../ContentTypeR/boxUAT";
import { Stack } from '@mui/material';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonCheckedSharpIcon from "@mui/icons-material/RadioButtonCheckedSharp";
import dayjs from 'dayjs';
import SelectSubtopic from '../Select/select-subtopic';
import Swal from 'sweetalert2';
import BasicRating from '../ContentTypeR/boxrating';
import Rating from '@mui/material/Rating';

interface ApproveProps {
    name: string | null;
    status: string | null;
    req_id: string | null;
    it_m_name?: string | null;
    level_job: number | null;
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

// Update RequestData interface to include all necessary fields
interface RequestData {
    id: number;
    id_department: number;
    type_id: number | null;
    topic_id: number | null;
    subtopic_id: number | null;
    user_req: string;
    position: string;
    id_program?: number;
    program_name?: string;
    rs_code: string;
    name_req: string;
    phone: string;
    title_req: string;
    detail_req: string;
    status_id: number | null;
    status_name: string;
    m_name?: string;
    m_status?: string;
    d_name?: string;
    d_status?: string;
    it_m_name?: string;
    it_m_status?: string;
    it_m_note?: string;
    it_d_name?: string;
    it_d_status?: string;
    it_d_note?: string;
    level_job?: number | null;
    files?: string;
    date_start?: string | null;  // Changed from Date to string
    date_end?: string | null;    // Changed from Date to string
    date_estimate?: string | null;
    id_priority?: number | null;
    admin_recieve_username?: string | null;
    it_user_recieve?: string | null;
    check_m?: number;
    check_d?: number;
    check_it_m?: number;
    check_it_d?: number;
    knowledge?: string;
}

interface SubtopicOption {
    key: number;
    label: string;
    pattern: string;
    topic_id: number;
    check_m: number;
    check_d: number;
    check_it_m: number;
    check_it_d: number;
    knowledge: string;
}

// เพิ่ม interface สำหรับ rating
interface RatingScore {
    id_rating_score: number;
    id_rating: number;
    rating_name: string;
    score: number;
}

// เพิ่ม interface
interface RatingOption {
    id_rating: number;
    type_id: number;
    rating_name: string;
}

export default function RequestForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isEditMode] = useState(!!id);
    const [selectedDepartment, setSelectedDepartment] = useState<DepartmentOption | null>(null);
    const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
    const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
    const [selectedSubtopicId, setSelectedSubtopicId] = useState<number | null>(null);
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
    const numericId = id ? parseInt(id) : 0; // Convert string id to number
    const [requestData, setRequestData] = useState<RequestData | null>(null);
    const [selectedSubtopic, setSelectedSubtopic] = useState<SubtopicOption | null>(null);
    const [uatScore, setUatScore] = React.useState<boolean>(false);
    // console.log('subtopicOption', selectedSubtopic);
    // console.log('date_estimate', requestData?.date_estimate);
    const [showRating, setShowRating] = useState(false);
    const [ratingScores, setRatingScores] = useState<RatingScore[]>([]);
    const [ratingOptions, setRatingOptions] = useState<RatingOption[]>([]);

    const getStatusStyle = (status: string) => {
        const styles = {
            "Request": {
                backgroundColor: '#42a5f5',  // สีฟ้า
                icon: <RadioButtonCheckedSharpIcon sx={{ fontSize: '1rem' }} />
            },
            "Manager Approve": {
                backgroundColor: '#66bb6a',  // สีเขียว
                icon: <CheckCircleIcon sx={{ fontSize: '1rem' }} />
            },
            "Manager Unapprove": {
                backgroundColor: '#ef5350',  // สีแดง
                icon: <RadioButtonCheckedSharpIcon sx={{ fontSize: '1rem' }} />
            },
            "Director Approve": {
                backgroundColor: '#4caf50',  // สีเขียวเข้ม
                icon: <CheckCircleIcon sx={{ fontSize: '1rem' }} />
            },
            "Director Unapprove": {
                backgroundColor: '#f44336',  // สีแดงเข้ม
                icon: <RadioButtonCheckedSharpIcon sx={{ fontSize: '1rem' }} />
            },
            "IT Manager Approve": {
                backgroundColor: '#8bc34a',  // สีเขียวอ่อน
                icon: <CheckCircleIcon sx={{ fontSize: '1rem' }} />
            },
            "IT Manager Unapprove": {
                backgroundColor: '#ff5722',  // สีส้มแดง
                icon: <RadioButtonCheckedSharpIcon sx={{ fontSize: '1rem' }} />
            },
            "IT Director / Director Deputy Approve": {
                backgroundColor: '#4db6ac',  // สีเขียวฟ้า
                icon: <CheckCircleIcon sx={{ fontSize: '1rem' }} />
            },
            "IT Director / Director Deputy Unapprove": {
                backgroundColor: '#ff7043',  // สีส้ม
                icon: <RadioButtonCheckedSharpIcon sx={{ fontSize: '1rem' }} />
            },
            "Admin Recieve": {
                backgroundColor: '#90a4ae',  // สีเทา
                icon: <RadioButtonCheckedSharpIcon sx={{ fontSize: '1rem' }} />
            },
            "In Progress": {
                backgroundColor: '#5c6bc0',  // สีน้ำเงิน
                icon: <RadioButtonCheckedSharpIcon sx={{ fontSize: '1rem' }} />
            },
            "Complete": {
                backgroundColor: '#2e7d32',  // สีเขียวเข้มมาก
                icon: <CheckCircleIcon sx={{ fontSize: '1rem' }} />
            },
            "Cancel": {
                backgroundColor: '#d32f2f',  // สีแดงเข้มมาก
                icon: <RadioButtonCheckedSharpIcon sx={{ fontSize: '1rem' }} />
            },
            "Revise": {
                backgroundColor: '#ffa726',  // สีส้มอ่อน
                icon: <RadioButtonCheckedSharpIcon sx={{ fontSize: '1rem' }} />
            },
            "Confirm Close": {
                backgroundColor: '#7cb342',  // สีเขียวอมเหลือง
                icon: <CheckCircleIcon sx={{ fontSize: '1rem' }} />
            },
            "Reject": {
                backgroundColor: '#c62828',  // สีแดงเลือดหมู
                icon: <RadioButtonCheckedSharpIcon sx={{ fontSize: '1rem' }} />
            },
            "To Do": {
                backgroundColor: '#9575cd',  // สีม่วง
                icon: <RadioButtonCheckedSharpIcon sx={{ fontSize: '1rem' }} />
            },
            "UAT": {
                backgroundColor: '#00acc1',  // สีฟ้าเขียว
                icon: <CheckCircleIcon sx={{ fontSize: '1rem' }} />
            }
        };
        return styles[status as keyof typeof styles] || { backgroundColor: '#81b1c9', icon: <RadioButtonCheckedSharpIcon sx={{ fontSize: '1rem' }} /> };
    };

    // Add fetchRequestData function
    const fetchRequestData = useCallback(async () => {
        if (!numericId) return;
        try {
            const response = await fetch(`${URLAPI}/it-requests?req_id=${numericId}`);
            if (!response.ok) throw new Error(`Error fetching request data: ${response.statusText}`);

            const { data } = await response.json();
            if (data && data.length > 0) {
                const reqData = data[0];

                setRequestData({
                    ...reqData,
                    date_start: reqData.date_start ? reqData.date_start.split('T')[0] : null,
                    date_end: reqData.date_end ? reqData.date_end.split('T')[0] : null,
                    date_estimate: reqData.date_estimate ? reqData.date_estimate.split('T')[0] : null
                });

                setRequestData({
                    ...reqData,
                    admin_recieve_username: reqData.admin_recieve_username || null,
                    it_user_recieve: reqData.it_user_recieve || null
                });
                // อัพเดทค่าต่างๆ
                setSelectedDepartment({ key: reqData.id_department, label: '' });
                setSelectedTypeId(reqData.type_id || null);
                setSelectedTopicId(reqData.topic_id || null);
                setSelectedSubtopicId(reqData.subtopic_id || null);
                setSelectedProgram(
                    reqData.id_program && reqData.program_name
                        ? { key: reqData.id_program, label: reqData.program_name }
                        : null
                );
                setRsCode(reqData.rs_code || '');
                setName(reqData.name_req || '');
                setPhone(reqData.phone || '');
                setTitle(reqData.title_req || '');

                // ตรวจสอบและตั้งค่า details
                if (reqData.detail_req) {
                    setDetails(reqData.detail_req);
                }

                setStatusId(reqData.status_id || null);
                setManagerApprove({
                    name: reqData.m_name || '',
                    status: reqData.m_status || '',
                    req_id: numericId.toString()
                });
                setDirectorApprove({
                    name: reqData.d_name || '',
                    status: reqData.d_status || '',
                    req_id: numericId.toString()
                });
                setITManagerApprove({
                    name: reqData.it_m_name || '',
                    status: reqData.it_m_status || '',
                    req_id: numericId.toString(),
                    level_job: reqData.level_job
                });
                setITManagerNote(reqData.it_m_note || '');
                setITDirectorApprove({
                    name: reqData.it_d_name || '',
                    status: reqData.it_d_status || '',
                    req_id: numericId.toString(),
                    level_job: reqData.level_job
                });
                setITDirectorNote(reqData.it_d_note || '');
                setLevelJob(reqData.level_job || null);

                // Handle files
                let parsedFiles: ExistingFileInfo[] = [];
                try {
                    parsedFiles = JSON.parse(reqData.files);
                    if (!Array.isArray(parsedFiles)) {
                        parsedFiles = [];
                    }
                } catch (error) {
                    console.error('Error parsing files:', error);
                }
                setUploadedFiles(parsedFiles);

                // เพิ่มการเซ็ตค่า selectedSubtopic
                if (reqData.subtopic_id) {
                    setSelectedSubtopic({
                        key: reqData.subtopic_id,
                        label: reqData.subtopic_name || '',
                        pattern: reqData.pattern || '',
                        topic_id: reqData.topic_id || 0,
                        check_m: reqData.check_m || 0,
                        check_d: reqData.check_d || 0,
                        check_it_m: reqData.check_it_m || 0,
                        check_it_d: reqData.check_it_d || 0,
                        knowledge: reqData.knowledge || ''
                    });
                }
            }
        } catch (error) {
            console.error('Error:', error);
            setError(error instanceof Error ? error.message : "An error occurred");
        }
    }, [numericId]);

    // Add useEffect to fetch data
    useEffect(() => {
        if (isEditMode) {
            fetchRequestData();
        }
    }, [isEditMode, fetchRequestData]);

    useEffect(() => {
        const storedUserData = sessionStorage.getItem('userData');
        const storedAdmin = sessionStorage.getItem('admin');

        // console.log("Stored UserData:", storedUserData);
        // console.log("Stored Admin:", storedAdmin);

        if (storedUserData) {
            const userDataParsed = JSON.parse(storedUserData);
            setUserData(userDataParsed);
            // console.log("UserData:", userDataParsed);

            // Set default values from sessionStorage
            setSelectedDepartment({ key: userDataParsed.id_department, label: '' });
            setName(userDataParsed.name_employee);
        }

        if (storedAdmin) {
            setAdmin(storedAdmin);
            // console.log("Admin:", storedAdmin);
        }
    }, []);

    // Memoize complex calculations
    const isITStaff = useMemo(() => {
        if (!userData) return false;

        return Boolean(
            userData.id_section === 28 ||
            userData.id_division_competency === 86 ||
            userData.id_section_competency === 28
        );
    }, [userData]);

    const handleDepartmentChange = useCallback((department: DepartmentOption | null) => {
        setSelectedDepartment(department);
        setErrors(prev => ({ ...prev, department: '' }));
    }, []);

    const handleTypeChange = useCallback((typeId: number | null) => {
        setSelectedTypeId(typeId);
        if (typeId === null) {
            setSelectedTopicId(null);
            setSelectedSubtopicId(null);
            setDetails('');
        }
        setErrors(prev => ({ ...prev, typeId: '' }));
    }, []);

    const handleTopicChange = useCallback((topicId: number | null) => {
        setSelectedTopicId(topicId);
        if (topicId === null) {
            setSelectedSubtopicId(null);
            setDetails('');
        }
        setTitle('');
        setErrors(prev => ({ ...prev, topicId: '' }));
    }, []);

    const handleSubtopicChange = useCallback((subtopic: SubtopicOption | null) => {
        if (subtopic !== null) {
            setSelectedSubtopicId(subtopic.key);
            setSelectedSubtopic(subtopic);

            if (!isEditMode && subtopic.pattern) {
                setDetails(subtopic.pattern);
            }
            setErrors(prev => ({ ...prev, subtopicId: '' }));
        } else {
            setSelectedSubtopicId(null);
            setSelectedSubtopic(null);

            if (!isEditMode) {
                setDetails('');
            }
        }
    }, [isEditMode]);

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

                return `IT${dateCode}`; // Generate รหัสที่ไม่ซ้ำโดยเพิ่มเลข request ขึ้น 1
            } else {
                throw new Error('No data received from the API');
            }
        } catch (error) {
            console.error('Error generating code:', error);

            return getFallbackCode('IT');
        }
    }, []);


    const validateForm = useCallback(() => {
        const newErrors: { [key: string]: string } = {};

        if (!selectedDepartment) newErrors.department = 'กรุณาเลือกแผนก';
        if (!selectedTypeId) newErrors.typeId = 'กรุณาเลือกประเภทคำร้อง';
        if (!selectedTopicId) newErrors.topicId = 'กรุณาเลือกหัวข้อคำร้อง';
        if (!name) newErrors.name = 'กรุณากรอกชื่อ';
        if (!phone) newErrors.phone = 'กรุณากรอกเบอร์โทรศัพท์';
        if (!details || details.replace(/<[^>]*>/g, '').trim() === '') {
            newErrors.details = 'กรุณากรอกรายลเอียด';
        }

        if (selectedTypeId !== 3 && selectedSubtopic?.label === 'Other' && !title) {
            newErrors.title = 'กรุณากรอกหัวข้อคำร้อง';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [selectedDepartment, selectedTypeId, selectedTopicId, selectedSubtopicId, name, phone, details]);

    const handleSubmit = useCallback(async () => {
        if (!validateForm()) return;

        try {
            const formData = new FormData();

            const rsCodeToUse = isEditMode ? rsCode : await generateRsCode(selectedTypeId);

            // แปลงค่าให้เป็น string ก่อนส่ง
            formData.append('rs_code', rsCodeToUse);
            formData.append('id_department', selectedDepartment ? String(selectedDepartment.key) : '');
            formData.append('id_division', userData ? String(userData.id_division) : '');
            formData.append('id_section', userData ? String(userData.id_section) : '');
            formData.append('id_job_description', userData ? String(userData.id_job_description) : '');
            formData.append('id_division_competency', userData ? String(userData.id_division_competency) : '');
            formData.append('id_section_competency', userData ? String(userData.id_section_competency) : '');
            if (!isEditMode) {
                formData.append('user_req', userData ? userData.username : '');
            } else {
                formData.append('user_req', requestData?.user_req || '');
            }
            if (!isEditMode) {
                formData.append('position', userData ? userData.position : '');
            } else {
                formData.append('position', requestData?.position || '');
            }
            formData.append('name_req', name);
            formData.append('phone', phone);
            formData.append('type_id', selectedTypeId ? String(selectedTypeId) : '');
            formData.append('topic_id', selectedTopicId ? String(selectedTopicId) : '');
            formData.append('subtopic_id', selectedSubtopicId ? String(selectedSubtopicId) : '');
            if (selectedTypeId !== 3 && selectedSubtopic?.label === 'Other') {
                formData.append('title_req', title);
            } else {
                formData.append('title_req', '');
            }
            formData.append('detail_req', details);
            if (selectedTypeId === 3) {
                formData.append('id_program', selectedProgram ? String(selectedProgram.key) : '');
                if (selectedTypeId === 3 && selectedTopicId !== 2) {
                    formData.append('title_req', title);
                }
            } else {
                formData.append('id_program', '');
            }

            if (!isEditMode) {
                if (selectedTypeId !== 3) {
                    if (selectedSubtopic?.check_it_m === 1 && selectedSubtopic?.check_it_d === 0 || selectedSubtopic?.check_it_m === 1 && selectedSubtopic?.check_it_d === 1) {
                        formData.append('status_id', '2');
                    } else if (selectedSubtopic?.check_it_m === 0 && selectedSubtopic?.check_it_d === 1) {
                        formData.append('status_id', '3');
                    } else {
                        formData.append('status_id', '1');
                    }
                } else {
                    formData.append('status_id', '2');
                }
            }

            // จัดการกัคฟล์
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

            // Log formData เพื่อตรวจสอบ
            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }

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
    }, [isEditMode, rsCode, selectedDepartment, userData, name, phone, selectedTypeId, selectedTopicId, selectedSubtopicId, title, details, selectedProgram, uploadedFiles, validateForm, generateRsCode, navigate, id]);

    const clearForm = useCallback(() => {
        setSelectedDepartment(null);
        setSelectedTypeId(null);
        setSelectedTopicId(null);
        setSelectedSubtopicId(null);
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

    // Update the isReadOnly logic
    const isReadOnly = useMemo(() => {
        if (!isEditMode) return false;
        if (isEditMode) return true;

        // Allow editing for IT staff with specific status_id
        if (isITStaff && [5, 6].includes(status_id || 0)) {
            return false;
        }

        // Allow editing for managers/directors with specific status_id
        if (['m', 'd'].includes(userData?.position || '') && [2, 3].includes(status_id || 0)) {
            return false;
        }

        // Allow editing if status is pending (status_id = 1)
        if ((userData.type_id === 2 && status_id === 1) || (userData.type_id !== 2 && status_id === 2)) {
            return false;
        }

        // Allow editing for the original requester when status is 1 or when they're editing their own request
        if (userData?.username === rsCode?.split('/')[0]) {
            return false;
        }

        // Default to readonly for edit mode
        return isEditMode;
    }, [isEditMode, isITStaff, status_id, userData?.position, userData?.username, rsCode]);

    const handleAdminRecieve = useCallback(async () => {
        if (!numericId) return;

        try {
            let changeStatus;
            if (requestData?.type_id === 1 && requestData?.status_id === 4) {
                if (requestData?.check_it_m === 1) {
                    changeStatus = 'it_manager';
                } else if (requestData?.check_it_m === 0 && requestData?.check_it_d === 1) {
                    changeStatus = 'it_director';
                }
            } else if (requestData?.type_id === 2 && requestData?.status_id === 1) {
                changeStatus = 'todo';
            } else if (requestData?.type_id === 3 && requestData?.status_id === 4) {
                changeStatus = 'it_manager';
            }
            console.log(requestData?.type_id, requestData?.status_id, changeStatus);

            const response = await fetch(
                `${URLAPI}/change_status/${numericId}?change=${changeStatus}&username=${userData?.username}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" }
                }
            );

            if (!response?.ok) throw new Error("Network response was not ok");

            await Swal.fire({
                title: 'รับงานสำเร็จ!',
                icon: 'success',
                confirmButtonText: 'OK'
            });

            fetchRequestData();

        } catch (error) {
            Swal.fire({
                title: 'Error!',
                html: 'เกิดข้อผิดพลาดในการรับงาน',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    }, [numericId, userData?.username, requestData, fetchRequestData]);

    const handleITRecieve = useCallback(async () => {
        if (!numericId || !requestData?.date_estimate) {
            !requestData?.date_estimate && Swal.fire({
                title: 'Error!',
                html: 'กรุณากรอกวันที่ประมาณการ',
                icon: 'error',
                confirmButtonText: 'OK',
            });
            return;
        }

        try {
            // บันทึกวันที่เริ่มงาน
            const dateParams = new URLSearchParams({
                date_start: dayjs().format('YYYY-MM-DD')
            });

            await Promise.all([
                // บันทึกวันที่เริ่มงาน
                fetch(`${URLAPI}/datework/${numericId}?${dateParams.toString()}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                }),
                // เปลี่ยนสถานะงาน 
                fetch(`${URLAPI}/change_status/${numericId}?change=inprogress&username=${userData?.username}`, {
                    method: "PUT",
                    headers: { 'Content-Type': 'application/json' },
                })
            ]);

            Swal.fire({
                title: 'รับงานสำเร็จ!',
                icon: 'success',
                confirmButtonText: 'OK',
                customClass: {
                    title: 'alert-title',
                    confirmButton: 'alert-button'
                },
                buttonsStyling: false,
            });

            fetchRequestData();

        } catch (error) {
            console.error('Error fetching requests:', error);
            Swal.fire({
                title: 'Error!',
                html: 'เกิดข้อผิดพลาดในการรับงาน',
                icon: 'error',
                confirmButtonText: 'OK',
                customClass: {
                    title: 'alert-title',
                    confirmButton: 'alert-button'
                },
                buttonsStyling: false,
            });
        }
    }, [numericId, userData?.username, fetchRequestData, requestData]);

    const handleAddKnowledge = useCallback(() => {
        if (selectedSubtopic) {
            setSelectedSubtopic({ ...selectedSubtopic, knowledge: '' });
        }
    }, [selectedSubtopic]);

    const handleITConfirm = useCallback(async () => {
        if (!numericId) return;

        try {
            const response = await fetch(
                `${URLAPI}/change_status/${numericId}?change=confirm&username=${userData?.username}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" }
                }
            );

            if (!response.ok) throw new Error('Failed to fetch data from API');

            console.log('IT Confirm request:', await response.json());

            Swal.fire({
                title: 'ยืนยันการคอนฟิรมสำเร็จ!',
                icon: 'success',
                confirmButtonText: 'OK',
                customClass: {
                    title: 'alert-title',
                    confirmButton: 'alert-button'
                },
                buttonsStyling: false
            });

            fetchRequestData();

        } catch (error) {
            console.error('Error fetching requests:', error);
            Swal.fire({
                title: 'Error!',
                html: 'เกิดข้อผิดพลาดในการรับงาน',
                icon: 'error',
                confirmButtonText: 'OK',
                customClass: {
                    title: 'alert-title',
                    confirmButton: 'alert-button'
                },
                buttonsStyling: false
            });
        }
    }, [numericId, userData?.username, fetchRequestData]);

    const handleComplete = useCallback(async () => {
        if (!numericId) return;

        try {
            // เช็คคะแนนที่มีอยู่
            const response = await fetch(`${URLAPI}/rating_score/${numericId}`);
            if (!response.ok) throw new Error('Failed to fetch rating scores');
            const existingScores = await response.json();

            // เช็คคะแนนที่ต้องการทั้งหมด
            const ratingResponse = await fetch(`${URLAPI}/rating?type_id=${requestData?.type_id}`);
            if (!ratingResponse.ok) throw new Error('Failed to fetch rating options');
            const requiredRatings = await ratingResponse.json();

            // ถ้ายังไม่มีคะแนนเลย หรือคะแนนไม่ครบทุกหัวข้อ
            if (existingScores.length < requiredRatings.length) {
                setShowRating(true);
                return;
            }

            // เช็คว่ามีคะแนน 0 หรือ null หรือไม่
            const hasInvalidScore = existingScores.some((score: { score: number }) => !score.score);
            if (hasInvalidScore) {
                Swal.fire({
                    title: 'ไม่สามารถปิดงานได้',
                    text: 'กรุณาให้คะแนนให้ครบทุกหัวข้อ',
                    icon: 'warning',
                    confirmButtonText: 'ตกลง'
                });
                setShowRating(true);
                return;
            }

            // ถ้าผ่านการตรวจสอบทั้งหมด ทำการ change status
            const statusResponse = await fetch(
                `${URLAPI}/change_status/${numericId}?change=complete&username=${userData?.username}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                }
            );

            if (!statusResponse.ok) throw new Error('Failed to update status');

            Swal.fire({
                title: 'สำเร็จ!',
                icon: 'success',
                confirmButtonText: 'OK'
            });
            fetchRequestData();

        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                title: 'Error!',
                text: 'เกิดข้อผิดพลาดในการดำเนินการ',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    }, [numericId, userData?.username, requestData?.type_id, fetchRequestData]);

    const handleCloseRating = useCallback(() => {
        setShowRating(false);
    }, []);

    const handleRatingSubmit = useCallback(async () => {
        try {
            // เช็คคะแนนอีกครั้งหลังจากบันทึก
            const response = await fetch(`${URLAPI}/rating_score/${numericId}`);
            if (!response.ok) throw new Error('Failed to fetch rating scores');
            const existingScores = await response.json();

            const ratingResponse = await fetch(`${URLAPI}/rating?type_id=${requestData?.type_id}`);
            if (!ratingResponse.ok) throw new Error('Failed to fetch rating options');
            const requiredRatings = await ratingResponse.json();

            // ตรวจสอบว่าคะแนนครบทุกหัวข้อ
            if (existingScores.length < requiredRatings.length) {
                Swal.fire({
                    title: 'ไม่สามารถปิดงานได้',
                    text: 'กรุณาให้คะแนนให้ครบทุกหัวข้อ',
                    icon: 'warning',
                    confirmButtonText: 'ตกลง'
                });
                return;
            }

            // เช็คว่ามีคะแนน 0 หรือ null หรือไม่
            const hasInvalidScore = existingScores.some((score: { score: number }) => !score.score);
            if (hasInvalidScore) {
                Swal.fire({
                    title: 'ไม่สามารถปิดงานได้',
                    text: 'กรุณาให้คะแนนให้ครบทุกหัวข้อ',
                    icon: 'warning',
                    confirmButtonText: 'ตกลง'
                });
                return;
            }

            // ถ้าผ่านการตรวจสอบทั้งหมด ทำการ change status
            const statusResponse = await fetch(
                `${URLAPI}/change_status/${numericId}?change=complete&username=${userData?.username}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                }
            );

            if (!statusResponse.ok) throw new Error('Failed to update status');

            Swal.fire({
                title: 'ปิดงานสำเร็จ!',
                icon: 'success',
                confirmButtonText: 'OK'
            });
            fetchRequestData();

        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                title: 'Error!',
                text: 'เกิดข้อผิดพลาดในการดำเนินการ',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    }, [numericId, userData?.username, requestData?.type_id, fetchRequestData]);

    const handleReturn = useCallback(async () => {
        if (!numericId) return;

        try {
            const response = await fetch(
                `${URLAPI}/change_status/${numericId}?change=inprogress`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (!response.ok) {
                throw new Error('Failed to fetch data from API');
            }

            Swal.fire({
                title: 'คืนงานสำเร็จ!',
                icon: 'success',
                confirmButtonText: 'OK',
                customClass: {
                    title: 'alert-title',
                    confirmButton: 'alert-button'
                },
                buttonsStyling: false,
            });
            fetchRequestData();
        } catch (error) {
            console.error('Error fetching requests:', error);
            Swal.fire({
                title: 'Error!',
                html: 'เกิดข้อผิดพลาดในการคืนงาน',
                icon: 'error',
                confirmButtonText: 'OK',
                customClass: {
                    title: 'alert-title',
                    confirmButton: 'alert-button'
                },
                buttonsStyling: false,
            });
        }
    }, [numericId, userData?.username, fetchRequestData]);

    const handleScoreChange = (score: boolean) => {
        setUatScore(score);
    };

    const fetchRatingData = useCallback(async () => {
        if (!numericId || !requestData?.type_id) return;
        try {
            const [scoresRes, optionsRes] = await Promise.all([
                fetch(`${URLAPI}/rating_score/${numericId}`),
                fetch(`${URLAPI}/rating?type_id=${requestData.type_id}`)
            ]);

            if (scoresRes.ok && optionsRes.ok) {
                const scores = await scoresRes.json();
                const options = await optionsRes.json();
                setRatingScores(scores);
                setRatingOptions(options);
            }
        } catch (error) {
            console.error('Error fetching rating data:', error);
        }
    }, [numericId, requestData?.type_id]);

    useEffect(() => {
        fetchRatingData();
    }, [fetchRatingData]);

    return (
        <React.Fragment>
            <CssBaseline />
            <Container maxWidth="lg">
                {successAlert && <SaveAlert onClose={() => setSuccessAlert(false)} />}
                <Paper sx={{ width: '100%', padding: 2, boxShadow: 10 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography
                            sx={{
                                mt: 2,
                                mb: 2,
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
                            {isEditMode ? 'Request Edit' : 'Request Form'} : <span style={{ color: 'green' }}>{requestData?.rs_code}</span>
                        </Typography>
                        {/* Status */}
                        {isEditMode && (
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Chip
                                    label={requestData?.status_name}
                                    style={{
                                        backgroundColor: getStatusStyle(requestData?.status_name ?? '').backgroundColor,
                                        color: "#fff",
                                    }}
                                    size="medium"
                                    icon={
                                        requestData?.status_name === "Complete" ? (
                                            <CheckCircleIcon />
                                        ) : (
                                            <RadioButtonCheckedSharpIcon />
                                        )
                                    }
                                    sx={{

                                        color: "#fff",
                                        minWidth: '140px',
                                        height: '28px',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        '& .MuiChip-icon': {
                                            color: '#fff',
                                            marginLeft: '4px'
                                        },
                                        '& .MuiChip-label': {
                                            padding: '0 8px'
                                        },
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                        transition: 'transform 0.2s ease',
                                        '&:hover': {
                                            transform: 'translateY(-1px)',
                                            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                                        }
                                    }}
                                />
                            </Stack>
                        )}
                    </Box>

                    <hr />
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <Box sx={{ mt: 4 }}>
                                <SelectDepartment onDepartmentChange={handleDepartmentChange} initialValue={selectedDepartment} filterDepartments={false} />
                                {errors.department && <Typography color="danger">{errors.department}</Typography>}
                            </Box>
                            <NameInput
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                readOnly={isReadOnly}
                            />
                            {errors.name && <Typography color="danger">{errors.name}</Typography>}
                            <PhoneInput
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                readOnly={isReadOnly}
                            />
                            {errors.phone && <Typography color="danger">{errors.phone}</Typography>}
                            <Box sx={{ mt: 2 }}>
                                <FormLabel>ประเภท Request</FormLabel>
                                <SelectTypeRequest onSelectType={handleTypeChange} initialValue={selectedTypeId} />
                                {errors.typeId && <Typography color="danger">{errors.typeId}</Typography>}
                            </Box>
                            <Box sx={{ mt: 2 }}>
                                {(admin === 'ADMIN' || (userData?.position && (userData.position === 'm' || userData.position === 'd'))) && selectedTypeId !== 2 && (
                                    <>
                                        <BoxManagerApprove
                                            managerApprove={managerApprove || { name: '', status: '', req_id: '', m_name: '' }}
                                            id_division_competency={userData?.id_division_competency || 0}
                                            check_m={selectedSubtopic?.check_m || 0}
                                            check_d={selectedSubtopic?.check_d || 0}
                                            type_id={selectedTypeId}
                                        />

                                        <BoxDirectorApprove
                                            directorApprove={directorApprove || { name: '', status: '', req_id: '', m_name: '' }}
                                            m_name={managerApprove?.name ?? null}
                                            id_section_competency={userData?.id_section_competency || 0}
                                            check_m={selectedSubtopic?.check_m || 0}
                                            check_d={selectedSubtopic?.check_d || 0}
                                            type_id={selectedTypeId}
                                        />
                                    </>
                                )}
                            </Box>
                        </Grid>
                        <Grid item xs={8}>
                            <Box sx={{ mt: 4 }}>
                                <SelectTopic selectedTypeId={selectedTypeId} onSelectTopic={handleTopicChange} initialValue={selectedTopicId} />
                                {errors.topicId && <Typography color="danger">{errors.topicId}</Typography>}
                            </Box>

                            {selectedTypeId === 3 && selectedTopicId === 2 ? (
                                <>
                                    <Box sx={{ mt: 2 }}>
                                        <SelectProgram onProgramChange={handleProgramChange} initialValue={selectedProgram} />
                                    </Box>
                                </>
                            ) : (selectedTypeId === 1 || selectedTypeId === 2) && selectedTopicId !== null ? (
                                <>
                                    <Box sx={{ mt: 2 }}>
                                        <FormLabel>เรื่องที่ร้องขอ</FormLabel>
                                        <SelectSubtopic
                                            onSubtopicChange={handleSubtopicChange}
                                            initialValue={selectedSubtopic}
                                            selectedTopicId={selectedTopicId || 0}
                                        />
                                    </Box>
                                    {selectedSubtopic?.label === 'Other' && (
                                        <TitleInput
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                        />
                                    )}
                                </>
                            ) : (
                                <TitleInput
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            )}

                            <DetailsTextarea
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                placeholder={!isEditMode && selectedSubtopic?.pattern ? selectedSubtopic.pattern : 'กรุณากรอกรายลเอียด'}
                            />
                            {errors.details && <Typography color="danger">{errors.details}</Typography>}
                            <Fileupload onFilesChange={handleFilesChange} initialFiles={uploadedFiles} />
                            {errors.files && <Typography color="danger">{errors.files}</Typography>}
                        </Grid>
                    </Grid>

                    {requestData?.admin_recieve_username && (
                        <>
                            {((admin === 'ADMIN' && selectedTypeId !== 2) || (
                                userData?.position &&
                                (userData.position === 'm' || userData.position === 'd') &&
                                isITStaff && selectedTypeId !== 2
                            )) && (
                                    <>
                                        <Box sx={{
                                            backgroundColor: '#fff',
                                            padding: 2,
                                            borderRadius: 2,
                                            marginTop: 4,
                                            border: '1px dashed',
                                            borderColor: 'lightblue',
                                        }}>
                                            <Typography
                                                sx={{
                                                    mb: 2,
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
                                                    <BoxITManagerApprove
                                                        itmanagerApprove={{
                                                            name: itmanagerApprove?.name || null,
                                                            status: itmanagerApprove?.status || null,
                                                            req_id: itmanagerApprove?.req_id || null,
                                                            level_job: itmanagerApprove?.level_job || null
                                                        }}
                                                        id_division_competency={userData?.id_division_competency || 0}
                                                        it_m_note={itmanagerNote || null}
                                                        check_it_m={selectedSubtopic?.check_it_m || 0}
                                                        check_it_d={selectedSubtopic?.check_it_d || 0}
                                                        onLevelJobChange={(newLevelJob) => setLevelJob(newLevelJob)}
                                                        type_id={selectedTypeId}
                                                    />
                                                    <ITManagerTextarea
                                                        value={itmanagerNote}
                                                        onChange={(e) => setITManagerNote(e.target.value)}
                                                        readOnly={!(isITStaff && userData?.position === 'm')}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <BoxITDirectorApprove
                                                        itdirectorApprove={{
                                                            name: itdirectorApprove?.name || null,
                                                            status: itdirectorApprove?.status || null,
                                                            req_id: itdirectorApprove?.req_id || null,
                                                            level_job: itdirectorApprove?.level_job ?? null
                                                        }}
                                                        it_m_name={itmanagerApprove?.name ?? null}
                                                        id_section_competency={userData.id_section_competency || 0}
                                                        it_d_note={itdirectorNote || null}
                                                        levelJob={levelJob}
                                                        check_it_m={selectedSubtopic?.check_it_m || 0}
                                                        check_it_d={selectedSubtopic?.check_it_d || 0}
                                                        type_id={selectedTypeId}
                                                    />
                                                    <Box sx={{ mb: 8 }}>

                                                    </Box>

                                                    <ITDirectorTextarea
                                                        value={itdirectorNote}
                                                        onChange={(e) => setITDirectorNote(e.target.value)}
                                                        readOnly={!(isITStaff && userData?.position === 'd')}
                                                    />
                                                </Grid>

                                            </Grid>
                                        </Box>
                                    </>
                                )}
                            {(requestData?.status_id && ![1, 2, 3].includes(requestData.status_id)) && (
                                <Box
                                    sx={{
                                        backgroundColor: '#fff',
                                        padding: 2,
                                        borderRadius: 2,
                                        marginTop: 4,
                                        border: '1px dashed',
                                        borderColor: 'lightblue',
                                    }}
                                >
                                    <Typography
                                        sx={{
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
                                        Admin Assign
                                    </Typography>

                                    <Box sx={{ p: 1 }}>
                                        <Stack
                                            direction="row"
                                            spacing={2}
                                            alignItems="center"
                                            sx={{ mt: 2 }}
                                        >
                                            <Box>

                                                <Typography color="neutral" variant="plain" fontSize="0.75rem" mb={0.5}>
                                                    Tags
                                                </Typography>
                                                <Stack direction="row" spacing={1}>
                                                    <AssigneeDepSelector requestId={numericId} />
                                                </Stack>
                                            </Box>
                                        </Stack>

                                        <Stack
                                            direction="row"
                                            alignItems="center"
                                            spacing={4}
                                            sx={{
                                                p: 1,
                                                bgcolor: "#ffffff",
                                            }}
                                        >
                                            <Box>
                                                <DateWork
                                                    req_id={requestData?.id ?? 0}
                                                    date_start={requestData?.date_start ? new Date(requestData.date_start) : null}
                                                    date_end={requestData?.date_end ? new Date(requestData.date_end) : null}
                                                    date_estimate={requestData?.date_estimate ? new Date(requestData.date_estimate) : null}
                                                    onUpdateComplete={fetchRequestData}
                                                />
                                            </Box>

                                            <Box>
                                                <Typography color="neutral" variant="plain" fontSize="0.75rem" mb={0.5}>
                                                    Assignees
                                                </Typography>
                                                <Stack direction="row" spacing={1}>
                                                    <AssigneeEmpSelector
                                                        requestId={numericId}
                                                        typedata="main"
                                                    />
                                                </Stack>
                                            </Box>

                                            <Box>
                                                <Typography color="neutral" variant="plain" fontSize="0.75rem" mb={0.5}>
                                                    Priority
                                                </Typography>
                                                <SelectPriority
                                                    id={numericId}
                                                    id_priority={requestData?.id_priority ?? null}
                                                />
                                            </Box>
                                        </Stack>
                                    </Box>
                                </Box>
                            )}
                        </>
                    )}
                    {admin === "ADMIN" &&
                        // (([1, 3].includes(requestData?.type_id ?? 0) &&
                        // (status_id == 2 && (selectedSubtopic?.check_it_m === 1 && selectedSubtopic?.check_it_d === 0 ) 
                        // || (status_id == 3 && (selectedSubtopic?.check_it_m === 1 && selectedSubtopic?.check_it_d === 1) 
                        // || (selectedSubtopic?.check_it_m === 0 && selectedSubtopic?.check_it_d === 1)))) 
                        // || (requestData?.type_id === 2 && status_id == 1)) && (
                        (([1, 3].includes(requestData?.type_id ?? 0) && status_id == 4)
                            || (requestData?.type_id === 2 && status_id == 1)) && (
                            <Box sx={{ mt: 4 }}>
                                <Button
                                    color="primary"
                                    startDecorator={<SaveIcon />}
                                    onClick={() => {
                                        Swal.fire({
                                            title: 'ยืนยันการรับงาน',
                                            text: 'คุณต้องการรับงานนี้ใช่หรือไม่?',
                                            icon: 'question',
                                            showCancelButton: true,
                                            confirmButtonText: 'ใช่',
                                            cancelButtonText: 'ไม่',
                                            confirmButtonColor: '#3085d6',
                                            cancelButtonColor: '#d33'
                                        }).then((result) => {
                                            if (result.isConfirmed) {
                                                handleAdminRecieve();
                                            }
                                        });
                                    }}
                                >
                                    Admin Recieve
                                </Button>
                            </Box>
                        )}
                    {(status_id === 7 &&
                        (requestData?.type_id === 1 || requestData?.type_id === 2 || requestData?.type_id === 3)) &&
                        isITStaff &&
                        requestData?.date_estimate && // ใช้ requestData?.date_estimate
                        (
                            <Box sx={{ mt: 4 }}>
                                <Button
                                    color="primary"
                                    startDecorator={<SaveIcon />}
                                    onClick={() => {
                                        Swal.fire({
                                            title: 'ยืนยันการรับงาน',
                                            text: 'คุณต้องการรับงานนี้ใช่หรือไม่?',
                                            icon: 'question',
                                            showCancelButton: true,
                                            confirmButtonText: 'ใช่',
                                            cancelButtonText: 'ไม่',
                                            confirmButtonColor: '#3085d6',
                                            cancelButtonColor: '#d33'
                                        }).then((result) => {
                                            if (result.isConfirmed) {
                                                handleITRecieve();
                                            }
                                        });
                                    }}
                                >
                                    เจ้าหน้าที่ IT รับงาน
                                </Button>
                            </Box>
                        )}
                    {(status_id === 8 && (requestData?.type_id === 1 || requestData?.type_id === 2)) && (isITStaff) &&
                        requestData?.date_end && (
                            <Box sx={{ mt: 4 }}>
                                <Button
                                    color="success"
                                    startDecorator={<SaveIcon />}
                                    onClick={() => {
                                        Swal.fire({
                                            title: 'ยืนยันการคอนเฟิร์มงาน',
                                            text: 'คุณต้องการคอนเฟิร์มงานนี้ใช่หรือไม่?',
                                            icon: 'question',
                                            showCancelButton: true,
                                            confirmButtonText: 'ใช่',
                                            cancelButtonText: 'ไม่',
                                            confirmButtonColor: '#3085d6',
                                            cancelButtonColor: '#d33'
                                        }).then((result) => {
                                            if (result.isConfirmed) {
                                                handleITConfirm();
                                            }
                                        });
                                    }}
                                >
                                    เจ้าหน้าที่ Confirm งาน
                                </Button>
                            </Box>
                        )}
                    {!isITStaff && (requestData?.status_id === 9 || (uatScore === true && requestData?.status_id === 10)) && (
                        <Box sx={{ mt: 4 }}>
                            <Button
                                color="success"
                                sx={{ mr: 3 }}
                                startDecorator={<SaveIcon />}
                                onClick={() => {
                                    Swal.fire({
                                        title: 'ยืนยันการสำเร็จงาน',
                                        text: 'คุณต้องการสำเร็จงานนี้ใช่หรือไม่?',
                                        icon: 'question',
                                        showCancelButton: true,
                                        confirmButtonText: 'ใช่',
                                        cancelButtonText: 'ไม่',
                                        confirmButtonColor: '#3085d6',
                                        cancelButtonColor: '#d33'
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            handleComplete();
                                        }
                                    });
                                }}
                            >
                                Complete Job
                            </Button>
                            {requestData?.type_id !== 3 && (
                                <Button
                                    sx={{ mr: 3 }}
                                    color="danger"
                                    startDecorator={<SaveIcon />}
                                    onClick={() => {
                                        Swal.fire({
                                            title: 'ยืนยันการส่งแก้ไขงาน',
                                            text: 'คุณต้องการส่งแก้ไขงานนี้ใช่หรือไม่?',
                                            icon: 'question',
                                            showCancelButton: true,
                                            confirmButtonText: 'ใช่',
                                            cancelButtonText: 'ไม่',
                                            confirmButtonColor: '#3085d6',
                                            cancelButtonColor: '#d33'
                                        }).then((result) => {
                                            if (result.isConfirmed) {
                                                handleReturn();
                                            }
                                        });
                                    }}
                                >
                                    Edit Job
                                </Button>
                            )}
                        </Box>
                    )}

                    {/* ---------------------it employee must recieve task----------------------------- */}
                    {userData && (isITStaff) && requestData?.it_user_recieve && (
                        <>
                            {selectedSubtopic?.label !== 'Other' && selectedTypeId === 2 && (
                                <Box
                                    sx={{
                                        backgroundColor: '#fff',
                                        padding: 2,
                                        borderRadius: 2,
                                        marginTop: 4,
                                        border: '1px dashed',
                                        borderColor: 'lightblue',
                                    }}
                                >
                                    <Typography
                                        sx={{
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
                                        How To Solve This Problem
                                    </Typography>
                                    <DetailsTextarea
                                        value={selectedSubtopic?.knowledge || ''}
                                        onChange={(e) => {
                                            if (selectedSubtopic) {
                                                setSelectedSubtopic({
                                                    ...selectedSubtopic,
                                                    key: selectedSubtopic.key,
                                                    label: selectedSubtopic.label,
                                                    pattern: selectedSubtopic.pattern,
                                                    topic_id: selectedSubtopic.topic_id,
                                                    check_m: selectedSubtopic.check_m,
                                                    check_d: selectedSubtopic.check_d,
                                                    check_it_m: selectedSubtopic.check_it_m,
                                                    check_it_d: selectedSubtopic.check_it_d,
                                                    knowledge: e.target.value
                                                });
                                            }
                                        }}
                                        label=""
                                        placeholder="Enter knowledge details"
                                        readOnly={selectedSubtopic?.knowledge ? true : false}
                                    />
                                    {!selectedSubtopic?.knowledge && (
                                        <Button
                                            sx={{ mt: 2 }}
                                            color="primary"
                                            startDecorator={<SaveIcon />}
                                            onClick={() => {
                                                handleAddKnowledge();
                                            }}
                                        >
                                            Add Knowledge
                                        </Button>
                                    )}
                                </Box>
                            )}
                            <Box
                                sx={{
                                    backgroundColor: '#fff',
                                    padding: 2,
                                    borderRadius: 2,
                                    marginTop: 4,
                                    border: '1px dashed',
                                    borderColor: 'lightblue',
                                }}
                            >
                                <Typography
                                    sx={{


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
                                    Subtask
                                </Typography>

                                <Box sx={{ p: 1 }}>
                                    <SUBTASK req_id={requestData?.id ?? 0} />
                                </Box>
                            </Box>
                        </>
                    )
                    }
                    {requestData?.type_id === 3 && requestData?.it_user_recieve ? (
                        <Box
                            sx={{
                                backgroundColor: '#fff',
                                padding: 2,
                                borderRadius: 2,
                                marginTop: 4,
                                border: '1px dashed',
                                borderColor: 'lightblue',
                            }}
                        >
                            <Typography
                                sx={{
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
                                UAT
                            </Typography>

                            <Box sx={{ p: 1 }}>
                                <UAT
                                    id={requestData?.id ?? 0}
                                    username={userData.username}
                                    department={userData.id_department}
                                    status={requestData?.status_id ?? 0}
                                    onScoreChange={handleScoreChange}
                                    onUpdateComplete={fetchRequestData}
                                />
                            </Box>
                        </Box>
                    ) : null}
                    {ratingOptions.length > 0 && ratingScores.length > 0 && requestData?.status_id === 11 && (
                        <Box sx={{ mt: 4 }}>
                            <Card variant="outlined" sx={{ maxWidth: 1200 }}>
                                <Box sx={{ p: 2 }}>
                                    <Typography
                                        level="h4"
                                        gutterBottom
                                        sx={{
                                            borderBottom: '2px solid #1976d2',
                                            pb: 1,
                                            mb: 2,
                                            color: '#1976d2',
                                            fontWeight: 500
                                        }}
                                    >
                                        ผลการประเมินการให้บริการ
                                    </Typography>

                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                            p: 2,
                                            backgroundColor: '#f5f5f5',
                                            borderRadius: '4px 4px 0 0',
                                            borderBottom: '2px solid #1976d2',
                                            mb: 2
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                width: '80%',
                                                fontWeight: 600,
                                                color: '#1976d2'
                                            }}
                                        >
                                            หัวข้อการประเมิน
                                        </Typography>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                width: '20%',
                                                justifyContent: 'flex-end'
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontWeight: 600,
                                                    color: '#1976d2'
                                                }}
                                            >
                                                คะแนนการประเมิน
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Grid container spacing={2}>
                                        {ratingOptions.map((option, index) => {
                                            const score = ratingScores.find(s => s.id_rating === option.id_rating);
                                            return (
                                                <Grid item xs={12} key={option.id_rating}>
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 2,
                                                            p: 2,
                                                            backgroundColor: index % 2 === 0 ? '#f5f5f5' : 'white',
                                                            borderRadius: 1,
                                                            '&:hover': {
                                                                backgroundColor: '#e3f2fd'
                                                            },
                                                            border: '1px solid #e0e0e0',
                                                            mb: 1
                                                        }}
                                                    >
                                                        <Typography
                                                            sx={{
                                                                width: '80%',
                                                                fontWeight: 500,
                                                                color: '#424242'
                                                            }}
                                                        >
                                                            {option.rating_name}
                                                        </Typography>
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: 1,
                                                                width: '20%',
                                                                justifyContent: 'flex-end'
                                                            }}
                                                        >
                                                            <Rating
                                                                value={score?.score || 0}
                                                                readOnly
                                                                size="medium"
                                                                sx={{
                                                                    color: '#ffc107',
                                                                    '& .MuiRating-iconFilled': {
                                                                        filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.2))'
                                                                    }
                                                                }}
                                                            />
                                                            <Typography
                                                                level="body-sm"
                                                                sx={{
                                                                    color: '#757575',
                                                                    fontWeight: 500,
                                                                    ml: 1,
                                                                    minWidth: '45px'
                                                                }}
                                                            >
                                                                ({score?.score || 0}/5)
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </Grid>
                                            );
                                        })}
                                    </Grid>
                                </Box>
                            </Card>
                        </Box>
                    )}
                    <Grid item xs={12}>
                        <Box sx={{ my: 2, p: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            {
                                userData && (
                                    (
                                        // Condition 1: status_id = 2 and position is m or d and not type 2
                                        (status_id === 2 && ['m', 'd'].includes(userData?.position || '') && selectedTypeId !== 2) ||

                                        // Condition 2: status_id = 3 and position is d and not type 2
                                        (status_id === 3 && userData?.position === 'd' && selectedTypeId !== 2) ||

                                        // Condition 3: status_id = 4 and position is m or d and not type 2 and is IT staff
                                        (status_id === 5 && ['m', 'd'].includes(userData?.position || '') && selectedTypeId !== 2 && isITStaff) ||

                                        // Condition 4: status_id = 5 and position is d and not type 2 and is IT staff
                                        (status_id === 6 && userData?.position === 'd' && selectedTypeId !== 2 && isITStaff) ||

                                        // Condition 6: status_id = 1 or not in edit mode
                                        ((status_id === 1 || status_id === 13) || !isEditMode)
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
            <BasicRating
                req_id={numericId}
                type_id={requestData?.type_id || null}
                open={showRating}
                onClose={handleCloseRating}
                onSubmit={handleRatingSubmit}
            />
        </React.Fragment>
    );
}