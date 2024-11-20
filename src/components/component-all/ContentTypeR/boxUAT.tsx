import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Button, Checkbox, FormControlLabel, FormGroup, Grid, Paper, Divider, IconButton } from '@mui/material';
import { Textarea } from '@mui/joy';
import { pink, green } from '@mui/material/colors';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import ReplyIcon from '@mui/icons-material/Reply';
import URLAPI from '../../../URLAPI';
import { useEffect } from 'react';

interface Props {
    window?: () => Window;
    children?: React.ReactElement<{ elevation?: number }>;
    id: number; // เปลี่ยนเป็น number
    username: string;
    department: number;
    status: number;
    onClose?: () => void; // เพิ่ม callback function สำหรับปิด modal
}

interface UATRow {
    id: number;
    title: string;
    result: number | null;
    description: string;
    id_uat?: number; // เพิ่ม id_uat เพื่อใช้ในการแก้ไข
}

export default function UAT(props: Props) {
    const [rows, setRows] = React.useState<UATRow[]>([{
        id: Date.now(), // ใช้ timestamp แทนการใช้ index
        title: '',
        result: null,
        description: ''
    }]);

    const fetchUATData = async (req_id: number) => {
        try {
            const response = await fetch(`${URLAPI}/uat/${req_id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching UAT data:', error);
            return [];
        }
    };

    const fetchData = async () => {
        const uatData = await fetchUATData(props.id);
        if (uatData.length > 0) {
            setRows(uatData.map((data: { id_uat: any; uat_title: any; testresults: any; uat_note: any; }) => ({
                id: data.id_uat || Date.now(), // ใช้ id_uat ถ้ามี หรือใช้ timestamp ถ้าไม่มี
                title: data.uat_title,
                result: data.testresults,
                description: data.uat_note,
                id_uat: data.id_uat
            })));
        } else {
            setRows([{
                id: Date.now(),
                title: '',
                result: null,
                description: ''
            }]);
        }
    };

    useEffect(() => {
        fetchData();
    }, [props.id]);


    return (
        <Container component="main" sx={{ mb: 4 }}>
            <Paper elevation={3} sx={{ p: 2 }} id="uat-container">
                {props.department === 292 && (
                    <Button
                        id="add-row-button"
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        sx={{ mb: 2 }}
                    >
                        เพิ่มรายการ
                    </Button>
                )}

                <Paper elevation={4} sx={{ p: 2 }} id="uat-container">
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography variant="h6" gutterBottom id="title-header">
                                หัวข้อ UAT
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="h6" gutterBottom id="result-header">
                                ผลการทดสอบ
                            </Typography>
                        </Grid>
                    </Grid>

                    {rows.map((row, index) => {
                        const rowPrefix = `row_${index + 1}`;
                        return (
                            <React.Fragment key={row.id}>
                                <Grid
                                    container
                                    spacing={2}
                                    sx={{ mb: 2, position: 'relative' }}
                                    id={`${rowPrefix}_container`}
                                >
                                    <Grid item xs={6}>
                                        <Box sx={{ mt: 3 }}>
                                            <Textarea
                                                id={`${rowPrefix}_title`}
                                                value={row.title}
                                                minRows={4}
                                                placeholder="กรอกหัวข้อ UAT ที่นี่…"
                                                style={{ width: '100%' }}
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Box sx={{ mt: 1 }}>
                                            <FormGroup
                                                aria-label="position"
                                                row
                                                id={`${rowPrefix}_checkbox_group`}
                                            >
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            id={`${rowPrefix}_pass_checkbox`}
                                                            checked={row.result === 1}
                                                            value={1}
                                                            sx={{
                                                                color: green[500],
                                                                '&.Mui-checked': {
                                                                    color: green[500],
                                                                },
                                                            }}
                                                        />
                                                    }
                                                    label="ผ่าน"
                                                    labelPlacement="end"
                                                />
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            id={`${rowPrefix}_fail_checkbox`}
                                                            checked={row.result === 2}
                                                            value={2}
                                                            sx={{
                                                                color: pink[500],
                                                                '&.Mui-checked': {
                                                                    color: pink[500],
                                                                },
                                                            }}
                                                        />
                                                    }
                                                    label="ไม่ผ่าน"
                                                    labelPlacement="end"
                                                />
                                            </FormGroup>
                                        </Box>
                                        <Box>
                                            <Textarea
                                                id={`${rowPrefix}_description`}
                                                value={row.description}
                                                minRows={3}
                                                placeholder="กรอกรายละเอียดสิ่งที่ต้องการให้แก้ไขในกรณีที่ไม่ผ่าน!!"
                                                style={{ width: '100%' }}
                                                readOnly={row.result === 1} // ตั้งค่าให้เป็น ReadOnly ถ้าเลือก "ผ่าน"
                                            />
                                        </Box>
                                    </Grid>
                                    {props.department === 292 && (
                                        <>
                                            <IconButton
                                                id={`${rowPrefix}_save_button`}
                                                sx={{
                                                    position: 'absolute',
                                                    right: 40,
                                                    top: 8,
                                                    color: 'success.main',
                                                }}
                                            >
                                                {row.id_uat ? <EditIcon /> : <AddIcon />}
                                            </IconButton>

                                            <IconButton
                                                id={`${rowPrefix}_delete_button`}
                                                sx={{
                                                    position: 'absolute',
                                                    right: 8,
                                                    top: 8,
                                                    color: 'error.main',
                                                }}
                                                disabled={rows.length === 1}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </>
                                    )}
                                </Grid>
                                {index < rows.length - 1 && (
                                    <Divider
                                        sx={{ my: 2 }}
                                        id={`${rowPrefix}_divider`}
                                    />
                                )}
                            </React.Fragment>
                        );
                    })}
                </Paper>
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 2 }}>
                    {![7, 8, 17].includes(props.status) && (
                        <Button
                        variant="contained"
                        color="success"
                        startIcon={<SaveAsIcon />}
                        sx={{ mr: 2 }}
                        >
                            ส่ง UAT
                        </Button>
                    )}
                    
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<ReplyIcon />}
                    >
                        ไปหน้า List
                    </Button>
                </Box>

            </Paper>
        </Container>
    );
}