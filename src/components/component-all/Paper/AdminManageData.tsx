import * as React from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import GroupIcon from '@mui/icons-material/Group';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CategoryIcon from '@mui/icons-material/Category';
import Administrator from '../ManageData/Admin/Administrator';
import EmployeeManagement from '../ManageData/Employee/EmployeeManagement';
import Status from '../ManageData/Status/Status';
import TypeRequestComponent from '../ManageData/TTST/Type/TypeRequest';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import TypeMenu from '../ManageData/TTST/Type/TypeMenu';

const drawerWidth = 240;

const StyledDrawer = styled(Drawer)(() => ({
    '& .MuiDrawer-paper': {
        width: drawerWidth,
        position: 'absolute',
        height: '100%',
        backgroundColor: '#f5f5f5',
    },
}));

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
    open?: boolean;
}>(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    marginLeft: `-${drawerWidth}px`,
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

export default function AdminManageData() {
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [open] = React.useState(true);
    const [typeOpen, setTypeOpen] = React.useState(false);
    const [selectedTypeId, setSelectedTypeId] = React.useState<number | null>(null);

    const handleListItemClick = (_event: React.MouseEvent<HTMLDivElement>, index: number) => {
        if (index === 3) {
            setTypeOpen(!typeOpen);
        } else {
            setSelectedIndex(index);
            setSelectedTypeId(null);
        }
    };

    const handleTypeClick = (typeId: number) => {
        setSelectedTypeId(typeId);
        setSelectedIndex(3);
    };

    const menuItems = [
        { text: 'Administrator', icon: <AdminPanelSettingsIcon />, component: <Administrator /> },
        { text: 'Employee', icon: <GroupIcon />, component: <EmployeeManagement /> },
        { text: 'Status', icon: <AssignmentIcon />, component: <Status /> },
        { 
            text: 'Type', 
            icon: <CategoryIcon />, 
            component: <TypeRequestComponent typeId={selectedTypeId || undefined} />
        },
    ];

    return (
        <Box sx={{ 
            display: 'flex',
            position: 'relative',
            height: 'calc(100vh - 200px)',
            overflow: 'hidden'
        }}>
            <StyledDrawer variant="persistent" anchor="left" open={open}>
                <List>
                    {menuItems.map((item, index) => (
                        <React.Fragment key={item.text}>
                            <ListItem disablePadding>
                                <ListItemButton
                                    selected={selectedIndex === index && !selectedTypeId}
                                    onClick={(event) => handleListItemClick(event, index)}
                                >
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.text} />
                                    {index === 3 && (typeOpen ? <ExpandLess /> : <ExpandMore />)}
                                </ListItemButton>
                            </ListItem>
                            {index === 3 && (
                                <TypeMenu 
                                    open={typeOpen}
                                    selectedTypeId={selectedTypeId}
                                    onTypeClick={handleTypeClick}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </List>
            </StyledDrawer>
            <Main open={open}>
                <Box sx={{ p: 3, overflow: 'auto', height: '100%' }}>
                    {menuItems[selectedIndex].component}
                </Box>
            </Main>
        </Box>
    );
}