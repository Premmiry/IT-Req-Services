import React from 'react';
import { Box, FormLabel } from '@mui/material';
import { Textarea, Input } from '@mui/joy';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface InputProps {
  label?: string;
  id?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: 'text' | 'textarea';
  readOnly?: boolean;
}

interface StyledTextareaProps extends InputProps {
  color?: 'success' | 'warning';
}

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'color': [] }, { 'background': [] }],
    ['clean']
  ],
};

const quillFormats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet',
  'color', 'background'
];

const InputComponent: React.FC<InputProps> = ({ 
  label = '', 
  id = '', 
  placeholder = '', 
  value, 
  onChange, 
  type = 'text',
  readOnly = false
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
        readOnly={readOnly}
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
        readOnly={readOnly}
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
  color = 'success',
  readOnly = false
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
      readOnly={readOnly}
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
  <InputComponent {...props} id={props.id || "name_req"} label={props.label || "ชื่อผู้ร้องขอ"} placeholder={props.placeholder || "ชื่อ-นามสกุล..."} readOnly={props.readOnly || false} />
);

export const PhoneInput: React.FC<Omit<InputProps, 'type'>> = (props) => (
  <InputComponent {...props} id={props.id || "phone"} label={props.label || "เบอร์ติดต่อ"} placeholder={props.placeholder || "เบอร์ติดต่อ..."} readOnly={props.readOnly || false} />
);

export const TitleInput: React.FC<Omit<InputProps, 'type'>> = (props) => (
  <InputComponent {...props} id={props.id || "title_req"} label={props.label || "เรื่อง"} placeholder={props.placeholder || "เรื่องที่ต้องการ Request..."} readOnly={props.readOnly || false} />
);

export const DetailsTextarea: React.FC<Omit<InputProps, 'type'>> = (props) => (
  <Box sx={{ mt: 2 }}>
    <FormLabel>{props.label || "รายละเอียด"}</FormLabel>
    <Box 
      sx={{ 
        '.ql-container': {
          minHeight: '200px',
          fontSize: '1rem',
          fontFamily: 'inherit',
          borderBottomLeftRadius: '4px',
          borderBottomRightRadius: '4px',
          border: '1px solid',
          borderColor: (theme) => `${theme.palette.primary.main}70`,
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
        },
        '.ql-editor': {
          minHeight: '200px',
        },
        '.ql-toolbar': {
          borderTopLeftRadius: '4px',
          borderTopRightRadius: '4px',
          borderColor: (theme) => `${theme.palette.primary.main}70`,
          borderStyle: 'solid',
        },
        // Enhanced readonly styles
        ...(props.readOnly && {
          '.ql-toolbar': {
            display: 'none',
          },
          '.ql-container': {
            border: '2px solid #e3f2fd',
            backgroundColor: (theme) => `${theme.palette.primary.main}40`,
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
            borderRadius: '8px',
          },
          '.ql-editor': {
            backgroundColor: 'transparent',
            cursor: 'not-allowed',
            color: '#455a64',
            padding: '16px',
            '&:hover': {
              backgroundColor: '#f5f5f5',
              transition: 'background-color 0.2s ease',
            },
          },
        }),
      }}
    >
      <ReactQuill
        id={props.id || "details"}
        theme="snow"
        value={props.value}
        onChange={(content) => {
          const syntheticEvent = {
            target: {
              value: content
            }
          } as React.ChangeEvent<HTMLTextAreaElement>;
          props.onChange(syntheticEvent);
        }}
        placeholder={props.placeholder || "ใส่รายละเอียด Request ที่นี่…"}
        modules={quillModules}
        formats={quillFormats}
        readOnly={props.readOnly}
      />
    </Box>
  </Box>
);

export const ManagerInput: React.FC<Omit<InputProps, 'type'>> = (props) => (
  <InputComponent {...props} id={props.id || "m_name"} label={props.label || "ชื่อผู้จัดการส่วน"} placeholder={props.placeholder || "ชื่อ-นามสกุล..."} readOnly={props.readOnly || false} />
);

export const DirectorInput: React.FC<Omit<InputProps, 'type'>> = (props) => (
  <InputComponent {...props} id={props.id || "d_name"} label={props.label || "ชื่อผู้อำนวยการฝ่าย"} placeholder={props.placeholder || "ชื่อ-นามสกุล..."} readOnly={props.readOnly || false} />
);

export const ITManagerTextarea: React.FC<Omit<InputProps, 'type'>> = (props) => (
  <StyledTextarea 
    {...props} 
    id={props.id || "it_manager_note"} 
    label={props.label || "IT Manager Note"} 
    placeholder={props.placeholder || "Type in here…"} 
    color="success"
    readOnly={props.readOnly || false}
  />
);

export const ITDirectorTextarea: React.FC<Omit<InputProps, 'type'>> = (props) => (
  <StyledTextarea 
    {...props} 
    id={props.id || "it_director_note"} 
    label={props.label || "IT Director Note"} 
    placeholder={props.placeholder || "Type in here…"} 
    color="warning"
    readOnly={props.readOnly || false}
  />
);

export default InputComponent;