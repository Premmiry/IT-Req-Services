import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Stack, Grid } from '@mui/material';
import { FormLabel, Input, Select, Option, IconButton, Sheet, styled, SelectStaticProps, Button, Box } from '@mui/joy';
import CloseRounded from '@mui/icons-material/CloseRounded';
import { ApproveAlert } from '../Alert/alert';
import { useNavigate } from 'react-router-dom';
import URLAPI from '../../../URLAPI';

const Item = styled(Sheet)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography['body-sm'],
    padding: theme.spacing(0.1),
    textAlign: 'center',
    color: theme.vars.palette.text.secondary,
    ...theme.applyStyles('dark', {
        backgroundColor: theme.palette.background.level1,
    }),
}));

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
    it_m_name?: string | null; // Make id_section_competency optional
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

export const BoxITManagerApprove = ({ itmanagerApprove, id_division_competency, it_m_note }: { itmanagerApprove: ApproveProps, id_division_competency: number | null, it_m_note: string | null }) => {
    const [value1, setValue1] = React.useState<number | null>(null);
    const approveOptions = useApproveOptions();
    const [itmanagerName, setITManagerName] = useState<string>(itmanagerApprove?.name || '');
    const [showSubmitButton, setShowSubmitButton] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const action: SelectStaticProps['action'] = React.useRef(null);
    const navigate = useNavigate();

    const memoizedITManagerApprove = useMemo(() => {
        return {
            name: itmanagerApprove?.name,
            req_id: itmanagerApprove?.req_id,
            status: itmanagerApprove?.status
        };
    }, [itmanagerApprove?.name, itmanagerApprove?.req_id, itmanagerApprove?.status]);

    useEffect(() => {
        const storedUserData = sessionStorage.getItem('userData');
        if (storedUserData) {
            const userData: UserData = JSON.parse(storedUserData);
            if ((userData.position === 'm' || userData.position === 'd') && !memoizedITManagerApprove.name) {
                setITManagerName(userData.name_employee);
            } else if (memoizedITManagerApprove.name) {
                setITManagerName(memoizedITManagerApprove.name);
                setValue1(memoizedITManagerApprove.status ? parseInt(memoizedITManagerApprove.status) : null);
            }

            const shouldShowSubmitButton = Boolean(memoizedITManagerApprove.req_id) &&
                !memoizedITManagerApprove.status &&
                userData.position === 'm';
            setShowSubmitButton(shouldShowSubmitButton);
        }
    }, [memoizedITManagerApprove]);

    const handleSubmit = useCallback(async () => {
        if (!value1) {
            alert('Status cannot be empty');
            return;
        }

        if (!itmanagerApprove.req_id) {
            alert('Request ID cannot be empty');
            return;
        }

        try {
            const response = await fetch(`${URLAPI}/it_m_approve/${itmanagerApprove.req_id}?name=${encodeURIComponent(itmanagerName)}&status=${encodeURIComponent(value1)}&note=${encodeURIComponent(it_m_note ?? '')}`, {
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
    }, [value1, itmanagerApprove, itmanagerName, it_m_note, id_division_competency, navigate]);

    return (
        <Box sx={{ mt: 4, mb: 4, p: 2, border: '1px dashed #87beff' }}>
            <Grid container spacing={1}>
                <Grid item xs={3} component="div">
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
                            endDecorator: (
                                <IconButton
                                    size="sm"
                                    variant="plain"
                                    color="neutral"
                                    onMouseDown={(event) => event.stopPropagation()}
                                    onClick={() => {
                                        setValue1(null);
                                        action.current?.focusVisible();
                                    }}
                                >
                                    <CloseRounded />
                                </IconButton>
                            ),
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
            </Grid>
        </Box>
    );    
};

export const BoxITDirectorApprove = ({ itdirectorApprove, it_m_name, id_section_competency, it_d_note }: { itdirectorApprove: ApproveProps, it_m_name: string | null, id_section_competency: number, it_d_note: string | null }) => {
    const [value2, setValue2] = React.useState<number | null>(null);
    const approveOptions = useApproveOptions();
    const [itdirectorName, setITDirectorName] = useState<string>(itdirectorApprove?.name || '');
    const [showSubmitButton, setShowSubmitButton] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const action: SelectStaticProps['action'] = React.useRef(null);
    const navigate = useNavigate();

    const memoizedITDirectorApprove = useMemo(() => {
        return {
            name: itdirectorApprove?.name,
            req_id: itdirectorApprove?.req_id,
            status: itdirectorApprove?.status
        };
    }, [itdirectorApprove?.name, itdirectorApprove?.req_id, itdirectorApprove?.status]);

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

        try {
            if (!it_m_name) {
                const response = await fetch(`${URLAPI}/it_m_approve/${itdirectorApprove.req_id}?name=${encodeURIComponent(itdirectorName)}&status=${encodeURIComponent(value2)}&note=${encodeURIComponent(it_d_note ?? '')}`, {
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
    }, [value2, itdirectorApprove, itdirectorName, it_d_note, id_section_competency, navigate, it_m_name]);

    return (
        <Stack direction={{ xs: 'column', sm: 'row' }}>
            <Item>
                <FormLabel>IT Director Approve</FormLabel>
                <Input variant="outlined" color="warning" type='text' placeholder='Director Name' value={itdirectorName} readOnly={true} onChange={(e) => setITDirectorName(e.target.value)} />
            </Item>
            <Item>
                <FormLabel>Status</FormLabel>
                <Select
                    action={action}
                    value={value2}
                    placeholder="Status"
                    onChange={(_e, newValue) => {
                        console.log("Selected Value:", newValue);
                        setValue2(newValue);
                    }}
                    variant="outlined" color="warning"
                    {...(value2 && {
                        endDecorator: (
                            <IconButton
                                size="sm"
                                variant="plain"
                                color="neutral"
                                onMouseDown={(event) => event.stopPropagation()}
                                onClick={() => {
                                    setValue2(null);
                                    action.current?.focusVisible();
                                }}
                            >
                                <CloseRounded />
                            </IconButton>
                        ),
                        indicator: null,
                    })}
                >
                    {approveOptions.map(option => (
                        <Option key={option.id_approve} value={option.id_approve}>
                            {option.name_approve}
                        </Option>
                    ))}
                </Select>
            </Item>
            {showSubmitButton && <Button onClick={handleSubmit}>Submit</Button>}
            {showAlert && <ApproveAlert onClose={function (): void {
                throw new Error('Function not implemented.');
            }} />}
        </Stack>
    );
};