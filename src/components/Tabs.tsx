import * as React from 'react';
import Box from '@mui/joy/Box';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab, { tabClasses } from '@mui/joy/Tab';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import { Link, useLocation } from 'react-router-dom';
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';
import WorkHistoryOutlinedIcon from '@mui/icons-material/WorkHistoryOutlined';
import WorkOffOutlinedIcon from '@mui/icons-material/WorkOffOutlined';

export default function TabsBottomNavExample() {
  const location = useLocation();
  const pathToIndex = {
    '/it-services': 0,
    '/it-manager_approve': 1,
    '/it_services_open': 2,
    '/it_services_close': 3,
  };
  const index = pathToIndex[location.pathname as keyof typeof pathToIndex] || 0;

  const colors = ['primary', 'danger', 'success', 'warning'] as const;

  return (
    <Box
      sx={{
        flexGrow: 1,
        m: -3,
        p: 4,
        borderTopLeftRadius: '12px',
        borderTopRightRadius: '12px',
        bgcolor: `${'var(--colors-index)'}.500`,
      }}
      style={{ '--colors-index': colors[index] } as any}
    >
      <Tabs
        size="lg"
        aria-label="Bottom Navigation"
        value={index}
        sx={(theme) => ({
          p: 1,
          borderRadius: 16,
          maxWidth: 500,
          mx: 'auto',
          boxShadow: theme.shadow.sm,
          '--joy-shadowChannel': theme.vars.palette[colors[index]].darkChannel,
          [`& .${tabClasses.root}`]: {
            py: 1,
            flex: 1,
            transition: '0.3s',
            fontWeight: 'md',
            fontSize: 'md',
            [`&:not(.${tabClasses.selected}):not(:hover)`]: {
              opacity: 0.7,
            },
          },
        })}
      >
        <TabList
          variant="plain"
          size="sm"
          disableUnderline
          sx={{ borderRadius: 'lg', p: 0 }}
        >
          <Link to="/it-services" style={{ textDecoration: 'none', flex: 1 }}>
            <Tab
              disableIndicator
              orientation="vertical"
              {...(index === 0 && { color: colors[0] })}
            >
              <ListItemDecorator>
                <HomeRoundedIcon />
              </ListItemDecorator>
              <Box sx={{ textAlign: 'center'}}>Main Request</Box>
            </Tab>
          </Link>
          <Link to="/it-manager_approve" style={{ textDecoration: 'none', flex: 1 }}>
            <Tab
              disableIndicator
              orientation="vertical"
              {...(index === 1 && { color: colors[1] })}
            >
              <ListItemDecorator>
                <HowToRegOutlinedIcon />
              </ListItemDecorator>
              <Box sx={{ textAlign: 'center'}}>Request Approved</Box>
            </Tab>
          </Link>
          <Link to="/it_services_open" style={{ textDecoration: 'none', flex: 1 }}>
            <Tab
              disableIndicator
              orientation="vertical"
              {...(index === 2 && { color: colors[2] })}
            >
              <ListItemDecorator>
                <WorkHistoryOutlinedIcon />
              </ListItemDecorator>
              <Box sx={{ textAlign: 'center'}}>Open Services</Box>
            </Tab>
          </Link>
          <Link to="/it_services_close" style={{ textDecoration: 'none', flex: 1 }}>
            <Tab
              disableIndicator
              orientation="vertical"
              {...(index === 3 && { color: colors[3] })}
            >
              <ListItemDecorator>
                <WorkOffOutlinedIcon />
              </ListItemDecorator>
              <Box sx={{ textAlign: 'center'}}>Close Services</Box>
            </Tab>
          </Link>
        </TabList>
      </Tabs>
    </Box>
  );
}