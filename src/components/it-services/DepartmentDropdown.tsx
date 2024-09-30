import React, { useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';

const DepartmentDropdown = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const departments = ['แผนกไอที', 'แผนกบัญชี', 'แผนกการตลาด'];

  return (
    <div>
      <Button
        aria-controls={open ? 'department-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        variant="outlined"
      >
        เลือกแผนก
      </Button>
      <Menu
        id="department-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {departments.map((dept) => (
          <MenuItem key={dept} onClick={handleClose}>
            {dept}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default DepartmentDropdown;
