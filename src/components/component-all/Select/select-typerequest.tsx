import React, { useState, useEffect } from 'react';
import { Autocomplete } from '@mui/joy';
import { FormLabel, Box } from '@mui/material';

interface TypesReq {
    type_id: number;
    type_name: string;
}

interface TypesReqOption {
    key: number;
    label: string;
}

interface SelectTypeRequestProps {
    onSelectType: (typeId: number | null) => void;
    initialValue: number | null;
}

export default function SelectTypeRequest({ onSelectType, initialValue }: SelectTypeRequestProps) {
    const [typesreq, setTypesReq] = useState<TypesReqOption[]>([]);
    const [selectedType, setSelectedType] = useState<TypesReqOption | null>(null); // เพิ่ม state สำหรับเก็บค่าที่เลือก

    useEffect(() => {
        const fetchTypesReq = async () => {
            try {
                const response = await fetch('http://10.200.240.2:1234/treqs');
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

    useEffect(() => {
        // อัปเดต selectedType เมื่อ initialValue เปลี่ยนไป
        if (initialValue !== null && typesreq.length > 0) {
            const initialType = typesreq.find(type => type.key === initialValue) || null;
            setSelectedType(initialType);
        }
    }, [initialValue, typesreq]);

    const handleTypeChange = (_event: any, value: TypesReqOption | null) => {
        setSelectedType(value);  // อัปเดต selectedType เมื่อมีการเลือกใหม่
        onSelectType(value ? value.key : null);  // ส่งค่า null เมื่อไม่มีการเลือก
    };

    return (
        <React.Fragment>
            <Box sx={{ mt:2 }}>
            <FormLabel>ประเภท Request</FormLabel>
            <Autocomplete
                placeholder="เลือกประเภท Request..."
                options={typesreq}
                value={selectedType} // ใช้ selectedType ที่เก็บใน state
                variant="outlined"
                color="primary"
                getOptionLabel={(option: TypesReqOption) => option.label}
                isOptionEqualToValue={(option: TypesReqOption, value: TypesReqOption) => option.key === value?.key}
                onChange={handleTypeChange}  // ส่งการเปลี่ยนค่าไปยัง RequestForm
            />
            </Box>
        </React.Fragment>
    );
}
