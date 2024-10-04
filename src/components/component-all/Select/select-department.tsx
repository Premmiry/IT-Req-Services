import React, { useState, useEffect } from 'react';
import { Autocomplete } from '@mui/joy';
import { FormLabel } from '@mui/material';

interface Department {
  id_department: number;
  name_department: string;
}

interface DepartmentOption {
  key: number;
  label: string;
}

interface SelectDepartmentProps {
  onDepartmentChange: (department: DepartmentOption | null) => void; // ฟังก์ชัน prop สำหรับส่งค่ากลับไปยัง RequestForm
}

export default function SelectDepartment({ onDepartmentChange }: SelectDepartmentProps) {
  const [departments, setDepartments] = useState<DepartmentOption[]>([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch('http://127.0.0.1:1234/departments');
        const data: Department[] = await response.json();
        const departmentOptions: DepartmentOption[] = data.map(dept => ({
          key: dept.id_department,
          label: dept.name_department
        }));
        setDepartments(departmentOptions);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    fetchDepartments();
  }, []);

  return (
    <React.Fragment>
      <FormLabel>แผนกที่ร้องขอ</FormLabel>
      <Autocomplete
        placeholder="เลือกแผนก..."
        options={departments}
        variant="outlined"
        color="primary"
        getOptionLabel={(option: DepartmentOption) => option.label}
        isOptionEqualToValue={(option: DepartmentOption, value: DepartmentOption) => option.key === value.key}
        onChange={(_event, value) => onDepartmentChange(value)} // เมื่อเลือกค่าใหม่ ส่งค่ากลับไปยัง RequestForm
      />
    </React.Fragment>
  );
}
