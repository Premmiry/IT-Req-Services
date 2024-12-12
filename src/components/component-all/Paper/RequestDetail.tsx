import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Typography,
    Divider,
    Grid,
    Link,
    Stepper,
    Step,
    StepLabel,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import URLAPI from "../../../URLAPI";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonCheckedSharpIcon from "@mui/icons-material/RadioButtonCheckedSharp";
import AssigneeDepSelector from "../Select/AssigneeDepSelector";
import AssigneeEmpSelector from "../Select/AssigneeEmpSelector";
import { SelectPriority } from "../Select/select-priority";
import DateWork from "../DatePicker/datework";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 1100,
    maxHeight: "100vh",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    overflowY: "auto",
};

// Interfaces
interface RequestData {
    id: number;
    id_department: number;
    name_department: string;
    type_id: number | null;
    type: string;
    topic_id: number | null;
    topic: string;
    id_program?: number;
    program_name?: string;
    name_req: string;
    phone: string;
    title_req: string;
    detail_req: string;
    rs_code: string;
    created_at: string;
    status_id: number | null;
    status_name: string;
    files?: string;
    // Approval fields
    m_name?: string;
    m_status?: string;
    mapp?: string;
    d_name?: string;
    d_status?: string;
    dapp?: string;
    it_m_name?: string;
    it_m_status?: string;
    itmapp?: string;
    it_m_note?: string;
    it_d_name?: string;
    it_d_status?: string;
    itdapp?: string;
    it_d_note?: string;
    id_priority?: number | null;
    name_priority?: string | null;
    date_start?: Date | null;
    date_end?: Date | null;
}

interface FileInfo {
    file_path: string;
    file_name: string;
    file_old_name: string;
    file_new_name: string;
}

interface RequestDetailProps {
    id: number;
    isModal?: boolean;
    onClose?: () => void;
    readOnly?: boolean; // Add this
}

