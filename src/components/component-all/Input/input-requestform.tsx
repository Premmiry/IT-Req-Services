import React from 'react';
import { Box, FormLabel } from '@mui/material';
import { Textarea, Input } from '@mui/joy';

interface InputProps {
  label?: string;
  id?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: 'text' | 'textarea';
}

interface StyledTextareaProps extends InputProps {
  color?: 'success' | 'warning';
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

const StyledTextarea: React.FC<StyledTextareaProps> = ({
  label = '',
  id = '',
  placeholder = '',
  value,
  onChange,
  color = 'success'
}) => (
  <Box sx={{ mt: 2 }}>
    <FormLabel>{label}</FormLabel>
    <Textarea
      id={id}
      minRows={4}
      placeholder={placeholder}
      variant="soft"
      color={color}
      value={value}
      onChange={onChange}
      sx={{
        mt: 1,
        borderBottom: '2px solid',
        borderColor: 'neutral.outlinedBorder',
        borderRadius: 2,
        '&:hover': {
          borderColor: 'neutral.outlinedHoverBorder',
        },
        '&::before': {
          border: '1px solid var(--Textarea-focusedHighlight)',
          transform: 'scaleX(0)',
          left: 0,
          right: 0,
          bottom: '-2px',
          top: 'unset',
          transition: 'transform .15s cubic-bezier(0.1,0.9,0.2,1)',
          borderRadius: 0,
        },
        '&:focus-within::before': {
          transform: 'scaleX(1)',
        },
      }}
    />
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
  <StyledTextarea 
    {...props} 
    id={props.id || "it_manager_note"} 
    label={props.label || "IT Manager Note"} 
    placeholder={props.placeholder || "Type in here…"} 
    color="success"
  />
);

export const ITDirectorTextarea: React.FC<Omit<InputProps, 'type'>> = (props) => (
  <StyledTextarea 
    {...props} 
    id={props.id || "it_director_note"} 
    label={props.label || "IT Director Note"} 
    placeholder={props.placeholder || "Type in here…"} 
    color="warning"
  />
);

export default InputComponent;