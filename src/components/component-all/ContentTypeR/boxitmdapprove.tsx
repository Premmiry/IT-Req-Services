import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Grid, FormGroup } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { FormLabel, Input, Select, Option, SelectStaticProps, Button } from "@mui/joy";
import { ApproveAlert } from "../Alert/alert";
import { useNavigate } from "react-router-dom";
import URLAPI from "../../../URLAPI";
import CheckboxITApprove from "../Checkbox/checkbox_it_approve";

const fetchApproveOptions = async () => {
    const response = await fetch(`${URLAPI}/mtapprove`);
    if (!response.ok) {
        throw new Error("Network response was not ok");
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
    const [approveOptions, setApproveOptions] = useState<
        { id_approve: number; name_approve: string }[]
    >([]);

    useEffect(() => {
        fetchApproveOptions().then((data) => {
            setApproveOptions(data);
        });
    }, []);

    return approveOptions;
};

export const BoxITManagerApprove = ({ itmanagerApprove, id_division_competency, it_m_note, onLevelJobChange, check_it_m, check_it_d, type_id }: { itmanagerApprove: ApproveProps; id_division_competency: number | null; it_m_note: string | null;
onLevelJobChange?: (levelJob: number | null) => void, check_it_m: number | null, check_it_d: number | null, type_id: number | null }) => {
    const [value1, setValue1] = React.useState<number | null>(null);
    const approveOptions = useApproveOptions();
    const [itmanagerName, setITManagerName] = useState<string>(itmanagerApprove?.name || "");
    const [levelJob, setLevelJob] = useState<number | null>(itmanagerApprove?.level_job || null);
    const [check_Itmanager, setCheckItManager] = useState<number | null>(check_it_m);
    const [check_Itdirector, setCheckItDirector] = useState<number | null>(check_it_d);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [showSubmitButton, setShowSubmitButton] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const action: SelectStaticProps["action"] = React.useRef(null);
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
            level_job: itmanagerApprove?.level_job,
            check_it_m: check_it_m,
            check_it_d: check_it_d,
            type_id: type_id
        };
    }, [itmanagerApprove?.name, itmanagerApprove?.req_id, itmanagerApprove?.status, itmanagerApprove?.level_job, check_it_m, check_it_d, type_id]);

    useEffect(() => {
        const storedUserData = sessionStorage.getItem("userData");
        if (storedUserData) {
            const userData: UserData = JSON.parse(storedUserData);
            setUserData(userData);

            if (
                (userData.position === "m" || userData.position === "d") &&
                !memoizedITManagerApprove.name
            ) {
                setITManagerName(userData.name_employee);
                setCheckItManager(memoizedITManagerApprove.check_it_m);
                setCheckItDirector(memoizedITManagerApprove.check_it_d);
            } else if (memoizedITManagerApprove.name) {
                setITManagerName(memoizedITManagerApprove.name);
                setValue1(
                    memoizedITManagerApprove.status
                        ? parseInt(memoizedITManagerApprove.status)
                        : null
                );
                setLevelJob(memoizedITManagerApprove.level_job);
                setCheckItManager(memoizedITManagerApprove.check_it_m);
                setCheckItDirector(memoizedITManagerApprove.check_it_d);
            }

            const shouldShowSubmitButton =
                Boolean(memoizedITManagerApprove.req_id) &&
                !memoizedITManagerApprove.status &&
                userData.position === "m";
            setShowSubmitButton(shouldShowSubmitButton);
        }
    }, [memoizedITManagerApprove, check_it_m, check_it_d, type_id]);

    const handleChangeCheck =
        () => (event: React.ChangeEvent<HTMLInputElement>) => {
            const value = parseInt(event.target.value, 10);
            handleLevelJobChange(value);
            console.log("Level Job:", value);
        };

    const handleSubmit = useCallback(async () => {
        if (!value1) {
            alert("Status cannot be empty");
            return;
        }

        if (!itmanagerApprove.req_id) {
            alert("Request ID cannot be empty");
            return;
        }

        if (!levelJob) {
            alert("Level Job cannot be empty");
            console.log("Level Job:", levelJob);
            return;
        }

        if (value1 !== 3) {
            try {
                const response = await fetch(
                    `${URLAPI}/it_m_approve/${itmanagerApprove.req_id}?name=${encodeURIComponent(itmanagerName)}&status=${encodeURIComponent(value1)}&note=${encodeURIComponent(it_m_note ?? "")}&level_job=${Number(levelJob)}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    const errorMessage = await response.text();
                    console.error("Error:", errorMessage);
                    alert(`Error: ${errorMessage}`);
                    throw new Error("Network response was not ok");
                }

                if (response.ok && check_Itmanager === 1 && check_Itdirector === 0) {
                    const response_m = await fetch(`${URLAPI}/change_status/${itmanagerApprove.req_id}?change=todo`, {
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
                } else if (response.ok && check_Itmanager === 1 && check_Itdirector === 1) {
                    const response_m = await fetch(`${URLAPI}/change_status/${itmanagerApprove.req_id}?change=it_director`, {
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
                    const response_m = await fetch(`${URLAPI}/change_status/${itmanagerApprove.req_id}?change=it_director`, {
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


                const result = await response.json();
                console.log("IT-Manager approval updated successfully:", result);
                setShowAlert(true);

                setTimeout(() => {
                    setShowAlert(false);
                    navigate(id_division_competency === 86 ? '/request-list-it' : '/request-list');
                }, 2000);
            } catch (error) {
                console.error("Error updating manager approval:", error);
            }
        } else {
            try {
                const response = await fetch(`${URLAPI}/change_status/${itmanagerApprove.req_id}?change=rewrite`, {
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
                const responseclear = await fetch(`${URLAPI}/clearall_approve/${itmanagerApprove.req_id}`, {
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
    }, [value1, itmanagerApprove, itmanagerName, it_m_note, id_division_competency, navigate, levelJob, check_Itmanager,check_Itdirector,type_id]);

    return (
        <Grid container spacing={1}>
            <Grid item xs={6} component="div">
                <FormLabel>IT Manager Approve</FormLabel>
                <Input
                    variant="outlined"
                    color="success"
                    type="text"
                    placeholder="Manager Name"
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
                    {approveOptions.map((option) => (
                        <Option key={option.id_approve} value={option.id_approve}>
                            {option.name_approve}
                        </Option>
                    ))}
                </Select>
            </Grid>
            <Grid item xs={3} component="div">
                {showSubmitButton && ((check_Itmanager === 1 && type_id !== 3) || type_id === 3) && (
                    <>
                        <FormLabel>Approve</FormLabel>
                        <Button color="success" variant="soft" onClick={handleSubmit}>
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

            <Grid item xs={12} component="div">
                <FormGroup aria-label="position" row id={`checkbox_group`}>
                    <CheckboxITApprove
                        levelJob={levelJob}
                        onChange={handleChangeCheck()}
                        loading3={false}
                    />
                </FormGroup>
            </Grid>

        </Grid>
    );
};

export const BoxITDirectorApprove = ({itdirectorApprove, it_m_name,id_section_competency, it_d_note, levelJob: initialLevelJob, check_it_m, check_it_d, type_id}: {itdirectorApprove: ApproveProps; it_m_name: string | null; id_section_competency: number; it_d_note: string | null; levelJob: number | null, check_it_m: number | null, 
check_it_d: number | null, type_id: number | null}) => {
    const [value2, setValue2] = React.useState<number | null>(null);
    const approveOptions = useApproveOptions();
    const [itdirectorName, setITDirectorName] = useState<string>(itdirectorApprove?.name || '');
    const [showSubmitButton, setShowSubmitButton] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [levelJob, setLevelJob] = useState<number | null>(initialLevelJob);
    const [check_Itmanager, setCheckItManager] = useState<number | null>(check_it_m);
    const [check_Itdirector, setCheckItDirector] = useState<number | null>(check_it_d);
    const action: SelectStaticProps['action'] = React.useRef(null);
    const navigate = useNavigate();



    const memoizedITDirectorApprove = useMemo(() => {
        return {
            name: itdirectorApprove?.name,
            req_id: itdirectorApprove?.req_id,
            status: itdirectorApprove?.status,
            check_it_m: check_it_m,
            check_it_d: check_it_d,
            type_id: type_id
        };
    }, [itdirectorApprove?.name, itdirectorApprove?.req_id, itdirectorApprove?.status, check_it_m, check_it_d, type_id]);

    useEffect(() => {
        // Update levelJob when initialLevelJob changes
        setLevelJob(initialLevelJob);
    }, [initialLevelJob, check_it_m, check_it_d, type_id]);



    useEffect(() => {
        const storedUserData = sessionStorage.getItem('userData');
        if (storedUserData) {
            const userData: UserData = JSON.parse(storedUserData);
            if (userData.position === 'd' && !memoizedITDirectorApprove.name) {
                setITDirectorName(userData.name_employee);
                setCheckItManager(memoizedITDirectorApprove.check_it_m);
                setCheckItDirector(memoizedITDirectorApprove.check_it_d);
            } else if (memoizedITDirectorApprove.name) {
                setITDirectorName(memoizedITDirectorApprove.name);
                setValue2(memoizedITDirectorApprove.status ? parseInt(memoizedITDirectorApprove.status) : null);
                setCheckItManager(memoizedITDirectorApprove.check_it_m);
                setCheckItDirector(memoizedITDirectorApprove.check_it_d);
            }

            const shouldShowSubmitButton = Boolean(memoizedITDirectorApprove.req_id) &&
                !memoizedITDirectorApprove.status &&
                userData.position === 'd';
            setShowSubmitButton(shouldShowSubmitButton);
        }
    }, [memoizedITDirectorApprove, check_it_m, check_it_d, type_id]);

    const handleSubmit = useCallback(async () => {
        if (!value2) {
            alert("Status cannot be empty");
            return;
        }

        if (!itdirectorApprove.req_id) {
            alert("Request ID cannot be empty");
            return;
        }

        if (!levelJob) {
            alert('Level Job cannot be empty');
            return;
        }

        if (value2 !== 3) {
        try {
            if ((!it_m_name && check_Itmanager === 1 && type_id !== 3) || (!it_m_name && type_id === 3)) {
                const response = await fetch(
                    `${URLAPI}/it_m_approve/${itdirectorApprove.req_id}?name=${encodeURIComponent(itdirectorName)}&status=${encodeURIComponent(value2)}&note=${encodeURIComponent(it_d_note ?? "")}&level_job=${encodeURIComponent(levelJob ?? "")}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                if (!response.ok) {
                    const errorMessage = await response.text();
                    console.error("Error:", errorMessage);
                    alert(`Error: ${errorMessage}`);
                    throw new Error("Network response was not ok");
                }
            }

            const response = await fetch(
                `${URLAPI}/it_d_approve/${itdirectorApprove.req_id}?name=${encodeURIComponent(itdirectorName)}&status=${encodeURIComponent(value2)}&note=${encodeURIComponent(it_d_note ?? "")}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            if (response.ok && check_Itdirector === 1) {
                const response_d = await fetch(`${URLAPI}/change_status/${itdirectorApprove.req_id}?change=todo`, {
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
                const response_d = await fetch(`${URLAPI}/change_status/${itdirectorApprove.req_id}?change=todo`, {
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
            const result = await response.json();
            console.log("IT Director approval updated successfully:", result);
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
                if (id_section_competency === 28) {
                    navigate("/request-list-it");
                } else {
                    navigate("/request-list");
                }
            }, 2000);
        } catch (error) {
                console.error("Error updating director approval:", error);
            }
        } else {
            try {
                const response = await fetch(`${URLAPI}/change_status/${itdirectorApprove.req_id}?change=rewrite`, {
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
                const responseclear = await fetch(`${URLAPI}/clearall_approve/${itdirectorApprove.req_id}`, {
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
    }, [value2,itdirectorApprove,itdirectorName,it_d_note,id_section_competency,navigate,it_m_name,levelJob,check_Itmanager,check_Itdirector,type_id]);

    return (
        <Grid container spacing={1}>
            <Grid item xs={6} component="div">
                <FormLabel>IT Director / Deputy Approve</FormLabel>
                <Input
                    variant="outlined"
                    color="warning"
                    type="text"
                    placeholder="Director Name"
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
                    {approveOptions.map((option) => (
                        <Option key={option.id_approve} value={option.id_approve}>
                            {option.name_approve}
                        </Option>
                    ))}
                </Select>
            </Grid>

            <Grid item xs={3} component="div">
                {showSubmitButton && ((check_Itdirector === 1 && type_id !== 3) || type_id === 3) && (
                    <>
                        <FormLabel>Approve</FormLabel>
                        <Button color="warning" variant="soft" onClick={handleSubmit}>
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