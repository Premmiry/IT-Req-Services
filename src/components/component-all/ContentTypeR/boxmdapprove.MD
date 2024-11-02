import React, { useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import { FormLabel, Input, Select, Option, IconButton, Sheet, styled, SelectStaticProps, Button } from '@mui/joy';
import CloseRounded from '@mui/icons-material/CloseRounded';
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
}

interface UserData {
    name_employee: string;
    position: string;
}

export const BoxManagerApprove = ({ managerApprove }: { managerApprove: ApproveProps }) => {
    const [value1, setValue1] = React.useState<string | null>(managerApprove?.status || '');
    const [approveOptions, setApproveOptions] = useState<{ id_approve: number, name_approve: string }[]>([]);
    const [managerName, setManagerName] = useState<string>(managerApprove?.name || '');
    const [showSubmitButton, setShowSubmitButton] = useState(false);
    const action: SelectStaticProps['action'] = React.useRef(null);

    useEffect(() => {
        const storedUserData = sessionStorage.getItem('userData');
        if (storedUserData) {
            const userData: UserData = JSON.parse(storedUserData);
            console.log("User Datam:", userData);
            if (userData.position === 'm' || userData.position === 'd' && !managerApprove?.name) {
                setManagerName(userData.name_employee);
            }

            // Check conditions to show/hide submit button
            const shouldShowSubmitButton = Boolean(managerApprove.req_id) && 
                                        !managerApprove.status && 
                                        userData.position === 'm';
            setShowSubmitButton(shouldShowSubmitButton);
        }

        fetchApproveOptions().then(data => setApproveOptions(data));
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
            const response = await fetch(`${URLAPI}/m_approve/${managerApprove.req_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: managerName,
                    status: value1,
                }),
            });
            console.log(managerName , value1);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log('Manager approval updated successfully:', result);
            const userData: UserData = JSON.parse(sessionStorage.getItem('userData') || '{}');
            const shouldShowSubmitButton = Boolean(managerApprove.req_id) && 
                                        !value1 && 
                                        userData.position === 'm';
            setShowSubmitButton(shouldShowSubmitButton);
            
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
                    onChange={(_e, newValue) => setValue1(newValue)}
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
                        <Option key={option.id_approve} value={option.name_approve}>
                            {option.name_approve}
                        </Option>
                    ))}
                </Select>
            </Item>
            {showSubmitButton && <Button onClick={handleSubmit}>Submit</Button>}
        </Stack>
    );
};

export const BoxDirectorApprove = ({ directorApprove }: { directorApprove: ApproveProps }) => {
    const [value2, setValue2] = React.useState<string | null>(directorApprove?.status || '');
    const [approveOptions, setApproveOptions] = useState<{ id_approve: number, name_approve: string }[]>([]);
    const [directorName, setDirectorName] = useState<string>(directorApprove?.name || '');
    const [showSubmitButton, setShowSubmitButton] = useState(false);
    const action: SelectStaticProps['action'] = React.useRef(null);

    useEffect(() => {
        const storedUserData = sessionStorage.getItem('userData');
        if (storedUserData) {
            const userData: UserData = JSON.parse(storedUserData);
            console.log("User Datad:", userData);
            if (userData.position === 'd' && !directorApprove?.name) {
                setDirectorName(userData.name_employee);
            }

            // Check conditions to show/hide submit button
            const shouldShowSubmitButton = Boolean(directorApprove.req_id) && 
                                        !directorApprove.status && 
                                        userData.position === 'd';
            setShowSubmitButton(shouldShowSubmitButton);
        }

        fetchApproveOptions().then(data => setApproveOptions(data));
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
            const response = await fetch(`${URLAPI}/d_approve/${directorApprove.req_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: directorName,
                    status: value2
                }),
                
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log('Director approval updated successfully:', result);
            const userData: UserData = JSON.parse(sessionStorage.getItem('userData') || '{}');
            const shouldShowSubmitButton = Boolean(directorApprove.req_id) && 
                                        !value2 && 
                                        userData.position === 'd';
            setShowSubmitButton(shouldShowSubmitButton);
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
                    onChange={(_e, newValue) => setValue2(newValue)}
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
                        <Option key={option.id_approve} value={option.name_approve}>
                            {option.name_approve}
                        </Option>
                    ))}
                </Select>
            </Item>
            {showSubmitButton && <Button onClick={handleSubmit}>Submit</Button>}
        </Stack>
    );
};