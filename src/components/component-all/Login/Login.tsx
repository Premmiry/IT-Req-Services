import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, TextField, Button, Typography, Container, Paper } from '@mui/material'
import URLAPI from '../../../URLAPI';
function Login() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [usernameError, setUsernameError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const navigate = useNavigate();

    const onButtonClick = async () => {
        setUsernameError("")
        setPasswordError("")

        if ("" === username) {
            setUsernameError("Please enter your Username")
            return
        }

        if ("" === password) {
            setPasswordError("Please enter a password")
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
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            sessionStorage.setItem('loginAD', JSON.stringify(data));

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
            // console.error("Error fetching data:", error);
            setPasswordError("ไม่พบ ข้อมูลผู้ใช้ในระบบ กรุณาติดต่อ 57976 วิค , 57974 เปรม"); // แจ้งให้ผู้ใช้ทราบว่ามีข้อผิดพลาด
            navigate("/nouserad");
        }
    }

    return (
        <Container maxWidth="xs" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <Paper sx={{ padding: 2, boxShadow: 10 }}>
                <Box
                    sx={{
                        marginTop: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Login ระบบ IT-Request
                    </Typography>
                    <Box component="form" noValidate sx={{ mt: 1 }}>
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
                        />
                        <Button
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={onButtonClick}
                        >
                            Submit
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    )
}

export default Login