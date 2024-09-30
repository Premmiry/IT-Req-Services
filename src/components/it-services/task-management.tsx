import React from 'react';
import { 
  AppBar, Toolbar, Typography, Box, List, ListItem, 
  ListItemText, CssBaseline
} from '@mui/material';

const mockTasks = [
  { id: 'IT67008', name: 'Task 1', status: 'IN PROGRESS' },
  { id: 'IT67115', name: 'Task 2', status: 'IN PROGRESS' },
  { id: 'IT67156', name: 'Task 3', status: 'IN PROGRESS' },
  { id: 'IT67216', name: 'Task 4', status: 'IN PROGRESS' },
];

const TaskManagementMockup: React.FC = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div">
            Workspace
          </Typography>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>IT Request</Typography>
        <List>
          {mockTasks.map((task) => (
            <ListItem key={task.id}>
              <ListItemText 
                primary={`${task.id} ${task.name}`} 
                secondary={task.status}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default TaskManagementMockup;