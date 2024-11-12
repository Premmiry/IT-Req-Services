import * as React from 'react';
import { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate, NavigateFunction } from 'react-router-dom';

interface UserData {
  username: string;
  code_employee: string;
  position: string;
  name_employee: string;
  id_department: number;
  id_division: number;
  id_section: number;
  name_job_description: string;
}

function Navbar() {
  // const navigate = useNavigate();
  const navigate: NavigateFunction = useNavigate();
  const [userData, setUserData] = useState<any | null>(null);
  const [admin, setAdmin] = useState<string | null>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
      useEffect(() => {
        const storedUserData = sessionStorage.getItem('userData');
        const storedAdmin = sessionStorage.getItem('admin');

        console.log("Stored UserData:", storedUserData);
        console.log("Stored Admin:", storedAdmin);

        if (storedUserData) {
            const userDataParsed = JSON.parse(storedUserData);
            setUserData(userDataParsed);
            console.log("UserData:", userDataParsed);
            

        }

        if (storedAdmin) {
            setAdmin(storedAdmin);
            console.log("Admin:", storedAdmin);
        }
    }, []);

    // Call fetchRequests when userData or admin changes
    useEffect(() => {
        if (userData && admin) {

        } else {
            console.log("UserData or department is not set. Aborting fetch.");
        }
    }, [userData, admin]);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('userData'); // ลบข้อมูล session
    setUserData(null);
    handleCloseUserMenu();
    // เพิ่ม logic การ redirect ไปหน้า login หรือหน้าอื่นๆ ตามต้องการ
    navigate('/');
    
  };

  // ฟังก์ชันสำหรับแสดงชื่อย่อของผู้ใช้
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase();
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LOGO
          </Typography>

          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LOGO
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          {userData ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* แสดงชื่อพนักงานบนหน้าจอขนาดกลาง-ใหญ่ */}
              <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
                <PersonIcon sx={{ fontSize: 20 }} />
                <Typography>
                  {userData.name_employee}
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                  ({userData.name_job_description})
                </Typography>
              </Box>
              
              <Box>
                <Tooltip title="เมนูผู้ใช้งาน">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar sx={{ bgcolor: 'secondary.main' }}>
                      {getInitials(userData.name_employee.replace('คุณ', ''))}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {/* แสดงข้อมูลผู้ใช้ในเมนู (สำหรับหน้าจอขนาดเล็ก) */}
                  <Box sx={{ display: { md: 'none' }, px: 2, py: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {userData.name_employee}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {userData.name_job_description}
                    </Typography>
                  </Box>
                  
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon sx={{ mr: 1 }} />
                    <Typography>ออกจากระบบ</Typography>
                  </MenuItem>
                </Menu>
              </Box>
            </Box>
          ) : null}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;