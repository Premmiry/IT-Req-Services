import React, { useEffect, useState } from 'react';
import { 
    Paper, 
    Typography, 
    IconButton, 
    TextField,
    Box,
    Snackbar,
    Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { TypeRequest } from './types';
import URLAPI from '../../../../../URLAPI';
import TopicManager from '../Topic/TopicManager';

interface TypeRequestComponentProps {
    typeId?: number;
}

export default function TypeRequestComponent({ typeId }: TypeRequestComponentProps) {
    const [typeData, setTypeData] = useState<TypeRequest | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedDescription, setEditedDescription] = useState('');
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });

    useEffect(() => {
        const fetchTypeData = async () => {
            if (typeId) {
                try {
                    const response = await fetch(`${URLAPI}/treqs?typeid=${typeId}`);
                    const data = await response.json();
                    setTypeData(data[0]);
                    setEditedDescription(data[0]?.description || '');
                } catch (error) {
                    console.error('Error fetching type data:', error);
                }
            }
        };
        fetchTypeData();
    }, [typeId]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedDescription(typeData?.description || '');
    };

    const handleSave = async () => {
        if (!typeData) return;

        try {
            const response = await fetch(`${URLAPI}/treqs/${typeData.type_id}?type_name=${typeData.type_name}&description=${editedDescription}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                setTypeData({
                    ...typeData,
                    description: editedDescription
                });
                setIsEditing(false);
                setSnackbar({
                    open: true,
                    message: 'Description updated successfully',
                    severity: 'success'
                });
            } else {
                throw new Error('Failed to update');
            }
        } catch (error) {
            console.error('Error updating description:', error);
            setSnackbar({
                open: true,
                message: 'Failed to update description',
                severity: 'error'
            });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Paper sx={{ p: 2 }}>
            <Typography variant="h6">
                {typeData ? `Type: ${typeData.type_name}` : 'Type Request'}
            </Typography>
            
            {typeData && (
                <Box sx={{ 
                    mt: 2,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1
                }}>
                    <Box sx={{ flexGrow: 1 }}>
                        {isEditing ? (
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                value={editedDescription}
                                onChange={(e) => setEditedDescription(e.target.value)}
                                variant="outlined"
                                size="small"
                            />
                        ) : (
                            <Typography variant="body1">
                                Description: {typeData.description}
                            </Typography>
                        )}
                    </Box>
                    <Box>
                        {isEditing ? (
                            <>
                                <IconButton 
                                    onClick={handleSave}
                                    color="primary"
                                    size="small"
                                >
                                    <SaveIcon />
                                </IconButton>
                                <IconButton 
                                    onClick={handleCancel}
                                    color="error"
                                    size="small"
                                >
                                    <CancelIcon />
                                </IconButton>
                            </>
                        ) : (
                            <IconButton 
                                onClick={handleEdit}
                                color="primary"
                                size="small"
                            >
                                <EditIcon />
                            </IconButton>
                        )}
                    </Box>
                </Box>
            )}

            {typeData && (
                <Box sx={{ mt: 3 }}>
                    <TopicManager typeId={typeId} />
                </Box>
            )}

            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={6000} 
                onClose={handleCloseSnackbar}
            >
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Paper>
    );
}
    
