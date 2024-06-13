import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { AuthUser } from '../../../auth/components';
import { Button, Checkbox, IconButton } from '@mui/material';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteIcon from '@mui/icons-material/Delete';
import { esES } from '@mui/x-data-grid/locales';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AlertDialog, CirculoEspera, ConfirmationDialog, FormDialog, SkeletonTabla } from '../../components';
import dayjs from 'dayjs';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';

import './tareas.css';

const theme = createTheme(
    {
        palette: {
            primary: { main: '#9c27b0' },
        },
    },
    esES,
);

function convertirFormatoFecha(fechaString) {
    // Divide la fecha en sus partes (año, mes, día)
    const partesFecha = fechaString.split('-');

    // Crea un nuevo string de fecha en formato DD/MM/YYYY
    const fechaFormateada = `${partesFecha[2]}/${partesFecha[1]}/${partesFecha[0]}`;

    return fechaFormateada;
}

const StyledCell = styled('div')({
    maxHeight: '100px',
    overflowY: 'auto',
});

export const Tareas = () => {
    const [rows, setRows] = React.useState([])
    const [formDialogOpen, setFormDialogOpen] = React.useState(false);
    const [confDialogOpen, setConfDialogOpen] = React.useState(false);
    const [selectedRow, setSelectedRow] = React.useState({})
    const [loading, setLoading] = React.useState(false);
    const [actualizado, setActualizado] = React.useState(false);
    const [esqueleto, setEsqueleto] = React.useState(true);
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [mensaje, setMensaje] = React.useState('');
    const [error, setError] = React.useState(false);
    const [fecha, setFecha] = React.useState(null)
    const { getToken, getUser } = AuthUser();
    const navigate = useNavigate();

    React.useEffect(() => {
        getData()
    }, [actualizado])

    const columns = [
        { field: 'numero', headerName: 'No.', width: 70, headerAlign: 'center', align: 'center' },
        { field: 'employee_id', headerName: 'ID', width: 100, headerAlign: 'center', align: 'center' },
        { field: 'name', headerName: 'Nombre', width: 200, headerAlign: 'center', align: 'center' },
        { field: 'role', headerName: 'Puesto', width: 150, headerAlign: 'center', align: 'center' },
        {
            field: 'task', headerName: 'Tarea asignada', width: 200, headerAlign: 'center', align: 'center', renderCell: (params) => (
                <StyledCell>
                    {params.value}
                </StyledCell>
            ),
        },
        { field: 'state', headerName: 'Estado', width: 150, headerAlign: 'center', align: 'center' },
        { field: 'assignment_date', headerName: 'Fecha de asignación', width: 200, headerAlign: 'center', align: 'center' },
        { field: 'due_date', headerName: 'Fecha de vencimiento', width: 200, headerAlign: 'center', align: 'center' },
        {
            field: 'check', headerName: 'Check', width: 100, headerAlign: 'center', align: 'center', renderCell: (params) => (
                <>
                    {params.value ?
                        <Checkbox disabled checked sx={{
                            '& .MuiSvgIcon-root': { fontSize: 28 },
                            '&.Mui-disabled': { color: '#7bc379' }
                        }} />
                        : <Checkbox disabled sx={{
                            '& .MuiSvgIcon-root': { fontSize: 28 },
                            '&.Mui-disabled': { color: '#f50057' }
                        }} />
                    }
                </>
            ),
        },
        {
            field: 'actions',
            headerName: 'Acciones',
            width: 200,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <>
                    <IconButton
                        variant="contained"
                        color="inherit"
                        size="small"
                        style={{ marginRight: 16 }}
                        onClick={() => handleEdit(params.row.id)}
                    >
                        <EditNoteIcon sx={{ fontSize: 30, color: '#b5aa98' }} />
                    </IconButton>
                    <IconButton
                        variant="contained"
                        color="inherit"
                        size="small"
                        onClick={() => handleDelete(params.row.id)}
                    >
                        <DeleteIcon sx={{ fontSize: 30, color: '#79553d' }} />
                    </IconButton>
                </>
            ),
        },
    ];

    const deleteTask = async () => {
        setConfDialogOpen(false);
        setLoading(true);
        const api_url = 'http://localhost:8000/api';
        await fetch(`${api_url}/coordinador/tareas/${selectedRow}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            credentials: 'include'
        }).then(async (response) => {
            await response.json().then((data) => {
                if (data.success) {
                    setLoading(false);
                    setError(false);
                    handleOpenDialog('Tarea eliminada correctamente');
                } else {
                    setLoading(false);
                    setError(true);
                    handleOpenDialog('Error al eliminar la tarea, intenta nuevamente');
                }
            })
                .catch(() => {
                    setLoading(false);
                    setError(true);
                    handleOpenDialog('No se pudo eliminar la tarea, intenta nuevamente');
                });
        }).catch(() => {
            setLoading(false);
            setError(true);
            handleOpenDialog('Error interno del servidor, intenta nuevamente');
        });
    }

    const updateTask = async (estado) => {
        if (estado) {
            setFormDialogOpen(false);
            setLoading(true);
            const nuevaFecha = dayjs(fecha).format('YYYY-MM-DD');
            const api_url = 'http://localhost:8000/api';
            await fetch(`${api_url}/coordinador/tareas/${selectedRow}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                credentials: 'include',
                body: JSON.stringify({
                    due_date: nuevaFecha
                })
            }).then(async (response) => {
                await response.json().then((data) => {
                    if (data.success) {
                        setLoading(false);
                        setError(false);
                        handleOpenDialog('Datos actualizados correctamente');
                    } else {
                        setLoading(false);
                        setError(true);
                        handleOpenDialog('Error al actualizar, intenta nuevamente');
                    }
                })
                    .catch(() => {
                        setLoading(false);
                        setError(true);
                        handleOpenDialog('No se pudieron actualizar los datos, intenta nuevamente');
                    });
            }).catch(() => {
                setLoading(false);
                setError(true);
                handleOpenDialog('Error interno del servidor, intenta nuevamente');
            });
        }
    };

    const determinarEstado = (completada, fechaVencimiento) => {
        const fechaActual = dayjs().format('YYYY-MM-DD');
        if (completada) {
            return 'Completada';
        } else if (fechaVencimiento < fechaActual) {
            return 'Vencida';
        } else {
            return 'Pendiente';
        }
    }

    const setData = (data) => {
        const celdas = data.map((task, index) => {
            const fechaAsig = convertirFormatoFecha(task.assignment_date)
            const fechaVenc = convertirFormatoFecha(task.due_date)
            const empleado = task.assigned_users[0]
            const estado = determinarEstado(task.completed, task.due_date)
            return {
                id: task.id,
                numero: index + 1,
                employee_id: empleado.employee_id,
                name: empleado.name,
                role: empleado.role,
                task: task.description,
                state: estado,
                assignment_date: fechaAsig,
                due_date: fechaVenc,
                check: task.completed
            }
        })
        setRows(celdas)
    }

    const getData = async () => {
        setEsqueleto(true)
        const id = getUser().id;
        const api_url = 'http://localhost:8000/api';
        await fetch(`${api_url}/coordinador/tareas/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            credentials: 'include'
        }).then(async (response) => {
            await response.json().then((data) => {
                if (data) {
                    setEsqueleto(false);
                    setData(data)
                } else {
                    setEsqueleto(false);
                    console.log(data)
                }
            })
                .catch(() => {
                    setEsqueleto(false);
                    console.log(response)
                });
        }).catch(() => {
            setEsqueleto(false);
            console.log('Error')
        });
    }

    const handleCloseFormDialog = () => {
        setFormDialogOpen(false);
    };

    const handleCloseConfirmDialog = () => {
        setConfDialogOpen(false);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        if (!error) setActualizado(!actualizado);
    };

    const handleOpenDialog = (message) => {
        setMensaje(message);
        setDialogOpen(true);
    };

    const manejarFechaDesdeHijo = (fecha) => {
        setFecha(fecha);
    }

    const handleEdit = (id) => {
        setSelectedRow(id);
        setFormDialogOpen(true);
    };

    const handleDelete = (id) => {
        setSelectedRow(id);
        setConfDialogOpen(true);
    };

    const renderPage = () => {
        if (esqueleto) {
            return (
                <SkeletonTabla />
            )
        } else {
            return (
                <>
                    <AlertDialog
                        open={dialogOpen}
                        onClose={handleCloseDialog}
                        titulo={error ? "Error" : "Éxito"}
                        mensaje={mensaje}
                        error={error}
                    />
                    <FormDialog
                        open={formDialogOpen}
                        onClose={handleCloseFormDialog}
                        manejarLoading={updateTask}
                        componente={'tarea'}
                        manejarFecha={manejarFechaDesdeHijo}
                    />
                    <ConfirmationDialog
                        open={confDialogOpen}
                        onClose={handleCloseConfirmDialog}
                        titulo='Eliminar tarea'
                        mensaje='¿Estás seguro de que deseas eliminar esta tarea?'
                        manejarConfirmacion={deleteTask}
                    />
                    <div style={{ height: 400, width: '100%' }}>
                        <ThemeProvider theme={theme}>
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                initialState={{
                                    pagination: {
                                        paginationModel: { page: 0, pageSize: 5 },
                                    },
                                }}
                                pageSizeOptions={[5, 10]}
                                sx={{
                                    padding: '0 1rem 0 1rem',
                                    '& .MuiDataGrid-virtualScrollerRenderZone': {
                                        paddingBottom: '1rem',
                                    },
                                }}
                            />
                        </ThemeProvider>
                    </div>
                </>
            )
        }
    }

    return (
        <>
            {loading && <CirculoEspera />}
            <div className='tr-body'>
                <div className="tr-tabla">
                    <h1 className='tr-h1'>Lista de tareas</h1>
                    {renderPage()}
                    <div className="tr-form-boton">
                        <Button
                            onClick={() => navigate('/asignar-tarea')}
                            className='tr-boton-enviar'
                            variant="contained"
                            sx={{
                                backgroundColor: 'rgb(38, 39, 31, 0.7)',
                                "&:hover": {
                                    backgroundColor: '#26271f'
                                },
                            }}
                        >Asignar nueva tarea</Button>
                    </div>
                </div>
            </div>
        </>
    );
}