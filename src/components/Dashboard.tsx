import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';

import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';

import { DataGridPro } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    ...theme.applyStyles('dark', {
      backgroundColor: '#1A2027',
    }),
  }));




export default function Dashboard() {

    const { data } = useDemoData({
        dataSet: 'Commodity',
        rowLength: 10,
        editable: true,
      });


    return (
        <React.Fragment>
            {/* <CssBaseline /> */}
            <Container maxWidth="lg">

            <Stack direction="row" spacing={2}>
            <Card sx={{ maxWidth: 345 }}>
                                <CardActionArea>
                                    <CardMedia
                                        component="img"
                                        height="100"
                                        image="https://www.cloudhostltd.com/wp-content/uploads/2022/01/IT-Support-CloudHost.png"
                                        alt="green iguana"
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            IT Services
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            สำหรับผู้ที่ต้องการแจ้งบริการทั่วไป เช่น เครื่องคอมฯมีปัญหา, โปรแกรมมีปัญหา, อุปกรณ์คอมฯเสีย, Internet มีปัญหา เป็นต้น
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>

                            <Card sx={{ maxWidth: 345 }}>
                                <CardActionArea>
                                    <CardMedia
                                        component="img"
                                        height="100"
                                        image="https://static.vecteezy.com/system/resources/previews/003/343/387/non_2x/desktop-source-code-and-wallpaper-by-coding-and-programming-free-photo.jpg"
                                        alt="green iguana"
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            IT Hardware
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            สำหรับผู้ที่ต้องการขอเพิ่ม ขอสั่งซื้อ ขอใช้ อุปกรณ์ทาง IT เช่น จอคอมฯ, ชุดเคสคอมฯ, เครื่องปริ้น, เครื่องสแกน, เป็นต้น
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>

                            
</Stack>


<Stack direction="row" spacing={2}>
<Box sx={{ height: 520, width: '100%' }}>
      <DataGridPro
        {...data}
        loading={data.rows.length === 0}
        rowHeight={38}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
    </Stack>




            </Container>
        </React.Fragment>
    );
}
