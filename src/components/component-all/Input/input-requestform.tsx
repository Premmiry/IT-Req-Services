import React from 'react';
import { Box, Input, Textarea, FormLabel } from '@mui/joy';

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
  <Box sx={{ pl: 2, mt: 2 }}>
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