import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography, styled, useTheme } from '@mui/material';
import ListRequestIT from '../Table/List_Request_IT';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const StyledTabs = styled(Tabs)(({ theme }) => ({
    borderBottom: '1px solid',
    borderColor: theme.palette.divider,
    backgroundColor: theme.palette.primary.main,
    borderRadius: '8px 8px 0 0',
    '& .MuiTabs-indicator': {
        backgroundColor: theme.palette.common.white,
        height: 4,
    },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
    textTransform: 'none',
    fontSize: '1rem',
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.7)',
    minHeight: '48px',
    padding: '12px 16px',
    '&.Mui-selected': {
        color: theme.palette.common.white,
        background: `linear-gradient(180deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
    },
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
}));

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box
                    sx={{
                        padding: 2,
                        border: '1px solid rgba(0, 0, 0, 0.1)',
                        borderRadius: 2,
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'dark' ? '#424242' : '#f9f9f9',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        animation: 'fadeIn 0.4s ease-in-out',
                    }}
                >
                    <Typography component="div" sx={{ fontSize: '1rem', color: '#333' }}>
                        {children}
                    </Typography>
                </Box>
            )}
        </div>
    );
}

const fadeInAnimation = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

const GlobalStyle = styled('style')(() => ({
    '@global': {
        ...fadeInAnimation,
    },
}));

function a11yProps(index: number) {
    return {
        id: `tab-${index}`,
        'aria-controls': `tabpanel-${index}`,
    };
}

export default function RequestListIT() {
    const [value, setValue] = useState(0);
    const theme = useTheme();

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box
            sx={{
                width: '100%',
                backgroundColor: theme.palette.background.paper,
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                borderRadius: 2,
            }}
        >
            <GlobalStyle />
            <Box>
                <StyledTabs value={value} onChange={handleChange} aria-label="request tabs">
                    <StyledTab label="Request Job" {...a11yProps(0)} />
                    <StyledTab label="Complete Job" {...a11yProps(1)} />
                    <StyledTab label="Cancel Job" {...a11yProps(2)} />
                </StyledTabs>
            </Box>
            <TabPanel value={value} index={0}>
                <ListRequestIT tab={1} />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <ListRequestIT tab={2} />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <ListRequestIT tab={3} />
            </TabPanel>
        </Box>
    );
}
