// src/components/component-all/Paper/Priority/index.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { FormLabel, Select, Option, SelectStaticProps, Button, Grid } from '@mui/joy';

import URLAPI from '../../../URLAPI';

// Types
interface PriorityOption {
    id_priority: number;
    name_priority: string;
}

interface PrioritySelected {
    priority: string | null;
    req_id: string | null;
}

interface PriorityProps {
    prioritySelected: PrioritySelected;
    onPriorityChange?: (priority: string) => void;
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
                console.log(data);
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

export const SelectPriority: React.FC<PriorityProps> = ({ 
    prioritySelected, 
    onPriorityChange 
}) => {
    const { priorityOptions, isLoading, error } = usePriorityOptions();
    const [selectedValue, setSelectedValue] = useState<string | null>(
        prioritySelected?.priority || null
    );
    const action = React.useRef<SelectStaticProps['action']>(null);

    const handlePriorityChange = (_event: any, newValue: string | null) => {
        setSelectedValue(newValue);
        if (onPriorityChange && newValue) {
            onPriorityChange(newValue);
        }
    };


    return (
        <Grid container spacing={1}>
            <Grid xs={8}>
                <FormLabel>ระดับความสำคัญ</FormLabel>
                <Select
                    action={action}
                    value={selectedValue}
                    placeholder="เลือกความสำคัญ"
                    onChange={handlePriorityChange}
                    variant="outlined"
                    color="success"
                    disabled={isLoading}
                >
                    {priorityOptions.map((option) => (
                        <Option 
                            key={option.id_priority} 
                            value={option.name_priority}
                        >
                            {option.name_priority}
                        </Option>
                    ))}
                </Select>
                
                {/* Debug information */}
                <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#666' }}>
                    <pre>
                        {JSON.stringify({
                            selectedValue,
                            totalOptions: priorityOptions.length,
                            isLoading,
                            error
                        }, null, 2)}
                    </pre>
                </div>
            </Grid>
        </Grid>
    );
};