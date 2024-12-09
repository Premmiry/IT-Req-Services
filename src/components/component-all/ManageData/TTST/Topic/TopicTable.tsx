import { SyntheticEvent, useState } from 'react';
import { Table, TableBody, TableCell,  TableContainer,  TableHead,  TableRow,  TablePagination,  IconButton,  Paper, Box,
Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Snackbar, SnackbarCloseReason, Alert } from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import { Topic } from './types';
import URLAPI from '../../../../../URLAPI';

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
    const [hoveredRow, setHoveredRow] = useState<number | null>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
    const [editedTopicName, setEditedTopicName] = useState('');
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });

    const handleEditClick = (topic: Topic) => {
        setEditingTopic(topic);
        setEditedTopicName(topic.topic_name);
        setEditDialogOpen(true);
    };

    const handleEditSave = async () => {
        if (!editingTopic) return;

        try {
            const response = await fetch(`${URLAPI}/topics/${editingTopic.topic_id}?topic_name=${editedTopicName}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                onTopicUpdated();
                setEditDialogOpen(false);
                setSnackbar({
                    open: true,
                    message: 'Topic updated successfully',
                    severity: 'success'
                });
                
            }
        } catch (error) {
            console.error('Error updating topic:', error);
            setSnackbar({
                open: true,
                message: 'Failed to update topic',
                severity: 'error'
            });
        }
    };

    function handleCloseSnackbar(_event: Event | SyntheticEvent<any, Event>, _reason: SnackbarCloseReason): void {
        setSnackbar({ ...snackbar, open: false });
    }

    return (
        <>
            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell width="10%">No.</TableCell>
                            <TableCell width="70%">Topic</TableCell>
                            <TableCell width="20%" align="center">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {topics
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((topic, index) => (
                                <TableRow 
                                    key={topic.topic_id}
                                    onMouseEnter={() => setHoveredRow(topic.topic_id)}
                                    onMouseLeave={() => setHoveredRow(null)}
                                >
                                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            {topic.topic_name}
                                            {hoveredRow === topic.topic_id && (
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleEditClick(topic)}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton
                                            onClick={() => onToggleStatus(topic.topic_id)}
                                            color={topic.del_flag === 'N' ? 'success' : 'error'}
                                        >
                                            {topic.del_flag === 'N' ? 
                                                <CheckCircleIcon /> : 
                                                <BlockIcon />
                                            }
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={topics.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={onPageChange}
                    rowsPerPageOptions={[5]}
                />
            </TableContainer>

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
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={(event, reason) => handleCloseSnackbar(event, reason)}
                >
                    <Alert onClose={(event) => handleCloseSnackbar(event, 'clickaway')} severity={snackbar.severity}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Dialog>
        </>
    );
}


