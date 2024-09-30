import React from 'react';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Autocomplete from '@mui/joy/Autocomplete';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import FormHelperText from '@mui/joy/FormHelperText';
import { styled } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import Grid from '@mui/joy/Grid';
import Input from '@mui/joy/Input';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';


import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import Select, { SelectStaticProps } from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import IconButton from '@mui/joy/IconButton';
import CloseRounded from '@mui/icons-material/CloseRounded';
import Textarea from '@mui/joy/Textarea';
import Typography from '@mui/joy/Typography';


const Item = styled(Sheet)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark' ? theme.palette.background.level1 : '#fff',
  ...theme.typography['body-sm'],
  padding: theme.spacing(1),
  textAlign: 'center',
  borderRadius: 4,
  color: theme.vars.palette.text.secondary,
}));

function ITHardware() {

  // Select Manager
  const [value, setValue] = React.useState<string | null>('approve');
  const action: SelectStaticProps['action'] = React.useRef(null);


  // Emoji text area
  const [text, setText] = React.useState('');
  const addEmoji = (emoji: string) => () => setText(`${text}${emoji}`);



  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg">

        <Grid container spacing={2} sx={{ flexGrow: 1 }}>

          <Grid xs={6} >
            <Box><h2>IT Hardware</h2></Box>
          </Grid>
          <Grid xs={6}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <FormLabel>
                <h5>Request No.</h5>
                <Input placeholder="67/0001"
                  sx={{
                    width: 100, '--Input-radius': '0px',
                    borderBottom: '2px solid',
                    borderColor: 'neutral.outlinedBorder',
                    '&:hover': {
                      borderColor: 'neutral.outlinedHoverBorder',
                    },
                    '&::before': {
                      border: '1px solid var(--Input-focusedHighlight)',
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
                  variant="outlined" color="primary" type="text"

                />
              </FormLabel>
            </Box>
          </Grid>


          <Grid xs={5}>


            <FormControl>
              <FormLabel>แผนกที่ร้องขอ</FormLabel>
              <Autocomplete
                placeholder="เลือกแผนก..."
                options={top100Films}
                sx={{ width: 350 }}
                variant="outlined" color="primary"

              />

              <FormLabel>ชื่อผู้ร้องขอ</FormLabel>
              <Input placeholder="ชื่อ"
                sx={{ width: 350 }}
                variant="outlined" color="primary"
                type="text"
              />

              <FormLabel>เบอร์ติดต่อ</FormLabel>
              <Input placeholder="พัฒนาโปรแกรม"
                sx={{ width: 350 }}
                variant="outlined" color="primary"
                type="text"
              />




            </FormControl>

            <br />
            <FormControl>

              <FormLabel>Manager Approve</FormLabel>
              <Input placeholder="Manager name"
                sx={{ width: 350 }}
                variant="outlined" color="success"
                type="text"
              />

              <FormLabel>Manager Email</FormLabel>
              <Input placeholder="Manager@Email.com"
                sx={{ width: 350 }}
                variant="outlined" color="success"
                type="email"
              />



              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>

                <Box>
                  <FormLabel>Manager Approve Status</FormLabel>
                  <Select
                    action={action}
                    value={value}
                    placeholder="Status"
                    onChange={(e, newValue) => setValue(newValue)}
                    variant="outlined" color="success"
                    sx={{ width: 160 }}
                    {...(value && {
                      // display the button and remove select indicator
                      // when user has selected a value
                      endDecorator: (
                        <IconButton
                          size="sm"
                          variant="plain"
                          color="neutral"
                          onMouseDown={(event) => {
                            // don't open the popup when clicking on this button
                            event.stopPropagation();
                          }}
                          onClick={() => {
                            setValue(null);
                            action.current?.focusVisible();
                          }}
                        >
                          <CloseRounded />
                        </IconButton>
                      ),
                      indicator: null,
                    })}

                  >
                    <Option value="approve">อนุมัติ</Option>
                    <Option value="unapprove">ไม่อนุมัติ</Option>
                    <Option value="discuss">พิจารณา</Option>
                    <Option value="cancel">ยกเลิก</Option>
                  </Select>
                </Box>

                <Box>
                  <FormLabel>Manager Approve Date</FormLabel>
                  <Input
                    variant="outlined" color="success"
                    sx={{ width: 175 }}
                    type="date"
                  />
                </Box>
              </Box>


              <FormLabel>Director Approve</FormLabel>
              <Input placeholder="Director name"
                sx={{ width: 350 }}
                variant="outlined" color="warning"
                type="text"
              />

              <FormLabel>Director Email</FormLabel>
              <Input placeholder="Director@Email.com"
                sx={{ width: 350 }}
                variant="outlined" color="warning"
                type="email"
              />



              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>

                <Box>
                  <FormLabel>Director Approve Status</FormLabel>
                  <Select
                    action={action}
                    value={value}
                    placeholder="Status"
                    onChange={(e, newValue) => setValue(newValue)}
                    variant="outlined" color="warning"
                    sx={{ width: 160 }}
                    {...(value && {
                      // display the button and remove select indicator
                      // when user has selected a value
                      endDecorator: (
                        <IconButton
                          size="sm"
                          variant="plain"
                          color="neutral"
                          onMouseDown={(event) => {
                            // don't open the popup when clicking on this button
                            event.stopPropagation();
                          }}
                          onClick={() => {
                            setValue(null);
                            action.current?.focusVisible();
                          }}
                        >
                          <CloseRounded />
                        </IconButton>
                      ),
                      indicator: null,
                    })}

                  >
                    <Option value="approve">อนุมัติ</Option>
                    <Option value="unapprove">ไม่อนุมัติ</Option>
                    <Option value="discuss">พิจารณา</Option>
                    <Option value="cancel">ยกเลิก</Option>
                  </Select>
                </Box>

                <Box>
                  <FormLabel>Director Approve Date</FormLabel>
                  <Input
                    variant="outlined" color="warning"
                    type="date"
                    sx={{ width: 175 }}
                  />
                </Box>
              </Box>

            </FormControl>



          </Grid>
          <Grid xs={7}>
            <Box>
              <FormLabel>Subject</FormLabel>
              <Textarea
                size="md" name="Size" placeholder="Subject here…"
                variant="outlined" color="primary"
              />
            </Box>

            <Box>
              <FormLabel>Objective</FormLabel>
              <Textarea
                placeholder="Objective here…"
                variant="outlined" color="primary"
                value={text}
                onChange={(event) => setText(event.target.value)}
                minRows={2}
                maxRows={4}
                startDecorator={
                  <Box sx={{ display: 'flex', gap: 0.5, flex: 1 }}>
                    <IconButton variant="outlined" color="neutral" onClick={addEmoji('ทดสอบ')}>
                      ทดสอบ
                    </IconButton>
                    <IconButton variant="outlined" color="neutral" onClick={addEmoji('👍')}>
                      👍
                    </IconButton>
                    <IconButton variant="outlined" color="neutral" onClick={addEmoji('🏖')}>
                      🏖
                    </IconButton>
                    <IconButton variant="outlined" color="neutral" onClick={addEmoji('😍')}>
                      😍
                    </IconButton>
                    <Button variant="outlined" color="neutral" sx={{ ml: 'auto' }}>
                      See all
                    </Button>
                  </Box>
                }
                endDecorator={
                  <Typography level="body-xs" sx={{ ml: 'auto' }}>
                    {text.length} character(s)
                  </Typography>
                }
                sx={{ minWidth: 300 }}
              />

            </Box>


            <Box>
              <FormLabel>Requirment</FormLabel>
              <Textarea
                placeholder="Requirment here…"
                variant="outlined" color="primary"
                value={text}
                onChange={(event) => setText(event.target.value)}
                minRows={2}
                maxRows={4}
                startDecorator={
                  <Box sx={{ display: 'flex', gap: 0.5, flex: 1 }}>
                    <IconButton variant="outlined" color="neutral" onClick={addEmoji('ทดสอบ')}>
                      ทดสอบ
                    </IconButton>
                    <IconButton variant="outlined" color="neutral" onClick={addEmoji('👍')}>
                      👍
                    </IconButton>
                    <IconButton variant="outlined" color="neutral" onClick={addEmoji('🏖')}>
                      🏖
                    </IconButton>
                    <IconButton variant="outlined" color="neutral" onClick={addEmoji('😍')}>
                      😍
                    </IconButton>
                    <Button variant="outlined" color="neutral" sx={{ ml: 'auto' }}>
                      See all
                    </Button>
                  </Box>
                }
                endDecorator={
                  <Typography level="body-xs" sx={{ ml: 'auto' }}>
                    {text.length} character(s)
                  </Typography>
                }
                sx={{ minWidth: 300 }}
              />

            </Box>


          </Grid>

          <Grid xs={12}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
              <Button startDecorator={<SaveIcon />}>Save</Button>
              <Button endDecorator={<CancelIcon />} color="danger">
                Cancel
              </Button>
            </Box>
          </Grid>


          <Grid xs={4}>
            <Item>xs=4</Item>
          </Grid>
          <Grid xs={8}>
            <Item>xs=8</Item>
          </Grid>
        </Grid>




      </Container>
    </React.Fragment>
  );
}


const top100Films = [
  { label: 'บุคคล' },
  { label: 'โอนเงิน' },
  { label: 'รับเงิน' },
  { label: 'คลังสินค้า' },
  { label: 'คลังยา' },
  { label: 'ฉุกเฉิน' },
  { label: 'ประชาสัมพันธ์' },

];

export default ITHardware;
