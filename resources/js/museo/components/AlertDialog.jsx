import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { DialogContentText } from '@mui/material';

export const AlertDialog = ({ open, onClose, titulo, mensaje, error }) => {
    const tema = error ? 'rgb(211, 47, 47, 0.5)' : 'rgb(154, 209, 133, 0.5)';
    const temaBoton = error ? 'rgb(211, 47, 47)' : 'rgb(154, 209, 133)';
    const temaTexto = error ? '#ffff' : '#000000';
    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" sx={{ 'color': temaTexto, 'backgroundColor': tema }}>
                    {titulo}
                </DialogTitle>
                <DialogContent sx={{ 'backgroundColor': tema }}>
                    <DialogContentText sx={{ 'color': temaTexto}} id="alert-dialog-description">
                        {mensaje}
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ 'backgroundColor': tema }}>
                    <Button onClick={onClose} sx={{ 'color': temaTexto, 'backgroundColor': temaBoton }} autoFocus>
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
