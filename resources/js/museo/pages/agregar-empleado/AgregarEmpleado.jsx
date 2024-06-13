import { useState } from "react";
import { AlertDialog, CirculoEspera, InputComponent } from '../../../museo/components';
import { Box, Button } from "@mui/material";
import { AuthUser } from "../../../auth/components";

import './agregar-empleado.css'

export const AgregarEmpleado = () => {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [id, setId] = useState('');
    const [puesto, setPuesto] = useState('');
    const [birthday, setBirthday] = useState('DD/MM/YYYY');
    const [telefono, setTelefono] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [dateError, setDateError] = useState(false);

    const { getToken } = AuthUser();

    const handleNombreChange = (event) => {
        setNombre(event.target.value);
    }

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }

    const handleIdChange = (event) => {
        setId(event.target.value);
    }

    const handlePuestoChange = (event) => {
        setPuesto(event.target.value);
    }

    const handleBirthdayChange = (event) => {
        setDateError(false);
        setBirthday(event.target.value);
    }

    const handleTelefonoChange = (event) => {
        setTelefono(event.target.value);
    }

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
        if (nombre === '' || email === '' || password === '' || id === '' || puesto === '' || birthday === '' || telefono === '') {
            alert('Todos los campos son obligatorios')
            return
        }
        const fecha = convertirFechaParaMySQL(birthday);
        if (fecha === null) {
            setDateError(true);
            return;
        }
        const rolApp = getRole(puesto)
        const user = {
            name: nombre,
            email: email,
            password: password,
            employee_id: id,
            role: puesto,
            rol: rolApp,
            birthday: fecha,
            phone_number: telefono
        }
        setLoading(true);
        const api_url = 'http://localhost:8000/api';
        await fetch(`${api_url}/empleados`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(user),
            credentials: 'include'
        }).then(async (response) => {
            await response.json().then((data) => {
                if (data.success) {
                    setLoading(false);
                    setError(false);
                    handleOpenDialog('Usuario creado correctamente');
                } else {
                    setLoading(false);
                    setError(true);
                    handleOpenDialog('Verifica los datos ingresados e intenta nuevamente');
                }
            })
                .catch(() => {
                    setLoading(false);
                    setError(true);
                    handleOpenDialog('No se pudo crear el usuario, intenta nuevamente');
                });
        }).catch(() => {
            setLoading(false);
            setError(true);
            handleOpenDialog('Error interno del servidor, intenta nuevamente');
        });
    }

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const handleOpenDialog = (message) => {
        setMensaje(message);
        setDialogOpen(true);
    };

    function convertirFechaParaMySQL(fechaString) {
        const regex = /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[0-2])\/(19|20)\d\d$/;

        // Comprueba si el string cumple con la expresión regular
        if (!regex.test(fechaString)) {
            return null;
        }

        const [day, month, year] = fechaString.split('/').map(Number);

        // Comprobación adicional para días válidos según el mes y el año (incluyendo años bisiestos)
        const fechaObj = new Date(year, month - 1, day);
        const valida = fechaObj.getDate() === day && fechaObj.getMonth() === month - 1 && fechaObj.getFullYear() === year;
        if (!valida) {
            return null;
        }
        // Separar el string en día, mes y año
        const partesFecha = fechaString.split('/');
        const dia = partesFecha[0];
        const mes = partesFecha[1];
        const año = partesFecha[2];

        // Formatear la fecha para MySQL (teniendo en cuenta que MySQL requiere YYYY-MM-DD)
        const fechaFormateada = `${año}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;

        return fechaFormateada;
    }

    return (
        <>
            {loading && <CirculoEspera />}
            <Box sx={{ p: 3, padding: '1rem 5rem 1rem 5rem' }}>
                <div className="ae-body">
                    <div className='ae-componente'>
                        <h1>Nuevo registro</h1>
                        <form className="form" onSubmit={handleSubmit}>
                            <InputComponent
                                id='filled-email-input'
                                label='Nombre'
                                value={nombre}
                                onChange={handleNombreChange}
                                icon={false}
                                complete={false}
                            />
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
                                label='Contraseña'
                                value={password}
                                onChange={handlePasswordChange}
                                icon={false}
                                complete={false}
                            />
                            <InputComponent
                                id='filled-email-input'
                                label='ID de empleado'
                                value={id}
                                onChange={handleIdChange}
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
                            <InputComponent
                                id='filled-email-input'
                                label={dateError ? 'Error' : 'Fecha de nacimiento'}
                                value={birthday}
                                onChange={handleBirthdayChange}
                                icon={false}
                                complete={false}
                                helperText={dateError ? 'Ingresa una fecha válida' : ''}
                                error={dateError}
                            />
                            <InputComponent
                                id='filled-email-input'
                                label='Teléfono'
                                value={telefono}
                                onChange={handleTelefonoChange}
                                icon={false}
                                complete={false}
                            />
                            <div className="ae-form-boton">
                                <Button
                                    type="submit"
                                    className='ae-boton-enviar'
                                    variant="contained"
                                    sx={{
                                        backgroundColor: 'rgb(38, 39, 31, 0.7)',
                                        "&:hover": {
                                            backgroundColor: '#26271f'
                                        },
                                    }}
                                >Guardar registro</Button>
                            </div>
                        </form>
                    </div>
                    <AlertDialog
                        open={dialogOpen}
                        onClose={handleCloseDialog}
                        titulo={error ? "Error" : "Éxito"}
                        mensaje={mensaje}
                        error={error}
                    />
                </div>
            </Box>
        </>
    )
}
