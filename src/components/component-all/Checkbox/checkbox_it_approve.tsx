import React from 'react';
import RadioGroup from '@mui/joy/RadioGroup';
import Typography from '@mui/joy/Typography';
import Box from '@mui/material/Box';
import List from '@mui/joy/List';
import ListDivider from '@mui/joy/ListDivider';
import ListItem from '@mui/joy/ListItem';
import Radio from '@mui/joy/Radio';
import { green, orange, pink } from '@mui/material/colors';

interface CheckboxITApproveProps {
    levelJob: number | null;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    loading3: boolean;
}

const CheckboxITApprove: React.FC<CheckboxITApproveProps> = ({ levelJob, onChange, loading3 }) => {
    return (
        <>
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
                value={levelJob?.toString() || ''}
                onChange={onChange}
                sx={{
                    backgroundColor: '#f0f0f0', // สีพื้นหลังของ RadioGroup
                    borderRadius: 'xl', // ไม่มีมุมโค้ง
                }}
            >
                <List
                    component="div"
                    variant="outlined"
                    orientation="horizontal"
                    sx={{
                        borderRadius: 'md', // ไม่มีมุมโค้ง
                        boxShadow: 'sm',
                    }}
                >
                    {[
                        { 
                            value: 1, 
                            label: 'A ยาก',
                            color: pink[500] // สีแดง
                        },
                        { 
                            value: 2, 
                            label: 'B ปานกลาง',
                            color: orange[500] // สีส้ม
                        },
                        { 
                            value: 3, 
                            label: 'C ง่าย',
                            color: green[500] // สีเขียว
                        }
                    ].map((item, index) => (
                        <React.Fragment key={item.label}>
                            {index !== 0 && <ListDivider />}
                            <ListItem>
                                <Radio 
                                    id={`${item.label}_radio`}
                                    value={item.value}
                                    label={item.label}
                                    checked={levelJob === item.value}
                                    sx={{
                                        '& .MuiRadio-action': {
                                            bgcolor: `${item.color}20`, // สีพื้นหลังอ่อนๆ
                                            borderRadius: 'xl', // ไม่มีมุมโค้ง
                                        },
                                        '&:hover .MuiRadio-action': {
                                            bgcolor: `${item.color}80`, // สีเมื่อ hover
                                        },
                                        '& .MuiRadio-radio': {
                                            '&.Mui-checked': {
                                                color: item.color, // สีเมื่อเลือก
                                            },
                                        },
                                        '& .MuiRadio-label': {
                                            color: levelJob === item.value ? item.color : 'inherit',
                                            fontWeight: levelJob === item.value ? 'bold' : 'normal',
                                            zIndex: 1, // เพิ่ม z-index เพื่อให้ข้อความอยู่ด้านบน
                                        }
                                    }}
                                />
                            </ListItem>
                        </React.Fragment>
                    ))}
                </List>
            </RadioGroup>
        </>
    );
};

export default CheckboxITApprove;