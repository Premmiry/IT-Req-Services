import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { UserX, Users } from 'lucide-react';

interface NoUserProps {
    type: 'AD' | 'YH';
}

const NoUser: React.FC<NoUserProps> = ({ type }) => {
    const isAD = type === 'AD';

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
                    ไม่พบข้อมูลผู้ใช้
                </Typography>

                <Typography variant="h6" color="text.secondary" gutterBottom>
                    {isAD ? 'ไม่พบข้อมูลผู้ใช้ใน Active Directory' : 'ไม่พบข้อมูลผู้ใช้ในระบบ YH'}
                </Typography>

                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    {isAD
                        ? 'กรุณาตรวจสอบว่าผู้ใช้มีบัญชี Active Directory หรือลองค้นหาใหม่อีกครั้ง'
                        : 'กรุณาตรวจสอบว่าผู้ใช้มีบัญชีในระบบ YH หรือลองค้นหาใหม่อีกครั้ง'
                    }
                </Typography>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<Users />}
                        href="/"
                    >
                        กลับไปหน้ารายการผู้ใช้
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default NoUser;