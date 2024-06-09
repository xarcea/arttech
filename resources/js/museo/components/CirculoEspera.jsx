import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export const CirculoEspera = () => {
    return (
        <Box sx={{
            display: 'flex',
            height: '100%',
            position: 'fixed',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            zIndex: 3000,
            }}>
            <CircularProgress color='secondary' size='4rem' thickness={4} />
        </Box>
    );
}
