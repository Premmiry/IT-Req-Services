import React, { useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import { FormLabel, Input, Select, Option, IconButton, Sheet, styled, SelectStaticProps, Button } from '@mui/joy';
import CloseRounded from '@mui/icons-material/CloseRounded';

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
    const response = await fetch('http://127.0.0.1:1234/mtapprove');
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

export const BoxManagerApprove = ({ managerApprove }: { managerApprove: ApproveProps }) => {
    const [value1, setValue1] = React.useState<string | null>(managerApprove?.status || 'approve');
    const [approveOptions, setApproveOptions] = useState<{ id_approve: number, name_approve: string }[]>([]);
    const [managerName, setManagerName] = useState<string>(managerApprove?.name || '');
    const action: SelectStaticProps['action'] = React.useRef(null);

    useEffect(() => {
        fetchApproveOptions().then(data => setApproveOptions(data));
    }, []);

    const handleSubmit = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:1234/approve/${managerApprove.req_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    position: 'm',
                    m_name: managerName,
                    m_status: value1,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log('Manager approval updated successfully:', result);
        } catch (error) {
            console.error('Error updating manager approval:', error);
        }
    };

    return (
        <Stack direction={{ xs: 'column', sm: 'row' }}>
            <Item>
                <FormLabel>Manager Approve</FormLabel>
                <Input variant="outlined" color="success" type='text' placeholder='Manager Name' value={managerName} onChange={(e) => setManagerName(e.target.value)} />
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
            <Button onClick={handleSubmit}>Submit</Button>
        </Stack>
    );
};

export const BoxDirectorApprove = ({ directorApprove }: { directorApprove: ApproveProps }) => {
    const [value2, setValue2] = React.useState<string | null>(directorApprove?.status || 'approve');
    const [approveOptions, setApproveOptions] = useState<{ id_approve: number, name_approve: string }[]>([]);
    const [directorName, setDirectorName] = useState<string>(directorApprove?.name || '');
    const action: SelectStaticProps['action'] = React.useRef(null);

    useEffect(() => {
        fetchApproveOptions().then(data => setApproveOptions(data));
    }, []);

    const handleSubmit = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:1234/approve/${directorApprove.req_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    position: 'd',
                    d_name: directorName,
                    d_status: value2,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log('Director approval updated successfully:', result);
        } catch (error) {
            console.error('Error updating director approval:', error);
        }
    };

    return (
        <Stack direction={{ xs: 'column', sm: 'row' }}>
            <Item>
                <FormLabel>Director Approve</FormLabel>
                <Input variant="outlined" color="warning" type='text' placeholder='Director Name' value={directorName} onChange={(e) => setDirectorName(e.target.value)} />
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
            <Button onClick={handleSubmit}>Submit</Button>
        </Stack>
    );
};