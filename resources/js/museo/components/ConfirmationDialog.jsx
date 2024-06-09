import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { DialogContentText } from '@mui/material';

export const ConfirmationDialog = ({ open, onClose, titulo, mensaje, manejarConfirmacion }) => {
    const enviarConfirmacionAlPadre = () => {
        manejarConfirmacion();
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" sx={{ color: '#000000', backgroundColor: '#dcd5c3' }}>
                    {titulo}
                </DialogTitle>
                <DialogContent sx={{ backgroundColor: '#dcd5c3' }}>
                    <DialogContentText sx={{ color: '#000000' }} id="alert-dialog-description">
                        {mensaje}
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ backgroundColor: '#dcd5c3' }}>
                    <Button onClick={onClose}
                        sx={{
                            color: '#ffff',
                            backgroundColor: 'rgb(211, 47, 47, 0.5)',
                            "&:hover": {
                                backgroundColor: 'rgb(211, 47, 47)'
                            },
                        }}
                        autoFocus>
                        Cancelar
                    </Button>
                    <Button onClick={enviarConfirmacionAlPadre}
                        sx={{
                            color: '#ffff',
                            backgroundColor: 'rgb(38, 39, 31, 0.7)',
                            "&:hover": {
                                backgroundColor: '#26271f'
                            },
                        }}
                    >
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}