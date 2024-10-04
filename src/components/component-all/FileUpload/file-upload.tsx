import React, { useState } from 'react';
import { FormLabel, Box, IconButton, Typography } from '@mui/material';
import { Button, List, ListItem } from '@mui/joy';
import DeleteIcon from '@mui/icons-material/Delete';
import SvgIcon from '@mui/joy/SvgIcon';

interface FileuploadProps {
    onFilesChange: (files: File[]) => void; // Prop to pass files back to RequestForm
}

export default function Fileupload({ onFilesChange }: FileuploadProps) {
    const [files, setFiles] = useState<File[]>([]);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFiles = event.target.files;
        if (uploadedFiles) {
            const newFiles = [...files, ...Array.from(uploadedFiles)];
            setFiles(newFiles);
            onFilesChange(newFiles); // Pass the new files to RequestForm
        }
    };

    const handleFileDelete = (fileIndex: number) => {
        const updatedFiles = files.filter((_, index) => index !== fileIndex);
        setFiles(updatedFiles);
        onFilesChange(updatedFiles); // Pass the updated files to RequestForm
    };

    return (
        <Box sx={{ pl: 2, mt: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', border: '1px dashed', borderColor: 'lightblue', borderRadius: 'sm', padding: 2, marginTop: 2 }}>
                <FormLabel>แนบไฟล์</FormLabel>
                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                    <Button
                        sx={{ marginRight: 2 }}
                        component="label"
                        variant="outlined"
                        color="primary"
                        startDecorator={
                            <SvgIcon>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                                    />
                                </svg>
                            </SvgIcon>
                        }
                    >
                        Upload a file
                        <input
                            type="file"
                            multiple
                            hidden
                            onChange={handleFileUpload}
                        />
                    </Button>
                </Box>
            </Box>
            <List>
                {files.map((file, index) => (
                    <ListItem
                        sx={{
                            border: '1px dashed',
                            borderColor: 'lightblue',
                            borderRadius: 'sm',
                            margin: 1,
                            padding: 1,
                        }}
                        key={index}
                        endAction={
                            <IconButton
                                edge="end"
                                aria-label="delete"
                                color="error" // Changed from "danger" to "error"
                                onClick={() => handleFileDelete(index)}
                            >
                                <DeleteIcon />
                            </IconButton>
                        }
                    >
                        <Typography variant="body2" color="primary">{file.name}</Typography>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}
