import React, { useState } from 'react'
import { AlertDialog, InputPassword } from '../../components'
import { Button } from '@mui/material'
import { AuthUser } from '../../../auth/components'

import './updatePassword.css'

export const UpdatePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [dialogOpen, setDialogOpen] = useState(false);
    const [error, setError] = useState(false)
    const [message, setMessage] = useState('');
    const [alertError, setAlertError] = useState(false);

    const { getToken, user } = AuthUser();

    const handleCurrentPassword = (event) => {
        setCurrentPassword(event.target.value);
    };

    const handleNewPassword = (event) => {
        setNewPassword(event.target.value);
        setError(false);
    };

    const handleConfirmPassword = (event) => {
        setConfirmPassword(event.target.value);
        setError(false);
    };

    const validatePassword = () => {
        if (newPassword === '' || confirmPassword === '' || currentPassword === '') {
            return false;
        }
        if (newPassword !== confirmPassword) {
            setError(true);
            return false;
        }
        return true;
    }

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const handleOpenDialog = (message) => {
        setMessage(message);
        setDialogOpen(true);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (validatePassword()) {
            await fetch('/sanctum/csrf-cookie', {
                method: 'GET',
                credentials: 'include'
            });

            const api_url = 'http://localhost:8000/api';
            await fetch(`${api_url}/update-password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify({
                    user_id: user.id,
                    current_password: currentPassword,
                    new_password: newPassword
                }),
                credentials: 'include'
            }).then(async (response) => {
                await response.json().then((data) => {
                    console.log(data)
                    if (data.success) {
                        handleOpenDialog('Contraseña actualizada correctamente');
                        setAlertError(false);
                    } else {
                        handleOpenDialog('Error al actualizar la contraseña. Verifica los datos e inténtalo de nuevo.');
                        setAlertError(true);
                    }
                })
                    .catch(() => {
                        handleOpenDialog('Error al intentar actualizar. Inténtalo de nuevo más tarde.');
                        setAlertError(true);
                    });
            }).catch(() => {
                handleOpenDialog('Error al intentar actualizar. Inténtalo de nuevo más tarde.');
                setAlertError(true);
            });
        }
    }

    return (
        <div className="up-body">
            <div className='up-componente'>
                <h1 className='up-h1'>Cambio de contraseña</h1>
                <form className="up-form" onSubmit={handleSubmit}>
                    <div className="up-input">
                        <InputPassword
                            id='filled-password-input'
                            label='Contraseña actual'
                            value={currentPassword}
                            onChange={handleCurrentPassword}
                        />
                        <InputPassword
                            id='filled-password-input'
                            label={error ? 'Error' : 'Nueva contraseña'}
                            value={newPassword}
                            error={error}
                            helperText={error ? 'Los campos deben coincidir' : ''}
                            onChange={handleNewPassword}
                        />
                        <InputPassword
                            id='filled-password-input'
                            label={error ? 'Error' : 'Confirmar contraseña'}
                            value={confirmPassword}
                            error={error}
                            helperText={error ? 'Los campos deben coincidir' : ''}
                            onChange={handleConfirmPassword}
                        />
                    </div>
                    <div className="up-form-boton">
                        <Button
                            type="submit"
                            className='boton-enviar'
                            variant="contained"
                            sx={{
                                backgroundColor: 'rgb(38, 39, 31, 0.7)',
                                "&:hover": {
                                    backgroundColor: '#26271f'
                                },
                            }}
                        >Guardar cambios</Button>
                    </div>
                </form>
            </div>
            <AlertDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                titulo={alertError ? 'Error' : ''}
                mensaje={message}
                error={alertError}
            />
        </div>
    )
}
