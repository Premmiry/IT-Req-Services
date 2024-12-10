import React, { useState, useCallback } from 'react';
import {
    ListItem,
    ListItemText,
    Box,
    Typography,
    Chip,
    IconButton,
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import { SubTopic } from './types';
import SubTopicDialog from './SubTopicDialog';

interface CheckLabel {
    check: number;
    label: string;
}

interface SubTopicItemProps {
    subtopic: SubTopic;
    index: number;
    onUpdate: () => Promise<void>;
}

const SubTopicItem: React.FC<SubTopicItemProps> = React.memo(({
    subtopic,
    index,
    onUpdate
}) => {
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const checkLabels: CheckLabel[] = React.useMemo(() => [
        { check: subtopic.check_m, label: 'M' },
        { check: subtopic.check_d, label: 'D' },
        { check: subtopic.check_it_m, label: 'IT-M' },
        { check: subtopic.check_it_d, label: 'IT-D' }
    ], [subtopic]);

    const handleClose = useCallback((): void => {
        setDialogOpen(false);
    }, []);

    const handleSave = useCallback(async (): Promise<void> => {
        setIsLoading(true);
        try {
            await onUpdate();
            handleClose();
        } catch (error) {
            console.error('Error updating subtopic:', error);
        } finally {
            setIsLoading(false);
        }
    }, [onUpdate, handleClose]);

    const handleOpenDialog = useCallback((): void => {
        setDialogOpen(true);
    }, []);

    return (
        <Box component="div">
            <ListItem
                sx={{
                    pl: 4,
                    opacity: isLoading ? 0.7 : 1,
                    transition: 'opacity 0.2s ease-in-out'
                }}
                {...(isLoading ? { disabled: true } : {})}
            >
                <ListItemText
                    primary={
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                flexWrap: 'wrap'
                            }}
                        >
                            <Typography variant="body2" component="span">
                                {`${index + 1}. ${subtopic.subtopic_name}`}
                            </Typography>
                            {checkLabels
                                .filter(item => item.check === 1)
                                .map((item, i) => (
                                    <Chip
                                        key={`${item.label}-${i}`}
                                        label={item.label}
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                        sx={{
                                            height: '20px',
                                            '& .MuiChip-label': {
                                                px: 1
                                            }
                                        }}
                                    />
                                ))
                            }
                        </Box>
                    }
                />

                <IconButton
                    size="small"
                    onClick={handleOpenDialog}
                    disabled={isLoading}
                    sx={{
                        '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)'
                        }
                    }}
                >
                    <DescriptionIcon fontSize="small" />
                </IconButton>
            </ListItem>

            {dialogOpen && (
                <SubTopicDialog
                    open={dialogOpen}
                    onClose={handleClose}
                    topic_id={subtopic.topic_id}
                    onSave={handleSave}
                    isEditMode={true}
                    subtopicId={subtopic.subtopic_id}
                />
            )}
        </Box>
    );
});

SubTopicItem.displayName = 'SubTopicItem';

export default SubTopicItem;