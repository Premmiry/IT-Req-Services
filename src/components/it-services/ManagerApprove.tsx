import React, { useState } from 'react';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Autocomplete from '@mui/joy/Autocomplete';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import IconButton from '@mui/joy/IconButton';
import SvgIcon from '@mui/joy/SvgIcon';
import Typography from '@mui/joy/Typography';
import { styled } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import Grid from '@mui/joy/Grid';
import Input from '@mui/joy/Input';
import Select, { SelectStaticProps, SelectOption } from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import CloseRounded from '@mui/icons-material/CloseRounded';
import Textarea from '@mui/joy/Textarea';
import Stepper from '@mui/joy/Stepper';
import Step from '@mui/joy/Step';
import StepButton from '@mui/joy/StepButton';
import StepIndicator from '@mui/joy/StepIndicator';
import Check from '@mui/icons-material/Check';
import Checkbox from '@mui/joy/Checkbox';
import Chip from '@mui/joy/Chip';
import Close from '@mui/icons-material/Close';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import ListDivider from '@mui/joy/ListDivider';
import Radio from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import Avatar from '@mui/joy/Avatar';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import Rating from '@mui/material/Rating';
import { unstable_useEnhancedEffect as useEnhancedEffect } from '@mui/utils';



// Data Grid
import {
    DataGrid,
    GridRowsProp,
    GridRowModesModel,
    GridRowModes,
    GridColDef,
    GridToolbarContainer,
    GridActionsCellItem,
    GridEventListener,
    GridRowId,
    GridRowModel,
    GridRowEditStopReasons,
    GridSlots,
    GridRenderCellParams,
    useGridApiContext,
} from '@mui/x-data-grid';

interface EditToolbarProps {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
        newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
    ) => void;
    rows: GridRowsProp;
}

function EditToolbar(props: EditToolbarProps) {
    const { setRows, setRowModesModel, rows } = props;

    const handleClick = () => {
        const id = rows.length + 1;
        setRows((oldRows) => [...oldRows, { id, UatRole: '', UatDetail: '', UatStatus: '', UatComment: '', isNew: true }]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'UatRole' },
        }));
    };

    return (
        <GridToolbarContainer>
            <Button color="primary" startIcon={<AddIcon />} onClick={handleClick} >
                Add record
            </Button>
        </GridToolbarContainer>
    );
}

const initialRows: GridRowsProp = [
    { id: 1, UatRole: 'Unit Testing', UatDetail: 'Detail 1', UatStatus: 'ผ่าน', UatComment: 'Comment 1', dateSave: new Date() },
    // Add more initial rows as needed
];

// Data Grid

// Data Rating
function renderRating(params: GridRenderCellParams<any, number>) {
    return <Rating readOnly value={params.value} />;
}

function RatingEditInputCell(props: GridRenderCellParams<any, number>) {
    const { id, value, field, hasFocus } = props;
    const apiRef = useGridApiContext();
    const ref = React.useRef<HTMLElement>(null);

    const handleChange = (event: React.SyntheticEvent, newValue: number | null) => {
        apiRef.current.setEditCellValue({ id, field, value: newValue });
    };

    useEnhancedEffect(() => {
        if (hasFocus && ref.current) {
            const input = ref.current.querySelector<HTMLInputElement>(
                `input[value="${value}"]`,
            );
            input?.focus();
        }
    }, [hasFocus, value]);

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', pr: 2 }}>
            <Rating
                ref={ref}
                name="rating"
                precision={1}
                value={value}
                onChange={handleChange}
            />
        </Box>
    );
}

const renderRatingEditInputCell: GridColDef['renderCell'] = (params) => {
    return <RatingEditInputCell {...params} />;
};






const Item = styled(Sheet)(({ theme }) => ({
    backgroundColor:
        theme.palette.mode === 'dark' ? theme.palette.background.level1 : '#fff',
    ...theme.typography['body-sm'],
    padding: theme.spacing(1),
    textAlign: 'center',
    borderRadius: 4,
    color: theme.vars.palette.text.secondary,
}));




