import React, { useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import { FormLabel, Input, Select, Option, IconButton, Sheet, styled, SelectStaticProps, Button } from '@mui/joy';
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
    m_name?: string | null; // Make m_name optional
}

interface UserData {
    name_employee: string;
    position: string;
}

export const BoxManagerApprove = ({ managerApprove, id_division_competency }: { managerApprove: ApproveProps, id_division_competency: number | null }) => {
    const [value1, setValue1] = React.useState<number | null>(null);
    const [approveOptions, setApproveOptions] = useState<{ id_approve: number, name_approve: string }[]>([]);
    const [managerName, setManagerName] = useState<string>(managerApprove?.name || '');
    const [showSubmitButton, setShowSubmitButton] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const action: SelectStaticProps['action'] = React.useRef(null);
    const navigate = useNavigate();
    useEffect(() => {
        const storedUserData = sessionStorage.getItem('userData');
        if (storedUserData) {
            const userData: UserData = JSON.parse(storedUserData);
            console.log("User Datam:", userData);
            if ((userData.position === 'm' || userData.position === 'd') && !managerApprove?.name) {
                setManagerName(userData.name_employee);
            }
            else if (managerApprove?.name) {
                setManagerName(managerApprove.name);
                setValue1(managerApprove.status ? parseInt(managerApprove.status) : null);
            }

            // Check conditions to show/hide submit button
            const shouldShowSubmitButton = Boolean(managerApprove.req_id) &&
                !managerApprove.status &&
                userData.position === 'm';
            setShowSubmitButton(shouldShowSubmitButton);
        }

        fetchApproveOptions().then(data => {
            console.log("Approve Options:", data);
            setApproveOptions(data);
        });
    }, [managerApprove?.name, managerApprove.req_id, managerApprove.status]);

    const handleSubmit = async () => {
        if (!value1) {
            alert('Status cannot be empty');
            return;
        }

        if (!managerApprove.req_id) {
            alert('Request ID cannot be empty');
            return;
        }

        try {
            const response = await fetch(`${URLAPI}/m_approve/${managerApprove.req_id}?name=${encodeURIComponent(managerName)}&status=${encodeURIComponent(value1)}`, {
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
            console.log('Manager approval updated successfully:', result);
            setShowAlert(true);

            setTimeout(() => {
                setShowAlert(false);
                if (id_division_competency === 86) {
                    navigate('/request-list-it');
                }
                else {
                    navigate('/request-list');
                }
            }, 2000);

        } catch (error) {
            console.error('Error updating manager approval:', error);
        }
    };

    return (
        <Stack direction={{ xs: 'column', sm: 'row' }}>
            <Item>
                <FormLabel>Manager Approve</FormLabel>
                <Input variant="outlined" color="success" type='text' placeholder='Manager Name' value={managerName} readOnly={true} onChange={(e) => setManagerName(e.target.value)} />
            </Item>
            <Item>
                <FormLabel>Status</FormLabel>
                <Select
                    action={action}
                    value={value1}
                    placeholder="Status"
                    onChange={(_e, newValue) => {
                        console.log("Selected Value:", newValue);
                        setValue1(newValue);
                    }}
                    variant="outlined" color="success"
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
            </Item>
            {showSubmitButton && <Button onClick={handleSubmit}>Submit</Button>}
            {showAlert && <ApproveAlert onClose={function (): void {
                throw new Error('Function not implemented.');
            }} />}
        </Stack>
    );
};

export const BoxDirectorApprove = ({ directorApprove, m_name, id_section_competency }: { directorApprove: ApproveProps, m_name: string | null, id_section_competency: number }) => {
    const [value2, setValue2] = React.useState<number | null>(null);
    const [approveOptions, setApproveOptions] = useState<{ id_approve: number, name_approve: string }[]>([]);
    const [directorName, setDirectorName] = useState<string>(directorApprove?.name || '');
    const [showSubmitButton, setShowSubmitButton] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const action: SelectStaticProps['action'] = React.useRef(null);
    const navigate = useNavigate();
    console.log("Director Approve:", directorApprove);
    console.log("m_name:", m_name);
    useEffect(() => {
        const storedUserData = sessionStorage.getItem('userData');
        if (storedUserData) {
            const userData: UserData = JSON.parse(storedUserData);
            console.log("User Datad:", userData);
            if (userData.position === 'd' && !directorApprove?.name) {
                setDirectorName(userData.name_employee);
            }
            else if (directorApprove?.name) {
                setDirectorName(directorApprove.name);
                setValue2(directorApprove.status ? parseInt(directorApprove.status) : null);
            }

            // Check conditions to show/hide submit button
            const shouldShowSubmitButton = Boolean(directorApprove.req_id) &&
                !directorApprove.status &&
                userData.position === 'd';
            setShowSubmitButton(shouldShowSubmitButton);
        }

        fetchApproveOptions().then(data => {
            console.log("Approve Options:", data);
            setApproveOptions(data);
        });
    }, [directorApprove?.name, directorApprove.req_id, directorApprove.status]);

    const handleSubmit = async () => {
        if (!value2) {
            alert('Status cannot be empty');
            return;
        }

        if (!directorApprove.req_id) {
            alert('Request ID cannot be empty');
            return;
        }

        try {
            if (!m_name) {
                // If ManagerApprove.name is null, save DirectorApprove as ManagerApprove
                const response = await fetch(`${URLAPI}/m_approve/${directorApprove.req_id}?name=${encodeURIComponent(directorName)}&status=${encodeURIComponent(value2)}`, {
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

            // Save DirectorApprove
            const response = await fetch(`${URLAPI}/d_approve/${directorApprove.req_id}?name=${encodeURIComponent(directorName)}&status=${encodeURIComponent(value2)}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            console.log(directorName, value2);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            console.log('Director approval updated successfully:', result);
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
    };

    return (
        <Stack direction={{ xs: 'column', sm: 'row' }}>
            <Item>
                <FormLabel>Director Approve</FormLabel>
                <Input variant="outlined" color="warning" type='text' placeholder='Director Name' value={directorName} readOnly={true} onChange={(e) => setDirectorName(e.target.value)} />
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