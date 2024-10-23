import React, { useState, useEffect } from 'react';
import { FormLabel, Box, IconButton, Typography } from '@mui/material';
import { Button, List, ListItem } from '@mui/joy';
import DeleteIcon from '@mui/icons-material/Delete';
import SvgIcon from '@mui/joy/SvgIcon';

interface ExistingFileInfo {
    file_path: string;
    file_name: string;
    file_old_name: string;
    file_new_name: string;
}

interface FileuploadProps {
    onFilesChange: (files: (File | ExistingFileInfo)[]) => void;
    reqId?: string | number;
    initialFiles?: (File | ExistingFileInfo)[];
}

export default function Fileupload({ onFilesChange, reqId, initialFiles = [] }: FileuploadProps) {
    const [files, setFiles] = useState<(File | ExistingFileInfo)[]>([]);

    useEffect(() => {
        const fetchExistingFiles = async () => {
            if (!reqId) return;
            try {
                const response = await fetch(`http://10.200.240.2:1234/it-requests/images?req_id=${reqId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch existing files');
                }
                const data = await response.json();
                if (data.length === 0) {
                    setFiles([]);
                    onFilesChange([]);
                } else {
                    setFiles([...initialFiles, ...data]);
                    onFilesChange([...initialFiles, ...data]);
                }
            } catch (error) {
                console.error('Error fetching existing files:', error);
            }
        };

        if (initialFiles.length > 0) {
            setFiles(initialFiles);
            onFilesChange(initialFiles);
        } else if (reqId) {
            fetchExistingFiles();
        }
    }, [reqId, initialFiles]);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFiles = event.target.files;
        if (uploadedFiles) {
            const newFiles = [...files, ...Array.from(uploadedFiles)];
            setFiles(newFiles);
            onFilesChange(newFiles);
        }
    };

    const handleFileDelete = (fileIndex: number) => {
        const updatedFiles = files.filter((_, index) => index !== fileIndex);
        setFiles(updatedFiles);
        onFilesChange(updatedFiles);
    };

    const getFileName = (file: File | ExistingFileInfo) => {
        if (file instanceof File) {
            return { fileName: file.name, filePath: '' };
        } else {
            const filePath = file.file_path || 'Unknown file path';
            console.log(file.file_path)
            return { fileName: file.file_old_name || filePath.split('/').pop() || 'ไม่มีไฟล์', filePath };
        }
    };

    return (
        <Box sx={{ mt: 2 }}>
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
                {files.some(file => 'file_path' in file && file.file_path === null) && !files.some(file => file instanceof File) ? (
                    <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', marginTop: 2 }}>
                        ไม่มีไฟล์แนบ
                    </Typography>
                ) :
                    (
                        files.map((file, index) => {
                            const { fileName, filePath } = getFileName(file);
                            return (
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
                                            color="error"
                                            onClick={() => handleFileDelete(index)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                >
                                    {file instanceof File ? (
                                        <Typography variant="body2" color="primary">
                                            {fileName}
                                        </Typography>
                                    ) : (
                                        <a href={`http://10.200.240.2:1234/${filePath}`} target="_blank" rel="noopener noreferrer">
                                            {fileName}
                                        </a>
                                    )}
                                </ListItem>
                            );
                        })
                    )
                }
            </List>
        </Box>
    );
}