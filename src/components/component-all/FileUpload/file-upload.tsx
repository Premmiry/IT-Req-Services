import React, { useState, useEffect, useCallback } from 'react';
import { FormLabel, Box, Typography } from '@mui/material';
import { Button, Chip, IconButton } from '@mui/joy';
import SvgIcon from '@mui/joy/SvgIcon';
import DeleteIcon from '@mui/icons-material/Delete';
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
    const [files, setFiles] = useState<(File | ExistingFileInfo)[]>(initialFiles);

    useEffect(() => {
        const fetchExistingFiles = async () => {
            if (!reqId) return;
            try {
                const response = await fetch(`${URLAPI}/it-requests/images?req_id=${reqId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch existing files');
                }
                const data = await response.json();
                const validFiles = data.filter((file: ExistingFileInfo) => file.file_path);
                setFiles(prevFiles => {
                    if (JSON.stringify(prevFiles) !== JSON.stringify([...initialFiles, ...validFiles])) {
                        onFilesChange([...initialFiles, ...validFiles]);
                        return [...initialFiles, ...validFiles];
                    }
                    return prevFiles;
                });
            } catch (error) {
                console.error('Error fetching existing files:', error);
            }
        };
    
        if (initialFiles.length > 0) {
            const validInitialFiles = initialFiles.filter(file => 
                file instanceof File || (file as ExistingFileInfo).file_path
            );
            setFiles(prevFiles => {
                if (JSON.stringify(prevFiles) !== JSON.stringify(validInitialFiles)) {
                    onFilesChange(validInitialFiles);
                    return validInitialFiles;
                }
                return prevFiles;
            });
        } else if (reqId) {
            fetchExistingFiles();
        }
    }, [reqId, initialFiles, onFilesChange]);

    const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFiles = event.target.files;
        if (uploadedFiles) {
            const existingValidFiles = files.filter(file => 
                file instanceof File || (file as ExistingFileInfo).file_path
            );
            const newFiles = [...existingValidFiles, ...Array.from(uploadedFiles)];
            setFiles(newFiles);
            onFilesChange(newFiles);
        }
    }, [files, onFilesChange]);

    const handleFileDelete = useCallback((index: number) => {
        setFiles(prevFiles => {
            const newFiles = prevFiles.filter((_, i) => i !== index);
            onFilesChange(newFiles);
            return newFiles;
        });
    }, [onFilesChange]);

    const getFileName = useCallback((file: File | ExistingFileInfo) => {
        if (file instanceof File) {
            return { fileName: file.name, filePath: '' };
        } else if (file.file_path) {
            return { 
                fileName: file.file_old_name || file.file_path.split('/').pop() || 'ไม่มีไฟล์', 
                filePath: file.file_path 
            };
        }
        return { fileName: 'ไม่มีไฟล์', filePath: '' };
    }, []);

    return (
        <Box sx={{ mt: 2 }}>
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                border: '1px dashed', 
                borderColor: 'lightblue', 
                borderRadius: 'sm', 
                padding: 2, 
                marginTop: 2 
            }}>
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

                <Box sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 1,
                    minHeight: '50px',
                    padding: 1
                }}>
                    {files.length === 0 ? (
                        <Typography variant="body2" color="textSecondary" sx={{ width: '100%', textAlign: 'center' }}>
                            
                        </Typography>
                    ) : (
                        files.map((file, index) => {
                            if (file instanceof File || (file as ExistingFileInfo).file_path) {
                                const { fileName, filePath } = getFileName(file);
                                return (
                                    <Box
                                        key={index}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 0.5
                                        }}
                                    >
                                        <Chip
                                            variant="soft"
                                            color="primary"
                                            sx={{
                                                maxWidth: '200px',
                                                '& .MuiChip-label': {
                                                    display: 'block',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }
                                            }}
                                        >
                                            {file instanceof File ? (
                                                <Box sx={{ 
                                                    maxWidth: '180px',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                    {fileName}
                                                </Box>
                                            ) : (
                                                <a 
                                                    href={`${URLAPI}/${filePath}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{
                                                        color: 'inherit',
                                                        textDecoration: 'none'
                                                    }}
                                                >
                                                    <Box sx={{ 
                                                        maxWidth: '180px',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}>
                                                        {fileName}
                                                    </Box>
                                                </a>
                                            )}
                                        </Chip>
                                        <IconButton
                                            size="sm"
                                            variant="soft"
                                            color="danger"
                                            onClick={() => handleFileDelete(index)}
                                            sx={{
                                                '--IconButton-size': '24px',
                                            }}
                                        >
                                            <DeleteIcon sx={{ fontSize: '1rem' }} />
                                        </IconButton>
                                    </Box>
                                );
                            }
                            return null;
                        })
                    )}
                </Box>
            </Box>
        </Box>
    );
}