import React, { useState, useEffect, ReactNode } from 'react';
import { Box, Paper, Checkbox, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Snackbar, Alert, TablePagination,
Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SelectDepartment from '../../Select/select-department';
import URLAPI from '../../../../URLAPI';
import { UserYanheeTable } from './UserYanheeTable';
import { styled } from '@mui/material/styles';

interface UserYanhee {
    phone: ReactNode;
    nickname: ReactNode;
    username: string;
    name_employee: string;
    code_employee: string;  
}

interface Employee {
    id_emp: number;
    username: string;
    emp_name: string;
    code_emp: string;
    phone: string;
    nickname: string;
    name_department: string;
}

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    borderRadius: theme.spacing(1),
    boxShadow: '0 3px 10px rgb(0 0 0 / 0.2)'
}));

const PageTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    marginBottom: theme.spacing(2),
    color: theme.palette.primary.main
}));

export default function EmployeeManagement() {
    const [selectedDepartment, setSelectedDepartment] = useState<any>(null);
    const [userYanheeData, setUserYanheeData] = useState<UserYanhee[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [phoneInputs, setPhoneInputs] = useState<{ [key: string]: string }>({});
    const [nicknameInputs, setNicknameInputs] = useState<{ [key: string]: string }>({});
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(5);
    const [checkdep, setCheckdep] = useState(true);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await fetch(`${URLAPI}/employee`);
            const data = await response.json();
            setEmployees(data);
            console.log("Employees Data:", data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    // เพิ่มฟังก์ชันสำหรับดึงข้อมูล User Yanhee
    const fetchUserYanhee = async (key: number) => {
        try {
            const response = await fetch(`${URLAPI}/user_yanhee?id_department=${key}`);
            const data = await response.json();
            
            // กรองข้อมูลที่ซ้ำกับ employees ออก
            const filteredData = data.filter((userYanhee: UserYanhee) => 
                !employees.some(emp => emp.username === userYanhee.username)
            );

            setUserYanheeData(filteredData.map((userYanhee: UserYanhee) => ({
                username: userYanhee.username,
                name_employee: userYanhee.name_employee,
                code_employee: userYanhee.code_employee,
                phone: '',
                nickname: ''
            })));
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };
    const fetchDelete = async (id_emp: number) => {
        try {
            const response = await fetch(`${URLAPI}/employee/${id_emp}`, { method: 'DELETE' });
            if(response.ok){
                setSnackbar({
                    open: true,
                    message: 'ลบข้อมูลสำเร็จ', 
                    severity: 'success'
                });
                setTimeout(() => {
                    setSnackbar(prev => ({...prev, open: false}));
                }, 3000);
                fetchEmployees();
            }
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'เกิดข้อผิดพลาดในการลบข้อมูล',
                severity: 'error'
            });
            setTimeout(() => {
                setSnackbar(prev => ({...prev, open: false}));
            }, 3000);
        }
    };


    // เพิ่มฟังก์ชันสำหรับบันทึกข้อมูล
    const handleSave = async () => {
        if (!selectedDepartment) {
            alert('กรุณาเลือกแผนก');
            return;
        }
        if (selectedUsers.length === 0) {
            alert('กรุณาเลือกผู้ใช้');
            return;
        }

        // ตรวจสอบค่าว่างของ phone และ nickname
        for (const username of selectedUsers) {
            if (!phoneInputs[username]?.trim()) {
                alert('กรุณากรอกเบอร์โทรศัพท์');
                return;
            }
            if (!nicknameInputs[username]?.trim()) {
                alert('กรุณากรอกชื่อเล่น');
                return;
            }
        }
        
        try {
            for (const username of selectedUsers) {
                const user = userYanheeData.find(u => u.username === username);
                if (user) {
                    
                    const employeeData = {
                        username: user.username,
                        emp_name: user.name_employee,
                        id_department: selectedDepartment?.key,
                        name_department: selectedDepartment?.label,
                        code_emp: user.code_employee,
                        phone: phoneInputs[username] || '',
                        nickname: nicknameInputs[username] || ''
                    };

                    // สร้าง URL parameters
                    const params = new URLSearchParams({
                        username: employeeData.username,
                        emp_name: employeeData.emp_name,
                        id_department: employeeData.id_department.toString(),
                        name_department: employeeData.name_department,
                        code_emp: employeeData.code_emp,
                        phone: employeeData.phone,
                        nickname: employeeData.nickname
                    });

                    const response = await fetch(`${URLAPI}/employee?${params.toString()}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' }
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        console.error('Error details:', errorData);
                        throw new Error(`Failed to save employee: ${JSON.stringify(errorData)}`);
                    }
                }
            }
            
            setSnackbar({
                open: true,
                message: 'บันทึกข้อมูลสำเร็จ',
                severity: 'success'
            });
            setTimeout(() => {
                setSnackbar(prev => ({...prev, open: false}));
            }, 3000);
            fetchEmployees();

            // เคลียร์ค่าหลังจากบันทึกสำเร็จ
            setSelectedUsers([]);
            setPhoneInputs({});
            setNicknameInputs({});
            
            // ดึงข้อมูล User Yanhee ใหม่
            if (selectedDepartment) {
                fetchUserYanhee(selectedDepartment.key);
            }
        } catch (error) {
            console.error('Error saving employee:', error);
            setSnackbar({
                open: true,
                message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล',
                severity: 'error'
            });
            setTimeout(() => {
                setSnackbar(prev => ({...prev, open: false}));
            }, 3000);
        }
    };

    function handleDelete(id_emp: number): void {
        fetchDelete(id_emp);
    }

    // เพิ่มฟังก์ชันจัดการ pagination
    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    function handleCheckboxChange(user: UserYanhee) {
        setSelectedUsers(prev => 
            prev.includes(user.username) 
                ? prev.filter(u => u !== user.username)
                : [...prev, user.username]
        );
    }
    const handleCheckdep = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCheckdep(e.target.checked);
    };

    // เพิ่ม useEffect เพื่อ refresh ข้อมูล User Yanhee เมื่อ employees มีการเปลี่ยนแปลง
    useEffect(() => {
        if (selectedDepartment) {
            fetchUserYanhee(selectedDepartment.key);
        }
    }, [employees]);

    const handleDepartmentChange = (department: any) => {
        setSelectedDepartment(department);
        if (department) {
            fetchUserYanhee(department.key);
        } else {
            setUserYanheeData([]); // เคลียร์ข้อมูลเมื่อไม่ได้เลือกแผนก
        }
    };

    return (
        <Box sx={{ p: 3, maxWidth: '1200px', margin: '0 auto' }}>
            <StyledPaper>
                <PageTitle variant="h5">EMPLOYEE CONFIGURATION</PageTitle>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Checkbox 
                        checked={checkdep} 
                        onChange={handleCheckdep}
                        sx={{ '&.Mui-checked': { color: '#1976d2' } }}
                    />
                    <SelectDepartment
                        onDepartmentChange={handleDepartmentChange}
                        initialValue={null}
                        filterDepartments={checkdep}
                    />
                </Box>

                <UserYanheeTable 
                    userYanheeData={userYanheeData}
                    selectedUsers={selectedUsers}
                    handleCheckboxChange={handleCheckboxChange}
                    phoneInputs={phoneInputs}
                    nicknameInputs={nicknameInputs}
                    setPhoneInputs={setPhoneInputs}
                    setNicknameInputs={setNicknameInputs}
                />

                <Button
                    variant="contained"
                    onClick={handleSave}
                    sx={{ 
                        mt: 2,
                        backgroundColor: '#2e7d32',
                        '&:hover': {
                            backgroundColor: '#1b5e20'
                        }
                    }}
                >
                    บันทึก
                </Button>
            </StyledPaper>

            {/* ตารางแสดงข้อมูล Employee */}
            <Paper sx={{ p: 2 , shadow: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Employee</Typography>
                <hr />
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>username</TableCell>
                                <TableCell>name</TableCell>
                                <TableCell>department</TableCell>
                                <TableCell>code</TableCell>
                                <TableCell>phone</TableCell>
                                <TableCell>nickname</TableCell>
                                <TableCell>actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {employees
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((employee) => (
                                    <TableRow key={employee.id_emp}>
                                        {/* แสดงข้อมูลของแต่ละแถว */}
                                        <TableCell>{employee.username}</TableCell>
                                        <TableCell>{employee.emp_name}</TableCell>
                                        <TableCell>{employee.name_department}</TableCell>
                                        <TableCell>{employee.code_emp}</TableCell>
                                        <TableCell>{employee.phone}</TableCell>
                                        <TableCell>{employee.nickname}</TableCell>
                                        <TableCell>
                                            <IconButton
                                                onClick={() => {
                                                    if (window.confirm('คุณต้องการลบเจ้าหน้าที่คนนี้ใช่หรือไม่?')) {
                                                        handleDelete(employee.id_emp);
                                                    }
                                                }}
                                            >
                                                <DeleteIcon sx={{ color: 'red' }} />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        component="div"
                        count={employees.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        rowsPerPageOptions={[10]}
                    />
                </TableContainer>
            </Paper>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            >
                <Alert severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}