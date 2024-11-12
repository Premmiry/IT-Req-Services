import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { UserX, Users, LogIn } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface NoUserProps {
    type: 'AD' | 'YH' | 'NO';
}

const NoUser: React.FC<NoUserProps> = ({ type }) => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const getMessage = () => {
        switch (type) {
            case 'AD':
                return {
                    title: 'ไม่พบข้อมูลผู้ใช้',
                    subtitle: 'ไม่พบข้อมูลผู้ใช้ใน Active Directory',
                    description: 'กรุณาตรวจสอบว่าผู้ใช้มีบัญชี Active Directory หรือลองค้นหาใหม่อีกครั้ง'
                };
            case 'YH':
                return {
                    title: 'ไม่พบข้อมูลผู้ใช้',
                    subtitle: 'ไม่พบข้อมูลผู้ใช้ในระบบ YH',
                    description: 'กรุณาตรวจสอบว่าผู้ใช้มีบัญชีในระบบ YH หรือลองค้นหาใหม่อีกครั้ง'
                };
            case 'NO':
                return {
                    title: 'กรุณาเข้าสู่ระบบ',
                    subtitle: 'คุณยังไม่ได้เข้าสู่ระบบ',
                    description: 'กรุณาเข้าสู่ระบบเพื่อเข้าถึงหน้านี้'
                };
            default:
                return {
                    title: 'เกิดข้อผิดพลาด',
                    subtitle: 'ไม่สามารถเข้าถึงหน้านี้ได้',
                    description: 'กรุณาลองใหม่อีกครั้ง'
                };
        }
    };

    const message = getMessage();

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '60vh',
                    textAlign: 'center',
                    gap: 3
                }}
            >
                <Box
                    sx={{
                        backgroundColor: 'error.light',
                        borderRadius: '50%',
                        p: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        animation: 'pulse 2s infinite',
                        '@keyframes pulse': {
                            '0%': {
                                transform: 'scale(1)',
                                opacity: 1
                            },
                            '50%': {
                                transform: 'scale(1.1)',
                                opacity: 0.8
                            },
                            '100%': {
                                transform: 'scale(1)',
                                opacity: 1
                            }
                        }
                    }}
                >
                    <UserX size={48} color="error" />
                </Box>

                <Typography variant="h4" component="h1" gutterBottom color="error">
                    {message.title}
                </Typography>

                <Typography variant="h6" color="text.secondary" gutterBottom>
                    {message.subtitle}
                </Typography>

                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    {message.description}
                </Typography>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<LogIn />}
                        onClick={() => navigate('/')}
                    >
                        เข้าสู่ระบบ
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default NoUser;