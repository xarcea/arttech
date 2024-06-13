import { useEffect, useState } from 'react';
import { AlertDialog, CirculoEspera, SelectComponent, SelectorFecha, TextArea } from '../../components';
import { AuthUser } from '../../../auth/components';
import { Box, Button } from '@mui/material';
import dayjs from 'dayjs';

import './asignar-tarea.css';

export const AsignarTarea = () => {
    const [user, setUser] = useState();
    const [data, setData] = useState([]);
    const [fechaAsig, setFechaAsig] = useState(dayjs(new Date()));
    const [fechaVenc, setFechaVenc] = useState();
    const [tarea, setTarea] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false);
    const [message, setMessage] = useState('');
    const { getToken, getUser } = AuthUser();

    useEffect(() => {
        getData()
    }, [])

    const manejarUsuarioDesdeHijo = (id) => {
        setUser(id);
    }

    const manejarFechaAsigDesdeHijo = (fecha) => {
        setFechaAsig(fecha);
    }

    const manejarFechaVencDesdeHijo = (fecha) => {
        setFechaVenc(fecha);
    }

    const manejartextoDesdeHijo = (tarea) => {
        setTarea(tarea);
    }

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const handleOpenDialog = (message) => {
        setMessage(message);
        setDialogOpen(true);
    };

    const getData = async () => {
        const api_url = 'http://localhost:8000/api';
        await fetch(`${api_url}/empleados`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            credentials: 'include'
        }).then(async (response) => {
            await response.json().then((data) => {
                if (data && data.length > 0) {
                    const users = data.filter(user => user.rol === 'empleado');
                    setData(users)
                } else {
                    console.log(data)
                }
            })
                .catch(() => {
                    console.log(response)
                });
        }).catch(() => {
            console.log('Error')
        });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!user || !fechaAsig || !fechaVenc || !tarea) {
            alert('Todos los campos son obligatorios')
            return
        }
        setLoading(true);
        const fechaAsigForm = dayjs(fechaAsig).format('YYYY-MM-DD');
        const fechaVencForm = dayjs(fechaVenc).format('YYYY-MM-DD');
        const api_url = 'http://localhost:8000/api';
        const tareaData = {
            description: tarea,
            completed: false,
            assignment_date: fechaAsigForm,
            due_date: fechaVencForm,
            assigned_by: getUser().id,
            assigned_to: user
        }
        await fetch(`${api_url}/coordinador/tareas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            credentials: 'include',
            body: JSON.stringify(tareaData)
        }).then(async (response) => {
            await response.json().then((data) => {
                if (data.success) {
                    setLoading(false);
                    setError(false);
                    handleOpenDialog('Tarea asignada correctamente.');
                } else {
                    setLoading(false);
                    setError(true);
                    handleOpenDialog('Error al crear la tarea. Inténtalo de nuevo más tarde.');
                }
            })
                .catch(() => {
                    setLoading(false);
                    setError(true);
                    handleOpenDialog('Error al intentar asignar la tarea. Inténtalo de nuevo más tarde.');
                });
        }).catch(() => {
            setLoading(false);
            setError(true);
            handleOpenDialog('Error interno del servidor. Inténtalo de nuevo más tarde.');
        });
    }

    return (
        <>
            {loading && <CirculoEspera />}
            <AlertDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                titulo={error ? 'Error' : 'Éxito'}
                mensaje={message}
                error={error}
            />
            <div className="at-body">
                <form className='at-form' onSubmit={handleSubmit}>
                    <div className="at-h2">
                        <h2>Asignar nueva tarea</h2>
                    </div>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <Box sx={{ display: 'flex', gap: '2rem' }}>
                            <div className='at-fieldset'>
                                <label className='at-label'>Empleado</label>
                                <SelectComponent
                                    users={data}
                                    manejarUsuario={manejarUsuarioDesdeHijo}
                                />
                            </div>
                            <div className='at-fieldset-fecha'>
                                <label className='at-label-fecha'>Fecha de asignación</label>
                                <SelectorFecha
                                    valor={new Date()}
                                    manejarFecha={manejarFechaAsigDesdeHijo}
                                />
                            </div>
                        </Box>
                        <Box sx={{ display: 'flex', gap: '2rem' }}>
                            <div className="at-fieldset">
                                <label className='at-label'>Tarea a asignar</label>
                                <TextArea label="Descripción" manejarTexto={manejartextoDesdeHijo} />
                            </div>
                            <div className='at-fieldset-fecha'>
                                <label className='at-label-fecha'>Fecha de vencimiento</label>
                                <SelectorFecha manejarFecha={manejarFechaVencDesdeHijo} />
                            </div>
                        </Box>
                    </Box>
                    <div className="at-form-boton">
                        <Button
                            type="submit"
                            className='at-boton-enviar'
                            variant="contained"
                            sx={{
                                backgroundColor: 'rgb(38, 39, 31, 0.7)',
                                "&:hover": {
                                    backgroundColor: '#26271f'
                                },
                            }}
                        >Asignar tarea</Button>
                    </div>
                </form>
            </div>
        </>
    );
};
