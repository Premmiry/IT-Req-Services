import React, { useState } from 'react';
import { Grid } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import URLAPI from '../../../URLAPI';

interface DateWorkProps {
    req_id: number;
}

const DateWork: React.FC<DateWorkProps> = ({ req_id }) => {
    const [dateStart, setDateStart] = useState<Dayjs | null>(null);
    const [dateEnd, setDateEnd] = useState<Dayjs | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const updateDateWork = async (field: 'date_start' | 'date_end', value: Dayjs | null) => {
        if (!value) return;

        setIsLoading(true);
        const params = new URLSearchParams();
        
        // Set only the relevant date parameter
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
        if (!newValue) return;
        setDateStart(newValue);
        updateDateWork('date_start', newValue);
    };

    const handleDateEndChange = (newValue: Dayjs | null) => {
        if (!newValue) return;
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
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                disabled: isLoading
                            }
                        }}
                        disabled={isLoading}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <DatePicker
                        label="วันที่สิ้นสุด (Date End)"
                        value={dateEnd}
                        onChange={handleDateEndChange}
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                disabled: isLoading
                            }
                        }}
                        disabled={isLoading}
                        minDate={dateStart || undefined}
                    />
                </Grid>
            </Grid>
        </LocalizationProvider>
    );
};

export default DateWork;