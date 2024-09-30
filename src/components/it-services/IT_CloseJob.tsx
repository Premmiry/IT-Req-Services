import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Autocomplete from '@mui/joy/Autocomplete';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import FormLabel from '@mui/joy/FormLabel';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import IconButton from '@mui/joy/IconButton';
import SvgIcon from '@mui/joy/SvgIcon';
import Typography from '@mui/joy/Typography';
import Grid from '@mui/joy/Grid';
import Input from '@mui/joy/Input';
import Select, { SelectStaticProps, selectClasses } from '@mui/joy/Select';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import Option from '@mui/joy/Option';
import Textarea from '@mui/joy/Textarea';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import Paper from '@mui/material/Paper';

import Sheet from '@mui/joy/Sheet';
import { styled } from '@mui/joy/styles';


import TabsBottomNavExample from '../Tabs';

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

function Closejob() {
    const [files, setFiles] = useState<File[]>([]);
    const [selectedType, setSelectedType] = useState('');
    const [selectedPro, setSelectedPro] = useState('');


    // Select Manager 
    const [value1, setValue1] = React.useState<string | null>('approve');
    const [value2, setValue2] = React.useState<string | null>('approve');
    const [value3, setValue3] = React.useState<string | null>('approve');
    const [value4, setValue4] = React.useState<string | null>('approve');
    const action: SelectStaticProps['action'] = React.useRef(null);

    const handleTypeChange = (_event: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element> | React.FocusEvent<Element, Element> | null, value: string | null) => {
        if (value !== null) {
            setSelectedType(value);
        }
    };

    const handlePrograms = (_event: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element> | React.FocusEvent<Element, Element> | null, value: string | null) => {
        if (value !== null) {
            setSelectedPro(value);
        }
    }


    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFiles = event.target.files;
        if (uploadedFiles) {
            setFiles((prevFiles) => [...prevFiles, ...Array.from(uploadedFiles)]);
        }
    };

    const handleFileDelete = (fileIndex: number) => {
        setFiles((prevFiles) => prevFiles.filter((_, index) => index !== fileIndex));
    };


    const renderProgramsContent = (selectedPro: string) => {
        switch (selectedPro) {
            case '1':
                return null
            case '2':
                return (
                    <Box sx={{ my: 1 }}>
                        <FormLabel>โปรแกรม</FormLabel>
                        <Select
                            variant='outlined' color='primary'
                            placeholder="เลือกโปรแกรมที่ต้องการพัฒนาต่อ…"
                            indicator={<KeyboardArrowDown />}
                            sx={{
                                [`& .${selectClasses.indicator}`]: {
                                    transition: '0.2s',
                                    [`&.${selectClasses.expanded}`]: {
                                        transform: 'rotate(-180deg)',
                                    },
                                },
                            }}
                        >
                            <Option value="1">โปรแกรมแรก</Option>
                            <Option value="2">โปรแกรมสอง</Option>
                            <Option value="3">โปรแกรมสาม</Option>
                            <Option value="4">โปรแกรมสี่</Option>
                            <Option value="5">โปรแกรมห้า</Option>
                        </Select>
                    </Box>
                );
            default:
                return null;
        }
    }

    const renderRequestContent = (selectedType: string) => {
        switch (selectedType) {
            case '1':
                return (
                    <Box sx={{ my: 1 }}>
                        <FormLabel>หัวข้อ</FormLabel>
                        <Select
                            variant='outlined' color='primary'
                            placeholder="เลือกหัวข้อ Request…"
                            indicator={<KeyboardArrowDown />}
                            onChange={handlePrograms}
                            sx={{
                                [`& .${selectClasses.indicator}`]: {
                                    transition: '0.2s',
                                    [`&.${selectClasses.expanded}`]: {
                                        transform: 'rotate(-180deg)',
                                    },
                                },
                            }}
                        >
                            <Option value="1">พัฒนาโปรแกรมขึ้นใหม่</Option>
                            <Option value="2">พัฒนาโปรแกรมต่อเนื่อง</Option>
                            <Option value="3">เพิ่มสิทธิ์</Option>
                            <Option value="4">เพิ่ม Report</Option>
                            <Option value="5">อื่นๆ</Option>
                        </Select>
                    </Box>
                );
            case '2':
                return (
                    <Box sx={{ my: 1 }}>
                        <FormLabel>หัวข้อ</FormLabel>
                        <Select
                            variant='outlined' color='primary'
                            placeholder="เลือกหัวข้อที่ต้องการแจ้งซ่อม…"
                            indicator={<KeyboardArrowDown />}
                            sx={{
                                [`& .${selectClasses.indicator}`]: {
                                    transition: '0.2s',
                                    [`&.${selectClasses.expanded}`]: {
                                        transform: 'rotate(-180deg)',
                                    },
                                },
                            }}
                        >
                            <Option value="1">อาคาร</Option>
                            <Option value="2">คอมพิวเตอร์</Option>
                            <Option value="3">ไฟฟ้า</Option>
                            <Option value="4">น้ำ</Option>
                            <Option value="5">ยานยนต์</Option>
                        </Select>
                    </Box>
                );
            default:
                return null;
        }
    };

    const renderFormTypeContent = (selectedType: string) => {
        switch (selectedType) {
            case '1':
                return
            case '2':
                return (
                    <Box sx={{ mt: 4, mb: 4, p: 2, border: '1px dashed red' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <FormLabel>รหัสทรัพย์สิน (ถ้ามี)</FormLabel>
                                <Input
                                    variant="outlined"
                                    color="danger"
                                    type='text'
                                    placeholder='รหัสทรัพย์สิน'
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <FormLabel>ตึก</FormLabel>
                                <Autocomplete
                                    placeholder="เลือกตึก..."
                                    options={Buildings}
                                    variant="outlined"
                                    color="danger"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <FormLabel>ชั้น</FormLabel>
                                <Autocomplete
                                    placeholder="เลือกชั้น..."
                                    options={Floors}
                                    variant="outlined"
                                    color="danger"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <FormLabel>ห้อง</FormLabel>
                                <Input
                                    variant="outlined"
                                    color="danger"
                                    type='text'
                                    placeholder='เลขห้อง'
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    </Box>
                );
            default:
                return null;
        }
    };

    const renderLocationFields = () => {
        if (selectedType === "1") {
            return null;
        } else if (selectedType === "2") {
            return (
                <Box sx={{ mt: 4, mb: 4, p: 2, border: '1px dashed red' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <FormLabel>รหัสทรัพย์สิน (ถ้ามี)</FormLabel>
                            <Input
                                variant="outlined"
                                color="danger"
                                type='text'
                                placeholder='รหัสทรัพย์สิน'
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <FormLabel>ตึก</FormLabel>
                            <Autocomplete
                                placeholder="เลือกตึก..."
                                options={Buildings}
                                variant="outlined"
                                color="danger"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <FormLabel>ชั้น</FormLabel>
                            <Autocomplete
                                placeholder="เลือกชั้น..."
                                options={Floors}
                                variant="outlined"
                                color="danger"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <FormLabel>ห้อง</FormLabel>
                            <Input
                                variant="outlined"
                                color="danger"
                                type='text'
                                placeholder='เลขห้อง'
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                </Box>
            );
        }
    };

    const [index, setIndex] = React.useState(0);
    const colors = ['primary', 'danger', 'success', 'warning'] as const;

    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        setCurrentDate(formattedDate);
    }, []);

    return (
        <React.Fragment>
            <CssBaseline />
            <Container maxWidth="lg">

                <TabsBottomNavExample />

                <br />
                <Paper sx={{ width: '100%', padding: 2, boxShadow: 10 }}>
                    <Grid xs={6} >
                        <Box><h2>IT-Services (Open)</h2></Box>
                    </Grid>
                    <Grid container spacing={2} sx={{ flexGrow: 1 }}>


                        <Grid xs={5}>
                            <Box sx={{ my: 1 }}>
                                <FormLabel>แผนกที่ร้องขอ</FormLabel>
                                <Autocomplete
                                    placeholder="เลือกแผนก..."
                                    options={top100Films}
                                    variant="outlined" color="primary"
                                />
                            </Box>
                            <Box sx={{ my: 1 }}>
                                <FormLabel>ชื่อผู้ร้องขอ</FormLabel>
                                <Input placeholder="ชื่อ" variant="outlined" color="primary" type="text" />
                            </Box>
                            <Box sx={{ my: 1 }}>
                                <FormLabel>เบอร์ติดต่อ</FormLabel>
                                <Input placeholder="57976" variant="outlined" color="primary" type="text" />
                            </Box>

                            <Box>
                                <FormLabel>ประเภท</FormLabel>
                                <Select
                                    value={selectedType}
                                    onChange={handleTypeChange}
                                    variant='outlined' color='primary'
                                    placeholder="เลือกประเภท Request…"
                                    indicator={<KeyboardArrowDown />}
                                    sx={{
                                        [`& .${selectClasses.indicator}`]: {
                                            transition: '0.2s',
                                            [`&.${selectClasses.expanded}`]: {
                                                transform: 'rotate(-180deg)',
                                            },
                                        },
                                    }}
                                >
                                    <Option value="1">IT Request</Option>
                                    <Option value="2">IT Service</Option>
                                </Select>
                            </Box>

                        </Grid>

                        <Grid xs={7}>
                            {renderRequestContent(selectedType)}
                            {renderProgramsContent(selectedPro)}

                            <Box sx={{ my: 1 }}>

                                <FormLabel>หัวข้อเรื่อง</FormLabel>
                                <Textarea
                                    size="md" name="Size" placeholder="Subject here…"
                                    variant="outlined" color="primary"
                                />
                            </Box>



                            <Box sx={{ my: 1 }}>
                                <FormLabel>รายละเอียด</FormLabel>
                                <Textarea
                                    minRows={3}
                                    placeholder="Type in here…"
                                    variant="outlined"
                                    color="primary"
                                    maxRows={3}
                                    sx={{
                                        borderBottom: '2px solid',
                                        borderColor: 'neutral.outlinedBorder',
                                        borderRadius: 0,
                                        '&:hover': {
                                            borderColor: 'neutral.outlinedHoverBorder',
                                        },
                                        '&::before': {
                                            border: '1px solid var(--Textarea-focusedHighlight)',
                                            transform: 'scaleX(0)',
                                            left: 0,
                                            right: 0,
                                            bottom: '-2px',
                                            top: 'unset',
                                            transition: 'transform .15s cubic-bezier(0.1,0.9,0.2,1)',
                                            borderRadius: 0,
                                        },
                                        '&:focus-within::before': {
                                            transform: 'scaleX(1)',
                                        },
                                    }}
                                />
                            </Box>

                            <Box sx={{ border: '1px dashed', borderColor: 'lightblue', borderRadius: 'sm', p: 2 }}>
                                <FormLabel>แนบไฟล์</FormLabel>
                                <Button
                                    component="label"
                                    role={undefined}
                                    tabIndex={-1}
                                    variant="outlined"
                                    color="primary"
                                    startDecorator={
                                        <SvgIcon>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                                                />
                                            </svg>
                                        </SvgIcon>
                                    }
                                >
                                    Upload a file
                                    <input
                                        type="file"
                                        multiple
                                        hidden
                                        onChange={handleFileUpload}
                                    />
                                </Button>

                                <List>
                                    {files.map((file, index) => (
                                        <ListItem
                                            sx={{ border: '1px dashed', borderColor: 'lightblue', borderRadius: 'sm', margin: 1 }}
                                            key={index}
                                            endAction={
                                                <IconButton edge="end" aria-label="delete" color="danger" onClick={() => handleFileDelete(index)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            }
                                        >
                                            <Typography variant="body2">{file.name}</Typography>
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        </Grid>
                    </Grid>
                    {renderFormTypeContent(selectedType)}
                    <Box sx={{ mt: 4, mb: 4, p: 2, border: '1px dashed #00c00e' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <FormLabel>ผู้รับงาน</FormLabel>
                                <Input
                                    variant="outlined"
                                    color="success"
                                    type='text'
                                    placeholder='ชื่อผู้รับงาน'
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <FormLabel>ระดับความเร่งด่วน</FormLabel>
                                <Autocomplete
                                    placeholder="เลือกระดับ..."
                                    options={Level}
                                    variant="outlined"
                                    color="success"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <FormLabel>วันที่เข้าหน้างาน</FormLabel>
                                <Input
                                    type='date'
                                    variant="outlined"
                                    color="success"
                                    value={currentDate}
                                />
                            </Grid>

                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <FormLabel>หมายเหตุ</FormLabel>
                                <Input
                                    variant="outlined"
                                    color="success"
                                    type='text'
                                    placeholder='กรอกหมายเหตุ'
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <FormLabel>ผลกระทบ</FormLabel>
                                <Input
                                    variant="outlined"
                                    color="success"
                                    type='text'
                                    placeholder='กรุณากรอกผลกระทบ (จำเป็น)'
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    </Box>
                    <Box sx={{ mt: 4, mb: 4, p: 2, border: '1px dashed #e1bc00' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <FormLabel>ผู้ปิดงาน</FormLabel>
                                <Input
                                    variant="outlined"
                                    color="warning"
                                    type='text'
                                    placeholder='ชื่อผู้ปิดงาน'
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <FormLabel>วันที่ซ่อมจริง</FormLabel>
                                <Input
                                    type='date'
                                    variant="outlined"
                                    color="warning"
                                    value={currentDate}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <FormLabel>วันที่ซ่อมเสร็จ</FormLabel>
                                <Input
                                    type='date'
                                    variant="outlined"
                                    color="warning"
                                    value={currentDate}
                                />
                            </Grid>

                        </Grid>
                    </Box>
                    <Box sx={{ my: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Button color="danger" startDecorator={<CancelIcon />}>
                            Cancel
                        </Button>
                        <Button sx={{ ml: 2 }} color="primary" startDecorator={<SaveIcon />}>
                            Save
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </React.Fragment>
    );
}

const top100Films = [
    { label: 'พัฒนาโปรแกรม' },
    { label: 'จัดซื้อ' },
    { label: 'ทรัพยากรบุคคล' },
    { label: 'การเงิน' },
    { label: 'ศูนย์เทคโนโลยีสารสนเทศ' },
];

const Buildings = [
    { label: 'ยันฮี' },
    { label: 'Inter1' },
    { label: 'Inter2' },
    { label: 'Inter3' },
];

const Floors = [
    { label: 'ใต้ดิน' },
    { label: '1' },
    { label: '2' },
    { label: '3' },
    { label: '4' },
    { label: '5' },
    { label: '6' },
    { label: '7' },
    { label: '8' },
    { label: '9' },
    { label: '10' },
    { label: '11' },
    { label: '12' },
    { label: '13' },
    { label: '14' },
];

const Level = [
    { label: 'ปกติ' },
    { label: 'เร่งด่วน' },
    { label: 'ฉุกเฉิน' },
];

export default Closejob;
