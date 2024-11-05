import React from 'react';
import { Box, Alert, AspectRatio, IconButton, Typography, LinearProgress } from '@mui/joy';
import { Check, Close } from '@mui/icons-material';

interface PopAlertProps {
    onClose: () => void;
    title: string;
    message: string;
}

// Base Alert Component
const PopAlert: React.FC<PopAlertProps> = ({ onClose, title, message }) => {
    return (
        <Box
            sx={{
                position: 'fixed',
                top: '1rem',
                right: '1rem',
                zIndex: 1300,
            }}
        >
            <Alert
                size="lg"
                color="success"
                variant="solid"
                invertedColors
                startDecorator={
                    <AspectRatio
                        variant="solid"
                        ratio="1"
                        sx={{
                            minWidth: 40,
                            borderRadius: '50%',
                            boxShadow: '0 2px 12px 0 rgb(0 0 0/0.2)',
                        }}
                    >
                        <div>
                            <Check />
                        </div>
                    </AspectRatio>
                }
                endDecorator={
                    <IconButton
                        variant="plain"
                        sx={{
                            '--IconButton-size': '32px',
                            transform: 'translate(0.5rem, -0.5rem)',
                        }}
                        onClick={onClose}
                    >
                        <Close />
                    </IconButton>
                }
                sx={{ alignItems: 'flex-start', overflow: 'hidden' }}
            >
                <div>
                    <Typography level="title-lg" sx={{ color: 'white' }}>{title}</Typography>
                    <Typography level="body-sm" sx={{ color: 'white' }}>
                        {message}
                    </Typography>
                </div>
                <LinearProgress
                    variant="solid"
                    color="success"
                    value={40}
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        borderRadius: 0,
                    }}
                />
            </Alert>
        </Box>
    );
};

// Preset Save Alert Component
export const SaveAlert: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <PopAlert 
        title="บันทึกสำเร็จ" 
        message="กรุณารอซักครู่..." 
        onClose={onClose}
    />
);

export const ErrorAlert: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <PopAlert 
        title="บันทึกไม่สำเร็จ" 
        message="กรุณารอซักครู่กำลังกลับไปหน้ารายการ..." 
        onClose={onClose}
    />
);

export const ApproveAlert: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <PopAlert 
        title="บันทึกผลการอนุมัติสำเร็จ" 
        message="กรุณารอซักครู่กำลังกลับไปหน้ารายการ..." 
        onClose={onClose}
    />
);

export default PopAlert;