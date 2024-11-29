import React from 'react';
import { FormControlLabel, Checkbox } from '@mui/material';
import { green, pink, blue } from '@mui/material/colors';

interface CheckboxITApproveProps {
    levelJob: number | null;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CheckboxITApprove: React.FC<CheckboxITApproveProps> = ({ levelJob, onChange }) => {
    return (
        <>
            <FormControlLabel
                control={
                    <Checkbox
                        id={`a_checkbox`}
                        checked={levelJob === 1}
                        onChange={onChange}
                        value={1}
                        sx={{
                            color: green[500],
                            '&.Mui-checked': {
                                color: green[500],
                            },
                        }}
                    />
                }
                label="A"
                labelPlacement="end"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        id={`b_checkbox`}
                        checked={levelJob === 2}
                        onChange={onChange}
                        value={2}
                        sx={{
                            color: pink[500],
                            '&.Mui-checked': {
                                color: pink[500],
                            },
                        }}
                    />
                }
                label="B"
                labelPlacement="end"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        id={`c_checkbox`}
                        checked={levelJob === 3}
                        onChange={onChange}
                        value={3}
                        sx={{
                            color: blue[500],
                            '&.Mui-checked': {
                                color: blue[500],
                            }
                        }}
                    />
                }
                label="C"
                labelPlacement="end"
            />
        </>
    );
};

export default CheckboxITApprove;