import React, { useState, useEffect } from 'react';
import { Autocomplete } from '@mui/joy';
import { FormLabel } from '@mui/material';

interface TypesReq {
    type_id: number;
    type_name: string;
}

interface TypesReqOption {
    key: number;
    label: string;
}

interface SelectTypeRequestProps {
    onSelectType: (typeId: number | null) => void;  // ส่ง typeId หรือ null
}

export default function SelectTypeRequest({ onSelectType }: SelectTypeRequestProps) {
    const [typesreq, setTypesReq] = useState<TypesReqOption[]>([]);

    useEffect(() => {
        const fetchTypesReq = async () => {
            try {
                const response = await fetch('http://127.0.0.1:1234/treqs');
                const data: TypesReq[] = await response.json();
                const typesreqOptions: TypesReqOption[] = data.map(typer => ({
                    key: typer.type_id,
                    label: typer.type_name
                }));
                setTypesReq(typesreqOptions);
            } catch (error) {
                console.error('Error fetching typesreq:', error);
            }
        };

        fetchTypesReq();
    }, []);

    const handleTypeChange = (_event: any, value: TypesReqOption | null) => {
        onSelectType(value ? value.key : null);  // ส่งค่า null เมื่อเคลียร์
    };

    return (
        <React.Fragment>
            <FormLabel>ประเภท Request</FormLabel>
            <Autocomplete
                placeholder="เลือกประเภทRequest..."
                options={typesreq}
                variant="outlined"
                color="primary"
                getOptionLabel={(option: TypesReqOption) => option.label}
                isOptionEqualToValue={(option: TypesReqOption, value: TypesReqOption) => option.key === value.key}
                onChange={handleTypeChange}  // ส่งการเปลี่ยนค่าไปยัง RequestForm
            />
        </React.Fragment>
    );
}
