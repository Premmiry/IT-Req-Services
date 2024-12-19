import React, { useState, useEffect, useCallback } from 'react';
import {  Dialog,  DialogTitle,  DialogContent,  DialogActions,  TextField,  Button, Box,  FormControlLabel,  Checkbox,  Typography,  Alert } from '@mui/material';
import { DetailsTextarea } from '../../../Input/input-requestform';
import URLAPI from '../../../../../URLAPI';
import { styled } from '@mui/material/styles';

interface SubTopicDialogProps {
    open: boolean;
    onClose: () => void;
    topic_id: number;
    onSave: () => void;
    isEditMode?: boolean;
    subtopicId?: number;
}

interface SubTopic {
    subtopic_id: number;
    subtopic_name: string;
    pattern: string;
    topic_id: number;
    check_m: number;
    check_d: number;
    check_it_m: number;
    check_it_d: number;
    knowledge: string;
}

interface CheckboxField {
    key: keyof Pick<SubTopic, 'check_m' | 'check_d' | 'check_it_m' | 'check_it_d'>;
    label: string;
}

const StyledDialog = styled(Dialog)({
    '& .MuiDialog-paper': {
        margin: '16px',
        width: '100%',
        maxWidth: '800px'
    }
});

const StyledDialogContent = styled(DialogContent)({
    padding: '16px'
});

const SubTopicDialog: React.FC<SubTopicDialogProps> = ({
    open,
    onClose,
    topic_id,
    onSave,
    isEditMode = false,
    subtopicId,
}) => {
    const [subTopics, setSubTopics] = useState<SubTopic[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [editedSubTopic, setEditedSubTopic] = useState<SubTopic | null>(null);

    const checkboxFields: CheckboxField[] = [
        { key: 'check_m', label: 'Manager Approval' },
        { key: 'check_d', label: 'Director Approval' },
        { key: 'check_it_m', label: 'IT Manager Approval' },
        { key: 'check_it_d', label: 'IT Director Approval' }
    ];

    const fetchSubTopics = useCallback(async (): Promise<void> => {
        if (!topic_id) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const url = `${URLAPI}/subtopic/${topic_id}${subtopicId ? `?subtopic_id=${subtopicId}` : ''}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error('Failed to fetch subtopics');
            }
            
            const data = await response.json();
            setSubTopics(data);
        } catch (error) {
            console.error('Error:', error);
            setError(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, [topic_id, subtopicId]);

    const handleUpdateSubTopic = async (): Promise<void> => {
        if (!editedSubTopic || !subtopicId) return;
        
        setLoading(true);
        try {
            const response = await fetch(`${URLAPI}/subtopic/${subtopicId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedSubTopic),
            });

            if (!response.ok) {
                throw new Error('Failed to update subtopic');
            }

            onSave();
            onClose();
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to update subtopic');
        } finally {
            setLoading(false);
        }
    };

    const handleAddSubTopic = async (): Promise<void> => {
        if (!editedSubTopic || !topic_id) return;
        
        setLoading(true);
        try {
            const response = await fetch(`${URLAPI}/subtopic/${topic_id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    subtopic_name: editedSubTopic.subtopic_name,
                    pattern: editedSubTopic.pattern,
                    topic_id,
                    check_m: editedSubTopic.check_m,
                    check_d: editedSubTopic.check_d,
                    check_it_m: editedSubTopic.check_it_m,
                    check_it_d: editedSubTopic.check_it_d,
                    knowledge: editedSubTopic.knowledge,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create subtopic');
            }

            onSave();
            onClose();
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to create subtopic');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = useCallback((field: keyof SubTopic, value: string | number): void => {
        setEditedSubTopic(prev => prev ? {
            ...prev,
            [field]: value
        } : null);
    }, []);

    const handleInputChange2 = useCallback((field: keyof SubTopic, value: string | number): void => {
        setEditedSubTopic(prev => prev ? {
            ...prev,
            [field]: value
        } : null);
    }, []);

    useEffect(() => {
        if (open && topic_id && subtopicId && isEditMode) {
            fetchSubTopics();
        }
        return () => {
            setSubTopics([]);
            setError(null);
        };
    }, [open, topic_id, subtopicId, isEditMode, fetchSubTopics]);

    useEffect(() => {
        if (!isEditMode) {
            setEditedSubTopic({
                subtopic_id: 0,
                subtopic_name: '',
                pattern: '',
                topic_id,
                check_m: 0,
                check_d: 0,
                check_it_m: 0,
                check_it_d: 0,
                knowledge: ''
            });
        }
    }, [isEditMode, topic_id]);

    useEffect(() => {
        if (subTopics.length > 0) {
            setEditedSubTopic(subTopics[0]);
        }
    }, [subTopics]);

    if (!editedSubTopic) return null;

    return (
        <StyledDialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            disableRestoreFocus
        >
            <DialogTitle>
                {isEditMode ? 'Edit Subtopic' : 'Add New Subtopic'}
            </DialogTitle>
            <StyledDialogContent>
                <Box sx={{ p: 2 }}>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    <TextField
                        fullWidth
                        label="Subtopic Name"
                        value={editedSubTopic.subtopic_name}
                        onChange={(e) => handleInputChange('subtopic_name', e.target.value)}
                        margin="normal"
                        error={!editedSubTopic.subtopic_name}
                        helperText={!editedSubTopic.subtopic_name ? 'Subtopic name is required' : ''}
                        inputRef={(input) => {
                            if (input && !isEditMode) {
                                input.focus();
                            }
                        }}
                    />
                    <Box sx={{ mt: 2, mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                            Pattern:
                        </Typography>
                        <DetailsTextarea
                            value={editedSubTopic.pattern}
                            onChange={(e) => handleInputChange('pattern', e.target.value)}
                            label=""
                            placeholder="Enter pattern details"
                        />
                    </Box>
                    <Box sx={{ 
                        mt: 2, 
                        display: 'grid', 
                        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, 
                        gap: 2 
                    }}>
                        {checkboxFields.map((field) => (
                            <FormControlLabel
                                key={field.key}
                                control={
                                    <Checkbox
                                        checked={editedSubTopic[field.key] === 1}
                                        onChange={(e) => handleInputChange(field.key, e.target.checked ? 1 : 0)}
                                    />
                                }
                                label={field.label}
                            />
                        ))}
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                            Knowledge:
                        </Typography>
                        <DetailsTextarea
                            value={editedSubTopic.knowledge}
                            onChange={(e) => handleInputChange2('knowledge', e.target.value)}
                            label=""
                            placeholder="Enter knowledge details"
                        />
                    </Box>
                </Box>
            </StyledDialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button 
                    onClick={onClose} 
                    color="inherit"
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button 
                    onClick={isEditMode ? handleUpdateSubTopic : handleAddSubTopic}
                    color="primary" 
                    variant="contained"
                    disabled={loading || !editedSubTopic.subtopic_name}
                >
                    {loading ? 'Processing...' : isEditMode ? 'Save Changes' : 'Add Subtopic'}
                </Button>
            </DialogActions>
        </StyledDialog>
    );
};

export default SubTopicDialog;
