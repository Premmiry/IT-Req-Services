import React, { useState, useEffect } from 'react';
import { Select, MenuItem, FormControl, InputLabel, Grid, SelectChangeEvent } from '@mui/material';
import URLAPI from '../../../URLAPI';

interface PriorityOption {
    id_priority: number;
    name_priority: string;
}

interface PriorityProps {
    id: number;
    id_priority: number | null;
}

const usePriorityOptions = () => {
    const [priorityOptions, setPriorityOptions] = useState<PriorityOption[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPriorities = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${URLAPI}/priorities`);
                if (!response.ok) {
                    throw new Error('Failed to fetch priorities');
                }
                const data = await response.json();
                setPriorityOptions(data);
            } catch (error) {
                console.error('Error:', error);
                setError('Failed to load priorities');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPriorities();
    }, []);

    return { priorityOptions, isLoading, error };
};

export const SelectPriority: React.FC<PriorityProps> = ({ id, id_priority }) => {
    const { priorityOptions, isLoading } = usePriorityOptions();
    const [selectedValue, setSelectedValue] = useState<number | ''>(id_priority ?? '');

    useEffect(() => {
        setSelectedValue(id_priority ?? '');
    }, [id_priority]);

    const handlePriorityChange = async (event: SelectChangeEvent<string>) => {
        const newValue = parseInt(event.target.value, 10);
        setSelectedValue(newValue);

        if (!newValue) {
            console.log('Priority is not selected');
            return;
        }

        try {
            const response = await fetch(`${URLAPI}/priority/${id}?id_priority=${newValue}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                console.error('Error:', errorMessage);
                alert(`Error: ${errorMessage}`);
                return;
            }

            const updatedData = await response.json();
            console.log('Priority updated successfully:', updatedData);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <FormControl variant="outlined" fullWidth>
                    <InputLabel id="priority-label">เลือกความสำคัญ</InputLabel>
                    <Select
                        labelId="priority-label"
                        value={selectedValue === '' ? '' : selectedValue.toString()}
                        onChange={handlePriorityChange}
                        label="เลือกความสำคัญ"
                        disabled={isLoading}
                    >
                        <MenuItem value="">
                            <em>ยังไม่ได้เลือก</em>
                        </MenuItem>
                        {priorityOptions.map((option) => (
                            <MenuItem key={option.id_priority} value={option.id_priority.toString()}>
                                {option.name_priority}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
        </Grid>
    );
};