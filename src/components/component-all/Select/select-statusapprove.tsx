import React, { useEffect, useState } from 'react';
import URLAPI from '../../../URLAPI';
// Base Select Component
const BaseSelect: React.FC<{
    label: string;
    id: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: Array<{ value: string; label: string }>;
}> = ({ label, id, value, onChange, options }) => (
    <div>
        <label htmlFor={id}>{label}</label>
        <select id={id} value={value} onChange={onChange}>
            <option value="">-- กรุณาเลือก --</option>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    </div>
);

// Select Component สำหรับ Manager, Director, IT Manager, IT Director
export const SelectWithApi: React.FC<{
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; // Keep this as is
}> = ({ type, value, onChange }) => {
    const [options, setOptions] = useState<Array<{ value: string; label: string }>>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${URLAPI}/status_a`);
                const data = await response.json();
    
                // กรองข้อมูลตาม type ที่ได้รับจาก prop
                const filteredOptions = data
                    .filter((item: { type_a: string }) => item.type_a === type) // กรองข้อมูลตาม type
                    .map((item: { a_status_id: number; a_name: string }) => ({
                        value: item.a_status_id.toString(), // แปลงเป็น string
                        label: item.a_name, // ใช้ a_name เป็น label
                    }));
    
                setOptions(filteredOptions);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };
    
        fetchData();
    }, [type]);
    
    

    return (
        <BaseSelect
            label={`เลือก${type === 'm' ? 'ผู้จัดการส่วน' : type === 'd' ? 'ผู้อำนวยการฝ่าย' : type === 'it-m' ? 'IT Manager' : 'IT Director'}`}
            id={`${type}_select`}
            value={value}
            onChange={onChange}
            options={options}
        />
    );
};