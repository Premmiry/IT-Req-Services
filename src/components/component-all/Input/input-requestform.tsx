import React from 'react';
import { Box , FormLabel } from '@mui/material';
import { Textarea , Input } from '@mui/joy';

interface InputProps {
  label?: string;
  id?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: 'text' | 'textarea';
}

const InputComponent: React.FC<InputProps> = ({ 
  label = '', 
  id = '', 
  placeholder = '', 
  value, 
  onChange, 
  type = 'text' 
}) => (
  <Box sx={{ mt: 2 }}>
    <FormLabel>{label}</FormLabel>
    {type === 'text' ? (
      <Input
        id={id}
        placeholder={placeholder}
        variant="outlined"
        color="primary"
        type="text"
        value={value}
        onChange={onChange}
      />
    ) : (
      <Textarea
        id={id}
        minRows={4}
        placeholder={placeholder}
        variant="outlined"
        color="primary"
        maxRows={4}
        value={value}
        onChange={onChange}
      />
    )}
  </Box>
);

export const NameInput: React.FC<Omit<InputProps, 'type'>> = (props) => (
  <InputComponent {...props} id={props.id || "name_req"} label={props.label || "ชื่อผู้ร้องขอ"} placeholder={props.placeholder || "ชื่อ-นามสกุล..."} />
);

export const PhoneInput: React.FC<Omit<InputProps, 'type'>> = (props) => (
  <InputComponent {...props} id={props.id || "phone"} label={props.label || "เบอร์ติดต่อ"} placeholder={props.placeholder || "เบอร์ติดต่อ..."} />
);

export const TitleInput: React.FC<Omit<InputProps, 'type'>> = (props) => (
  <InputComponent {...props} id={props.id || "title_req"} label={props.label || "เรื่อง"} placeholder={props.placeholder || "เรื่องที่ต้องการ Request..."} />
);

export const DetailsTextarea: React.FC<Omit<InputProps, 'type'>> = (props) => (
  <InputComponent {...props} id={props.id || "details"} label={props.label || "รายละเอียด"} placeholder={props.placeholder || "ใส่รายละเอียด Request ที่นี่…"} type="textarea" />
);

export const ManagerInput: React.FC<Omit<InputProps, 'type'>> = (props) => (
  <InputComponent {...props} id={props.id || "m_name"} label={props.label || "ชื่อผู้จัดการส่วน"} placeholder={props.placeholder || "ชื่อ-นามสกุล..."} />
);

export const DirectorInput: React.FC<Omit<InputProps, 'type'>> = (props) => (
  <InputComponent {...props} id={props.id || "d_name"} label={props.label || "ชื่อผู้อำนวยการฝ่าย"} placeholder={props.placeholder || "ชื่อ-นามสกุล..."} />
);

export const ITManagerTextarea: React.FC<Omit<InputProps, 'type'>> = (props) => (
  <InputComponent {...props} id={props.id || "it_manager"} label={props.label || "IT Manager"} placeholder={props.placeholder || "IT Manager..."} type="textarea" />
);

export const ITDirectorTextarea: React.FC<Omit<InputProps, 'type'>> = (props) => (
  <InputComponent {...props} id={props.id || "it_director"} label={props.label || "IT Director"} placeholder={props.placeholder || "IT Director..."} type="textarea" />
);
