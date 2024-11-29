import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {  Box,  TextField,  Button,  Typography, Paper,  InputAdornment, keyframes } from '@mui/material'
import {  AccountCircle,  LockRounded,  LoginRounded } from '@mui/icons-material'
import URLAPI from '../../../URLAPI';

function Login() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [usernameError, setUsernameError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const navigate = useNavigate();

    // Create a dynamic gradient animation
    const gradientAnimation = keyframes`
        0% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0% 50%;
        }
    `;

    const validateAndSubmit = useCallback(async () => {
        setUsernameError("")
        setPasswordError("")

        if ("" === username) {
            setUsernameError("กรุณากรอกชื่อผู้ใช้")
            return
        }

        if ("" === password) {
            setPasswordError("กรุณากรอกรหัสผ่าน")
            return
        }

        try {
            const response = await fetch(`${URLAPI}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                setPasswordError("ไม่พบ ข้อมูลผู้ใช้ในระบบ กรุณาติดต่อ 57976 วิค , 57974 เปรม");
                navigate("/nouserad");
                return;
            }

            const data = await response.json();

            sessionStorage.setItem('loginAD', JSON.stringify(data));
            console.log("Login Data stored in sessionStorage:", data);
            
            if (data.status === "error") {
                navigate('/nouserad');
                return;
            }
            
            const userResponse = await fetch(`${URLAPI}/user_yanhee?user=${username}`, { method: 'GET' });

            if (!userResponse.ok) {
                navigate('/nouseryh');
                return;
            }

            const userData = await userResponse.json();

            if (userData === null) {
                navigate('/nouseryh');
            } else {
                sessionStorage.setItem('userData', JSON.stringify(userData));
                console.log("User Data stored in sessionStorage:", userData);

                // ตรวจสอบ admin
                const adminResponse = await fetch(`${URLAPI}/admin?user=${username}`, { method: 'GET' });

                if (adminResponse.ok) {
                    const adminData = await adminResponse.json();
                    sessionStorage.setItem('admin', (adminData && adminData.length > 0) ? 'ADMIN' : 'USER');
                } else {
                    sessionStorage.setItem('admin', 'USER');
                }
                
                if (userData.id_section === 28 || userData.id_division_competency === 86 || userData.id_section_competency === 28) {
                    navigate('/request-list-it');
                }
                else {
                    navigate('/request-list');
                }
            }
        } catch (error) {
            setPasswordError("ไม่พบ ข้อมูลผู้ใช้ในระบบ กรุณาติดต่อ 57976 วิค , 57974 เปรม");
            navigate("/nouserad");
        }
    }, [username, password, navigate]);

    const handleKeyPress = useCallback((event: any) => {
        if (event.key === 'Enter') {
            validateAndSubmit();
        }
    }, [validateAndSubmit]);

    return (
        <Box 
            sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                background: 'linear-gradient(135deg, #2196F3, #4FC3F7, #81D4FA, #B3E5FC)',
                backgroundSize: '400% 400%',
                animation: `${gradientAnimation} 15s ease infinite`,
            }}
        >
            <Paper 
                elevation={10} 
                sx={{ 
                    padding: 4, 
                    borderRadius: 3,
                    width: '100%',
                    maxWidth: '400px',
                    background: 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                        transform: 'scale(1.02)'
                    }
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography 
                        component="h1" 
                        variant="h4" 
                        sx={{ 
                            mb: 3, 
                            fontWeight: 'bold', 
                            color: '#1976D2',
                            textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                            letterSpacing: '0.5px'
                        }}
                    >
                        IT-Request Login
                    </Typography>
                    <Box 
                        component="form" 
                        noValidate 
                        sx={{ width: '100%' }}
                        onKeyDown={handleKeyPress}
                    >
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            value={username}
                            onChange={(ev) => setUsername(ev.target.value)}
                            error={!!usernameError}
                            helperText={usernameError}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountCircle color="primary" />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    '&:hover fieldset': {
                                        borderColor: 'primary.main',
                                    },
                                },
                            }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(ev) => setPassword(ev.target.value)}
                            error={!!passwordError}
                            helperText={passwordError}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockRounded color="primary" />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    '&:hover fieldset': {
                                        borderColor: 'primary.main',
                                    },
                                },
                            }}
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={validateAndSubmit}
                            endIcon={<LoginRounded />}
                            sx={{
                                mt: 3, 
                                mb: 2, 
                                py: 1.5,
                                borderRadius: 2,
                                background: 'linear-gradient(to right, #2196F3, #4FC3F7)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-3px)',
                                    boxShadow: '0 4px 17px rgba(0, 0, 0, 0.2)',
                                    background: 'linear-gradient(to right, #1E88E5, #2196F3)',
                                }
                            }}
                        >
                            เข้าสู่ระบบ
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    )
}

export default Login