import React, { useEffect, useState, useCallback, useMemo } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import { FormLabel, Input, Select, Option, SelectStaticProps, Button } from '@mui/joy';
import Grid from '@mui/joy/Grid';
import { ApproveAlert } from '../Alert/alert';
import { useNavigate } from 'react-router-dom';
import URLAPI from '../../../URLAPI';

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

const useApproveOptions = () => {
    const [approveOptions, setApproveOptions] = useState<{ id_approve: number, name_approve: string }[]>([]);

    useEffect(() => {
        fetchApproveOptions().then(data => {
            setApproveOptions(data);
        });
    }, []);

    return approveOptions;
};

export const BoxManagerApprove = ({ managerApprove, id_division_competency, check_m, check_d, type_id }: { managerApprove: ApproveProps, id_division_competency: number | null, check_m: number | null, check_d: number | null, type_id: number | null }) => {
    const [value1, setValue1] = useState<number | null>(null);
    const approveOptions = useApproveOptions();
    const [managerName, setManagerName] = useState<string>(managerApprove?.name || '');
    const [check_manager, setCheck_manager] = useState<number | null>(check_m);
    const [check_director, setCheck_director] = useState<number | null>(check_d);
    const [showSubmitButton, setShowSubmitButton] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const action: SelectStaticProps['action'] = React.useRef(null);
    const navigate = useNavigate();

    const memoizedManagerApprove = useMemo(() => ({
        name: managerApprove?.name,
        req_id: managerApprove?.req_id,
        status: managerApprove?.status,
        check_m: check_m,
        check_d: check_d,
        type_id: type_id
    }), [managerApprove, check_m, check_d, type_id]);
    console.log(memoizedManagerApprove);

    useEffect(() => {
        const storedUserData = sessionStorage.getItem('userData');
        if (storedUserData) {
            const userData: UserData = JSON.parse(storedUserData);
            if ((userData.position === 'm' || userData.position === 'd') && !memoizedManagerApprove.name) {
                setManagerName(userData.name_employee);
                setCheck_manager(memoizedManagerApprove.check_m);
                setCheck_director(memoizedManagerApprove.check_d);
            } else if (memoizedManagerApprove.name) {
                setManagerName(memoizedManagerApprove.name);
                setValue1(memoizedManagerApprove.status ? parseInt(memoizedManagerApprove.status) : null);
                setCheck_manager(memoizedManagerApprove.check_m);
                setCheck_director(memoizedManagerApprove.check_d);
            }

            const shouldShowSubmitButton = Boolean(memoizedManagerApprove.req_id) &&
                !memoizedManagerApprove.status &&
                userData.position === 'm';
            setShowSubmitButton(shouldShowSubmitButton);
        }
    }, [memoizedManagerApprove, check_m, check_d, type_id]);

    const handleSubmit = useCallback(async () => {
        if (!value1) {
            alert('Status cannot be empty');
            return;
        }

        if (!managerApprove.req_id) {
            alert('Request ID cannot be empty');
            return;
        }

        if (value1 !== 3) {
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

                if (response.ok && check_manager === 1 && check_director === 0) {
                    const response_m = await fetch(`${URLAPI}/change_status/${managerApprove.req_id}?change=admin`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });
                    if (!response_m.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const result_m = await response_m.json();
                    console.log('Manager approval updated successfully:', result_m);

                } else if (response.ok && check_manager === 1 && check_director === 1) {
                    const response_m = await fetch(`${URLAPI}/change_status/${managerApprove.req_id}?change=director`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });
                    if (!response_m.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const result_m = await response_m.json();
                    console.log('Manager approval updated successfully:', result_m);
                } else if (type_id === 3) {
                    const response_m = await fetch(`${URLAPI}/change_status/${managerApprove.req_id}?change=director`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });
                    if (!response_m.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const result_m = await response_m.json();
                    console.log('Manager approval updated successfully:', result_m);
                }


                setShowAlert(true);

                setTimeout(() => {
                    setShowAlert(false);
                    navigate(id_division_competency === 86 ? '/request-list-it' : '/request-list');
                }, 2000);


            } catch (error) {
                console.error('Error updating manager approval:', error);
            }
        } else {
            try {
                const response = await fetch(`${URLAPI}/change_status/${managerApprove.req_id}?change=rewrite`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();
                console.log('Manager approval updated successfully:', result);
                const responseclear = await fetch(`${URLAPI}/clearall_approve/${managerApprove.req_id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                if (!responseclear.ok) {
                    throw new Error('Network response was not ok');
                }
                const resultclear = await responseclear.json();
                console.log('Manager approval updated successfully:', resultclear);
            } catch (error) {
                console.error('Error updating manager approval:', error);
            }
        }
    }, [value1, managerApprove, managerName, id_division_competency, navigate, check_manager, check_director, type_id]);

    return (
        <Grid container spacing={1}>
            <Grid xs={6}>
                <FormLabel>Manager Approve</FormLabel>
                <Input variant="outlined" color="success" type='text' placeholder='Manager Name' value={managerName} readOnly onChange={(e) => setManagerName(e.target.value)} />
            </Grid>

            <Grid xs={4}>
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
                    {...(value1 && { indicator: null })}
                >
                    {approveOptions.map(option => (
                        <Option key={option.id_approve} value={option.id_approve}>
                            {option.name_approve}
                        </Option>
                    ))}
                </Select>
            </Grid>
            <Grid xs={1}>
                {showSubmitButton && ((check_manager === 1 && type_id !== 3) || type_id === 3) && (
                    <>
                        <FormLabel>Approve</FormLabel>
                        <Button
                            color="success"
                            variant="soft"
                            onClick={handleSubmit}
                        >
                            <SaveIcon />
                        </Button>
                    </>
                )}
                {showAlert && <ApproveAlert onClose={() => { /* Implement onClose function here */ }} />}
            </Grid>
        </Grid>
    );
};

export const BoxDirectorApprove = ({ directorApprove, m_name, id_section_competency, check_m, check_d, type_id }: { directorApprove: ApproveProps, m_name: string | null, id_section_competency: number, check_m: number | null, check_d: number | null, type_id: number | null }) => {
    const [value2, setValue2] = useState<number | null>(null);
    const approveOptions = useApproveOptions();
    const [directorName, setDirectorName] = useState<string>(directorApprove?.name || '');
    const [check_manager, setCheck_manager] = useState<number | null>(check_m);
    const [check_director, setCheck_director] = useState<number | null>(check_d);
    const [showSubmitButton, setShowSubmitButton] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const action: SelectStaticProps['action'] = React.useRef(null);
    const navigate = useNavigate();

    const memoizedDirectorApprove = useMemo(() => ({
        name: directorApprove?.name,
        req_id: directorApprove?.req_id,
        status: directorApprove?.status,
        check_m: check_m,
        check_d: check_d,
        type_id: type_id
    }), [directorApprove, check_m, check_d, type_id]);

    useEffect(() => {
        const storedUserData = sessionStorage.getItem('userData');
        if (storedUserData) {
            const userData: UserData = JSON.parse(storedUserData);
            if (userData.position === 'd' && !memoizedDirectorApprove.name) {
                setDirectorName(userData.name_employee);
                setCheck_manager(memoizedDirectorApprove.check_m);
                setCheck_director(memoizedDirectorApprove.check_d);
            } else if (memoizedDirectorApprove.name) {
                setDirectorName(memoizedDirectorApprove.name);
                setValue2(memoizedDirectorApprove.status ? parseInt(memoizedDirectorApprove.status) : null);
                setCheck_manager(memoizedDirectorApprove.check_m);
                setCheck_director(memoizedDirectorApprove.check_d);
            }

            const shouldShowSubmitButton = Boolean(memoizedDirectorApprove.req_id) &&
                !memoizedDirectorApprove.status &&
                userData.position === 'd';
            setShowSubmitButton(shouldShowSubmitButton);
        }
    }, [memoizedDirectorApprove, check_m, check_d, type_id]);

    const handleSubmit = useCallback(async () => {
        if (!value2) {
            alert('Status cannot be empty');
            return;
        }

        if (!directorApprove.req_id) {
            alert('Request ID cannot be empty');
            return;
        }

        if (value2 !== 3) {
            try {
                if ((!m_name && check_manager === 1 && type_id !== 3) || (!m_name && type_id === 3)) {
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

                const response = await fetch(`${URLAPI}/d_approve/${directorApprove.req_id}?name=${encodeURIComponent(directorName)}&status=${encodeURIComponent(value2)}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const result = await response.json();
                console.log('Director approval updated successfully:', result);

                if (response.ok && check_director === 1) {
                    const response_d = await fetch(`${URLAPI}/change_status/${directorApprove.req_id}?change=admin`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });
                    if (!response_d.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const result_d = await response_d.json();
                    console.log('Director approval updated successfully:', result_d);
                } else if (type_id === 3) {
                    const response_d = await fetch(`${URLAPI}/change_status/${directorApprove.req_id}?change=admin`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });
                    if (!response_d.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const result_d = await response_d.json();
                    console.log('Director approval updated successfully:', result_d);
                }
                setShowAlert(true);
                setTimeout(() => {
                    setShowAlert(false);
                    navigate(id_section_competency === 28 ? '/request-list-it' : '/request-list');
                }, 2000);
                
            } catch (error) {
                console.error('Error updating director approval:', error);
            }
        } else {
            try {
                const response = await fetch(`${URLAPI}/change_status/${directorApprove.req_id}?change=rewrite`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();
                console.log('Director approval updated successfully:', result);
                const responseclear = await fetch(`${URLAPI}/clearall_approve/${directorApprove.req_id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                if (!responseclear.ok) {
                    throw new Error('Network response was not ok');
                }
                const resultclear = await responseclear.json();
                console.log('Director approval updated successfully:', resultclear);
            } catch (error) {
                console.error('Error updating director approval:', error);
            }
        }
    }, [value2, directorApprove, directorName, id_section_competency, navigate, m_name, check_manager, check_director]);

    return (
        <Grid container spacing={1}>
            <Grid xs={6}>
                <FormLabel>Director Approve</FormLabel>
                <Input variant="outlined" color="warning" type='text' placeholder='Director Name' value={directorName} readOnly onChange={(e) => setDirectorName(e.target.value)} />
            </Grid>

            <Grid xs={4}>
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
                    {...(value2 && { indicator: null })}
                >
                    {approveOptions.map(option => (
                        <Option key={option.id_approve} value={option.id_approve}>
                            {option.name_approve}
                        </Option>
                    ))}
                </Select>
            </Grid>
            <Grid xs={1}>
                {showSubmitButton && ((check_director === 1 && type_id !== 3) || type_id === 3) && (
                    <>
                        <FormLabel>Approve</FormLabel>
                        <Button
                            color="warning"
                            variant="soft"
                            onClick={handleSubmit}
                        >
                            <SaveIcon />
                        </Button>
                    </>
                )}
                {showAlert && (
                    <ApproveAlert
                        onClose={() => {
                            /* Implement onClose function here */
                        }}
                    />
                )}
            </Grid>
        </Grid>
    );
};