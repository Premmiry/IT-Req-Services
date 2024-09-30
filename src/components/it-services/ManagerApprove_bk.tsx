import React, { useState } from 'react';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';

// Toolbar Component
const PageContainerToolbar = ({ title }) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">{title}</Typography>
    </Box>
);

function ManagerApprove() {
    const [approvalStatus, setApprovalStatus] = useState<string | null>('approved');
    const [approvalDate, setApprovalDate] = useState<string>(new Date().toISOString().slice(0, 10));
    const [managerNotes, setManagerNotes] = useState<string>('');

    // Sample data
    const sampleData = {
        departmentRequested: 'Computer Maintenance',
        requesterName: 'John Doe',
        contactNumber: '+66 123 4567',
        managerName: 'Jane Smith',
        managerEmail: 'jane.smith@example.com',
        taskType: 'New Program Development',
        additionalNotes: 'Additional features include real-time stock updates.',
        subject: 'New Program Development Request',
        purpose: 'To develop a new program for inventory management.',
        requirements: 'Additional features include real-time stock updates.',
    };

    const steps = ['Request', 'IT Admin', 'Manager Approve', 'Director Approved'];
    const [activeStep, setActiveStep] = useState<number>(2);

    const handleSave = () => {
        // Handle form submission here
        alert('Manager approval saved!');
    };

    const handleCancel = () => {
        // Handle cancel action here
        alert('Action canceled!');
    };

    return (
        <React.Fragment>
            <CssBaseline />
            <Container maxWidth="lg">
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((step, index) => (
                        <Step key={step}>
                            <StepButton onClick={() => setActiveStep(index)}>
                                {step}
                            </StepButton>
                        </Step>
                    ))}
                </Stepper>
                <br />
                <PageContainerToolbar
                    title="Manager Approval"
                />

                <Box sx={{ p: 3 }}>
                    <Grid container spacing={2}>

                        {/* Request Details Section */}
                        <Grid item xs={12}>
                            <Paper sx={{ p: 2, bgcolor: '#e3f2fd' }}>
                                <Typography variant="h6" gutterBottom>
                                    Request Details
                                </Typography>
                                <Divider sx={{ mb: 2 }} />

                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Department Requested
                                        </Typography>
                                        <Input
                                            value={sampleData.departmentRequested}
                                            readOnly
                                            fullWidth
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Requester Name
                                        </Typography>
                                        <Input
                                            value={sampleData.requesterName}
                                            readOnly
                                            fullWidth
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Contact Number
                                        </Typography>
                                        <Input
                                            value={sampleData.contactNumber}
                                            readOnly
                                            fullWidth
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Manager Name
                                        </Typography>
                                        <Input
                                            value={sampleData.managerName}
                                            readOnly
                                            fullWidth
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Manager Email
                                        </Typography>
                                        <Input
                                            value={sampleData.managerEmail}
                                            readOnly
                                            fullWidth
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Subject
                                        </Typography>
                                        <TextField
                                            value={sampleData.subject}
                                            multiline
                                            rows={4}
                                            fullWidth
                                            InputProps={{ readOnly: true }}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Purpose
                                        </Typography>
                                        <TextField
                                            value={sampleData.purpose}
                                            multiline
                                            rows={4}
                                            fullWidth
                                            InputProps={{ readOnly: true }}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Requirements
                                        </Typography>
                                        <TextField
                                            value={sampleData.requirements}
                                            multiline
                                            rows={4}
                                            fullWidth
                                            InputProps={{ readOnly: true }}
                                        />
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                        {/* Task Assignment Section */}
                        <Grid item xs={12} sx={{ mt: 2 }}>
                            <Paper sx={{ p: 2, bgcolor: '#e8f5e9' }}>
                                <Typography variant="h6" gutterBottom>
                                    Task Assignment
                                </Typography>
                                <Divider sx={{ mb: 2 }} />

                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Task Type
                                        </Typography>
                                        <Input
                                            value={sampleData.taskType}
                                            readOnly
                                            fullWidth
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Additional Notes
                                        </Typography>
                                        <TextField
                                            value={sampleData.additionalNotes}
                                            multiline
                                            rows={4}
                                            fullWidth
                                            InputProps={{ readOnly: true }}
                                        />
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                        {/* Manager Approval Section */}
                        <Grid item xs={12} sx={{ mt: 2 }}>
                            <Paper sx={{ p: 2, bgcolor: '#e8f5e9' }}>
                                <Typography variant="h6" gutterBottom>
                                    Manager Approval
                                </Typography>
                                <Divider sx={{ mb: 2 }} />

                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth>
                                            <InputLabel>Approval Status</InputLabel>
                                            <Select
                                                value={approvalStatus}
                                                onChange={(e) => setApprovalStatus(e.target.value)}
                                            >
                                                <MenuItem value="approved">Approved</MenuItem>
                                                <MenuItem value="rejected">Rejected</MenuItem>
                                                <MenuItem value="pending">Pending</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Approval Date
                                        </Typography>
                                        <TextField
                                            type="date"
                                            value={approvalDate}
                                            onChange={(e) => setApprovalDate(e.target.value)}
                                            fullWidth
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Manager Notes
                                        </Typography>
                                        <TextField
                                            value={managerNotes}
                                            onChange={(e) => setManagerNotes(e.target.value)}
                                            multiline
                                            rows={4}
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>

                    {/* Buttons at the bottom */}
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={handleCancel}
                            sx={{ mr: 2 }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSave}
                        >
                            Save
                        </Button>
                    </Box>
                </Box>
            </Container>
        </React.Fragment>
    );
}

export default ManagerApprove;
