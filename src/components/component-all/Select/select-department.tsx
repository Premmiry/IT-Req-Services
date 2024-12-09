import React, { useState, useEffect } from 'react';
import { Autocomplete, CircularProgress } from '@mui/joy';
import { FormLabel, Box } from '@mui/material';
import URLAPI from '../../../URLAPI';

interface Department {
  id_department: number;
  name_department: string;
}

interface DepartmentOption {
  key: number;
  label: string;
}

interface SelectDepartmentProps {
  onDepartmentChange: (department: any) => void;
  initialValue: any;
  filterDepartments: boolean;
}

export default function SelectDepartment({ onDepartmentChange, initialValue, filterDepartments }: SelectDepartmentProps) {
  const [departments, setDepartments] = useState<any[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentOption | null>(initialValue);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchDepartments = async () => {
      if (!isMounted) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`${URLAPI}/departments`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: Department[] = await response.json();
        
        if (!isMounted) return;

        const departmentOptions: DepartmentOption[] = data.map(dept => ({
          key: dept.id_department,
          label: dept.name_department
        }));
        
        // กรองข้อมูลแผนกตามเงื่อนไข
        const filteredData = filterDepartments 
          ? departmentOptions.filter((dept: any) => [290, 291, 292].includes(dept.key))
          : departmentOptions;
        
        setDepartments(filteredData);

        // อัปเดต label ของ initialValue ถ้ามีค่า
        if (initialValue) {
          const initialDept = filteredData.find(dept => dept.key === initialValue.key);
          if (initialDept) {
            setSelectedDepartment(initialDept);
          }
        }
      } catch (error) {
        if (!isMounted) return;
        console.error('Error fetching departments:', error);
        setError('ไม่สามารถโหลดข้อมูลแผนกได้');
        setDepartments([]);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDepartments();

    return () => {
      isMounted = false;
    };
  }, [initialValue, filterDepartments]);

  return (
    <React.Fragment>
      <FormLabel>
        {filterDepartments ? "Department IT" : "Department"}
      </FormLabel>
      <Autocomplete
        placeholder={loading ? "กำลังโหลด..." : "เลือกแผนก..."}
        options={departments}
        value={selectedDepartment}
        variant="outlined"
        color="primary"
        readOnly={false}
        disabled={loading}
        getOptionLabel={(option: DepartmentOption) => option.label}
        isOptionEqualToValue={(option: DepartmentOption, value: DepartmentOption) => option.key === value.key}
        onChange={(_event, value) => {
          setSelectedDepartment(value);
          onDepartmentChange(value);
        }}
        slotProps={{
          listbox: {
            sx: { maxHeight: '300px' }
          }
        }}
        endDecorator={loading ? <CircularProgress size="sm" /> : null}
      />
      {error && (
        <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>
          {error}
        </Box>
      )}
    </React.Fragment>
  );
}