// Component
const RequestDetail: React.FC<RequestDetailProps> = ({
    id,
    isModal,
    onClose,
    readOnly = false,
}: RequestDetailProps) => {
    const navigate = useNavigate();

    // State declarations
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [requestData, setRequestData] = useState<RequestData | null>(null);
    const [uploadedFiles, setUploadedFiles] = useState<FileInfo[]>([]);
    // const [userData, setUserData] = useState<any | null>(null);
    const [userData, setUserData] = useState<any | null>(null);
    const [admin, setAdmin] = useState<string | null>(null);

    // Helper function to format dates
    const formatDate = useCallback((dateString: string): string => {
        const date = new Date(dateString);
        const buddhistYear = date.getFullYear() + 543;
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        return `${day}/${month}/${buddhistYear}`;
    }, []);

    const isITStaff = useMemo(() => {
        return (
            userData?.id_section === 28 ||
            userData?.id_division_competency === 86 ||
            userData?.id_section_competency === 28
        );
    }, [userData]);

    // Fetch Functions
    const fetchRequestData = useCallback(async () => {
        if (!id) return;
        try {
            const response = await fetch(`${URLAPI}/it-requests?req_id=${id}`);
            if (!response.ok)
                throw new Error(`Error fetching request data: ${response.statusText}`);

            const { data } = await response.json();
            console.log("ข้อมูลที่ได้จาก API:", data);

            if (data && data.length > 0) {
                const requestData = data[0];
                setRequestData(requestData);
            }

            if (data[0].files) {
                try {
                    const parsedFiles = JSON.parse(data[0].files);
                    setUploadedFiles(Array.isArray(parsedFiles) ? parsedFiles : []);
                } catch (e) {
                    console.error("Error parsing files:", e);
                    setUploadedFiles([]);
                }
            }

            // console.log('Request data:', data[0]);
        } catch (error) {
            setError(error instanceof Error ? error.message : "An error occurred");
        }
    }, [id]);

    // Effects
    useEffect(() => {
        const fetchAllData = async () => {
            setIsLoading(true);
            try {
                await Promise.all([fetchRequestData()]);
            } catch (error) {
                setError(error instanceof Error ? error.message : "An error occurred");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllData();
    }, [fetchRequestData]);

    // Handlers
    const handleEdit = () => navigate(`/edit-request/${id}`);

    useEffect(() => {
        const storedUserData = sessionStorage.getItem("userData");
        const storedAdmin = sessionStorage.getItem("admin");

        console.log("Stored UserData:", storedUserData);
        console.log("Stored Admin:", storedAdmin);

        if (storedUserData) {
            const userDataParsed = JSON.parse(storedUserData);
            setUserData(userDataParsed);
            console.log("UserData:", userDataParsed);
        }

        if (storedAdmin) {
            setAdmin(storedAdmin);
            console.log("Admin:", storedAdmin);
        }
    }, []);

    // Render helpers
    if (isLoading) {
        return (
            <Box sx={{ p: 3, textAlign: "center" }}>
                <Typography>Loading...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3, textAlign: "center" }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    if (!requestData) {
        return (
            <Box sx={{ p: 3, textAlign: "center" }}>
                <Typography>No request data found</Typography>
            </Box>
        );
    }

    const getStatusStyle = (status: string) => {
        const styles = {
            "Request": {
                backgroundColor: '#42a5f5',  // สีฟ้า
                icon: <RadioButtonCheckedSharpIcon sx={{ fontSize: '1rem' }} />
            },
            "Manager Approve": {
                backgroundColor: '#66bb6a',  // สีเขียว
                icon: <CheckCircleIcon sx={{ fontSize: '1rem' }} />
            },
            "Manager Unapprove": {
                backgroundColor: '#ef5350',  // สีแดง
                icon: <RadioButtonCheckedSharpIcon sx={{ fontSize: '1rem' }} />
            },
            "Director Approve": {
                backgroundColor: '#4caf50',  // สีเขียวเข้ม
                icon: <CheckCircleIcon sx={{ fontSize: '1rem' }} />
            },
            "Director Unapprove": {
                backgroundColor: '#f44336',  // สีแดงเข้ม
                icon: <RadioButtonCheckedSharpIcon sx={{ fontSize: '1rem' }} />
            },
            "IT Manager Approve": {
                backgroundColor: '#8bc34a',  // สีเขียวอ่อน
                icon: <CheckCircleIcon sx={{ fontSize: '1rem' }} />
            },
            "IT Manager Unapprove": {
                backgroundColor: '#ff5722',  // สีส้มแดง
                icon: <RadioButtonCheckedSharpIcon sx={{ fontSize: '1rem' }} />
            },
            "IT Director / Director Deputy Approve": {
                backgroundColor: '#4db6ac',  // สีเขียวฟ้า
                icon: <CheckCircleIcon sx={{ fontSize: '1rem' }} />
            },
            "IT Director / Director Deputy Unapprove": {
                backgroundColor: '#ff7043',  // สีส้ม
                icon: <RadioButtonCheckedSharpIcon sx={{ fontSize: '1rem' }} />
            },
            "Admin Recieve": {
                backgroundColor: '#90a4ae',  // สีเทา
                icon: <RadioButtonCheckedSharpIcon sx={{ fontSize: '1rem' }} />
            },
            "In Progress": {
                backgroundColor: '#5c6bc0',  // สีน้ำเงิน
                icon: <RadioButtonCheckedSharpIcon sx={{ fontSize: '1rem' }} />
            },
            "Complete": {
                backgroundColor: '#2e7d32',  // สีเขียวเข้มมาก
                icon: <CheckCircleIcon sx={{ fontSize: '1rem' }} />
            },
            "Cancel": {
                backgroundColor: '#d32f2f',  // สีแดงเข้มมาก
                icon: <RadioButtonCheckedSharpIcon sx={{ fontSize: '1rem' }} />
            },
            "Revise": {
                backgroundColor: '#ffa726',  // สีส้มอ่อน
                icon: <RadioButtonCheckedSharpIcon sx={{ fontSize: '1rem' }} />
            },
            "Confirm Close": {
                backgroundColor: '#7cb342',  // สีเขียวอมเหลือง
                icon: <CheckCircleIcon sx={{ fontSize: '1rem' }} />
            },
            "Reject": {
                backgroundColor: '#c62828',  // สีแดงเลือดหมู
                icon: <RadioButtonCheckedSharpIcon sx={{ fontSize: '1rem' }} />
            },
            "To Do": {
                backgroundColor: '#9575cd',  // สีม่วง
                icon: <RadioButtonCheckedSharpIcon sx={{ fontSize: '1rem' }} />
            },
            "UAT": {
                backgroundColor: '#00acc1',  // สีฟ้าเขียว
                icon: <CheckCircleIcon sx={{ fontSize: '1rem' }} />
            }
        };
        return styles[status as keyof typeof styles] || { backgroundColor: '#81b1c9', icon: <RadioButtonCheckedSharpIcon sx={{ fontSize: '1rem' }} /> };
    };

    const handleConfirmJob = async () => {
        try {
            const response = await fetch(
                `${URLAPI}/change_status/${requestData.id}?change=complete`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json", // ถ้ามี token ให้ใส่ตรงนี้
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            console.log("Job confirmed successfully:", data);
            alert("Job confirmed successfully!"); // แจ้งเตือนเมื่อสำเร็จ
            if (onClose) {
                onClose();
            }
        } catch (error) {
            console.error("Failed to confirm job:", error);
            alert("Failed to confirm job. Please try again.");
        }
    };

    const handleCancelJob = async () => {
        try {
            const response = await fetch(
                `${URLAPI}/change_status/${requestData.id}?change=cancel`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json", // ถ้ามี token ให้ใส่ตรงนี้
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            console.log("Job canceled successfully:", data);
            alert("Job canceled successfully!"); // แจ้งเตือนเมื่อสำเร็จ
            if (onClose) {
                onClose();
            }
        } catch (error) {
            console.error("Failed to cancel job:", error);
            alert("Failed to cancel job. Please try again.");
        }
    };

    return (
        <Box sx={style}>
            <Typography
                variant="h5"
                gutterBottom
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <span>
                    {requestData.rs_code} : {requestData.topic}{" "}
                    {requestData.id_program
                        ? requestData.program_name
                        : requestData.title_req}
                </span>

                {/* Status */}
                <Stack direction="row" spacing={1} alignItems="center">
                    <Chip
                        label={requestData.status_name}
                        style={{
                            backgroundColor: getStatusStyle(requestData?.status_name ?? '').backgroundColor,
                            color: "#fff",
                        }}
                        size="medium"
                        icon={
                            requestData.status_name === "Complete" ? (
                                <CheckCircleIcon />
                            ) : (
                                <RadioButtonCheckedSharpIcon />
                            )
                        }
                        sx={{

                            color: "#fff",
                            minWidth: '140px',
                            height: '28px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            '& .MuiChip-icon': {
                                color: '#fff',
                                marginLeft: '4px'
                            },
                            '& .MuiChip-label': {
                                padding: '0 8px'
                            },
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            transition: 'transform 0.2s ease',
                            '&:hover': {
                                transform: 'translateY(-1px)',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                            }
                        }}
                    />
                </Stack>
            </Typography>

            <Box>
                <Card variant="outlined" sx={{ maxWidth: 1200 }}>
                    <Box sx={{ p: 2 }}>
                        <Stack direction="column">
                            <Stack
                                direction="row"
                                sx={{ justifyContent: "space-between", alignItems: "center" }}
                            >
                                <Typography gutterBottom component="div">
                                    Requestor:{" "}
                                    <Box
                                        component="span"
                                        sx={{ fontSize: "0.875rem", color: "primary.main" }}
                                    >
                                        {requestData.name_req}
                                    </Box>
                                </Typography>
                                <Typography gutterBottom component="div">
                                    Request Date:{" "}
                                    <Box
                                        component="span"
                                        sx={{ fontSize: "0.875rem", color: "warning.main" }}
                                    >
                                        {formatDate(requestData.created_at)}
                                    </Box>
                                </Typography>
                            </Stack>

                            <Stack
                                direction="row"
                                sx={{ justifyContent: "space-between", alignItems: "center" }}
                            >
                                <Typography gutterBottom component="div">
                                    Department:{" "}
                                    <Box
                                        component="span"
                                        sx={{ fontSize: "0.875rem", color: "primary.main" }}
                                    >
                                        {requestData.name_department || "Loading..."}
                                    </Box>
                                </Typography>
                                <Typography gutterBottom component="div">
                                    Tel:{" "}
                                    <Box
                                        component="span"
                                        sx={{ fontSize: "0.875rem", color: "warning.main" }}
                                    >
                                        {requestData.phone}
                                    </Box>
                                </Typography>
                            </Stack>

                            <Stack direction="column" spacing={0.5}>
                                <Typography gutterBottom component="div">
                                    Request Type:{" "}
                                    <Box
                                        component="span"
                                        sx={{ fontSize: "0.875rem", color: "primary.main" }}
                                    >
                                        {requestData.type}
                                    </Box>
                                </Typography>
                                <Typography gutterBottom component="div">
                                    Detail:{" "}
                                    <Box
                                        component="span"
                                        sx={{ fontSize: "0.875rem", color: "info.main" }}
                                        dangerouslySetInnerHTML={{ __html: requestData.detail_req }}
                                    />
                                </Typography>
                            </Stack>

                            <Box sx={{ p: 1 }}>
                                {(requestData?.m_name || requestData?.d_name) && (
                                    <Grid
                                        container
                                        spacing={2}
                                        justifyContent="center"
                                        alignItems="center"
                                    >
                                        <Grid item xs={12} sm={6} md={8}>
                                            <Stack spacing={2} sx={{ width: "100%" }}>
                                                <Stepper
                                                    activeStep={-1}
                                                    sx={{
                                                        ".MuiStepLabel-root": {
                                                            fontSize: "0.8rem", // ลดขนาดฟอนต์ของ StepLabel
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                        },
                                                    }}
                                                >
                                                    {requestData.m_name && (
                                                        <Step>
                                                            <StepLabel
                                                                color="neutral"
                                                                StepIconComponent={() => (
                                                                    <CheckCircleIcon
                                                                        sx={{
                                                                            color: "primary.main",
                                                                            fontSize: "1.5rem",
                                                                        }}
                                                                    />
                                                                )}
                                                            >
                                                                Manager
                                                            </StepLabel>
                                                        </Step>
                                                    )}
                                                    {requestData.d_name && (
                                                        <Step>
                                                            <StepLabel
                                                                StepIconComponent={() => (
                                                                    <CheckCircleIcon
                                                                        sx={{
                                                                            color: "secondary.main",
                                                                            fontSize: "1.5rem",
                                                                        }}
                                                                    />
                                                                )}
                                                            >
                                                                Director
                                                            </StepLabel>
                                                        </Step>
                                                    )}
                                                </Stepper>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                )}

                                <Grid container spacing={1} justifyContent="center">
                                    {requestData?.m_name && (
                                        <Grid item xs={12} sm={6} md={4}>
                                            <List>
                                                <ListItem alignItems="center" sx={{ padding: 0.1 }}>
                                                    <ListItemAvatar>
                                                        <Avatar
                                                            alt="Manager"
                                                            src=""
                                                            sx={{
                                                                width: 20,
                                                                height: 20,
                                                                bgcolor: "primary.main",
                                                            }}
                                                        />
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={
                                                            <>
                                                                <span>{requestData.m_name} : </span>
                                                                <span style={{ color: "green" }}>
                                                                    {requestData.mapp}
                                                                </span>
                                                            </>
                                                        }
                                                    />
                                                </ListItem>
                                                <Divider variant="inset" component="li" />
                                            </List>
                                        </Grid>
                                    )}

                                    {requestData?.d_name && (
                                        <Grid item xs={12} sm={6} md={4}>
                                            <List>
                                                <ListItem alignItems="center" sx={{ padding: 0.1 }}>
                                                    <ListItemAvatar>
                                                        <Avatar
                                                            alt="IT Director"
                                                            src=""
                                                            sx={{
                                                                width: 20,
                                                                height: 20,
                                                                bgcolor: "secondary.main",
                                                            }}
                                                        />
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={
                                                            <>
                                                                <span>{requestData.d_name} : </span>
                                                                <span style={{ color: "green" }}>
                                                                    {requestData.dapp}
                                                                </span>
                                                            </>
                                                        }
                                                    />
                                                </ListItem>
                                                <Divider variant="inset" component="li" />
                                            </List>
                                        </Grid>
                                    )}
                                </Grid>
                            </Box>
                        </Stack>
                    </Box>
                    <Divider />
                    <Box sx={{ p: 1 }}>
                        <Typography gutterBottom variant="body2">
                            Attached Files
                        </Typography>
                        <Stack direction="column">
                            {uploadedFiles.length > 0 ? (
                                <Stack direction="row" spacing={1} flexWrap="wrap">
                                    {uploadedFiles.map((file, index) => (
                                        <Link
                                            key={index}
                                            href={`${URLAPI}/${file.file_path}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{ textDecoration: "none", color: "inherit" }}
                                        >
                                            <Chip
                                                label={file.file_old_name || file.file_name}
                                                color="primary"
                                                variant="outlined"
                                                clickable
                                                sx={{ fontWeight: "bold" }}
                                                size="small"
                                            />
                                        </Link>
                                    ))}
                                </Stack>
                            ) : (
                                <Typography color="text.secondary">
                                    No files uploaded
                                </Typography>
                            )}
                        </Stack>
                    </Box>
                </Card>
                <br />

                <Card variant="outlined" sx={{ maxWidth: 1200 }}>
                    {/* <Typography
                        gutterBottom
                        variant="h6"
                        sx={{
                            p: 2,
                            // color: '#1976d2',
                            textAlign: "center",
                            fontWeight: "bold",
                            // textTransform: 'uppercase',
                            textDecoration: "underline",
                            textDecorationThickness: 2,
                            textUnderlineOffset: 6,
                            // textDecorationColor: '#1976d2',
                            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                        }}
                    >
                        Admin IT Assign Job
                    </Typography> */}
                    <Box sx={{ p: 2 }}>
                        {(requestData?.it_m_name || requestData?.it_d_name) && (
                            <Grid
                                container
                                spacing={2}
                                justifyContent="center"
                                alignItems="center"
                            >
                                <Grid item xs={12} sm={6} md={8}>
                                    <Stack spacing={2} sx={{ width: "100%" }}>
                                        <Stepper
                                            activeStep={-1}
                                            sx={{
                                                ".MuiStepLabel-root": {
                                                    fontSize: "0.8rem", // ลดขนาดฟอนต์ของ StepLabel
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                },
                                            }}
                                        >
                                            {requestData.it_m_name && (
                                                <Step>
                                                    <StepLabel
                                                        color="neutral"
                                                        StepIconComponent={() => (
                                                            <CheckCircleIcon
                                                                sx={{
                                                                    color: "warning.main",
                                                                    fontSize: "1.5rem",
                                                                }}
                                                            />
                                                        )}
                                                    >
                                                        Manager
                                                    </StepLabel>
                                                </Step>
                                            )}
                                            {requestData.it_d_name && (
                                                <Step>
                                                    <StepLabel
                                                        StepIconComponent={() => (
                                                            <CheckCircleIcon
                                                                sx={{
                                                                    color: "success.main",
                                                                    fontSize: "1.5rem",
                                                                }}
                                                            />
                                                        )}
                                                    >
                                                        Director
                                                    </StepLabel>
                                                </Step>
                                            )}
                                        </Stepper>
                                    </Stack>
                                </Grid>
                            </Grid>
                        )}
                        <Grid container spacing={2} justifyContent="center">
                            {requestData?.it_m_name && (
                                <Grid item xs={12} sm={6} md={4}>
                                    <List>
                                        <ListItem alignItems="center" sx={{ padding: 0.1 }}>
                                            <ListItemAvatar>
                                                <Avatar
                                                    alt="Manager"
                                                    src=""
                                                    sx={{
                                                        width: 20,
                                                        height: 20,
                                                        bgcolor: "warning.main",
                                                    }}
                                                />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <>
                                                        <span>{requestData.it_m_name} : </span>
                                                        <span style={{ color: "green" }}>
                                                            {requestData.itmapp}
                                                        </span>
                                                    </>
                                                }
                                                secondary={
                                                    <React.Fragment>
                                                        <Typography
                                                            component="span"
                                                            variant="body2"
                                                            sx={{ color: "text.primary", display: "inline" }}
                                                        >
                                                            Note:
                                                        </Typography>
                                                        {requestData.it_m_note && (
                                                            <> {requestData.it_m_note} </>
                                                        )}
                                                    </React.Fragment>
                                                }
                                            />
                                        </ListItem>
                                        <Divider variant="inset" component="li" />
                                    </List>
                                </Grid>
                            )}
                            {requestData?.it_d_name && (
                                <Grid item xs={12} sm={6} md={4}>
                                    <List>
                                        <ListItem alignItems="center" sx={{ padding: 0.1 }}>
                                            <ListItemAvatar>
                                                <Avatar
                                                    alt="Manager"
                                                    src=""
                                                    sx={{
                                                        width: 20,
                                                        height: 20,
                                                        bgcolor: "success.main",
                                                    }}
                                                />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <>
                                                        <span>{requestData.it_d_name} : </span>
                                                        <span style={{ color: "green" }}>
                                                            {requestData.itdapp}
                                                        </span>
                                                    </>
                                                }
                                                secondary={
                                                    <React.Fragment>
                                                        <Typography
                                                            component="span"
                                                            variant="body2"
                                                            sx={{ color: "text.primary", display: "inline" }}
                                                        >
                                                            Note:
                                                        </Typography>
                                                        {requestData.it_d_note && (
                                                            <> {requestData.it_d_note} </>
                                                        )}
                                                    </React.Fragment>
                                                }
                                            />
                                        </ListItem>
                                        <Divider variant="inset" component="li" />
                                    </List>
                                </Grid>
                            )}
                        </Grid>
                    </Box>
                    <Divider />
                    <Box sx={{ p: 1 }}>
                        <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                            sx={{ mt: 2 }}
                        >
                            {/* Assignees */}
                            <Box>
                                <Typography color="text.secondary" fontSize="0.75rem" mb={0.5}>
                                    Tags
                                </Typography>
                                <Stack direction="row" spacing={1}>
                                    <AssigneeDepSelector requestId={requestData.id} />
                                </Stack>
                            </Box>
                        </Stack>

                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing={4}
                            sx={{
                                p: 1,
                                bgcolor: "#ffffff",
                            }}
                        >
                            {/* Dates */}
                            <Box>
                                {/* <Typography color="text.secondary" fontSize="0.75rem" mb={0.5}>
                                    Dates
                                </Typography> */}
                                <DateWork
                                    req_id={requestData.id}
                                    date_start={requestData.date_start}
                                    date_end={requestData.date_end}
                                />
                            </Box>

                            {/* Assignees */}
                            <Box>
                                <Typography color="text.secondary" fontSize="0.75rem" mb={0.5}>
                                    Assignees
                                </Typography>
                                <Stack direction="row" spacing={1}>
                                    <AssigneeEmpSelector
                                        requestId={requestData.id}
                                        typedata="main"
                                    />
                                </Stack>
                            </Box>

                            {/* Priority */}
                            <Box>
                                <Typography color="text.secondary" fontSize="0.75rem" mb={0.5}>
                                    Priority
                                </Typography>
                                <SelectPriority
                                    id={requestData.id}
                                    id_priority={requestData?.id_priority ?? null}
                                />
                            </Box>

                        </Stack>

                    </Box>
                </Card>
                {/* {!isITStaff &&
                    ((requestData.status_id === 6 && requestData.type_id !== 3) ||
                        (requestData.status_id === 16 && requestData.type_id === 3)) ? (
                    <>
                        <Box sx={{ p: 2 }}>
                            <Button
                                color="primary"
                                startIcon={<ThumbUpAltIcon />}
                                onClick={handleConfirmJob}
                            >
                                Complete Job
                            </Button>
                        </Box>
                    </>
                ) : null}
                <br /> */}

            </Box>
            {!isModal && (
                <Button
                    variant="contained"
                    endIcon={<SendIcon />}
                    onClick={handleEdit}
                    sx={{ mt: 2, mb: 2, width: "100%" }}
                >
                    Request Form Edit
                </Button>
            )}
        </Box>
    );
};

export default RequestDetail;