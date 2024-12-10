import React from 'react';
import { Box, Container } from '@mui/material';
import TopicManager from '../Topic/TopicManager';

interface TypeRequestComponentProps {
  typeId?: number;
}

export default function TypeRequestComponent({ typeId }: TypeRequestComponentProps) {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 3 }}>
        <TopicManager typeId={typeId} />
      </Box>
    </Container>
  );
}
    
