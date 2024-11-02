import React, { useState, useEffect } from 'react';
import { FormLabel, Box, IconButton, Typography } from '@mui/material';
import { Button, List, ListItem } from '@mui/joy';
import DeleteIcon from '@mui/icons-material/Delete';
import SvgIcon from '@mui/joy/SvgIcon';
import URLAPI from '../../../URLAPI';

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
                const response = await fetch(`${URLAPI}/it-requests/images?req_id=${reqId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch existing files');
                }
                const data = await response.json();
                // กรองไฟล์ที่มี file_path เป็น null หรือ undefined ออก
                const validFiles = data.filter((file: ExistingFileInfo) => file.file_path);
                setFiles([...initialFiles, ...validFiles]);
                onFilesChange([...initialFiles, ...validFiles]);
            } catch (error) {
                console.error('Error fetching existing files:', error);
            }
        };

        if (initialFiles.length > 0) {
            // กรองไฟล์ที่มี file_path เป็น null หรือ undefined ออกจาก initialFiles
            const validInitialFiles = initialFiles.filter(file => 
                file instanceof File || (file as ExistingFileInfo).file_path
            );
            setFiles(validInitialFiles);
            onFilesChange(validInitialFiles);
        } else if (reqId) {
            fetchExistingFiles();
        }
    }, [reqId, initialFiles]);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFiles = event.target.files;
        if (uploadedFiles) {
            // รวมไฟล์ใหม่กับไฟล์ที่มีอยู่ โดยกรองเฉพาะไฟล์ที่มี file_path
            const existingValidFiles = files.filter(file => 
                file instanceof File || (file as ExistingFileInfo).file_path
            );
            const newFiles = [...existingValidFiles, ...Array.from(uploadedFiles)];
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
        } else if (file.file_path) { // เพิ่มเงื่อนไขตรวจสอบ file_path
            return { 
                fileName: file.file_old_name || file.file_path.split('/').pop() || 'ไม่มีไฟล์', 
                filePath: file.file_path 
            };
        }
        return { fileName: 'ไม่มีไฟล์', filePath: '' };
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
                {files.length === 0 ? (
                    <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', marginTop: 2 }}>
                        ไม่มีไฟล์แนบ
                    </Typography>
                ) : (
                    files.map((file, index) => {
                        // แสดงเฉพาะไฟล์ที่มี file_path หรือเป็น File object
                        if (file instanceof File || (file as ExistingFileInfo).file_path) {
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
                                        <a href={`${URLAPI}/${filePath}`} target="_blank" rel="noopener noreferrer">
                                            {fileName}
                                        </a>
                                    )}
                                </ListItem>
                            );
                        }
                        return null;
                    })
                )}
            </List>
        </Box>
    );
}