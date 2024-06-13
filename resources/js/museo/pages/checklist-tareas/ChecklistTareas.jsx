import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import { AuthUser } from '../../../auth/components';
import { CirculoEspera, SkeletonTareas } from '../../components';

import './checklist-tareas.css';
import { set } from 'date-fns';

function convertirFormatoFecha(fechaString) {
    // Divide la fecha en sus partes (año, mes, día)
    const partesFecha = fechaString.split('-');

    // Crea un nuevo string de fecha en formato DD/MM/YYYY
    const fechaFormateada = `${partesFecha[2]}/${partesFecha[1]}/${partesFecha[0]}`;

    return fechaFormateada;
}

export const ChecklistTareas = () => {
    const [checked, setChecked] = React.useState([]);
    const [tareas, setTareas] = React.useState([]);
    const [completas, setCompletas] = React.useState([]);
    const [vencidas, setVencidas] = React.useState([]);
    const [esqueleto, setEsqueleto] = React.useState(true);
    const [vacio, setVacio] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [actualizado, setActualizado] = React.useState(false);
    const [height, setHeight] = React.useState(window.innerHeight);

    const { getToken, getUser } = AuthUser();

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


    const handleToggle = (id, value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        setChecked(newChecked);
        actualizarEstado(id);
    };

    const generarArreglos = (data) => {
        const completedTasks = data.filter(task => task.completed);
        const today = new Date();
        const overdueTasks = data.filter(task => !task.completed && new Date(task.due_date) < today);
        const pendingTasks = data.filter(task => !task.completed && new Date(task.due_date) >= today);
        setCompletas(completedTasks);
        setVencidas(overdueTasks);
        setTareas(pendingTasks);
    }

    const getData = async () => {
        setEsqueleto(true)
        const api_url = 'http://localhost:8000/api';
        const id = getUser().id;
        await fetch(`${api_url}/empleado/tareas/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            credentials: 'include'
        }).then(async (response) => {
            await response.json().then((data) => {
                if (data && data.length > 0) {
                    setEsqueleto(false);
                    generarArreglos(data)
                } else {
                    setEsqueleto(false);
                    setVacio(true);
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

    const actualizarEstado = async (id) => {
        setLoading(true)
        const api_url = 'http://localhost:8000/api';
        await fetch(`${api_url}/empleado/tareas/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            credentials: 'include',
            body: JSON.stringify({
                completed: true
            })
        }).then(async (response) => {
            await response.json().then((data) => {
                if (data.success) {
                    console.log(data)
                    setLoading(false)
                    setActualizado(!actualizado)
                }
            })
                .catch(() => {
                    setLoading(false)
                    console.log(response)
                });
        }).catch(() => {
            setLoading(false)
            console.log('Error')
        });
        setChecked([]);
    }

    const renderPendientes = () => {
        return (
            <>
                <h2 className='ct-h1'>Tareas pendientes</h2>
                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    <div className="ct-titulos">
                        <h3>Check</h3>
                        <h3 className='ct-h3'>Descripción</h3>
                        <h3 className='ct-h3'>Fecha de asignación</h3>
                        <h3 className='ct-h3'>Fecha de vencimiento</h3>
                    </div>
                    {tareas.map((tarea, index) => {
                        const labelId = `checkbox-list-label-${index}`;

                        return (
                            <ListItem
                                key={index}
                                disablePadding
                            >
                                <ListItemButton role={undefined} dense
                                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <ListItemIcon>
                                        <Checkbox
                                            onClick={handleToggle(tarea.id, index)}
                                            sx={{
                                                '& .MuiSvgIcon-root': { fontSize: 28 },
                                                '&.Mui-checked .MuiSvgIcon-root': {
                                                    color: '#b5aa98',
                                                },
                                            }}
                                            edge="start"
                                            checked={checked.indexOf(index) !== -1}
                                            tabIndex={-1}
                                            disableRipple
                                            inputProps={{ 'aria-labelledby': labelId }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText
                                        id={labelId}
                                        primary={`${tarea.description}`}
                                        sx={{
                                            '& .MuiListItemText-primary': {
                                                fontSize: '110%',
                                            },
                                            width: '33%',
                                            display: 'flex',
                                            justifyContent: 'center'
                                        }}
                                    />
                                    <ListItemText
                                        id={labelId}
                                        primary={`${convertirFormatoFecha(tarea.assignment_date)}`}
                                        sx={{
                                            '& .MuiListItemText-primary': {
                                                fontSize: '110%',
                                            },
                                            width: '33%',
                                            display: 'flex',
                                            justifyContent: 'center'
                                        }}
                                    />
                                    <ListItemText
                                        id={labelId}
                                        primary={`${convertirFormatoFecha(tarea.due_date)}`}
                                        sx={{
                                            '& .MuiListItemText-primary': {
                                                fontSize: '110%',
                                            },
                                            width: '33%',
                                            display: 'flex',
                                            justifyContent: 'center'
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </>
        )
    }

    const renderCompletas = () => {
        return (
            <>
                <h2 className='ct-h1'>Tareas completadas</h2>
                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    {completas.map((tarea, index) => {
                        const labelId = `checkbox-list-label-${index}`;

                        return (
                            <ListItem
                                key={index}
                                disablePadding
                            >
                                <ListItemButton role={undefined} dense disableRipple>
                                    <ListItemIcon>
                                        <Checkbox
                                            sx={{
                                                '& .MuiSvgIcon-root': { fontSize: 28 },
                                                '&.Mui-checked .MuiSvgIcon-root': {
                                                    color: '#b5aa98',
                                                },
                                            }}
                                            edge="start"
                                            checked={tarea.completed ? true : false}
                                            tabIndex={-1}
                                            disableRipple
                                            inputProps={{ 'aria-labelledby': labelId }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText
                                        id={labelId}
                                        primary={`${tarea.description}`}
                                        sx={{
                                            '& .MuiListItemText-primary': {
                                                fontSize: '110%',
                                            },
                                            width: '33%',
                                            display: 'flex',
                                            justifyContent: 'center'
                                        }}
                                    />
                                    <ListItemText
                                        id={labelId}
                                        primary={`${convertirFormatoFecha(tarea.assignment_date)}`}
                                        sx={{
                                            '& .MuiListItemText-primary': {
                                                fontSize: '110%',
                                            },
                                            width: '33%',
                                            display: 'flex',
                                            justifyContent: 'center'
                                        }}
                                    />
                                    <ListItemText
                                        id={labelId}
                                        primary={`${convertirFormatoFecha(tarea.due_date)}`}
                                        sx={{
                                            '& .MuiListItemText-primary': {
                                                fontSize: '110%',
                                            },
                                            width: '33%',
                                            display: 'flex',
                                            justifyContent: 'center'
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </>
        )
    }

    const renderVencidas = () => {
        return (
            <>
                <h2 className='ct-h1'>Tareas vencidas</h2>
                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    {vencidas.map((tarea, index) => {
                        const labelId = `checkbox-list-label-${index}`;

                        return (
                            <ListItem
                                key={index}
                                disablePadding
                            >
                                <ListItemButton role={undefined} dense disableRipple>
                                    <ListItemIcon>
                                        <Checkbox
                                            sx={{
                                                '& .MuiSvgIcon-root': { fontSize: 28 },
                                                '&.Mui-checked .MuiSvgIcon-root': {
                                                    color: '#b5aa98',
                                                },
                                            }}
                                            edge="start"
                                            checked={tarea.completed ? true : false}
                                            tabIndex={-1}
                                            disableRipple
                                            inputProps={{ 'aria-labelledby': labelId }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText
                                        id={labelId}
                                        primary={`${tarea.description}`}
                                        sx={{
                                            '& .MuiListItemText-primary': {
                                                fontSize: '110%',
                                            },
                                            width: '33%',
                                            display: 'flex',
                                            justifyContent: 'center'
                                        }}
                                    />
                                    <ListItemText
                                        id={labelId}
                                        primary={`${convertirFormatoFecha(tarea.assignment_date)}`}
                                        sx={{
                                            '& .MuiListItemText-primary': {
                                                fontSize: '110%',
                                            },
                                            width: '33%',
                                            display: 'flex',
                                            justifyContent: 'center'
                                        }}
                                    />
                                    <ListItemText
                                        id={labelId}
                                        primary={`${convertirFormatoFecha(tarea.due_date)}`}
                                        sx={{
                                            '& .MuiListItemText-primary': {
                                                fontSize: '110%',
                                            },
                                            width: '33%',
                                            display: 'flex',
                                            justifyContent: 'center'
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </>
        )
    }

    const renderPage = () => {
        if (esqueleto) {
            return (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem', justifyContent: 'center', height: height - 170 }}>
                    <SkeletonTareas />
                    <SkeletonTareas />
                </div>
            )
        } else if (vacio) {
            return (
                <div className='ct-vacio'>
                    <h2 className='ct-h1'>Tareas pendientes</h2>
                    <h3>No hay tareas pendientes</h3>
                </div>
            )
        } else {
            return (
                <>
                    {tareas.length > 0 && renderPendientes()}
                    {tareas.length === 0 &&
                        <>
                            <h2 className='ct-h1'>Tareas pendientes</h2>
                            <h3>No hay tareas pendientes</h3>
                        </>
                    }
                    {completas.length > 0 && renderCompletas()}
                    {vencidas.length > 0 && renderVencidas()}
                </>
            )
        }
    }

    return (
        <>
            {loading && <CirculoEspera />}
            <div className='ct-body'>
                <div className="ct-tabla">
                    {renderPage()}
                </div>
            </div>
        </>
    );
}
