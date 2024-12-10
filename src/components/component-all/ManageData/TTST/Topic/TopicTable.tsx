import { useState } from 'react';
import { Paper, Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Snackbar, Alert, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Typography, Divider, MenuItem, Menu,
Collapse, TablePagination } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Topic } from './types';
import URLAPI from '../../../../../URLAPI';
import SubTopicDialog from '../SubTopic/SubTopicDialog';
import { SubTopicItem } from '../SubTopic/index';
import { SubTopic } from '../SubTopic/types';


interface TopicTableProps {
    topics: Topic[];
    page: number;
    rowsPerPage: number;
    onPageChange: (event: unknown, newPage: number) => void;
    onToggleStatus: (topicId: number) => void;
    onTopicUpdated: () => void;
}

export default function TopicTable({
    topics,
    page,
    rowsPerPage,
    onPageChange,
    onToggleStatus,
    onTopicUpdated
}: TopicTableProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editedTopicName, setEditedTopicName] = useState('');
    const [subTopicDialogOpen, setSubTopicDialogOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });
    const [expandedTopic, setExpandedTopic] = useState<number | null>(null);
    const [topicSubTopics, setTopicSubTopics] = useState<{ [key: number]: SubTopic[] }>({});

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>, topic: Topic) => {
        setAnchorEl(event.currentTarget);
        setSelectedTopic(topic);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleAddSubTopicClick = () => {
        if (selectedTopic) {
            setSubTopicDialogOpen(true);
            handleMenuClose();
        }
    };

    const handleEditClick = () => {
        if (selectedTopic) {
            setEditedTopicName(selectedTopic.topic_name);
            setEditDialogOpen(true);
        }
        handleMenuClose();
    };

    const handleToggleStatus = () => {
        if (selectedTopic) {
            onToggleStatus(selectedTopic.topic_id);
        }
        handleMenuClose();
    };

    const handleEditSave = async () => {
        if (!selectedTopic) return;

        const response = await fetch(`${URLAPI}/topics/${selectedTopic.topic_id}?topic_name=${editedTopicName}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            setSnackbar({ open: true, message: 'Topic updated successfully', severity: 'success' });
            onTopicUpdated();
        } else {
            setSnackbar({ open: true, message: 'Failed to update topic', severity: 'error' });
        }
    };

    const handleTopicClick = async (topicId: number) => {
        if (expandedTopic === topicId) {
            setExpandedTopic(null);
            return;
        }

        try {
            const response = await fetch(`${URLAPI}/subtopic/${topicId}`);
            if (!response.ok) throw new Error('Failed to fetch subtopics');
            const data = await response.json();
            setTopicSubTopics(prev => ({ ...prev, [topicId]: data }));
            setExpandedTopic(topicId);
        } catch (error) {
            console.error('Error:', error);
            setSnackbar({
                open: true,
                message: 'Failed to fetch subtopics',
                severity: 'error'
            });
        }
    };

    return (
        <Box>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <List>
                    {topics
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((topic, index) => (
                            <Box key={topic.topic_id}>
                                <ListItem 
                                    sx={{ 
                                        cursor: 'pointer',
                                        '&:hover': {
                                            backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                        }
                                    }}
                                    onClick={() => handleTopicClick(topic.topic_id)}
                                >
                                    <ListItemText
                                        primary={
                                            <Typography variant="subtitle1">
                                                {`${page * rowsPerPage + index + 1}. ${topic.topic_name}`}
                                            </Typography>
                                        }
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton
                                            edge="end"
                                            onClick={(event) => handleMenuClick(event, topic)}
                                        >
                                            <MoreVertIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                                <Collapse in={expandedTopic === topic.topic_id}>
                                    <List disablePadding>
                                        {topicSubTopics[topic.topic_id]?.map((subtopic: SubTopic, subIndex: number) => (
                                            <SubTopicItem
                                                key={subtopic.subtopic_id}
                                                subtopic={subtopic}
                                                index={subIndex}
                                                onUpdate={() => handleTopicClick(topic.topic_id)}
                                            />
                                        ))}
                                    </List>
                                </Collapse>
                                <Divider />
                            </Box>
                        ))}
                </List>
                <TablePagination
                    component="div"
                    count={topics.length}
                    page={page}
                    onPageChange={onPageChange}
                    rowsPerPage={5}
                    rowsPerPageOptions={[5]}
                />
            </Paper>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleAddSubTopicClick}>
                    <AddIcon sx={{ mr: 1 }} fontSize="small" />
                    Add Subtopic
                </MenuItem>
                <MenuItem onClick={handleEditClick}>
                    <EditIcon sx={{ mr: 1 }} fontSize="small" />
                    Edit Topic
                </MenuItem>
                <MenuItem onClick={handleToggleStatus}>
                    {selectedTopic?.del_flag === 'N' ? (
                        <>
                            <BlockIcon sx={{ mr: 1 }} fontSize="small" color="error" />
                            Disable Topic
                        </>
                    ) : (
                        <>
                            <CheckCircleIcon sx={{ mr: 1 }} fontSize="small" color="success" />
                            Enable Topic
                        </>
                    )}
                </MenuItem>
            </Menu>

            <Dialog 
                open={editDialogOpen} 
                onClose={() => setEditDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Edit Topic</DialogTitle>
                <DialogContent sx={{ width: '500px', pt: 2 }}>
                    <TextField
                        autoFocus
                        fullWidth
                        label="Topic Name"
                        value={editedTopicName}
                        onChange={(e) => setEditedTopicName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleEditSave} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>

            {selectedTopic && subTopicDialogOpen && (
                <SubTopicDialog
                    open={subTopicDialogOpen}
                    onClose={() => setSubTopicDialogOpen(false)}
                    topic_id={selectedTopic.topic_id}
                    onSave={() => {
                        handleTopicClick(selectedTopic.topic_id);
                        setSubTopicDialogOpen(false);
                    }}
                    isEditMode={false}
                    subtopicId={undefined}
                />
            )}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={(_event, _reason) => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}


