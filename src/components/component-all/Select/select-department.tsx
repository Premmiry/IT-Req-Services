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
  onDepartmentChange: (department: DepartmentOption | null) => void;
  initialValue: DepartmentOption | null;
}

export default function SelectDepartment({ onDepartmentChange, initialValue }: SelectDepartmentProps) {
  const [departments, setDepartments] = useState<DepartmentOption[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentOption | null>(initialValue);

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

        // อัปเดต label ของ initialValue ถ้ามีค่า
        if (initialValue) {
          const initialDept = departmentOptions.find(dept => dept.key === initialValue.key);
          if (initialDept) {
            setSelectedDepartment(initialDept);
          }
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    fetchDepartments();
  }, [initialValue]);

  return (
    <React.Fragment>
      <FormLabel>แผนกที่ร้องขอ</FormLabel>
      <Autocomplete
        placeholder="เลือกแผนก..."
        options={departments}
        value={selectedDepartment}
        variant="outlined"
        color="primary"
        getOptionLabel={(option: DepartmentOption) => option.label}
        isOptionEqualToValue={(option: DepartmentOption, value: DepartmentOption) => option.key === value.key}
        onChange={(_event, value) => {
          setSelectedDepartment(value);
          onDepartmentChange(value);
        }}
      />
    </React.Fragment>
  );
}
