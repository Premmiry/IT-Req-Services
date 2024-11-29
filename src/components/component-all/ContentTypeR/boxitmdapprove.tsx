import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Stack, Grid, Box, FormGroup } from '@mui/material';
import { FormLabel, Input, Select, Option, SelectStaticProps, Button } from '@mui/joy';
import { ApproveAlert } from '../Alert/alert';
import { useNavigate } from 'react-router-dom';
import URLAPI from '../../../URLAPI';
import CheckboxITApprove from '../Checkbox/checkbox_it_approve';

const fetchApproveOptions = async () => {
    const response = await fetch(`${URLAPI}/mtapprove`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

interface ApproveProps {
    name: string | null;
    status: string | null;
    req_id: string | null;
    it_m_name?: string | null;
    level_job: number | null;
}

interface UserData {
    name_employee: string;
    position: string;
}

const useApproveOptions = () => {
    const [approveOptions, setApproveOptions] = useState<{ id_approve: number, name_approve: string }[]>([]);

    useEffect(() => {
        fetchApproveOptions().then(data => {
            setApproveOptions(data);
        });
    }, []);

    return approveOptions;
};

export const BoxITManagerApprove = ({ 
    itmanagerApprove, 
    id_division_competency, 
    it_m_note,
    onLevelJobChange 
}: { 
    itmanagerApprove: ApproveProps, 
    id_division_competency: number | null, 
    it_m_note: string | null,
    onLevelJobChange?: (levelJob: number | null) => void 
}) => {
    const [value1, setValue1] = React.useState<number | null>(null);
    const approveOptions = useApproveOptions();
    const [itmanagerName, setITManagerName] = useState<string>(itmanagerApprove?.name || '');
    const [levelJob, setLevelJob] = useState<number | null>(itmanagerApprove?.level_job ?? null);
    const [showSubmitButton, setShowSubmitButton] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const action: SelectStaticProps['action'] = React.useRef(null);
    const navigate = useNavigate();

    // Update levelJob and call the callback if provided
    const handleLevelJobChange = (newLevelJob: number | null) => {
        setLevelJob(newLevelJob);
        if (onLevelJobChange) {
            onLevelJobChange(newLevelJob);
        }
    };

    const memoizedITManagerApprove = useMemo(() => {
        return {
            name: itmanagerApprove?.name,
            req_id: itmanagerApprove?.req_id,
            status: itmanagerApprove?.status,
            level_job: itmanagerApprove?.level_job
        };
    }, [itmanagerApprove?.name, itmanagerApprove?.req_id, itmanagerApprove?.status, itmanagerApprove?.level_job]);

    useEffect(() => {
        const storedUserData = sessionStorage.getItem('userData');
        if (storedUserData) {
            const userData: UserData = JSON.parse(storedUserData);
            if ((userData.position === 'm' || userData.position === 'd') && !memoizedITManagerApprove.name) {
                setITManagerName(userData.name_employee);
            } else if (memoizedITManagerApprove.name) {
                setITManagerName(memoizedITManagerApprove.name);
                setValue1(memoizedITManagerApprove.status ? parseInt(memoizedITManagerApprove.status) : null);
                setLevelJob(memoizedITManagerApprove.level_job);
            }

            const shouldShowSubmitButton = Boolean(memoizedITManagerApprove.req_id) &&
                !memoizedITManagerApprove.status &&
                userData.position === 'm';
            setShowSubmitButton(shouldShowSubmitButton);
        }
    }, [memoizedITManagerApprove]);

    const handleChangeCheck = () => (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value, 10);
        handleLevelJobChange(value);
        console.log('Level Job:', value);
    };

    const handleSubmit = useCallback(async () => {
        if (!value1) {
            alert('Status cannot be empty');
            return;
        }

        if (!itmanagerApprove.req_id) {
            alert('Request ID cannot be empty');
            return;
        }

        if (!levelJob) {
            alert('Level Job cannot be empty');
            console.log('Level Job:', levelJob);
            return;
        }

        try {
            const response = await fetch(`${URLAPI}/it_m_approve/${itmanagerApprove.req_id}?name=${encodeURIComponent(itmanagerName)}&status=${encodeURIComponent(value1)}&note=${encodeURIComponent(it_m_note ?? '')}&level_job=${encodeURIComponent(levelJob)}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                console.error('Error:', errorMessage);
                alert(`Error: ${errorMessage}`);
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log('IT-Manager approval updated successfully:', result);
            setShowAlert(true);

            setTimeout(() => {
                setShowAlert(false);
                if (id_division_competency === 86) {
                    navigate('/request-list-it');
                } else {
                    navigate('/request-list');
                }
            }, 2000);

        } catch (error) {
            console.error('Error updating manager approval:', error);
        }
    }, [value1, itmanagerApprove, itmanagerName, it_m_note, id_division_competency, navigate, levelJob]);

    return (
        <Grid container spacing={1}>
            <Grid item xs={6} component="div">
                <FormLabel>IT Manager Approve</FormLabel>
                <Input
                    variant="outlined"
                    color="success"
                    type='text'
                    placeholder='Manager Name'
                    value={itmanagerName}
                    readOnly={true}
                    onChange={(e) => setITManagerName(e.target.value)}
                />
            </Grid>
            <Grid item xs={3} component="div">
                <FormLabel>Status</FormLabel>
                <Select
                    action={action}
                    value={value1}
                    placeholder="Status"
                    onChange={(_e, newValue) => {
                        console.log("Selected Value:", newValue);
                        setValue1(newValue);
                    }}
                    variant="outlined"
                    color="success"
                    {...(value1 && {
                        indicator: null,
                    })}
                >
                    {approveOptions.map(option => (
                        <Option key={option.id_approve} value={option.id_approve}>
                            {option.name_approve}
                        </Option>
                    ))}
                </Select>
                <Stack direction={{ xs: 'column', sm: 'row' }}>
                    {showSubmitButton && <Button onClick={handleSubmit}>Submit</Button>}
                    {showAlert && <ApproveAlert onClose={() => { /* Implement onClose function here */ }} />}
                </Stack>
            </Grid>
            <Grid item xs={6}>
                <Box sx={{ mt: 1 }}>
                    <FormGroup
                        aria-label="position"
                        row
                        id={`checkbox_group`}
                    >
                        <CheckboxITApprove levelJob={levelJob} onChange={handleChangeCheck()} />
                    </FormGroup>
                </Box>
            </Grid>
        </Grid>
    );
};

export const BoxITDirectorApprove = ({ 
    itdirectorApprove, 
    it_m_name, 
    id_section_competency, 
    it_d_note, 
    levelJob: initialLevelJob, 
    onLevelJobChange 
}: { 
    itdirectorApprove: ApproveProps, 
    it_m_name: string | null, 
    id_section_competency: number, 
    it_d_note: string | null, 
    levelJob: number | null,
    onLevelJobChange?: (levelJob: number | null) => void 
}) => {
    const [value2, setValue2] = React.useState<number | null>(null);
    const approveOptions = useApproveOptions();
    const [itdirectorName, setITDirectorName] = useState<string>(itdirectorApprove?.name || '');
    const [showSubmitButton, setShowSubmitButton] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [levelJob, setLevelJob] = useState<number | null>(initialLevelJob);
    const action: SelectStaticProps['action'] = React.useRef(null);
    const navigate = useNavigate();

    // Update levelJob and call the callback if provided
    const handleLevelJobChange = (newLevelJob: number | null) => {
        setLevelJob(newLevelJob);
        if (onLevelJobChange) {
            onLevelJobChange(newLevelJob);
        }
    };

    const memoizedITDirectorApprove = useMemo(() => {
        return {
            name: itdirectorApprove?.name,
            req_id: itdirectorApprove?.req_id,
            status: itdirectorApprove?.status
        };
    }, [itdirectorApprove?.name, itdirectorApprove?.req_id, itdirectorApprove?.status]);

    useEffect(() => {
        // Update levelJob when initialLevelJob changes
        setLevelJob(initialLevelJob);
    }, [initialLevelJob]);

    useEffect(() => {
        const storedUserData = sessionStorage.getItem('userData');
        if (storedUserData) {
            const userData: UserData = JSON.parse(storedUserData);
            if (userData.position === 'd' && !memoizedITDirectorApprove.name) {
                setITDirectorName(userData.name_employee);
            } else if (memoizedITDirectorApprove.name) {
                setITDirectorName(memoizedITDirectorApprove.name);
                setValue2(memoizedITDirectorApprove.status ? parseInt(memoizedITDirectorApprove.status) : null);
            }

            const shouldShowSubmitButton = Boolean(memoizedITDirectorApprove.req_id) &&
                !memoizedITDirectorApprove.status &&
                userData.position === 'd';
            setShowSubmitButton(shouldShowSubmitButton);
        }
    }, [memoizedITDirectorApprove]);

    const handleSubmit = useCallback(async () => {
        if (!value2) {
            alert('Status cannot be empty');
            return;
        }

        if (!itdirectorApprove.req_id) {
            alert('Request ID cannot be empty');
            return;
        }

        if (!levelJob) {
            alert('Level Job cannot be empty');
            return;
        }

        try {
            if (!it_m_name) {
                const response = await fetch(`${URLAPI}/it_m_approve/${itdirectorApprove.req_id}?name=${encodeURIComponent(itdirectorName)}&status=${encodeURIComponent(value2)}&note=${encodeURIComponent(it_d_note ?? '')}&level_job=${encodeURIComponent(levelJob ?? '')}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                if (!response.ok) {
                    const errorMessage = await response.text();
                    console.error('Error:', errorMessage);
                    alert(`Error: ${errorMessage}`);
                    throw new Error('Network response was not ok');
                }
            }

            const response = await fetch(`${URLAPI}/it_d_approve/${itdirectorApprove.req_id}?name=${encodeURIComponent(itdirectorName)}&status=${encodeURIComponent(value2)}&note=${encodeURIComponent(it_d_note ?? '')}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            console.log('IT Director approval updated successfully:', result);
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
                if (id_section_competency === 28) {
                    navigate('/request-list-it');
                } else {
                    navigate('/request-list');
                }
            }, 2000);
        } catch (error) {
            console.error('Error updating director approval:', error);
        }
    }, [value2, itdirectorApprove, itdirectorName, it_d_note, id_section_competency, navigate, it_m_name, levelJob]);

    return (
        <Grid container spacing={1}>
            <Grid item xs={6} component="div">
                <FormLabel>IT Director Approve</FormLabel>
                <Input 
                    variant="outlined" 
                    color="warning" 
                    type='text' 
                    placeholder='Director Name' 
                    value={itdirectorName} 
                    readOnly={true} 
                    onChange={(e) => setITDirectorName(e.target.value)} 
                />
            </Grid>
            <Grid item xs={3} component="div">
                <FormLabel>Status</FormLabel>
                <Select
                    action={action}
                    value={value2}
                    placeholder="Status"
                    onChange={(_e, newValue) => {
                        console.log("Selected Value:", newValue);
                        setValue2(newValue);
                    }}
                    variant="outlined" 
                    color="warning"
                    {...(value2 && {
                        indicator: null,
                    })}
                >
                    {approveOptions.map(option => (
                        <Option key={option.id_approve} value={option.id_approve}>
                            {option.name_approve}
                        </Option>
                    ))}
                </Select>
            </Grid>
            {showSubmitButton && <Button onClick={handleSubmit}>Submit</Button>}
            {showAlert && <ApproveAlert onClose={() => {/* Implement onClose function */}} />}
        </Grid>
    );
};