import React from 'react';
import { styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import { Link } from 'react-router-dom';
import Tooltip from '@mui/joy/Tooltip';

const images = [
  {
    url: 'https://www.cloudhostltd.com/wp-content/uploads/2022/01/IT-Support-CloudHost.png',
    title: 'IT Services',
    link: '/list-services',
    detail: 'สำหรับผู้ที่ต้องการแจ้งบริการทั่วไป เช่น เครื่องคอมฯมีปัญหา, โปรแกรมมีปัญหา, อุปกรณ์คอมฯเสีย, Internet มีปัญหา เป็นต้น',
  },
  {
    url: 'https://images.contentstack.io/v3/assets/blt7f746f0684174ee8/blt4cf3155552d1a7d7/6400a8dc3acc576c56033f58/download',
    title: 'IT Hardware',
    link: '/it-hardware',
    detail: 'สำหรับผู้ที่ต้องการขอเพิ่ม ขอสั่งซื้อ ขอใช้ อุปกรณ์ทาง IT เช่น จอคอมฯ, ชุดเคสคอมฯ, เครื่องปริ้น, เครื่องสแกน, เป็นต้น',
  },
  {
    url: 'https://static.vecteezy.com/system/resources/previews/003/343/387/non_2x/desktop-source-code-and-wallpaper-by-coding-and-programming-free-photo.jpg',
    title: 'IT Development',
    link: '/it-development',
    detail: 'สำหรับผู้ที่ต้องการขอพัฒนา หรือแก้ไขปรับปรุง ระบบต่างๆ ภายในองค์กร ขึ้นมาใช้เอง',
  },
];

const ImageButton = styled(ButtonBase)(({ theme }) => ({
  position: 'relative',
  height: 200,
  [theme.breakpoints.down('sm')]: {
    width: '100% !important',
    height: 100,
  },
  '&:hover, &.Mui-focusVisible': {
    zIndex: 1,
    '& .MuiImageBackdrop-root': {
      opacity: 0.15,
    },
    '& .MuiImageMarked-root': {
      opacity: 0,
    },
    '& .MuiTypography-root': {
      border: '4px solid currentColor',
    },
  },
}));

const ImageSrc = styled('span')({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundSize: 'cover',
  backgroundPosition: 'center 40%',
});

const Image = styled('span')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.common.white,
}));

const ImageBackdrop = styled('span')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundColor: theme.palette.common.black,
  opacity: 0.4,
  transition: theme.transitions.create('opacity'),
}));

const ImageMarked = styled('span')(({ theme }) => ({
  height: 3,
  width: 18,
  backgroundColor: theme.palette.common.white,
  position: 'absolute',
  bottom: -2,
  left: 'calc(50% - 9px)',
  transition: theme.transitions.create('opacity'),
}));

function Content() {
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg">
        {images.map((image) => (
          <Card key={image.title} sx={{ display: 'flex', marginBottom: 4 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', minWidth: 300, width: '100%' }}>
              <Tooltip 
              title={
                <Box 
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  maxWidth: 450,
                  justifyContent: 'center',
                  p: 1,
                }}
                >
                  {image.detail}
                </Box>
                
              } 
              placement="top"
              color="success"
              arrow
              size="lg" 
              >
                <ImageButton
                  focusRipple
                  style={{ width: '100%' }}
                  component={Link}
                  to={image.link}
                >
                  <ImageSrc style={{ backgroundImage: `url(${image.url})` }} />
                  <ImageBackdrop className="MuiImageBackdrop-root" />
                  <Image>
                    <Typography
                      component="span"
                      variant="subtitle1"
                      color="inherit"
                      sx={{
                        position: 'relative',
                        p: 4,
                        pt: 2,
                        pb: (theme) => `calc(${theme.spacing(1)} + 6px)`,
                      }}
                    >
                      {image.title}
                      <ImageMarked className="MuiImageMarked-root" />
                    </Typography>
                  </Image>
                </ImageButton>
              </Tooltip>
            </Box>
          </Card>
        ))}
      </Container>
    </React.Fragment>
  );
}

export default Content;
