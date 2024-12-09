import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, Tabs, Tab, TextField, 
    Button, styled, Paper 
} from '@mui/material';
import { Person as PersonIcon, Add as AddIcon } from '@mui/icons-material';
import URLAPI from '../../../../URLAPI';
import axios from 'axios';
import { Admin } from './admin.types';
import { AdminTable } from './AdminTable';
import { AdminDialog } from './AdminDialog';

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    borderRadius: theme.spacing(1),
    boxShadow: '0 3px 10px rgb(0 0 0 / 0.2)'
}));

const PageTitle = styled(Typography)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    color: theme.palette.primary.main,
    fontWeight: 600,
    marginBottom: theme.spacing(2),
    '& .MuiSvgIcon-root': {
        color: 'black'
    }
}));



const Administrator: React.FC = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [username, setUsername] = useState('');
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
    const [page, setPage] = useState(0);

    const fetchAdmins = async () => {
        try {
            const { data } = await axios.get(`${URLAPI}/admin`);
            setAdmins(data);
        } catch (error) {
            console.error('Error fetching admins:', error);
            alert('ไม่สามารถดึงข้อมูลผู้ดูแลระบบได้ กรุณาลองใหม่อีกครั้ง');
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const handleTabChange = (_e: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
        setPage(0);
    };

    const handleAddAdmin = async () => {
        if (!username.trim()) {
            alert('กรุณากรอกชื่อผู้ใช้');
            return;
        }

        try {
            const { data } = await axios.post(`${URLAPI}/admin/${username}`);
            alert(data.message);
            setUsername('');
            fetchAdmins();
        } catch (error) {
            console.error('Error adding admin:', error);
            alert('ไม่สามารถเพิ่มผู้ดูแลระบบได กรุณาลองใหม่อีกครั้ง');
        }
    };

    const handleDeleteAdmin = async (admin: Admin) => {
        
        try {
            const newDelFlag = admin.del_flag === 'N' ? 'Y' : 'N';
            const { data } = await axios.put(
                `${URLAPI}/admin/${admin.id_admin}`, 
                {}, 
                {
                    params: {
                        del_flag: newDelFlag
                    }
                }
            );
            
            alert(data.message);
            await fetchAdmins();
            setOpenDeleteDialog(false);
            setSelectedAdmin(null);
        } catch (error: any) {
            console.error('Error updating admin status:', error);
            alert(error.response?.data?.message || 'ไม่สามารถเปลี่ยนสถานะผู้ดูแลระบบได้ กรุณาลองใหม่อีกครั้ง');
        }
    };

    const filteredAdmins = admins.filter(admin =>
        activeTab === 0 ? admin.del_flag === 'N' : admin.del_flag === 'Y'
    );

    return (
        <Box sx={{ p: 3 }}>
            <StyledPaper>
                <PageTitle variant="h6">
                    ADMIN CONFIGURATION <PersonIcon />
                </PageTitle>
                <Box sx={{ 
                    display: 'flex', 
                    gap: 2, 
                    mb: 2,
                    alignItems: 'center' 
                }}>
                    <TextField
                        label="Username"
                        variant="outlined"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        size="small"
                        sx={{ flexGrow: 1 }}
                    />
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAddAdmin}
                        sx={{
                            backgroundColor: 'success.main',
                            '&:hover': {
                                backgroundColor: 'success.dark'
                            }
                        }}
                    >
                        เพิ่มผู้ดูแลระบบ
                    </Button>
                </Box>
            </StyledPaper>

            <StyledPaper>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    centered
                    sx={{
                        borderBottom: 1,
                        borderColor: 'divider',
                        mb: 2
                    }}
                >
                    <Tab label="เปิดใช้งาน" />
                    <Tab label="ปิดการใช้งาน" />
                </Tabs>

                <AdminTable 
                    admins={filteredAdmins}
                    page={page}
                    onPageChange={(_, newPage) => setPage(newPage)}
                    onStatusChange={(admin) => {
                        setSelectedAdmin(admin);
                        setOpenDeleteDialog(true);
                    }}
                />
            </StyledPaper>

            <AdminDialog 
                open={openDeleteDialog}
                admin={selectedAdmin}
                onClose={() => {
                    setOpenDeleteDialog(false);
                    setSelectedAdmin(null);
                }}
                onConfirm={handleDeleteAdmin}
            />
        </Box>
    );
};

export default Administrator;