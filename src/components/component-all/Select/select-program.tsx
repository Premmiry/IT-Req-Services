import React, { useState, useEffect } from 'react';
import { Autocomplete } from '@mui/joy';
import { Box, FormLabel } from '@mui/material';
import URLAPI from '../../../URLAPI';

interface Program {
    id_program: number;
    name_program: string;
}

interface ProgramOption {
    key: number;
    label: string;
}

interface SelectProgramProps {
    onProgramChange: (selectedProgram: ProgramOption | null) => void;
    initialValue: ProgramOption | null; // initialValue สามารถเป็น null ได้
}

export default function SelectProgram({ onProgramChange, initialValue }: SelectProgramProps) {
    const [programs, setPrograms] = useState<ProgramOption[]>([]);
    const [selectedProgram, setSelectedProgram] = useState<ProgramOption | null>(initialValue); // ใช้ initialValue เป็นค่าเริ่มต้น

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                // const response = await fetch(`http://10.200.240.2:1234/programs`);
                const response = await fetch(`${URLAPI}/programs`);
                const data: Program[] = await response.json();
                const programOptions: ProgramOption[] = data.map(program => ({
                    key: program.id_program,
                    label: program.name_program,
                }));
                setPrograms(programOptions);
            } catch (error) {
                console.error('Error fetching programs:', error);
            }
        };

        fetchPrograms();
    }, []);

    useEffect(() => {
        // อัปเดต selectedProgram เมื่อ initialValue เปลี่ยนไป
        if (initialValue && programs.length > 0) {
            const initialProgram = programs.find(program => program.key === initialValue.key) || null;
            setSelectedProgram(initialProgram);
        }
    }, [initialValue, programs]);

    const handleProgramChange = (_event: any, value: ProgramOption | null) => {
        setSelectedProgram(value); // อัปเดต selectedProgram เมื่อมีการเลือกใหม่
        onProgramChange(value);    // ส่งค่ากลับไปยัง parent component
    };

    return (
        <React.Fragment>
            <Box sx={{ mt: 2 }}>
            <FormLabel>เลือกโปรแกรม</FormLabel>
            <Autocomplete
                placeholder="เลือกโปรแกรม..."
                options={programs}
                value={selectedProgram} // ใช้ selectedProgram ที่เก็บใน state
                variant="outlined"
                color="primary"
                getOptionLabel={(option: ProgramOption) => option.label}
                isOptionEqualToValue={(option: ProgramOption, value: ProgramOption) => option.key === value?.key}
                onChange={handleProgramChange}
                disabled={programs.length === 0}
            />
            </Box>
        </React.Fragment>
    );
}