import React, { useState, useEffect, useMemo } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import localeData from 'dayjs/plugin/localeData';
import 'dayjs/locale/th';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import EditCalendarRoundedIcon from '@mui/icons-material/EditCalendarRounded';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import URLAPI from '../../../URLAPI';
import { Grid } from '@mui/material';

// ตั้งค่า plugin ที่ใช้
dayjs.extend(advancedFormat);
dayjs.extend(localeData);
dayjs.locale('th');

interface DateWorkProps {
    req_id: number;
    date_start?: Date | null;
    date_end?: Date | null;
    date_estimate?: Date | null;
    onUpdateComplete?: () => void; // เพิ่ม prop สำหรับ callback
}

const StyledButton = styled(IconButton)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius,
}));

const StyledDay = styled(PickersDay)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius,
    color: theme.palette.primary.light,
    '&.Mui-selected': {
        color: theme.palette.warning.dark,
    },
}));

const usePriorityOptions = () => {
    const [userData, setUserData] = useState<any | null>(null);
    const [admin, setAdmin] = useState<string | null>(null);

    useEffect(() => {
        const storedUserData = sessionStorage.getItem('userData');
        const storedAdmin = sessionStorage.getItem('admin');

        if (storedUserData) {
            setUserData(JSON.parse(storedUserData));
        }
        if (storedAdmin) {
            setAdmin(storedAdmin);
        }
    }, []);

    const isITStaff = useMemo(() => {
        return userData?.id_section === 28 ||
            userData?.id_division_competency === 86 ||
            userData?.id_section_competency === 28;
    }, [userData]);

    return { isITStaff, admin };
};

const DateWork: React.FC<DateWorkProps> = ({ req_id, date_start, date_end, date_estimate, onUpdateComplete }) => {
    // console.log('DateWork props:', { req_id, date_start, date_end, date_estimate });

    const { isITStaff, admin } = usePriorityOptions();
    const [dateStart, setDateStart] = useState<Dayjs | null>(null);
    const [currentDate, setCurrentDate] = useState<Dayjs | null>(null);
    const [dateEnd, setDateEnd] = useState<Dayjs | null>(null);
    const [dateEstimate, setDateEstimate] = useState<Dayjs | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (date_start) {
            setDateStart(dayjs(date_start));
        }
        if (date_end) {
            setDateEnd(dayjs(date_end));
        }
        if (date_estimate) {
            setDateEstimate(dayjs(date_estimate));
        }
        setCurrentDate(dayjs());
    }, [date_start, date_end, date_estimate]);

    const updateDateWork = async (field: 'date_start' | 'date_end' | 'date_estimate', value: Dayjs | null) => {
        if (!value) return;

        setIsLoading(true);
        const params = new URLSearchParams();
        params.set(field, value.format('YYYY-MM-DD'));

        try {
            const response = await fetch(`${URLAPI}/datework/${req_id}?${params.toString()}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                const errorMessage = errorData?.detail || 'Failed to update date';
                throw new Error(errorMessage);
            }

            const data = await response.json();
            console.log(`${field} updated successfully:`, data);
            
            // เรียก callback function หลังจากอัพเดตสำเร็จ
            if (onUpdateComplete) {
                onUpdateComplete();
            }
        } catch (error) {
            console.error('Error updating date:', error);
            alert(error instanceof Error ? error.message : 'An error occurred while updating the date');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDateStartChange = (newValue: Dayjs | null) => {
        if (!newValue || (!isITStaff)) return;
        setDateStart(newValue);
        updateDateWork('date_start', newValue);
    };

    const handleDateEndChange = (newValue: Dayjs | null) => {
        if (!newValue || (!isITStaff)) return;
        setDateEnd(newValue);
        updateDateWork('date_end', newValue);
    };

    const handleDateEstimateChange = (newValue: Dayjs | null) => {
        if (!newValue || (!isITStaff)) return;
        setDateEstimate(newValue);
        updateDateWork('date_estimate', newValue);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid container spacing={2} sx={{ width: '100%' }}>
                <Grid item xs={12} sm={5}>
                    <DatePicker
                        label="วันที่เริ่มงาน (Date Start)"
                        value={dateStart}
                        onChange={handleDateStartChange}
                        format="DD-MM-YYYY"
                        slots={{
                            openPickerIcon: EditCalendarRoundedIcon,
                            openPickerButton: StyledButton,
                            day: StyledDay,
                        }}
                        slotProps={{
                            openPickerIcon: { fontSize: 'large' },
                            openPickerButton: { color: 'primary' },
                            textField: {
                                variant: 'standard',
                                focused: true,
                                color: 'primary',
                            },
                        }}
                        disabled={true}
                    />
                </Grid>
                <Grid item xs={12} sm={5}>
                        <DatePicker
                            label="วันที่ประมาณการ (Date Estimate)"
                            value={dateEstimate}
                            onChange={handleDateEstimateChange}
                            format="DD-MM-YYYY"
                            slots={{
                                openPickerIcon: EditCalendarRoundedIcon,
                                openPickerButton: StyledButton,
                                day: StyledDay,
                            }}
                            slotProps={{
                                openPickerIcon: { fontSize: 'large' },
                                openPickerButton: { color: 'warning' },
                                textField: {
                                    variant: 'standard',
                                    focused: true,
                                    color: 'primary',
                                },
                            }}
                        disabled={(!isITStaff) || isLoading}
                    />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <DatePicker
                        label="วันที่สิ้นสุดงาน (Date End)"
                        value={dateEnd}
                        onChange={handleDateEndChange}
                        format="DD-MM-YYYY"
                        slots={{
                            openPickerIcon: EditCalendarRoundedIcon,
                            openPickerButton: StyledButton,
                            day: StyledDay,
                        }}
                        slotProps={{
                            openPickerIcon: { fontSize: 'large' },
                            openPickerButton: { color: 'secondary' },
                            textField: {
                                variant: 'standard',
                                focused: true,
                                color: 'secondary',
                            },
                        }}
                        disabled={(!isITStaff) || isLoading}
                        minDate={currentDate || undefined}
                    />
                </Grid>
                
            </Grid>
        </LocalizationProvider>
    );
};

export default DateWork;