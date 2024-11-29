import React, { useState, useEffect, useMemo } from 'react';
import { 
    Box,
    IconButton,
    Popover,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    Divider
} from '@mui/material';
import URLAPI from '../../../URLAPI';
import CloseIcon from '@mui/icons-material/Close';
import FlagIcon from '@mui/icons-material/Flag';
import ClearIcon from '@mui/icons-material/Clear';

interface PriorityOption {
    id_priority: number;
    name_priority: string;
}

interface PriorityProps {
    id: number;
    id_priority: number | null;
    readOnly?: boolean;
}

const priorityConfig = {
    'Urgent': { color: '#d32f2f', icon: <FlagIcon sx={{ color: '#d32f2f' }} /> },
    'High': { color: '#f57c00', icon: <FlagIcon sx={{ color: '#f57c00' }} /> },
    'Normal': { color: '#1976d2', icon: <FlagIcon sx={{ color: '#1976d2' }} /> },
    'Low': { color: '#757575', icon: <FlagIcon sx={{ color: '#757575' }} /> },
};

const usePriorityOptions = () => {
    const [priorityOptions, setPriorityOptions] = useState<PriorityOption[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userData, setUserData] = useState<any | null>(null);

    const isITStaff = useMemo(() => {
        return userData?.id_section === 28 ||
            userData?.id_division_competency === 86 ||
            userData?.id_section_competency === 28;
    }, [userData]);

    useEffect(() => {
        const fetchPriorities = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${URLAPI}/priorities`);
                if (!response.ok) {
                    throw new Error('Failed to fetch priorities');
                }
                const data = await response.json();
                setPriorityOptions(data);
            } catch (error) {
                console.error('Error:', error);
                setError('Failed to load priorities');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPriorities();

        // ดึงข้อมูลผู้ใช้จาก sessionStorage
        const storedUserData = sessionStorage.getItem('userData');
        if (storedUserData) {
            setUserData(JSON.parse(storedUserData));
        }
    }, []);

    return { priorityOptions, isLoading, error, isITStaff };
};

export const SelectPriority: React.FC<PriorityProps> = ({ id, id_priority, readOnly = false }) => {
    const { priorityOptions, isLoading, error, isITStaff } = usePriorityOptions();
    const [selectedPriority, setSelectedPriority] = useState<PriorityOption | null>(null);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    useEffect(() => {
        if (id_priority && priorityOptions.length > 0) {
            const priority = priorityOptions.find(p => p.id_priority === id_priority);
            setSelectedPriority(priority || null);
        }
    }, [id_priority, priorityOptions]);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        if (!readOnly && isITStaff) {
            setAnchorEl(event.currentTarget);
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handlePrioritySelect = async (priority: PriorityOption | null) => {
        setSelectedPriority(priority);
        handleClose();
    
        try {
            const url = priority 
                ? `${URLAPI}/priority/${id}?id_priority=${priority.id_priority}`
                : `${URLAPI}/priority/${id}`;
    
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (!response.ok) {
                const errorMessage = await response.text();
                console.error('Error:', errorMessage);
                alert(`Error: ${errorMessage}`);
                return;
            }
    
            const updatedData = await response.json();
            console.log('อัปเดตลำดับความสำคัญเรียบร้อยแล้ว:', updatedData);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const open = Boolean(anchorEl);

    return (
        <Box>
            {/* Selected Priority Display */}
            <Box
                onClick={handleClick}
                sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    cursor: readOnly || !isITStaff ? 'default' : 'pointer',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: selectedPriority ? '#f5f5f5' : 'transparent',
                    '&:hover': {
                        backgroundColor: readOnly || !isITStaff ? 'transparent' : '#f0f0f0'
                    }
                }}
            >
                <FlagIcon 
                    sx={{ 
                        color: selectedPriority 
                            ? priorityConfig[selectedPriority.name_priority as keyof typeof priorityConfig]?.color 
                            : '#757575',
                        fontSize: '20px'
                    }} 
                />
                <Typography variant="body2">
                    {selectedPriority?.name_priority || 'Priority'}
                </Typography>
                {selectedPriority && !readOnly && isITStaff && (
                    <IconButton
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            handlePrioritySelect(null);
                        }}
                    >
                        <CloseIcon sx={{ fontSize: '16px' }} />
                    </IconButton>
                )}
            </Box>

            {/* Dropdown Menu */}
            {isITStaff && (
                <Popover
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    PaperProps={{
                        sx: {
                            width: '200px',
                            mt: 1,
                            boxShadow: '0px 2px 8px rgba(0,0,0,0.15)',
                        }
                    }}
                >
                    <List sx={{ p: 0 }}>
                        {priorityOptions.map((option) => (
                            <ListItemButton
                                key={option.id_priority}
                                onClick={() => handlePrioritySelect(option)}
                                selected={selectedPriority?.id_priority === option.id_priority}
                                sx={{
                                    '&:hover': {
                                        backgroundColor: '#f5f5f5'
                                    },
                                    '&.Mui-selected': {
                                        backgroundColor: '#f0f0f0',
                                        '&:hover': {
                                            backgroundColor: '#e0e0e0'
                                        }
                                    }
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 36 }}>
                                    {priorityConfig[option.name_priority as keyof typeof priorityConfig]?.icon}
                                </ListItemIcon>
                                <ListItemText primary={option.name_priority} />
                            </ListItemButton>
                        ))}
                        <Divider />
                        <ListItemButton
                            onClick={() => handlePrioritySelect(null)}
                            sx={{
                                '&:hover': {
                                    backgroundColor: '#f5f5f5'
                                }
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 36 }}>
                                <ClearIcon />
                            </ListItemIcon>
                            <ListItemText primary="Clear" />
                        </ListItemButton>
                    </List>
                </Popover>
            )}
        </Box>
    );
};

export default SelectPriority;