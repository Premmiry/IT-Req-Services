import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Paper, Grid, Divider, Button, Collapse, List } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { Card, CardContent } from '@mui/material';
// import { Close } from 'lucide-react';
interface RatingSectionProps {
  ratings: {
    [key: string]: number;
  };
  handleRatingChange: (key: string, rating: number) => void;
}

interface StarRatingProps {
  rating: number;
  onRatingChange: (newRating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange }) => {
  return (
    <div style={{ display: 'flex' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Button
          key={star}
          onClick={() => onRatingChange(star)}
          style={{ padding: 0, minWidth: 0, background: 'none', border: 'none', cursor: 'pointer' }}
        >
          {star <= rating ? (
            <StarIcon style={{ color: '#FFD700' }} />
          ) : (
            <StarBorderIcon style={{ color: '#C0C0C0' }} />
          )}
        </Button>
      ))}
    </div>
  );
};

const RatingSection: React.FC<RatingSectionProps> = ({ ratings, handleRatingChange }) => {
  return (
    <Card style={{ marginTop: '1rem', border: '2px solid #E0E0E0', borderRadius: '8px' }}>
      <CardContent style={{ padding: '1rem' }}>
        <Typography variant="h6" style={{ marginBottom: '1rem', textAlign: 'center', fontWeight: 'bold' }}>การให้คะแนน</Typography>
        <hr style={{ marginBottom: '1rem' }} />
        {[
          { key: 'speed', label: 'ความรวดเร็วในการซ่อม' },
          { key: 'communication', label: 'ลักษณะในการติดต่อประสานงาน' },
          { key: 'skill', label: 'ความสามารถในการซ่อม' },
          { key: 'cleanliness', label: 'ความสะอาดในการซ่อม' },
          { key: 'understanding', label: 'การรับฟังความต้องการ' },
        ].map(({ key, label }) => (
          <Box key={key} style={{ marginBottom: '1rem' }}>
            <Typography style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>{label}:</Typography>
            <StarRating
              rating={ratings[key]}
              onRatingChange={(rating) => handleRatingChange(key, rating)}
            />
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};
// Mock data - for demonstration purposes only
const serviceData = {
  IT67001: {
    name: 'โครงการลด 50%(โปรแกรมลงชื่อเจ้าหน้าที่ที่ร่วมโครงการ)',
    description: 'รายละเอียดของโครงการลด 50%',
    assignee: 'thaweep',
    datecreated: '2024-10-01',
    status: 'Request',
    type: '1',
  },
  IT67002: {
    name: 'โครงการปรับปรุงระบบ IT',
    description: 'รายละเอียดของโครงการปรับปรุงระบบ IT',
    assignee: 'somchai',
    datecreated: '2024-10-02',
    status: 'IT Admin',
    type: '2',
  },
  // Add more data as needed
};

export default function ServiceDetails() {
  const { id } = useParams<{ id: string }>(); // Extract the id from the URL
  const [ratings, setRatings] = useState({
    speed: 0,
    communication: 0,
    skill: 0,
    cleanliness: 0,
    understanding: 0
  });
  const navigate = useNavigate();

  type Ratings = {
    [key: string]: number;
  };
  const handleRatingChange = (key: string, rating: number): void => {
    setRatings((prevRatings: Ratings) => ({ ...prevRatings, [key]: rating }));
  };
  const service = serviceData[id];

  if (!service) {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Service Not Found
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
        </Box>
      </Container>
    );
  }



  return (
    <Container maxWidth="lg">

      <Paper sx={{ width: '100%', padding: 2, boxShadow: 10 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          {service.type === '1' ? (
            <Typography variant="h6">รายละเอียดรายการ IT Request</Typography>
          ) : (
            <Typography variant="h6">รายละเอียดรายการ IT Service</Typography>
          )}

          {/* <Close /> */}
        </Box>

        <Box bgcolor="primary.main" color="primary.contrastText" p={1} mb={2}>
          <Typography variant="subtitle1">ข้อมูลการแจ้งปัญหา</Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Typography variant="body2" color="text.secondary">รายการแจ้งซ่อม</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="body2">
              ระบบเครือข่าย (ระบบ Wi-Fi)
              <br />
              รายละเอียดเพิ่มเติม
              <br />
              WIFI สัญญาณ ติดๆ ดับๆ ไม่สามารถใช้สื่อออนไลน์ สอนได้เลย
            </Typography>
          </Grid>

          <Grid item xs={4}>
            <Typography variant="body2" color="text.secondary">หมายเลขแจ้งซ่อม</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="body2">LVC-004719</Typography>
          </Grid>

          <Grid item xs={4}>
            <Typography variant="body2" color="text.secondary">วันที่แจ้งซ่อม</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="body2">15 กรกฎาคม 2567 เวลา 02:38:59</Typography>
          </Grid>

          <Grid item xs={4}>
            <Typography variant="body2" color="text.secondary">ผู้แจ้งซ่อม</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="body2">นายเรืองกฤษ มหาสมการ : โทร 0866336160</Typography>
          </Grid>

          <Grid item xs={4}>
            <Typography variant="body2" color="text.secondary">หน่วยงาน/สถานที่</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="body2">
              แผนกวิชา
              <br />
              แผนกวิชาการตลาด
              <br />
              อาคาร อาคาร 10 ชั้น 3
              <br />
              ห้อง 1034
            </Typography>
          </Grid>

          <Grid item xs={4}>
            <Typography variant="body2" color="text.secondary">ผู้รับแจ้งซ่อม</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="body2">แจ้งซ่อมด้วยตนเอง</Typography>
          </Grid>
        </Grid>

        <Box bgcolor="success.main" color="success.contrastText" p={1} my={2}>
          <Typography variant="subtitle1">ข้อมูลการดำเนินการ</Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Typography variant="body2" color="text.secondary">วันที่ดำเนินการ</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="body2">02 กันยายน เวลา 04:36:13</Typography>
          </Grid>

          <Grid item xs={4}>
            <Typography variant="body2" color="text.secondary">ผู้ดำเนินการ</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="body2">นางสาวพัชรีพรรณ วงศ์หาญคำ</Typography>
          </Grid>

          <Grid item xs={4}>
            <Typography variant="body2" color="text.secondary">สาเหตุ/วิธีแก้ไข</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="body2">-</Typography>
          </Grid>

          <Grid item xs={4}>
            <Typography variant="body2" color="text.secondary">สถานะการดำเนินการ</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="body2">เสร็จเรียบร้อย</Typography>
          </Grid>
        </Grid>
        {service.type === '1' ? (
            null
        ) : (
          <Box bgcolor="primary.main" color="primary.contrastText" p={1} mb={2}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {/* ... (ส่วนอื่นๆ คงเดิม) */}
                <RatingSection ratings={ratings} handleRatingChange={handleRatingChange} />
              </List>
            </Collapse>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        <Button variant="contained" fullWidth>พิมพ์ใบแจ้งซ่อม</Button>
      </Paper>
    </Container>
  );
}