function ManagerApprove() {

    // Select Manager 
    const [value1, setValue1] = React.useState<string | null>('approve');
    const [value2, setValue2] = React.useState<string | null>('approve');
    const [value3, setValue3] = React.useState<string | null>('approve');
    const [value4, setValue4] = React.useState<string | null>('approve');
    const action: SelectStaticProps['action'] = React.useRef(null);


    // Emoji text area
    // const [textObjective, setTextObjective] = React.useState('');
    // const [textRequirement, setTextRequirement] = React.useState('');

    // const addEmojiToObjective = (emoji: string) => () => setTextObjective(`${textObjective}${emoji}`);
    // const addEmojiToRequirement = (emoji: string) => () => setTextRequirement(`${textRequirement}${emoji}`);

    // const emojis = ['👍', '🏖', '😍', '😀', '😁', '😅', '😂', '😊', '😎', '🙌', '💪', '🎉', '🚀', '🔥', '💡', '🔧', '⚙️', '💼'];




    // File Update
    const VisuallyHiddenInput = styled('input')`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;

    const [files, setFiles] = useState<File[]>([]);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFiles = event.target.files;
        if (uploadedFiles) {
            setFiles(prevFiles => [...prevFiles, ...Array.from(uploadedFiles)]);
        }
    };

    const handleFileDelete = (fileIndex: number) => {
        setFiles(prevFiles => prevFiles.filter((_, index) => index !== fileIndex));
    };

    // Steps
    const steps = ['Request', 'IT Admin', 'Manager Approve', 'Director Approved'];
    const [activeStep, setActiveStep] = React.useState();


    // Loading states
    const [loading1, setLoading1] = useState(true);
    const [loading2, setLoading2] = useState(true);
    const [loading3, setLoading3] = useState(true);
    const [loading4, setLoading4] = useState(true);
    const [loading5, setLoading5] = useState(true);
    // คอมโพเนนต์ย่อยสำหรับแสดงช่อง Checkbox
    const TextCheckbox = ({ label, color, defaultChecked }) => (
        <Checkbox label={label} color={color} defaultChecked={defaultChecked} />
    );
    // คอมโพเนนต์ย่อยสำหรับแสดงรายการ Checkbox
    const CheckboxList = ({ options }) => (
        <Stack spacing={2} direction="row">
            {options.map((option, index) => (
                <Grid item xs={6} key={index}>
                    <TextCheckbox {...option} />
                </Grid>
            ))}
        </Stack>
    );


    // Radio
    // const [orientation, setOrientation] =
    //   React.useState<ListProps['orientation']>('horizontal');
    const [selectedValue, setSelectedValue] = React.useState('a');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedValue(event.target.value);
    };

    // ผู้รับมอบหมาย
    const options = [
        { value: '1', label: 'Eric', src: 'https://www.unlockmen.com/wp-content/uploads/2019/04/1904026-john-wick-dailygrindhouse.jpg' },
        { value: '2', label: 'Smith', src: 'https://hips.hearstapps.com/hmg-prod/images/gettyimages-1229892983-square.jpg' },
        { value: '3', label: 'Erika', src: 'https://upload.wikimedia.org/wikipedia/commons/f/fc/Bill_Gates_-_2023_-_P062021-967902_%28cropped%29.jpg' },
    ];

    function renderValue(option: SelectOption<string> | null) {
        if (!option) {
            return null;
        }

        return (
            <React.Fragment>
                <ListItemDecorator>
                    <Avatar size="sm" src={options.find((o) => o.value === option.value)?.src} />
                </ListItemDecorator>
                {option.label}
            </React.Fragment>
        );
    }


    // Data Table
    const [rows, setRows] = React.useState<GridRowsProp>(initialRows);
    const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});

    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id: GridRowId) => () => {
        setRows(rows.filter((row) => row.id !== id));
    };

    const handleCancelClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow!.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
    };

    const processRowUpdate = (newRow: GridRowModel) => {
        const updatedRow = { ...newRow, isNew: false };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const columns: GridColDef[] = [
        {
            field: 'UatRole',
            headerName: 'UAT หัวข้อ',
            width: 220,
            editable: true,
            type: 'singleSelect',
            valueOptions: ['Unit Testing', 'Integration Testing', 'System Testing', 'Acceptance Testing'],
        },
        {
            field: 'UatDetail',
            headerName: 'UAT รายละเอียด',
            width: 350,
            editable: true
        },
        {
            field: 'UatStatus',
            headerName: 'ผลการทดสอบ',
            type: 'singleSelect',
            width: 150,
            align: 'left',
            headerAlign: 'left',
            editable: true,
            valueOptions: ['ผ่าน', 'ไม่ผ่าน'],
        },
        {
            field: 'UatComment',
            headerName: 'Comment',
            width: 350,
            align: 'left',
            headerAlign: 'left',
            editable: true,
        },
        {
            field: 'dateSave',
            headerName: 'วันที่',
            type: 'date',
            width: 110,
            editable: true,
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon />}
                            label="Save"
                            sx={{ color: 'primary.main' }}
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                ];
            },
        },
    ];

    // Data Rating
    const columnss: GridColDef[] = [
        {
            field: 'places',
            headerName: 'Places',
            width: 120,
        },
        {
            field: 'rating',
            headerName: 'Rating',
            display: 'flex',
            renderCell: renderRating,
            renderEditCell: renderRatingEditInputCell,
            editable: true,
            width: 180,
            type: 'number',
        },
    ];

    const rowss = [
        { id: 1, places: 'Barcelona', rating: 5 },
        { id: 2, places: 'Rio de Janeiro', rating: 4 },
        { id: 3, places: 'London', rating: 3 },
        { id: 4, places: 'New York', rating: 2 },
    ];

    return (


        <React.Fragment>
            <CssBaseline />
            <Container maxWidth="lg">

                <Stepper>
                    {steps.map((step, index) => (
                        <Step
                            key={step}
                            indicator={
                                <StepIndicator
                                    variant={activeStep <= index ? 'soft' : 'solid'}
                                    color={activeStep < index ? 'neutral' : 'primary'}
                                >
                                    {activeStep <= index ? index + 1 : <Check />}
                                </StepIndicator>
                            }
                            sx={{
                                '&::after': {
                                    ...(activeStep > index &&
                                        index !== 2 && { bgcolor: 'primary.solidBg' }),
                                },
                            }}
                        >
                            <StepButton onClick={() => setActiveStep(index)}>{step}</StepButton>
                        </Step>
                    ))}
                </Stepper>
                <br />


                <Grid container spacing={2} sx={{ flexGrow: 1 }}>

                    <Grid xs={6} >
                        <Box><h2>IT ManagerApprove</h2></Box>
                    </Grid>

                    <Grid xs={6}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <FormLabel>
                                <h5>Request No.</h5>
                                <Input placeholder="67/0001"
                                    sx={{
                                        width: 100, '--Input-radius': '0px',
                                        borderBottom: '2px solid',
                                        borderColor: 'neutral.outlinedBorder',
                                        '&:hover': {
                                            borderColor: 'neutral.outlinedHoverBorder',
                                        },
                                        '&::before': {
                                            border: '1px solid var(--Input-focusedHighlight)',
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
                                    variant="outlined" color="primary" type="text"

                                />
                            </FormLabel>
                        </Box>
                    </Grid>

                    <Grid xs={6}>


                        <Box sx={{ my: 1 }}>
                            <FormLabel>แผนกที่ร้องขอ</FormLabel>
                            <Autocomplete
                                placeholder="เลือกแผนก..."
                                options={top100Films}

                                variant="outlined" color="primary"
                            /></Box>
                        <Box sx={{ my: 1 }}>
                            <FormLabel>ชื่อผู้ร้องขอ</FormLabel>
                            <Input placeholder="ชื่อ"

                                variant="outlined" color="primary"
                                type="text"
                            /></Box>
                        <Box sx={{ my: 1 }}>
                            <FormLabel>เบอร์ติดต่อ</FormLabel>
                            <Input placeholder="พัฒนาโปรแกรม"

                                variant="outlined" color="primary"
                                type="text"
                            />
                        </Box>




                        <Box sx={{ my: 1 }}>
                            <FormLabel>Manager Approve</FormLabel>
                            <Input placeholder="Manager name"

                                variant="outlined" color="success"
                                type="text"
                            /></Box>

                        <Box sx={{ my: 1 }}>
                            <FormLabel>Manager Email</FormLabel>
                            <Input placeholder="Manager@Email.com"

                                variant="outlined" color="success"
                                type="email"
                            /></Box>

                        <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                            <Grid size="auto">
                                <FormLabel>Manager Approve Status</FormLabel>
                                <Select
                                    action={action}
                                    value={value1}
                                    placeholder="Status"
                                    onChange={(e, newValue) => setValue1(newValue)}
                                    variant="outlined" color="success"

                                    {...(value1 && {
                                        // display the button and remove select indicator
                                        // when user has selected a value
                                        endDecorator: (
                                            <IconButton
                                                size="sm"
                                                variant="plain"
                                                color="neutral"
                                                onMouseDown={(event) => {
                                                    // don't open the popup when clicking on this button
                                                    event.stopPropagation();
                                                }}
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
                                    <Option value="approve">อนุมัติ</Option>
                                    <Option value="unapprove">ไม่อนุมัติ</Option>
                                    <Option value="discuss">พิจารณา</Option>
                                    <Option value="cancel">ยกเลิก</Option>
                                </Select>
                            </Grid>
                            <Grid size="auto">
                                <FormLabel>Manager Approve Date</FormLabel>
                                <Input
                                    variant="outlined" color="success"

                                    type="date"
                                />
                            </Grid>
                        </Grid>



                        <Box sx={{ my: 1 }}>
                            <FormLabel>Director Approve</FormLabel>
                            <Input placeholder="Director name"

                                variant="outlined" color="warning"
                                type="text"
                            />
                        </Box>

                        <Box sx={{ my: 1 }}>
                            <FormLabel>Director Email</FormLabel>
                            <Input placeholder="Director@Email.com"

                                variant="outlined" color="warning"
                                type="email"
                            />
                        </Box>


                        <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                            <Grid size="auto">
                                <FormLabel>Director Approve Status</FormLabel>
                                <Select
                                    action={action}
                                    value={value2}
                                    placeholder="Status"
                                    onChange={(e, newValue) => setValue2(newValue)}
                                    variant="outlined" color="warning"

                                    {...(value2 && {
                                        // display the button and remove select indicator
                                        // when user has selected a value
                                        endDecorator: (
                                            <IconButton
                                                size="sm"
                                                variant="plain"
                                                color="neutral"
                                                onMouseDown={(event) => {
                                                    // don't open the popup when clicking on this button
                                                    event.stopPropagation();
                                                }}
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
                                    <Option value="approve">อนุมัติ</Option>
                                    <Option value="unapprove">ไม่อนุมัติ</Option>
                                    <Option value="discuss">พิจารณา</Option>
                                    <Option value="cancel">ยกเลิก</Option>
                                </Select>
                            </Grid>
                            <Grid size="auto">
                                <FormLabel>Director Approve Date</FormLabel>
                                <Input
                                    variant="outlined" color="warning"
                                    type="date"

                                />
                            </Grid>
                        </Grid>


                    </Grid>

                    <Grid xs={6}>
                        <Box sx={{ my: 1 }}>
                            <FormLabel>หัวข้อเรื่อง</FormLabel>
                            <Textarea
                                size="md" name="Size" placeholder="Subject here…"
                                variant="outlined" color="primary"
                            />
                        </Box>

                        <Box>
                            <FormLabel>วัตถุประสงค์</FormLabel>
                            <Textarea
                                minRows={2}
                                placeholder="Type in here…"
                                variant="outlined"
                                color="primary"
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

                        <Box sx={{ my: 1 }}>
                            <FormLabel>ความต้องการ</FormLabel>
                            <Textarea
                                minRows={2}
                                placeholder="Type in here…"
                                variant="outlined"
                                color="primary"
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

                        <br />


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

                        <br />
                        <Grid item xs={12}>
                            <FormControl orientation="horizontal" sx={{ gap: 1 }}>
                                {/* <Switch
size="sm"
checked={loading3}
onChange={(event) => setLoading3(event.target.checked)}
/> */}
                                <FormLabel 
                                sx={{
                                    color: 'blue',           // กำหนดสีตัวอักษร
                                    textDecoration: 'underline', // เพิ่มขีดเส้นใต้
                                  }}><h3 >IT Admin</h3></FormLabel>
                            </FormControl>
                        </Grid>

                        <Grid container spacing={2} sx={{ flexGrow: 1 }}>


                            <Grid size="auto">
                                {/* <Skeleton loading={loading3} variant="rectangular"> */}
                                <FormLabel>Assign Department</FormLabel>

                                <Box
                                    sx={{

                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Typography
                                        id="example-payment-channel-label"
                                        level="title-md"
                                        textColor={'text.secondary'}
                                        fontWeight="xl"
                                    >

                                    </Typography>

                                </Box>
                                <Autocomplete
                                    options={top101Films.map((option) => option.title)}
                                    id="auto-highlight"
                                    variant="outlined" color="danger"
                                    placeholder="Assign..."
                                    autoHighlight
                                    renderInput={(params) => (
                                        <TextField {...params} label="autoHighlight" variant="standard" />
                                    )}
                                />



                                {/* </Skeleton> */}
                            </Grid>
                            <Grid size="auto">
                                {/* <Skeleton loading={loading3} variant="rectangular"> */}
                                <FormLabel>Task Type</FormLabel>
                                <Autocomplete
                                    id="tags-default"
                                    multiple
                                    placeholder="Task Type..."
                                    color="danger"
                                    options={top102Films}
                                    getOptionLabel={(option) => option.title}

                                    renderTags={(tags, getTagProps) =>
                                        tags.map((item, index) => (
                                            <Chip
                                                key={index}
                                                label={item.title}
                                                variant="solid"
                                                color="primary"
                                                endDecorator={<Close fontSize="sm" />}
                                                sx={{ minWidth: 0 }}
                                                onDelete={() => { }}
                                                deleteIcon={<CloseIcon />}
                                                {...getTagProps({ index })}
                                            >{item.title}</Chip>
                                        ))
                                    }
                                />
                                {/* </Skeleton> */}
                            </Grid>
                        </Grid>

                        <Box sx={{ my: 1 }}>

                                {/* <Skeleton loading={loading3} variant="rectangular"> */}
                                <Typography variant="h6">ข้อมูลต่างๆ</Typography>
                                <Textarea
                                    minRows={2}
                                    placeholder="Type in here…"
                                    variant="soft"
                                    color="danger"
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

                                {/* </Skeleton> */}

                            </Box>

                    </Grid>



                </Grid>

                <br />




                <Grid container spacing={1} sx={{ border: '1px dashed', borderColor: 'lightblue', borderRadius: 'sm', p: 2 }}>


                    <Grid item xs={12}>
                        <FormControl orientation="horizontal" sx={{ gap: 1 }}>
                            {/* <Switch
                size="sm"
                checked={loading2}
                onChange={(event) => setLoading2(event.target.checked)}
              /> */}
                            <FormLabel
                            sx={{
                                color: 'blue',           // กำหนดสีตัวอักษร
                                textDecoration: 'underline', // เพิ่มขีดเส้นใต้
                              }}><h3>ฝ่าย IT</h3></FormLabel>
                        </FormControl>
                    </Grid>

                    <Grid item xs={2} >
                        {/* <Skeleton loading={loading2} variant="rectangular"> */}
                        <FormLabel>IT Manager Approve</FormLabel>
                        <Input variant="outlined" color="success" type='text' placeholder='IT Manager Name' />
                        {/* </Skeleton> */}
                    </Grid>

                    <Grid item xs={2}>
                        {/* <Skeleton loading={loading2} variant="rectangular"> */}
                        <FormLabel>IT Manager Approve Status</FormLabel>
                        <Select
                            action={action}
                            value={value3}
                            placeholder="Status"
                            onChange={(e, newValue) => setValue3(newValue)}
                            variant="outlined" color="success"
                            {...(value3 && {
                                // display the button and remove select indicator
                                // when user has selected a value
                                endDecorator: (
                                    <IconButton
                                        size="sm"
                                        variant="plain"
                                        color="neutral"
                                        onMouseDown={(event) => {
                                            // don't open the popup when clicking on this button
                                            event.stopPropagation();
                                        }}
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
                            <Option value="approve">อนุมัติ</Option>
                            <Option value="unapprove">ไม่อนุมัติ</Option>
                            <Option value="discuss">พิจารณา</Option>
                            <Option value="cancel">ยกเลิก</Option>
                        </Select>
                        {/* </Skeleton> */}
                    </Grid>

                    <Grid item xs={2}>
                        {/* <Skeleton loading={loading2} variant="rectangular"> */}
                        <FormLabel>IT Manager Approve Date</FormLabel>
                        <Input type='date' variant="outlined" color="success" />
                        {/* </Skeleton> */}
                    </Grid>

                    <Grid item xs={2} >
                        {/* <Skeleton loading={loading2} variant="rectangular"> */}
                        <FormLabel>IT Manager Director</FormLabel>
                        <Input variant="outlined" color="warning" type='text' placeholder='IT Manager Name' />
                        {/* </Skeleton> */}
                    </Grid>

                    <Grid item xs={2}>
                        {/* <Skeleton loading={loading2} variant="rectangular"> */}
                        <FormLabel>IT Manager Director Status</FormLabel>
                        <Select
                            action={action}
                            value={value4}
                            placeholder="Status"
                            onChange={(e, newValue) => setValue4(newValue)}
                            variant="outlined" color="warning"
                            {...(value4 && {
                                // display the button and remove select indicator
                                // when user has selected a value
                                endDecorator: (
                                    <IconButton
                                        size="sm"
                                        variant="plain"
                                        color="neutral"
                                        onMouseDown={(event) => {
                                            // don't open the popup when clicking on this button
                                            event.stopPropagation();
                                        }}
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
                            <Option value="approve">อนุมัติ</Option>
                            <Option value="unapprove">ไม่อนุมัติ</Option>
                            <Option value="discuss">พิจารณา</Option>
                            <Option value="cancel">ยกเลิก</Option>
                        </Select>
                        {/* </Skeleton> */}
                    </Grid>

                    <Grid item xs={2}>
                        {/* <Skeleton loading={loading2} variant="rectangular"> */}
                        <FormLabel>IT Manager Director Date</FormLabel>
                        <Input type='date' variant="outlined" color="warning" />
                        {/* </Skeleton> */}
                    </Grid>

                    <Grid item xs={6}>
                        <Stack spacing={2}>
                            {/* <Skeleton loading={loading2} variant="rectangular"> */}
                            <Typography variant="h6">IT Manager Note</Typography>

                            <Textarea
                                minRows={2}
                                placeholder="Type in here…"
                                variant="soft"
                                color="success"
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
                            {/* </Skeleton> */}
                        </Stack>
                    </Grid>

                    <Grid item xs={6}>
                        <Stack spacing={2}>
                            {/* <Skeleton loading={loading2} variant="rectangular"> */}
                            <Typography variant="h6">IT Director Note</Typography>

                            <Textarea
                                minRows={2}
                                placeholder="Type in here…"
                                variant="soft"
                                color="warning"
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
                            {/* </Skeleton> */}
                        </Stack>
                    </Grid>


                </Grid>

                <br />

                <Grid container spacing={1} sx={{ border: '1px dashed', borderColor: 'lightblue', borderRadius: 'sm', p: 2 }}>

                    <Grid item xs={12}>
                        <FormControl orientation="horizontal" sx={{ gap: 1 }}>
                            {/* <Switch
                size="sm"
                checked={loading3}
                onChange={(event) => setLoading3(event.target.checked)}
              /> */}
                            <FormLabel
                            sx={{
                                color: 'blue',           // กำหนดสีตัวอักษร
                                textDecoration: 'underline', // เพิ่มขีดเส้นใต้
                              }}><h3>ผลการดําเนินการ</h3></FormLabel>
                        </FormControl>
                    </Grid>

                    <Grid item xs={4} >
                        {/* <Skeleton loading={loading3} variant="rectangular"> */}
                        <FormLabel>ระดับความยากง่ายในการพัฒนาโปรแกรม</FormLabel>

                        <Box
                            sx={{

                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <Typography
                                id="example-payment-channel-label"
                                level="title-md"
                                textColor={'text.secondary'}
                                fontWeight="xl"
                            >

                            </Typography>

                        </Box>
                        <RadioGroup
                            aria-labelledby="example-payment-channel-label"
                            overlay
                            name="example-payment-channel"

                        >
                            <List
                                component="div"
                                variant="outlined"
                                orientation="horizontal"
                                sx={{
                                    borderRadius: 'sm',
                                    boxShadow: 'sm',
                                }}
                            >
                                {['A ยาก', 'B ปานกลาง', 'C ง่าย'].map((value, index) => (
                                    <React.Fragment key={value}>
                                        {index !== 0 && <ListDivider />}
                                        <ListItem>
                                            <Radio id={value} value={value} label={value} />
                                        </ListItem>
                                    </React.Fragment>
                                ))}
                            </List>
                        </RadioGroup>

                        {/* </Skeleton> */}
                    </Grid>

                    <Grid item xs={2} >
                        {/* <Skeleton loading={loading3} variant="rectangular"> */}
                        <FormLabel>ผู้รับมอบหมาย</FormLabel>
                        <Select
                            defaultValue="1"
                            slotProps={{
                                listbox: {
                                    sx: {
                                        '--ListItemDecorator-size': '44px',
                                    },
                                },
                            }}
                            sx={{
                                '--ListItemDecorator-size': '44px',
                                minWidth: 150,
                            }}
                            renderValue={renderValue}
                        >
                            {options.map((option, index) => (
                                <React.Fragment key={option.value}>
                                    {index !== 0 ? <ListDivider role="none" inset="startContent" /> : null}
                                    <Option value={option.value} label={option.label}>
                                        <ListItemDecorator>
                                            <Avatar size="sm" src={option.src} />
                                        </ListItemDecorator>
                                        {option.label}
                                    </Option>
                                </React.Fragment>
                            ))}
                        </Select>
                        {/* </Skeleton> */}
                    </Grid>

                    <Grid item xs={2}>
                        {/* <Skeleton loading={loading3} variant="rectangular"> */}
                        <FormLabel>ประมาณการวันที่แล้วเสร็จ</FormLabel>
                        <Input variant="outlined" color="success"
                            type="date" />
                        {/* </Skeleton> */}
                    </Grid>

                    <Grid item xs={2}>
                        {/* <Skeleton loading={loading3} variant="rectangular"> */}
                        <FormLabel>เริ่มวันที่</FormLabel>
                        <Input type='date' variant="outlined" color="primary" />
                        {/* </Skeleton> */}
                    </Grid>

                    <Grid item xs={2}>
                        {/* <Skeleton loading={loading3} variant="rectangular"> */}
                        <FormLabel>สิ้นสุดวันที่</FormLabel>
                        <Input type='date' variant="outlined" color="danger" />
                        {/* </Skeleton> */}
                    </Grid>

                    <Grid item xs={12}>
                        <Stack spacing={2}>
                            {/* <Skeleton loading={loading3} variant="rectangular"> */}
                            <Typography variant="h6">ข้อมูลต่างๆ</Typography>


                            {/* </Skeleton> */}
                        </Stack>
                    </Grid>

                </Grid>


                <br />

                <Grid container spacing={1} sx={{ border: '1px dashed', borderColor: 'lightblue', borderRadius: 'sm', p: 2 }}>

                    <Grid item xs={12}>
                        <FormControl orientation="horizontal" sx={{ gap: 1 }}>
                            {/* <Switch
                size="sm"
                checked={loading4}
                onChange={(event) => setLoading4(event.target.checked)}
              /> */}
                            <FormLabel
                            sx={{
                                color: 'blue',           // กำหนดสีตัวอักษร
                                textDecoration: 'underline', // เพิ่มขีดเส้นใต้
                              }}><h3>Link To UAT</h3></FormLabel>
                        </FormControl>
                    </Grid>




                    <Grid item xs={12}>
                        <Stack spacing={2}>
                            {/* <Skeleton loading={loading4} variant="rectangular"> */}

                            <Box
                                sx={{
                                    height: 500,
                                    width: '100%',
                                    '& .actions': {
                                        color: 'text.secondary',
                                    },
                                    '& .textPrimary': {
                                        color: 'text.primary',
                                    },
                                }}
                            >
                                <DataGrid
                                    rows={rows}
                                    columns={columns}
                                    editMode="row"
                                    rowModesModel={rowModesModel}
                                    onRowModesModelChange={handleRowModesModelChange}
                                    onRowEditStop={handleRowEditStop}
                                    processRowUpdate={processRowUpdate}
                                    slots={{
                                        toolbar: EditToolbar as GridSlots['toolbar'],
                                    }}
                                    slotProps={{
                                        toolbar: { setRows, setRowModesModel, rows },
                                    }}
                                />
                            </Box>

                            {/* </Skeleton> */}
                        </Stack>
                    </Grid>







                </Grid>
                <br />

                <Grid container spacing={1} sx={{ border: '1px dashed', borderColor: 'lightblue', borderRadius: 'sm', p: 2 }}>

                    <Grid item xs={12}>
                        <FormControl orientation="horizontal" sx={{ gap: 1 }}>
                            {/* <Switch
                size="sm"
                checked={loading5}
                onChange={(event) => setLoading5(event.target.checked)}
              /> */}
                            <FormLabel
                            sx={{
                                color: 'blue',           // กำหนดสีตัวอักษร
                                textDecoration: 'underline', // เพิ่มขีดเส้นใต้
                              }}><h3>Link To Evaluate</h3></FormLabel>
                        </FormControl>
                    </Grid>


                    <Grid item xs={12}>
                        <Stack spacing={2}>
                            {/* <Skeleton loading={loading5} variant="rectangular"> */}

                            <div style={{ height: 250, width: '100%' }}>
                                <DataGrid rows={rowss} columns={columnss} />
                            </div>

                            {/* </Skeleton> */}
                        </Stack>
                    </Grid>


                </Grid>

                <br />

                <Grid xs={12}>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
                        <Button startDecorator={<SaveIcon />}>Save</Button>
                        <Button endDecorator={<CancelIcon />} color="danger">
                            Cancel
                        </Button>
                    </Box>
                </Grid>



            </Container>
        </React.Fragment >
    );
}


const top100Films = [
    { label: 'บุคคล' },
    { label: 'โอนเงิน' },
    { label: 'รับเงิน' },
    { label: 'คลังสินค้า' },
    { label: 'คลังยา' },
    { label: 'ฉุกเฉิน' },
    { label: 'ประชาสัมพันธ์' },

];


const top101Films = [
    { title: 'ซ่อมบำรุงคอมฯ' },
    { title: 'ควบคุมระบบ' },
    { title: 'พัฒนาโปรแกรม' },
];

const top102Films = [
    { title: 'พัฒนาโปรแกรมขึ้นใหม่' },
    { title: 'การขอใช้อุปกรณ์' },
    { title: 'พัฒนาโปรแกรมต่อเนื่อง' },
    { title: 'ขอเปิดสิทธิ' },
    { title: 'แก้ไข/เพิ่มเติม Report' },
    { title: 'ขอใช้ Social Media' },
    { title: 'ขอใช้ Email' },
];




export default ManagerApprove;
