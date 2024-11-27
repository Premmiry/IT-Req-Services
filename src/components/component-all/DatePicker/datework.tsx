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

    const isITStaff = useMemo(() => {
        return userData?.id_section === 28 ||
            userData?.id_division_competency === 86 ||
            userData?.id_section_competency === 28;
    }, [userData]);

    useEffect(() => {
        const storedUserData = sessionStorage.getItem('userData');
        if (storedUserData) {
            setUserData(JSON.parse(storedUserData));
        }
    }, []);

    return { isITStaff };
};

const DateWork: React.FC<DateWorkProps> = ({ req_id, date_start, date_end }) => {
    const { isITStaff } = usePriorityOptions();
    const [dateStart, setDateStart] = useState<Dayjs | null>(date_start ? dayjs(date_start) : null);
    const [dateEnd, setDateEnd] = useState<Dayjs | null>(date_end ? dayjs(date_end) : null);
    const [isLoading, setIsLoading] = useState(false);

    const updateDateWork = async (field: 'date_start' | 'date_end', value: Dayjs | null) => {
        if (!value || !isITStaff) return;

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
        } catch (error) {
            console.error('Error updating date:', error);
            alert(error instanceof Error ? error.message : 'An error occurred while updating the date');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDateStartChange = (newValue: Dayjs | null) => {
        if (!newValue || !isITStaff) return;
        setDateStart(newValue);
        updateDateWork('date_start', newValue);
    };

    const handleDateEndChange = (newValue: Dayjs | null) => {
        if (!newValue || !isITStaff) return;
        setDateEnd(newValue);
        updateDateWork('date_end', newValue);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <DatePicker
                        label="วันที่เริ่มต้น (Date Start)"
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
                        disabled={!isITStaff || isLoading}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <DatePicker
                        label="วันที่สิ้นสุด (Date End)"
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
                        disabled={!isITStaff || isLoading}
                        minDate={dateStart || undefined}
                    />
                </Grid>
            </Grid>
        </LocalizationProvider>
    );
};

export default DateWork;