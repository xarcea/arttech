import { InputComponent, InputPassword } from '../../../museo/components';
import Button from '@mui/material/Button';
import { useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

import './login.css';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false);

    const handleEmailChange = (event) => {
        setEmailErrorMessage('');
        setEmailError(false);
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        setPasswordError(false);
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        let emailIsValid = true;
        let passwordIsValid = true;
        if (email === '') {
            setEmailErrorMessage('Este campo es obligatorio');
            setEmailError(true);
            emailIsValid = false;
        } else if (!validateEmail(email)) {
            setEmailErrorMessage('Correo electrónico no válido');
            setEmailError(true);
            emailIsValid = false;
        }
        if (password === '') {
            setPasswordError(true);
            passwordIsValid = false;
        }

        if (emailIsValid && passwordIsValid) {
            const api_url = 'http://localhost:8000/api';
            const data = { email, password };
            axios.post(`${api_url}/login`, data)
                .then((response) => {
                    if (response.data.success) {
                        console.log(response.data);
                        // TODO: Implementar la lógica para success
                    } else {
                        // TODO: Mostrar un mensaje de error al usuario
                    }
                })
                .catch((error) => { //TODO: Manejar errores de solicitud al servidor
                    // Manejar errores de solicitud al servidor
                    // Mostrar un mensaje de error al usuario
                });
        }
    }

    return (
        <div className="body">
            <div className='lg-componente'>
                <h1>¡Bienvenido!</h1>
                <h3>Introduce tus datos para iniciar sesión</h3>
                <img className='img-datos-usuario' src='/assets/imgs/account_circle_white.svg' />
                <form className="form" onSubmit={handleSubmit}>
                    <InputComponent
                        id='filled-email-input'
                        label={emailError ? 'Error' : 'Correo electrónico'}
                        value={email}
                        onChange={handleEmailChange}
                        helperText={emailErrorMessage}
                        error={emailError}
                    />
                    <InputPassword
                        id='filled-password-input'
                        onChange={handlePasswordChange}
                        value={password}
                        error={passwordError}
                        label={passwordError ? 'Error' : 'Contraseña'}
                        helperText={passwordError ? 'Este campo es obligatorio' : ''}
                    />
                    <div className="form-boton">
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
                        >Ingresar</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
