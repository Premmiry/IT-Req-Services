import { useEffect, useState } from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import { TypeRequest } from './types';
import URLAPI from '../../../../../URLAPI';

interface TypeMenuProps {
    open: boolean;
    selectedTypeId: number | null;
    onTypeClick: (typeId: number) => void;
}

export default function TypeMenu({ open, selectedTypeId, onTypeClick }: TypeMenuProps) {
    const [types, setTypes] = useState<TypeRequest[]>([]);

    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const response = await fetch(`${URLAPI}/treqs`);
                const data = await response.json();
                setTypes(data);
            } catch (error) {
                console.error('Error fetching types:', error);
            }
        };
        fetchTypes();
    }, []);

    return (
        <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
                {types.map((type) => (
                    <ListItemButton
                        key={type.type_id}
                        sx={{ pl: 4 }}
                        selected={selectedTypeId === type.type_id}
                        onClick={() => onTypeClick(type.type_id)}
                    >
                        <ListItemText primary={type.type_name} />
                    </ListItemButton>
                ))}
            </List>
        </Collapse>
    );
}