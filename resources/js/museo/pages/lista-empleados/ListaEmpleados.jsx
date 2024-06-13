import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { AuthUser } from '../../../auth/components';
import { Box, IconButton } from '@mui/material';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteIcon from '@mui/icons-material/Delete';
import { esES } from '@mui/x-data-grid/locales';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AlertDialog, CirculoEspera, ConfirmationDialog, FormDialog, SkeletonTabla } from '../../components';

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

export const ListaEmpleados = () => { // TODO: hacer pruebas de modificación y eliminación de empleados
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
    const [height, setHeight] = React.useState(window.innerHeight);

    const { getToken } = AuthUser();

    React.useEffect(() => {
        getData()

        const handleResize = () => {
            setHeight(window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [actualizado])

    const manejarLoadingDesdeHijo = (nuevoEstado) => {
        setLoading(nuevoEstado);
        if (nuevoEstado) {
            setFormDialogOpen(false);
        }
    };

    const manejarActualizadoDesdeHijo = (nuevoEstado) => {
        if (nuevoEstado) setActualizado(!actualizado);
    }

    const columns = [
        { field: 'numero', headerName: 'No.', width: 70, headerAlign: 'center', align: 'center' },
        { field: 'employee_id', headerName: 'ID', width: 100, headerAlign: 'center', align: 'center' },
        { field: 'name', headerName: 'Nombre', width: 200, headerAlign: 'center', align: 'center' },
        { field: 'birthday', headerName: 'Fecha de nacimiento', width: 150, headerAlign: 'center', align: 'center' },
        { field: 'email', headerName: 'Correo electrónico', width: 250, headerAlign: 'center', align: 'center' },
        { field: 'phone_number', headerName: 'Teléfono', width: 150, headerAlign: 'center', align: 'center' },
        { field: 'role', headerName: 'Puesto', width: 150, headerAlign: 'center', align: 'center' },
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
                        onClick={() => handleEdit(params.row)}
                    >
                        <EditNoteIcon sx={{ fontSize: 30, color: '#b5aa98' }} />
                    </IconButton>
                    <IconButton
                        variant="contained"
                        color="inherit"
                        size="small"
                        onClick={() => handleDelete(params.row)}
                    >
                        <DeleteIcon sx={{ fontSize: 30, color: '#79553d' }} />
                    </IconButton>
                </>
            ),
        },
    ];

    const handleEdit = (user) => {
        setSelectedRow(user);
        setFormDialogOpen(true);
    };

    const handleDelete = (user) => {
        setSelectedRow(user);
        setConfDialogOpen(true);
    };

    const deleteUser = async () => {
        setConfDialogOpen(false);
        setLoading(true);
        const api_url = 'http://localhost:8000/api';
        await fetch(`${api_url}/empleados/${selectedRow.id}`, {
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
                    handleOpenDialog('Empleado eliminado correctamente');
                } else {
                    setLoading(false);
                    setError(true);
                    handleOpenDialog('Error al eliminar empleado, intenta nuevamente');
                }
            })
                .catch(() => {
                    setLoading(false);
                    setError(true);
                    handleOpenDialog('No se pudo eliminar el empleado, intenta nuevamente');
                });
        }).catch(() => {
            setLoading(false);
            setError(true);
            handleOpenDialog('Error interno del servidor, intenta nuevamente');
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

    const setData = (data) => {
        const celdas = data.map((employee, index) => {
            const fecha = convertirFormatoFecha(employee.birthday)
            return {
                id: employee.id,
                numero: index + 1,
                employee_id: employee.employee_id,
                name: employee.name,
                birthday: fecha,
                email: employee.email,
                phone_number: employee.phone_number,
                role: employee.role,
            }
        })
        setRows(celdas)
    }

    const getData = async () => {
        setEsqueleto(true)
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
                        user={selectedRow}
                        manejarLoading={manejarLoadingDesdeHijo}
                        manejarActualizado={manejarActualizadoDesdeHijo}
                        componente={'empleado'}
                    />
                    <ConfirmationDialog
                        open={confDialogOpen}
                        onClose={handleCloseConfirmDialog}
                        titulo={`Eliminar empleado ${selectedRow.name}`}
                        mensaje='¿Estás seguro de que deseas eliminar este empleado?'
                        manejarConfirmacion={deleteUser}
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
                                // checkboxSelection
                                sx={{ padding: '0 1rem 0 1rem' }}
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
            <Box sx={{ p: 3, padding: '1rem 5rem 1rem 5rem', height: height - 182 }}>
                <h1 className='le-h1'>Lista de empleados</h1>
                {renderPage()}
            </Box>
        </>
    );
}