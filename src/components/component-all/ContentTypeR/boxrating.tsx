import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid } from '@mui/material';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import URLAPI from '../../../URLAPI';
import Swal from 'sweetalert2';

interface RatingProps {
    req_id: number;
    type_id: number | null;
    open: boolean;
    onClose: () => void;
    onSubmit: () => void;
}

interface RatingOption {
    id_rating: number;
    type_id: number;
    rating_name: string;
}

interface ExistingScore {
    id_rating_score: number;
    id_rating: number;
    req_id: number;
    score: number;
}

const labels: { [index: string]: string } = {
    0: 'ไม่มีคะแนน',
    1: 'ไม่ดี',
    2: 'ปรับปรุง',
    3: 'พอใช้',
    4: 'ดี',
    5: 'ดีมาก',
};

export default function BasicRating({ req_id, type_id, open, onClose, onSubmit }: RatingProps) {
    const [ratings, setRatings] = useState<{ [key: number]: number | null }>({});
    const [hover, setHover] = useState<{ [key: number]: number }>({});
    const [ratingOptions, setRatingOptions] = useState<RatingOption[]>([]);
    const [existingScores, setExistingScores] = useState<ExistingScore[]>([]);

    useEffect(() => {
        const fetchRatingOptions = async () => {
            try {
                const response = await fetch(`${URLAPI}/rating?type_id=${type_id}`);
                if (!response.ok) throw new Error('Failed to fetch rating options');
                const data = await response.json();
                setRatingOptions(data);
            } catch (error) {
                console.error('Error fetching rating options:', error);
            }
        };

        if (type_id) fetchRatingOptions();
    }, [type_id]);

    useEffect(() => {
        const fetchExistingScores = async () => {
            try {
                const response = await fetch(`${URLAPI}/rating_score/${req_id}`);
                if (!response.ok) throw new Error('Failed to fetch existing scores');
                const data = await response.json();
                setExistingScores(data);
                
                // Set initial ratings from existing scores
                const initialRatings = data.reduce((acc: { [key: number]: number | null }, score: ExistingScore) => {
                    acc[score.id_rating] = score.score;
                    return acc;
                }, {});
                setRatings(initialRatings);
            } catch (error) {
                console.error('Error fetching existing scores:', error);
            }
        };

        if (req_id && open) {
            fetchExistingScores();
        }
    }, [req_id, open]);

    const handleSubmit = async () => {
        try {
            // สึงข้อมูลคะแนนที่มีอยู่ล่าสุดก่อน
            const response = await fetch(`${URLAPI}/rating_score/${req_id}`);
            if (!response.ok) throw new Error('Failed to fetch existing scores');
            const existingScores = await response.json();

            // ส่งคะแนนทีละรายการ
            for (const [id_rating, currentScore] of Object.entries(ratings)) {
                const existingScore = existingScores.find((s: ExistingScore) => s.id_rating === parseInt(id_rating));
                
                if (existingScore) {
                    // เช็คว่าคะแนนมีการเปลี่ยนแปลงหรือไม่
                    if (existingScore.score !== currentScore) {
                        // Update เฉพาะคะแนนที่มีการเปลี่ยนแปลง
                        await fetch(`${URLAPI}/rating_score/${existingScore.id_rating_score}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                id_rating_score: existingScore.id_rating_score,
                                score: currentScore
                            })
                        });
                    }
                } else {
                    // Create new score สำหรับคะแนนที่ยังไม่มี
                    await fetch(`${URLAPI}/rating_score/${req_id}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            req_id: req_id,
                            id_rating: parseInt(id_rating),
                            score: currentScore
                        })
                    });
                }
            }

            onSubmit();
            onClose();
        } catch (error) {
            console.error('Error submitting ratings:', error);
            // เพิ่มการแจ้งเตือนเมื่อเกิดข้อผิดพลาด
            Swal.fire({
                title: 'Error!',
                text: 'เกิดข้อผิดพลาดในการบันทึกคะแนน',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle>แบบประเมินการให้บริการ</DialogTitle>
            <DialogContent>
                <Grid container sx={{ p: 2 }}>
                    <Grid item xs={12}>
                        <Box 
                            sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 2,
                                p: 2,
                                backgroundColor: '#f5f5f5',
                                borderRadius: '4px 4px 0 0',
                                borderBottom: '2px solid #1976d2',
                                mb: 2
                            }}
                        >
                            <Typography 
                                sx={{ 
                                    width: '80%',
                                    fontWeight: 600,
                                    color: '#1976d2'
                                }}
                            >
                                หัวข้อการประเมิน
                            </Typography>
                            <Box 
                                sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    width: '20%',
                                    justifyContent: 'flex-end'
                                }}
                            >
                                <Typography 
                                    sx={{
                                        fontWeight: 600,
                                        color: '#1976d2'
                                    }}
                                >
                                    คะแนนการประเมิน
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    {ratingOptions.map((option) => (
                        <Grid item xs={12} key={option.id_rating}>
                            <Box 
                                sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center',
                                    p: 2,
                                    borderBottom: '1px solid #e0e0e0',
                                    '&:hover': {
                                        backgroundColor: '#f5f5f5'
                                    }
                                }}
                            >
                                <Typography 
                                    sx={{ 
                                        width: '80%',
                                        pr: 2,
                                        wordBreak: 'break-word'
                                    }}
                                >
                                    {option.rating_name}
                                </Typography>
                                <Box 
                                    sx={{ 
                                        width: '20%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Rating
                                        size="large"
                                        value={ratings[option.id_rating] || 0}
                                        precision={1}
                                        onChange={(_event, newValue) => {
                                            setRatings(prev => ({
                                                ...prev,
                                                [option.id_rating]: newValue
                                            }));
                                        }}
                                        onChangeActive={(_event, newHover) => {
                                            setHover(prev => ({
                                                ...prev,
                                                [option.id_rating]: newHover
                                            }));
                                        }}
                                    />
                                    <Typography 
                                        variant="body2" 
                                        color="text.secondary"
                                        sx={{ mt: 1 }}
                                    >
                                        {labels[hover[option.id_rating] !== undefined ? 
                                            hover[option.id_rating] : 
                                            ratings[option.id_rating] ?? 0]}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>ยกเลิก</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    ยืนยัน
                </Button>
            </DialogActions>
        </Dialog>
    );
}
