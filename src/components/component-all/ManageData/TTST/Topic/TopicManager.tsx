import { useEffect, useState } from 'react';
import { Box, Button, Paper, Snackbar, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Topic } from './types';
import TopicTable from './TopicTable';
import AddTopicDialog from './AddTopicDialog';
import URLAPI from '../../../../../URLAPI';

interface TopicManagerProps {
    typeId?: number;
}

export default function TopicManager({ typeId }: TopicManagerProps) {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [page, setPage] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [newTopicName, setNewTopicName] = useState('');
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });

    const rowsPerPage = 5;

    useEffect(() => {
        fetchTopics();
    }, [typeId]);

    const fetchTopics = async () => {
        if (!typeId) return;
        try {
            const response = await fetch(`${URLAPI}/topics?typeId=${typeId}`);
            const data = await response.json();
            setTopics(data);
        } catch (error) {
            console.error('Error fetching topics:', error);
            setSnackbar({
                open: true,
                message: 'Failed to fetch topics',
                severity: 'error'
            });
        }
    };

    const handleToggleStatus = async (topicId: number) => {
        try {
            const response = await fetch(`${URLAPI}/topics/${topicId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                await fetchTopics();
                setSnackbar({
                    open: true,
                    message: 'Topic status updated successfully',
                    severity: 'success'
                });
            }
        } catch (error) {
            console.error('Error updating topic status:', error);
            setSnackbar({
                open: true,
                message: 'Failed to update topic status',
                severity: 'error'
            });
        }
    };


    const handleTopicUpdated = async () => {
        await fetchTopics();
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <>
            <Box sx={{ mb: 2 }}>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenDialog(true)}
                >
                    Add Topic
                </Button>
            </Box>

            {topics.length > 0 ? (
                <TopicTable
                    topics={topics}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={(_, newPage) => setPage(newPage)}
                    onToggleStatus={handleToggleStatus}
                    onTopicUpdated={handleTopicUpdated}
                />
            ) : (
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                    No topics available for this type.
                </Paper>
            )}

            <AddTopicDialog
                open={openDialog}
                onClose={() => {
                    setOpenDialog(false);
                    setNewTopicName('');
                }}
                typeId={typeId}
                topicName={newTopicName}
                onTopicNameChange={setNewTopicName}
                onTopicAdded={handleTopicUpdated}
            />

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
        </>
    );
}