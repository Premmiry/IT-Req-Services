import React, { useState, useEffect } from 'react';
import { Autocomplete } from '@mui/joy';
import { FormLabel, Box, Typography } from '@mui/material';
import URLAPI from '../../../URLAPI';
import ComputerIcon from '@mui/icons-material/Computer';
import ConstructionIcon from '@mui/icons-material/Construction';
import DeveloperModeIcon from '@mui/icons-material/DeveloperMode';

interface TypesReq {
    type_id: number;
    type_name: string;
    description: string;
}

interface TypesReqOption {
    key: number;
    label: string;
    description: string;
}

interface SelectTypeRequestProps {
    onSelectType: (typeId: number | null) => void;
    initialValue: number | null;
}

export default function SelectTypeRequest({ onSelectType, initialValue }: SelectTypeRequestProps) {
    const [typesreq, setTypesReq] = useState<TypesReqOption[]>([]);
    const [selectedType, setSelectedType] = useState<TypesReqOption | null>(null);

    useEffect(() => {
        const fetchTypesReq = async () => {
            try {
                const response = await fetch(`${URLAPI}/treqs`);
                const data: TypesReq[] = await response.json();
                const typesreqOptions: TypesReqOption[] = data.map(typer => ({
                    key: typer.type_id,
                    label: typer.type_name,
                    description: typer.description
                }));
                setTypesReq(typesreqOptions);
            } catch (error) {
                console.error('Error fetching typesreq:', error);
            }
        };

        fetchTypesReq();
    }, []);

    useEffect(() => {
        if (initialValue !== null && typesreq.length > 0) {
            const initialType = typesreq.find(type => type.key === initialValue) || null;
            setSelectedType(initialType);
        }
    }, [initialValue, typesreq]);

    const handleTypeChange = (_event: any, value: TypesReqOption | null) => {
        setSelectedType(value);
        onSelectType(value ? value.key : null);
    };

    const getIcon = (typeId: number) => {
        switch(typeId) {
            case 1:
                return <ComputerIcon sx={{ color: '#1976d2' }} />;
            case 2:
                return <ConstructionIcon sx={{ color: '#2e7d32' }} />;
            case 3:
                return <DeveloperModeIcon sx={{ color: '#ed6c02' }} />;
            default:
                return null;
        }
    };

    return (
        <React.Fragment>
            <Box sx={{ mt:2 }}>
            
            <Autocomplete
                placeholder="เลือกประเภท Request..."
                options={typesreq}
                value={selectedType}
                variant="outlined"
                color="primary"
                getOptionLabel={(option: TypesReqOption) => `${option.label}`}
                renderOption={(props, option) => (
                    <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getIcon(option.key)}
                        <Typography>
                            <span style={{ fontWeight: 'bold' }}>{option.label}</span>
                            <span style={{ color: '#666', marginLeft: '5px', fontSize: '12px' }}>({option.description})</span>
                        </Typography>
                    </Box>
                )}
                isOptionEqualToValue={(option: TypesReqOption, value: TypesReqOption) => option.key === value?.key}
                onChange={handleTypeChange}
            />
            </Box>
        </React.Fragment>
    );
}