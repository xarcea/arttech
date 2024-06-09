import { AlertDialog, CirculoEspera, ImageAvatars } from '../../components'
import { AuthUser } from '../../../auth/components';
import { Alert, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { useRef, useState } from 'react';

import './home.css'

export const HomePage = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [message, setMessage] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const { user, getRole, getToken, setToken } = AuthUser();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
        setMessage('');
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setMessage('Por favor seleccione un archivo.');
            return;
        }

        if (selectedFile.size > 1000000) {
            setMessage('El archivo es demasiado grande. Por favor seleccione un archivo de menos de 1MB.');
            return;
        }

        if (!selectedFile.type.includes('image')) {
            setMessage('Por favor seleccione un archivo de imagen.');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('user_id', user.id);

        try {
            setLoading(true);
            const api_url = 'http://localhost:8000/api';
            await axios.get('/sanctum/csrf-cookie');
            const response = await axios.post(`${api_url}/empleado/archivo`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            });
            if (response.data.success) {
                await axios.get(`${api_url}/empleados/${user.id}`, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${getToken()}`
                    }
                }).then((response) => {
                    if (response.data.success) {
                        setToken(response.data.user, getToken(), getRole());
                        setSelectedFile(null);
                        setLoading(false);
                        handleOpenDialog('La foto se actualizó correctamente.');
                    } else {
                        setSelectedFile(null);
                        setLoading(false);
                        handleOpenDialog('La foto se actualizó correctamente. Los cambios se verán reflejados la próxima vez que inicies sesión.');
                    }
                }).catch(() => {
                    setSelectedFile(null);
                    setLoading(false);
                    handleOpenDialog('La foto se actualizó correctamente. Los cambios se verán reflejados la próxima vez que inicies sesión.');
                });
            } else {
                console.log(response.data.message);
                setSelectedFile(null);
                setLoading(false);
                setMessage('Error al subir el archivo.');
            }
        } catch (error) {
            setSelectedFile(null);
            setLoading(false);
            setMessage('Error al subir el archivo.');
            console.error(error);
        }
    };

    const handleOpenDialog = (message) => {
        setSuccessMessage(message);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    return (
        <>
            {loading && <CirculoEspera />}
            <div className='hp-componente'>

                <div className="hp-div-h1">
                    <h1 className='hp-h1'>{user.role}</h1>
                </div>
                <div className="hp-gap">
                    <div className="datos-usuario">
                        <ImageAvatars
                            name={user.name}
                            avatar={user.avatar}
                            size='200px'
                            fontSize='4rem'
                        />
                        <div className="datos-usuario-texto">
                            <h2>Nombre: {user.name}</h2>
                            <h2>ID de empleado: {user.employee_id}</h2>
                            <h2>Correo electrónico: {user.email}</h2>
                        </div>
                    </div>
                    <div className="hp-button">
                        <Button
                            type="submit"
                            className='boton-enviar'
                            variant="contained"
                            sx={{
                                backgroundColor: '#ddd4c3',
                                "&:hover": {
                                    backgroundColor: '#ddd4c3'
                                },
                                color: 'black',
                            }}
                            onClick={() => navigate('/update-password')}
                        >Cambiar contraseña</Button>
                        <>
                            <AlertDialog
                                open={dialogOpen}
                                onClose={handleCloseDialog}
                                titulo="Foto actualizada"
                                mensaje={successMessage}
                                error={false}
                            />
                            <Box sx={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                                <input type="file" onChange={handleFileChange} style={{ display: 'none' }} ref={fileInputRef} />
                                <Button
                                    onClick={() => fileInputRef.current.click()}
                                    className='boton-enviar'
                                    variant="contained"
                                    sx={{
                                        backgroundColor: '#ddd4c3',
                                        "&:hover": {
                                            backgroundColor: '#ddd4c3'
                                        },
                                        color: 'black',
                                    }}
                                >Actualizar foto de perfil</Button>
                                {selectedFile &&
                                    <Alert severity="info">{selectedFile.name}</Alert>
                                }
                            </Box>
                            {message && <Alert severity="error">{message}</Alert>}
                            {selectedFile && !message &&
                                <Button
                                    onClick={handleUpload}
                                    className='boton-enviar'
                                    variant="contained"
                                    sx={{
                                        backgroundColor: '#ddd4c3',
                                        "&:hover": {
                                            backgroundColor: '#ddd4c3'
                                        },
                                        color: 'black',
                                    }}
                                >Subir archivo</Button>
                            }
                        </>
                    </div>
                </div>
            </div>
        </>
    )
}
