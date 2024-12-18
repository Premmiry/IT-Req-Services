import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Button, Checkbox, FormControlLabel, FormGroup, Grid, Divider, IconButton } from '@mui/material';
import { Textarea } from '@mui/joy';
import { pink, green } from '@mui/material/colors';
import AddIcon from '@mui/icons-material/Add';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import ReplyIcon from '@mui/icons-material/Reply';
import URLAPI from '../../../URLAPI';
import { useEffect } from 'react';



interface Props {
    window?: () => Window;
    children?: React.ReactElement<{ elevation?: number }>;
    id: number;
    username: string;
    department: number;
    status: number;
    onClose?: () => void;
    onScoreChange?: (score: boolean) => void;
    onUpdateComplete?: () => void;
}

interface UATRow {
    id: number;
    title: string;
    result: number | null;
    description: string;
    id_uat?: number; // เพิ่ม id_uat เพื่อใช้ในการแก้ไข
}

export default function UAT(props: Props) {
    const [dataUat, setDataUat] = React.useState<any | null>(null);
    const [rows, setRows] = React.useState<UATRow[]>([]);
    const [selectedRows, setSelectedRows] = React.useState<number[]>([]);
    const [isAddingRow, setIsAddingRow] = React.useState<boolean>(false);
    const [score, setScore] = React.useState<boolean>(false);

    const fetchUATData = async (req_id: number) => {
        try {
            const response = await fetch(`${URLAPI}/uat/${req_id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setDataUat(data);

            // เช็คว่าทุก row มี result เป็น 1 หรือไม่
            const allPassed = data.length > 0 && data.every((item: any) => 
                item.id_uat && // มี id_uat
                item.testresults === 1 // result เป็น 1
            );
            
            setScore(allPassed);
            if (props.onScoreChange) {
                props.onScoreChange(allPassed);
            }

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
                id: data.id_uat || 0,
                title: data.uat_title,
                result: data.testresults,
                description: data.uat_note,
                id_uat: data.id_uat
            })));
            setIsAddingRow(true);
        }
    };

    useEffect(() => {
        fetchData();
    }, [props.id]);

    const handleChangeCheck = (id: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value, 10);
        setRows(prevRows =>
            prevRows.map(row =>
                row.id === id
                    ? {
                        ...row,
                        result: row.result === value ? null : value,
                        description: value === 1 ? '' : row.description // เคลียร์ค่า description ถ้าเลือก "ผ่าน"
                    }
                    : row
            )
        );
    };


    const handleTextChange = (id: number, field: 'title' | 'description') => (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = event.target.value;
        setRows(prevRows =>
            prevRows.map(row =>
                row.id === id
                    ? { ...row, [field]: value }
                    : row
            )
        );
    };

    const addRow = () => {
        setIsAddingRow(true);
        const newId = Date.now();
        setRows(prevRows => [
            ...prevRows,
            {
                id: newId,
                title: '',
                result: null,
                description: ''
            }
        ]);
    };

    const saveSelectedRows = async () => {
        const rowsToSave = rows.filter(row => selectedRows.includes(row.id));

        if (rowsToSave.length === 0) {
            alert("กรุณาเลือกรายการที่ต้องการบันทึก");
            return;
        }

        // Validate all selected rows
        for (const row of rowsToSave) {
            if (!row.title || row.title.trim() === "") {
                alert("หัวข้อ UAT ห้ามเป็นค่าว่าง");
                return;
            }
        }

        try {
            // Save all selected rows
            const savePromises = rowsToSave.map(row => saveOrUpdateRow(row));
            await Promise.all(savePromises);

            alert("บันทึกข้อมูลสำเร็จ");
            setSelectedRows([]); // Clear selection
            await fetchData(); // Refresh data
        } catch (error) {
            console.error("Error saving rows:", error);
            alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        }
    };

    const handleRowSelection = (id: number) => {
        setSelectedRows(prev => {
            if (prev.includes(id)) {
                return prev.filter(rowId => rowId !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    const validateAndSaveRow = async (id: number) => {
        const row = rows.find((r) => r.id === id);
        if (!row) return;

        // ตรวจสอบว่า title ไม่เป็นค่าว่างหรือ null
        if (!row.title || row.title.trim() === "") {
            alert("หัวข้อ UAT ห้ามเป็นค่าว่าง");
            return; // ถ้าไม่ผ่านการตรวจสอบใ��้หยุดการทำงาน
        }

        // ถ้าผ่านการตรวจสอบแล้ว ให้เรียกฟังก์ัน SaveRow
        await saveOrUpdateRow(row);
    };

    const saveOrUpdateRow = async (row: UATRow) => {
        try {
            const data = {
                req_id: props.id,
                uat_title: row.title,
                created_by: props.username
            };

            console.log("Sending data:", data);

            let response;
            if (row.id_uat) {
                // Update existing row
                response = await fetch(`${URLAPI}/uat/${row.id_uat}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ id_uat: row.id_uat, uat_title: row.title }),
                });
            } else {
                // Save new row
                response = await fetch(`${URLAPI}/uat/${props.id}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                });
            }

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error response:", errorText);
                throw new Error("Network response was not ok");
            }

            const result = await response.json();
            if (result.message) {
                alert(result.message);
                // เรียกใช้ fetchData เพื่ออัปเดตข้อมูล
                await fetchData();
            }
        } catch (error) {
            console.error("Error saving/updating UAT row:", error);
            alert("เกิดข้อผิดพลาดในการบันทึก/แก้ไขข้อมูล");
        }
    };

    const deleteRow = (id: number) => {
        const row = rows.find((r) => r.id === id);
        if (!row) return;

        if (row.id_uat) {
            const confirmDelete = window.confirm("ต้องการจะลบข้อมูลนี้ใช่หรือไม่?");
            if (confirmDelete) {
                deleteUATRow(row.id_uat);
            }
        } else {
            setRows(prevRows => prevRows.filter(row => row.id !== id));
        }
    };

    const deleteUATRow = async (id_uat: number) => {
        try {
            const response = await fetch(`${URLAPI}/uat/${id_uat}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error response:", errorText);
                throw new Error("Network response was not ok");
            }

            const result = await response.json();
            if (result.message) {
                alert(result.message);
                setRows(prevRows => prevRows.filter(row => row.id_uat !== id_uat));
            }
        } catch (error) {
            console.error("Error deleting UAT row:", error); ``
            alert("เกิดข้อผิดพลาดในการลบข้อมูล");
        }
    };



    const handleUpdateUat = async () => {
        try {
            // กรองเฉพาะ rows ที่มีการเลือก checkbox (มีค่า result)
            const rowsToUpdate = rows.filter(row =>
                row.id_uat && // มี id_uat (เป็น row ที่บันทึกแล้ว)
                row.result !== null // มีการเลือก checkbox
            );

            if (rowsToUpdate.length === 0) {
                alert("ไม่มีรายการที่ต้องการบันทึกผลการทดสอบ");
                return;
            }

            // ตรวจสอบว่าถ้าเลือกไม่��่านต้องมีการกรอกเหุผล
            const invalidRows = rowsToUpdate.filter(row =>
                row.result === 2 && // result = 2 คือไม่ผ่าน
                (!row.description || row.description.trim() === '')
            );

            if (invalidRows.length > 0) {
                alert("กรุณาใส่เหตุผลที่ไม่ให้ผ่าน !!");
                return;
            }

            // สร้าง requests สำหรับ rows ที่จะอัพเดท
            const updatePromises = rowsToUpdate.map(async (row) => {
                const data = {
                    id_uat: parseInt(String(row.id_uat)),
                    req_id: parseInt(String(props.id)),
                    assigned_username: String(props.username),
                    testresults: row.result !== null ? parseInt(String(row.result)) : null,
                    uat_note: row.description ? String(row.description).trim() : null
                };

                const response = await fetch(`${URLAPI}/assigned_uat/${row.id_uat}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Error response:', errorText);
                    throw new Error(errorText || 'Failed to update UAT');
                }

                return await response.json();
            });

            // รอให้ทุก request เสร็จสิ้น
            const results = await Promise.all(updatePromises);

            alert(`บันทึกผลการทดสอบ UAT เรียบร้อยแล้ว ${results.length} รายการ`);

            // เพียก fetchUATData เพื่อรีเฟรชข้อมูลและอัพเดท score
            await fetchUATData(props.id);

            // เรียก callback เพื่อรีเฟรชข้อมูลใน RequestForm
            if (props.onUpdateComplete) {
                props.onUpdateComplete();
            }

            // ปิด modal ถ้ามี
            if (props.onClose) {
                props.onClose();
            }

        } catch (error: any) {
            console.error('Error updating UAT results:', error);
            alert(`เกิดข้อผิดพลาดในการบันทึกผลการทดสอบ UAT: ${error.message}`);
        }
    };

    const handleChangeUAT = async () => {
        try {
            const response = await fetch(`${URLAPI}/change_status/${props.id}?change=uat`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error response:", errorText);
                throw new Error("Network response was not ok");
            }

            const result = await response.json();
            console.log("UAT Title updated successfully:", result);
            alert("UAT Title updated successfully!"); // แจ้งเตือนเมื่อสำเร็จ
            if (props.onClose) {
                props.onClose();
            }
        } catch (error: any) {
            console.error('Error updating UAT results:', error);
            alert(`เกิดข้อผิดพลาดในการบันทึกผลการทดสอบ UAT: ${error.message}`);
        }
    };

    return (
        <Container component="main" sx={{ mb: 4 }} maxWidth="xl">
            {props.department === 292 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    {!isAddingRow ? (
                        <Button
                            id="add-row-button"
                            variant="contained"
                            endIcon={<AddBoxIcon />}
                            onClick={addRow}
                            sx={{ width: '200px' }}
                        >
                            เพิ่มหัวข้อ UAT
                        </Button>
                    ) : (
                        <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                            <Button
                                id="add-more-row-button"
                                variant="contained"
                                endIcon={<AddBoxIcon />}
                                onClick={addRow}
                            >
                                เพิ่มหัวข้อ UAT
                            </Button>
                            {rows.length > 0 && (
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={saveSelectedRows}
                                    disabled={selectedRows.length === 0}
                                >
                                    บันทึกรายการที่เลือก
                                </Button>
                            )}
                        </Box>
                    )}
                </Box>
            )}

            {(rows.length > 0 || isAddingRow) && (
                <>
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

                    {rows.map((row, index) => (
                        <React.Fragment key={row.id}>
                            <Grid
                                container
                                spacing={2}
                                sx={{ mb: 2, position: 'relative' }}
                                id={`row_${index + 1}_container`}
                            >
                                {props.department === 292 && (
                                    <Box sx={{ position: 'absolute', left: -40, top: 8 }}>
                                        <Checkbox
                                            checked={selectedRows.includes(row.id)}
                                            onChange={() => handleRowSelection(row.id)}
                                        />
                                    </Box>
                                )}

                                <Grid item xs={6}>
                                    <Box sx={{ mt: 3 }}>
                                        <Textarea
                                            id={`row_${index + 1}_title`}
                                            value={row.title}
                                            onChange={handleTextChange(row.id, 'title')}
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
                                            id={`row_${index + 1}_checkbox_group`}
                                        >
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        id={`row_${index + 1}_pass_checkbox`}
                                                        checked={row.result === 1}
                                                        onChange={handleChangeCheck(row.id)}
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
                                                        id={`row_${index + 1}_fail_checkbox`}
                                                        checked={row.result === 2}
                                                        onChange={handleChangeCheck(row.id)}
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
                                            id={`row_${index + 1}_description`}
                                            value={row.description}
                                            onChange={handleTextChange(row.id, 'description')}
                                            minRows={3}
                                            placeholder="กรอกรายละเอียดสิ่งที่ต้องการให้แก้ไขในกรณีที่ไม่ผ่าน!!"
                                            style={{ width: '100%' }}
                                            readOnly={row.result === 1}
                                        />
                                    </Box>
                                </Grid>

                                {props.department === 292 && (
                                    <>
                                        <IconButton
                                            id={`row_${index + 1}_save_button`}
                                            onClick={() => validateAndSaveRow(row.id)}
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
                                            id={`row_${index + 1}_delete_button`}
                                            onClick={() => deleteRow(row.id)}
                                            sx={{
                                                position: 'absolute',
                                                right: 8,
                                                top: 8,
                                                color: 'error.main',
                                            }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </>
                                )}
                            </Grid>
                            {index < rows.length - 1 && (
                                <Divider sx={{ my: 2 }} id={`row_${index + 1}_divider`} />
                            )}
                        </React.Fragment>
                    ))}
                </>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 2 }}>
                {dataUat && ([6].includes(props.status)) && props.department !== 292 && (
                    <>
                        <Button
                            variant="contained"
                            color="success"
                            endIcon={<SaveAsIcon />}
                            sx={{ mr: 2 }}
                            onClick={handleUpdateUat}
                        >
                            ส่ง UAT
                        </Button>
                    </>
                )}
                {props.department === 292 && props.status === 6 && (
                    <Button
                        variant="contained"
                        color="secondary"
                        endIcon={<ReplyIcon />}
                        onClick={handleChangeUAT}
                    >
                        ส่งหัวข้อ UAT
                    </Button>
                )}


            </Box>


        </Container>
    );
}