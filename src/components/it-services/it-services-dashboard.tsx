import React, { useState } from 'react';
import { Box, Typography, Chip, TextField, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, Checkbox } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';

interface Task {
  id: string;
  name: string;
  status: 'IN PROGRESS';
  tags: string[];
  assignee: string;
}

const getTagColor = (tag: string) => {
  // ... (same as before)
};

const TaskRow: React.FC<{ 
  task: Task, 
  isSelected: boolean, 
  onSelect: () => void,
  onAddClick: () => void,
  onEditClick: () => void,
  onStatusClick: () => void,
  onAssigneeClick: () => void
}> = ({ task, isSelected, onSelect, onAddClick, onEditClick, onStatusClick, onAssigneeClick }) => (
  <TableRow 
    selected={isSelected}
    onClick={onSelect}
    sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
  >
    <TableCell padding="checkbox">
      <Checkbox checked={isSelected} onChange={onSelect} onClick={(e) => e.stopPropagation()} />
    </TableCell>
    <TableCell>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box component="span" sx={{ color: '#3f51b5', mr: 1 }}>●</Box>
        <Typography variant="body2">{task.name}</Typography>
      </Box>
      <Box sx={{ mt: 0.5, display: 'flex', flexWrap: 'wrap' }}>
        {task.tags.map((tag, index) => (
          <Chip
            key={index}
            label={tag}
            size="small"
            sx={{
              mr: 0.5,
              mb: 0.5,
              bgcolor: getTagColor(tag),
              color: 'black',
              fontSize: '0.7rem',
              height: 20,
            }}
            onClick={(e) => { e.stopPropagation(); console.log(`Tag clicked: ${tag}`); }}
          />
        ))}
      </Box>
    </TableCell>
    <TableCell>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton size="small" sx={{ mr: 1 }} onClick={(e) => { e.stopPropagation(); onAddClick(); }}>
          <AddIcon />
        </IconButton>
        <IconButton size="small" sx={{ mr: 1 }} onClick={(e) => { e.stopPropagation(); onEditClick(); }}>
          <EditIcon />
        </IconButton>
        <Chip 
          label={task.status} 
          color="primary" 
          size="small" 
          onClick={(e) => { e.stopPropagation(); onStatusClick(); }}
        />
      </Box>
    </TableCell>
    <TableCell>
      <Avatar 
        sx={{ width: 24, height: 24, fontSize: '0.8rem', cursor: 'pointer' }}
        onClick={(e) => { e.stopPropagation(); onAssigneeClick(); }}
      >
        {task.assignee[0]}
      </Avatar>
    </TableCell>
  </TableRow>
);

const ITServicesDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 'IT67115', name: 'แผนก : WNH(WARD 14) เรื่อง : ติดตั้งสัญญาณ wifi', status: 'IN PROGRESS', tags: ['แผนกร่วมบริการ'], assignee: 'John' },
    { id: 'IT67156', name: 'แผนก: IT Online เรื่อง: แก้ไขโปรแกรมค่ารักษา', status: 'IN PROGRESS', tags: ['แผนกร่วมบริจาคออนไลน์และเครื่องมือแพทย์'], assignee: 'TP' },
    { id: 'IT67204', name: 'แผนก: ศัลยกรรมตกแต่ง เรื่อง: เพิ่มจุดสัญญาณ wifi', status: 'IN PROGRESS', tags: ['ไอที'], assignee: 'Alice' },
    { id: 'IT67210', name: 'แผนก: ศูนย์ผู้สูงอายุ (ชั้น 14) เรื่อง: ขอเครื่องสแกนพริ้นเตอร์', status: 'IN PROGRESS', tags: ['ส่วน it online'], assignee: 'Bob' },
    { id: 'IT67232', name: 'แผนก: บุคคล เรื่อง: ปรับแก้โปรแกรมประเมินพฤติกรรมเจ้าหน้าที่', status: 'IN PROGRESS', tags: ['นพท'], assignee: 'Charlie' },
    { id: 'IT67237', name: 'แผนก: พัฒนาคุณภาพ JCI เรื่อง: ขอเปิดสิทธิ์ โปรแกรม KM', status: 'IN PROGRESS', tags: ['แผนควบคุมระบบปฏิบัติงาน'], assignee: 'David' },
    { id: 'IT67242', name: 'แผนก: บุคคล เรื่อง: ขอให้ทำแบบสอบถามความพึงพอใจ', status: 'IN PROGRESS', tags: ['นพท'], assignee: 'Eve' },
  ]);

  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  const handleTaskSelect = (taskId: string) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId) 
        : [...prev, taskId]
    );
  };

  const handleAddClick = (taskId: string) => {
    console.log(`Add clicked for task ${taskId}`);
    // Implement add functionality here
  };

  const handleEditClick = (taskId: string) => {
    console.log(`Edit clicked for task ${taskId}`);
    // Implement edit functionality here
  };

  const handleStatusClick = (taskId: string) => {
    console.log(`Status clicked for task ${taskId}`);
    // Implement status change functionality here
  };

  const handleAssigneeClick = (taskId: string) => {
    console.log(`Assignee clicked for task ${taskId}`);
    // Implement assignee change functionality here
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 1000, mx: 'auto', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <TextField
          size="small"
          placeholder="Search or Create New"
          InputProps={{
            endAdornment: (
              <IconButton size="small" onClick={() => console.log('Search clicked')}>
                <SearchIcon />
              </IconButton>
            ),
          }}
          sx={{ width: 300 }}
          onChange={(e) => console.log('Search query:', e.target.value)}
        />
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedTasks.length > 0 && selectedTasks.length < tasks.length}
                  checked={selectedTasks.length === tasks.length}
                  onChange={() => 
                    setSelectedTasks(selectedTasks.length === tasks.length ? [] : tasks.map(t => t.id))
                  }
                />
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Assignee</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map(task => (
              <TaskRow 
                key={task.id} 
                task={task} 
                isSelected={selectedTasks.includes(task.id)}
                onSelect={() => handleTaskSelect(task.id)}
                onAddClick={() => handleAddClick(task.id)}
                onEditClick={() => handleEditClick(task.id)}
                onStatusClick={() => handleStatusClick(task.id)}
                onAssigneeClick={() => handleAssigneeClick(task.id)}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton color="primary" onClick={() => console.log('Add new task clicked')}>
          <AddIcon />
        </IconButton>
        <Typography variant="body2" sx={{ ml: 1 }}>Add Task</Typography>
      </Box>
    </Box>
  );
};

export default ITServicesDashboard;
