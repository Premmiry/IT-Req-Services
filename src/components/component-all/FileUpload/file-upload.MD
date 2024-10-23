import React, { useState, useEffect } from 'react';
import { FormLabel, Box, IconButton, Typography } from '@mui/material';
import { Button, List, ListItem } from '@mui/joy';
import DeleteIcon from '@mui/icons-material/Delete';
import SvgIcon from '@mui/joy/SvgIcon';

interface ExistingFileInfo {
    file_path: string;
    file_name: string;
}

interface FileuploadProps {
    onFilesChange: (files: (File | ExistingFileInfo)[]) => void;
    reqId: string | number;
    initialFiles?: ExistingFileInfo[];
}

export default function Fileupload({ onFilesChange, reqId, initialFiles = [] }: FileuploadProps) {
    const [files, setFiles] = useState<(File | ExistingFileInfo)[]>([]);

    useEffect(() => {
        const fetchExistingFiles = async () => {
            try {
                const response = await fetch(`http://10.200.240.2:1234/it-requests/images?req_id=${reqId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch existing files');
                }
                const data = await response.json();
                setFiles([...initialFiles, ...data]);
                onFilesChange([...initialFiles, ...data]);
            } catch (error) {
                console.error('Error fetching existing files:', error);
            }
        };

        if (initialFiles.length > 0) {
            setFiles(initialFiles);
            onFilesChange(initialFiles);
        } else {
            fetchExistingFiles();
        }
    }, [reqId, onFilesChange, initialFiles]);

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
            return { fileName: file.file_name || filePath.split('/').pop() || 'Unknown file', filePath };
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
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                                </svg>
                            </SvgIcon>
                        }
                    >
                        Upload a file
                        <input type="file" multiple hidden onChange={handleFileUpload} />
                    </Button>
                </Box>
                {initialFiles.length > 0 && (
                    <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                        * หมายเหตุ: เมื่ออัพโหลดไฟล์ใหม่จะแทนที่ไฟล์เดิมจะหายไป
                    </Typography>
                )}
            </Box>
            <List>
                {files.length === 0 ? (
                    <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', marginTop: 2 }}>
                        
                    </Typography>
                ) : (
                    files.map((file, index) => {
                        const { fileName, filePath } = getFileName(file);
                        const displayName = `ไฟล์แนบ ${index + 1}`; // ตั้งชื่อที่แสดงเอง
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
                                    initialFiles.length === 0 ? (
                                        <IconButton
                                            edge="end"
                                            aria-label="delete"
                                            color="error"
                                            onClick={() => handleFileDelete(index)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    ) : null
                                }
                            >
                                <Typography variant="body2" color="primary">
                                    {file instanceof File ? (
                                        fileName
                                    ) : (
                                        <a href={`http://10.200.240.2:1234/${file.file_path}`} target="_blank" rel="noopener noreferrer">
                                            {displayName} {/* ใช้ชื่อที่แสดงที่กำหนดเอง */}
                                        </a>
                                    )}
                                </Typography>
                            </ListItem>
                        );
                    })
                )}
            </List>
        </Box>
    );
}
