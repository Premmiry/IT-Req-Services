import { Table, TableCell, TableRow, TableHead, TableContainer, TableBody, Checkbox, TextField, TablePagination } from "@mui/material";
import { UserYanhee } from "./employee.types";
import { Dispatch, SetStateAction, useState } from 'react';

interface UserYanheeTableProps {
    userYanheeData: UserYanhee[];
    selectedUsers: string[];
    handleCheckboxChange: (user: UserYanhee) => void;
    phoneInputs: { [key: string]: string };
    nicknameInputs: { [key: string]: string };
    setPhoneInputs: Dispatch<SetStateAction<{ [key: string]: string }>>;
    setNicknameInputs: Dispatch<SetStateAction<{ [key: string]: string }>>;
}

export const UserYanheeTable = ({ 
    userYanheeData = [],
    selectedUsers = [],
    handleCheckboxChange,
    phoneInputs = {},
    nicknameInputs = {},
    setPhoneInputs,
    setNicknameInputs
}: UserYanheeTableProps) => {
    const [page, setPage] = useState(0);
    const rowsPerPage = 5;

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handlePhoneChange = (username: string, value: string) => {
        if (!username || !setPhoneInputs) return;
        setPhoneInputs(prev => ({
            ...prev,
            [username]: value
        }));
    };

    const handleNicknameChange = (username: string, value: string) => {
        if (!username || !setNicknameInputs) return;
        setNicknameInputs(prev => ({
            ...prev,
            [username]: value
        }));
    };

    if (!Array.isArray(userYanheeData)) {
        return <div>ไม่พบข้อมูลผู้ใช้</div>;
    }

    return (
        <TableContainer>
            <Table sx={{ 
                mt: 2,
                '& .MuiTableCell-head': {
                    backgroundColor: '#f5f5f5',
                    fontWeight: 600
                }
            }}>
                <TableHead>
                    <TableRow>
                        <TableCell>username</TableCell>
                        <TableCell>name</TableCell>
                        <TableCell>phone</TableCell>
                        <TableCell>nickname</TableCell>
                        <TableCell>Select</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {userYanheeData
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((user) => {
                            if (!user || !user.username) return null;
                            
                            return (
                                <TableRow key={user.username}>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.name_employee}</TableCell>
                                    <TableCell>
                                        <TextField 
                                            value={phoneInputs[user.username] || ''}
                                            onChange={(e) => handlePhoneChange(user.username, e.target.value)}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField 
                                            value={nicknameInputs[user.username] || ''}
                                            onChange={(e) => handleNicknameChange(user.username, e.target.value)}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedUsers.includes(user.username)}
                                            onChange={() => handleCheckboxChange(user)}
                                        />
                                    </TableCell>
                                </TableRow>
                            );
                    })}
                </TableBody>
            </Table>
            <TablePagination
                component="div"
                count={userYanheeData.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[5]}
            />
        </TableContainer>
    );
}
