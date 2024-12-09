import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import URLAPI from '../../../../../URLAPI';

interface AddTopicDialogProps {
    open: boolean;
    onClose: () => void;
    typeId?: number;
    topicName: string;
    onTopicNameChange: (value: string) => void;
    onTopicAdded: () => void;
}

export default function AddTopicDialog({
    open,
    onClose,
    typeId,
    topicName,
    onTopicNameChange,
    onTopicAdded
}: AddTopicDialogProps) {
    const handleAdd = async () => {
        if (!typeId) return;

        try {
            const response = await fetch(`${URLAPI}/topics?type_id=${typeId}&topic_name=${topicName}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                onTopicAdded();
                onClose();
            }
        } catch (error) {
            console.error('Error adding topic:', error);
        }
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>Add New Topic</DialogTitle>
            <DialogContent sx={{ width: '500px', pt: 2 }}>
                <TextField
                    autoFocus
                    fullWidth
                    label="Topic Name"
                    value={topicName}
                    onChange={(e) => onTopicNameChange(e.target.value)}
                />
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleAdd} variant="contained">Add</Button>
            </DialogActions>
        </Dialog>
    );
}