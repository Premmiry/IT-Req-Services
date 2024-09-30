import React, { useState } from 'react';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Autocomplete from '@mui/joy/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import Chip from '@mui/joy/Chip';
import Close from '@mui/icons-material/Close';
import CloseIcon from '@mui/icons-material/Close';
import Textarea from '@mui/joy/Textarea';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';


// Toolbar Component
const PageContainerToolbar = ({ title }) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">{title}</Typography>
    </Box>
);


function ITAdminPage() {

    const [department, setDepartment] = React.useState('');


    const handleChange = (event: SelectChangeEvent) => {
        setDepartment(event.target.value);
    };

    const handleSave = () => {
        // Handle form submission here
        alert('Data saved and proceeding to the next step!');
    };

    const handleCancel = () => {
        // Handle cancel action here
        alert('Action canceled!');
    };

    // Sample data
    const sampleData = {
        departmentRequested: 'Computer Maintenance',
        requesterName: 'John Doe',
        contactNumber: '+66 123 4567',
        managerName: 'Jane Smith',
        managerEmail: 'jane.smith@example.com',
        managerApproveStatus: 'Approved',
        managerApproveDate: '2024-08-27',
        directorName: 'Robert Brown',
        directorEmail: 'robert.brown@example.com',
        directorApproveDate: '2024-08-28',
        subject: 'New Program Development Request',
        purpose: 'To develop a new program for inventory management.',
        requirements: 'Additional features include real-time stock updates.',
    };

    const steps = ['Request', 'IT Admin', 'Manager Approve', 'Director Approved'];
    const [activeStep, setActiveStep] = useState<number>(1);

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
                    title="IT Admin Task Assignment"
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
                                            color="success"

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
                                            color="success"
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
                                            color="success"
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
                                            color="success"
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
                                            color="success"
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Manager Approval Status
                                        </Typography>
                                        <Input
                                            value={sampleData.managerApproveStatus}
                                            readOnly
                                            fullWidth
                                            color="success"
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Manager Approval Date
                                        </Typography>
                                        <Input
                                            value={sampleData.managerApproveDate}
                                            readOnly
                                            fullWidth
                                            color="success"
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Director Name
                                        </Typography>
                                        <Input
                                            value={sampleData.directorName}
                                            readOnly
                                            fullWidth
                                            color="success"
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Director Email
                                        </Typography>
                                        <Input
                                            value={sampleData.directorEmail}
                                            readOnly
                                            fullWidth
                                            color="success"
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Director Approval Date
                                        </Typography>
                                        <Input
                                            value={sampleData.directorApproveDate}
                                            readOnly
                                            fullWidth
                                            color="success"
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
                                            color="success"
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
                                            color="success"
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Typography variant="subtitle1" gutterBottom >
                                            Requirements
                                        </Typography>
                                        <TextField
                                            value={sampleData.requirements}
                                            multiline
                                            rows={4}
                                            fullWidth
                                            InputProps={{ readOnly: true }}
                                            color="success"
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
                                        <FormControl fullWidth>


                                            <Autocomplete
                                                placeholder="Assign Department"
                                                options={top100Films}
                                                variant="outlined" color="primary"
                                            />

                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth>
                                            <Autocomplete
                                                id="tags-default"
                                                multiple
                                                placeholder="Task Type"
                                                options={top101Films}
                                                variant="outlined" color="primary"
                                                getOptionLabel={(option) => option.title}
                                                defaultValue={[top101Films[0]]}
                                                renderTags={(tags, getTagProps) =>
                                                    tags.map((item, index) => (
                                                        <Chip
                                                            key={index}
                                                            label={item.title}
                                                            variant="solid"
                                                            color="primary"
                                                            endDecorator={<Close fontSize="sm" />}
                                                            sx={{ minWidth: 0 }}
                                                            onDelete={() => { }}
                                                            deleteIcon={<CloseIcon />}
                                                            {...getTagProps({ index })}
                                                        >{item.title}</Chip>
                                                    ))
                                                }
                                            />

                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12}>


                                        <Textarea
                                            minRows={2}
                                            placeholder="Additional Notes"
                                            variant="outlined"
                                            color="primary"
                                            sx={{
                                                borderBottom: '2px solid',
                                                borderColor: 'neutral.outlinedBorder',
                                                borderRadius: 0,
                                                '&:hover': {
                                                    borderColor: 'neutral.outlinedHoverBorder',
                                                },
                                                '&::before': {
                                                    border: '1px solid var(--Textarea-focusedHighlight)',
                                                    transform: 'scaleX(0)',
                                                    left: 0,
                                                    right: 0,
                                                    bottom: '-2px',
                                                    top: 'unset',
                                                    transition: 'transform .15s cubic-bezier(0.1,0.9,0.2,1)',
                                                    borderRadius: 0,
                                                },
                                                '&:focus-within::before': {
                                                    transform: 'scaleX(1)',
                                                },
                                            }}
                                        />


                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>

                    {/* Buttons at the bottom */}
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                        <Stack direction="row" spacing={2}>
                            <Button variant="contained" startIcon={<SaveIcon />} color="success">
                                Save
                            </Button>
                            <Button variant="contained" endIcon={<CancelIcon />} color="error">
                                Cancel
                            </Button>
                        </Stack>
                    </Box>
                </Box>
            </Container>
        </React.Fragment>
    );
}


const top100Films = [
    { label: 'Computer Maintenance', value: 'computerMaintenance' },
    { label: 'System Control', value: 'systemControl' },
    { label: 'Program Development', value: 'programDevelopment' },
];

const top101Films = [
    { title: 'New Program Development', value: 'newProgramDevelopment' },
    { title: 'Continued Program Development', value: 'continuedProgramDevelopment' },
    { title: 'Report Modification/Addition', value: 'reportModification' },
    { title: 'Email Request', value: 'emailRequest' },
    { title: 'Equipment Request', value: 'equipmentRequest' },
    { title: 'Access Rights Request', value: 'accessRightsRequest' },
    { title: 'Other', value: 'other' },
];

export default ITAdminPage;
