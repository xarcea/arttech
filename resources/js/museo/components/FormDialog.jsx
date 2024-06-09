import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { InputComponent } from './InputComponent';
import { AuthUser } from '../../auth/components';
import { AlertDialog } from './AlertDialog';

export const FormDialog = ({ open, onClose, user, manejarLoading, manejarActualizado }) => {
    const [email, setEmail] = React.useState('');
    const [telefono, setTelefono] = React.useState('');
    const [puesto, setPuesto] = React.useState('');
    const [mensaje, setMensaje] = React.useState('');
    const [error, setError] = React.useState(false);
    const [dialogOpen, setDialogOpen] = React.useState(false);

    const { getToken } = AuthUser();

    React.useEffect(() => {
        if (user) {
            setEmail(user.email);
            setTelefono(user.phone_number);
            setPuesto(user.role);
        }
    }, [user]);

    const enviarLoadingAlPadre = (loading) => {
        manejarLoading(loading);
    };

    const enviarActualizadoAlPadre = (actualizado) => {
        manejarActualizado(actualizado);
    }

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }

    const handlePuestoChange = (event) => {
        setPuesto(event.target.value);
    }

    const handleTelefonoChange = (event) => {
        setTelefono(event.target.value);
    }

    const handleCloseDialog = () => {
        setDialogOpen(false);
        if(!error) {
            enviarActualizadoAlPadre(true);
        }
    };

    const handleOpenDialog = (message) => {
        setMensaje(message);
        setDialogOpen(true);
    };

    const getRole = (role) => {
        const empleado = ['Restaurador', 'Restauradora', 'Conservador', 'Conservadora', 'Catalogador', 'Catalogadora', 'Investigador', 'Investigadora'];
        if (empleado.includes(role)) {
            return 'empleado'
        } else {
            return 'coordinador'
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const rolApp = getRole(puesto)
        enviarLoadingAlPadre(true)
        const api_url = 'http://localhost:8000/api';
        await fetch(`${api_url}/empleados/${user.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify({
                email: email,
                phone_number: telefono,
                role: puesto,
                rol: rolApp
            }),
            credentials: 'include'
        }).then(async (response) => {
            await response.json().then((data) => {
                if (data.success) {
                    enviarLoadingAlPadre(false);
                    setError(false);
                    handleOpenDialog('Datos actualizados correctamente');
                } else {
                    enviarLoadingAlPadre(false);
                    setError(true);
                    handleOpenDialog('Error al actualizar, intenta nuevamente');
                }
            })
                .catch(() => {
                    enviarLoadingAlPadre(false);
                    setError(true);
                    handleOpenDialog('No se pudieron actualizar los datos, intenta nuevamente');
                });
        }).catch(() => {
            enviarLoadingAlPadre(false);
            setError(true);
            handleOpenDialog('Error interno del servidor, intenta nuevamente');
        });
    }

    return (
        <>
            <AlertDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                titulo={error ? "Error" : "Éxito"}
                mensaje={mensaje}
                error={error}
            />
            <Dialog
                open={open}
                onClose={onClose}
            >
                <DialogTitle sx={{ backgroundColor: '#b5aa98', color: '#ffff' }}>Editar datos de {user.name}</DialogTitle>
                <DialogContent sx={{ backgroundColor: '#b5aa98', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <InputComponent
                        id='filled-email-input'
                        label='Correo electrónico'
                        value={email}
                        onChange={handleEmailChange}
                        icon={false}
                        complete={false}
                    />
                    <InputComponent
                        id='filled-email-input'
                        label='Teléfono'
                        value={telefono}
                        onChange={handleTelefonoChange}
                        icon={false}
                        complete={false}
                    />
                    <InputComponent
                        id='filled-email-input'
                        label='Puesto'
                        value={puesto}
                        onChange={handlePuestoChange}
                        icon={false}
                        complete={false}
                    />
                </DialogContent>
                <DialogActions sx={{ backgroundColor: '#b5aa98', padding: '0 1.5rem 1rem 0' }}>
                    <Button
                        onClick={onClose}
                        sx={{
                            color: '#ffff',
                            backgroundColor: 'rgb(211, 47, 47, 0.5)',
                            "&:hover": {
                                backgroundColor: 'rgb(211, 47, 47)'
                            },
                        }}
                    >Cancelar</Button>
                    <Button
                        type="submit"
                        onClick={handleSubmit}
                        sx={{
                            color: '#ffff',
                            backgroundColor: 'rgb(38, 39, 31, 0.7)',
                            "&:hover": {
                                backgroundColor: '#26271f'
                            },
                        }}
                    >
                        Guardar cambios</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}