import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab, Typography,styled } from '@mui/material';
import ListRequestIT from '../Table/List_Request_IT';
import AdminManageData from './AdminManageData';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
    role?: string;
    'aria-labelledby'?: string;
}

// Styled components with colors
const StyledTabs = styled(Tabs)(({ }) => ({
    borderBottom: 1,
    borderColor: 'divider',
    backgroundColor: '#2196f3', // สีฟ้าพื้นหลัง
    borderRadius: '4px 4px 0 0',
    '& .MuiTabs-indicator': {
        backgroundColor: '#ffffff', // สีขาวของแถบด้านล่าง
        height: 3
    },
}));

const StyledTab = styled(Tab)({
    textTransform: 'none',
    fontSize: '1rem',
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.7)', // สีขาวแบบโปร่งใสสำหรับแท็บที่ไม่ได้เลือก
    minHeight: '48px',
    padding: '12px 16px',
    '&.Mui-selected': {
        color: '#ffffff', // สีขาวสำหรับแท็บที่เลือก
        background: 'linear-gradient(180deg, #1976d2 0%, #2196f3 100%)', // gradient สีฟ้า
    },
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)', // สีขาวโปร่งใสเมื่อ hover
        opacity: 1,
    },
});

function TabPanel(props: TabPanelProps) {
    const { children, value, index, role, 'aria-labelledby': ariaLabelledby, ...other } = props;

    return (
        <div
            role={role || "tabpanel"}
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={ariaLabelledby || `tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box>
                    <Typography component="div">{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `tab-${index}`,
        'aria-controls': `tabpanel-${index}`,
    };
}

export default function RequestListIT() {
    const [value, setValue] = useState(0);
    const [admin, setAdmin] = useState<string | null>(null);

    useEffect(() => {
        const adminValue = sessionStorage.getItem('admin');
        setAdmin(adminValue);
    }, []);

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ 
            width: '100%',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            <Box 
                role="navigation" 
                aria-label="request tabs"
            >
                <StyledTabs 
                    value={value} 
                    onChange={handleChange}
                    aria-labelledby="request-tabs-label"
                >
                    <StyledTab 
                        label="Request Job" 
                        {...a11yProps(0)}
                        tabIndex={value === 0 ? 0 : -1}
                    />
                    <StyledTab 
                        label="Complete Job" 
                        {...a11yProps(1)}
                        tabIndex={value === 1 ? 0 : -1}
                    />
                    <StyledTab 
                        label="Cancel Job" 
                        {...a11yProps(2)}
                        tabIndex={value === 2 ? 0 : -1}
                    />
                    {admin === 'ADMIN' && (
                        <StyledTab 
                            label="Manage Data" 
                            {...a11yProps(3)}
                            tabIndex={value === 3 ? 0 : -1}
                        />
                    )}
                </StyledTabs>
            </Box>
            
            <TabPanel 
                value={value} 
                index={0}
                role="tabpanel"
                aria-labelledby={`tab-${0}`}
            >
                <ListRequestIT tab={1} />
            </TabPanel>
            <TabPanel 
                value={value} 
                index={1}
                role="tabpanel"
                aria-labelledby={`tab-${1}`}
            >
                <ListRequestIT tab={2} />
            </TabPanel>
            <TabPanel 
                value={value} 
                index={2}
                role="tabpanel"
                aria-labelledby={`tab-${2}`}
            >
                <ListRequestIT tab={3} />
            </TabPanel>
            {admin === 'ADMIN' && (
                <TabPanel 
                    value={value} 
                    index={3}
                    role="tabpanel"
                    aria-labelledby={`tab-${3}`}
                >
                    <AdminManageData />
                </TabPanel>
            )}
        </Box>
    );
}