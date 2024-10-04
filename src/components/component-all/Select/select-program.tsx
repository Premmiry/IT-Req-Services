import React, { useState, useEffect } from 'react';
import { Autocomplete } from '@mui/joy';
import { FormLabel } from '@mui/material';

interface Program {
    id_program: number;
    name_program: string;
}

interface ProgramOption {
    key: number;
    label: string;
}

interface SelectProgramProps {
    onProgramChange: (selectedProgram: ProgramOption | null) => void;  // รับฟังก์ชันจาก parent ผ่าน props
}

export default function SelectProgram({ onProgramChange }: SelectProgramProps) {
    const [programs, setPrograms] = useState<ProgramOption[]>([]);
    const [selectedProgram, setSelectedProgram] = useState<ProgramOption | null>(null);

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:1234/programs`);
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

    const handleProgramChange = (_event: any, value: ProgramOption | null) => {
        setSelectedProgram(value);
        onProgramChange(value);  // เรียกฟังก์ชันเพื่อส่งค่ากลับไปที่ parent
    };

    return (
        <React.Fragment>
            <FormLabel>เลือกโปรแกรม</FormLabel>
            <Autocomplete
                placeholder="เลือกโปรแกรม..."
                options={programs}
                value={selectedProgram}
                variant="outlined"
                color="primary"
                getOptionLabel={(option: ProgramOption) => option.label}
                isOptionEqualToValue={(option: ProgramOption, value: ProgramOption) => option.key === value.key}
                onChange={handleProgramChange}
                disabled={programs.length === 0}
            />
        </React.Fragment>
    );
}
