import { AlertDialog, InputComponent, InputPassword } from '../../../museo/components';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthUser } from '../../components';

import './login.css';

export const Login = () => {
    const { setToken, getToken } = AuthUser();
    const [email, setEmail] = useState('');
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        if (getToken()) {
            navigate('/')
        }
    }, []);

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

    const validateCredentials = () => {
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
        return emailIsValid && passwordIsValid;
    }

    const handleOpenDialog = (message) => {
        setErrorMessage(message);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const credentialsAreValid = validateCredentials();
        if (credentialsAreValid) {
            await fetch('/sanctum/csrf-cookie', {
                method: 'GET',
                credentials: 'include'
            });

            const api_url = 'http://localhost:8000/api';
            const data = { email, password };

            await fetch(`${api_url}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
                credentials: 'include'
            }).then(async (response) => {
                await response.json().then((data) => {
                    console.log(data)
                    if (data.success) {
                        setToken(data.user, data.token, data.role[0]);
                        navigate('/');
                    } else {
                        handleOpenDialog('El correo o la contraseña son incorrectos. Inténtalo de nuevo.');
                    }
                })
                    .catch(() => {
                        handleOpenDialog('Error al intentar iniciar sesión. Inténtalo de nuevo más tarde.');
                    });
            }).catch(() => {
                handleOpenDialog('Error al intentar iniciar sesión. Inténtalo de nuevo más tarde.');
            });
        }
    }

    return (
        <div className="lg-body">
            <div className='lg-componente'>
                <h1>¡Bienvenido!</h1>
                <h3>Introduce tus datos para iniciar sesión</h3>
                <img className='img-datos-usuario' src='/storage/assets/imgs/account_circle_white.svg' />
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
            <AlertDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                titulo="Error"
                mensaje={errorMessage}
                error={true}
            />
        </div>
    )
}
