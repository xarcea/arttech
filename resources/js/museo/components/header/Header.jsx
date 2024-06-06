import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { useNavigate } from 'react-router-dom';
import { AuthUser } from '../../../auth/components';
import { Typography } from '@mui/material';
import { ImageAvatars } from '../ImageAvatars';
import { SideBar } from '../SideBar';
import { CirculoEspera } from '../CirculoEspera';

import './header.css';

export const Header = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const { getToken, getLogout, user } = AuthUser();
    const navigate = useNavigate();

    const logoutUser = async () => {
        if (getToken()) {
            try {
                setLoading(true);
                const api_url = 'http://localhost:8000/api';
                const response = await axios.post(`${api_url}/logout`, {}, {
                    headers: {
                        'Authorization': `Bearer ${getToken()}`
                    }
                });

                if (response.data.success) {
                    setLoading(false);
                    getLogout();
                } else {
                    setLoading(false);
                    console.log(response.data.message);
                }
            } catch (error) {
                setLoading(false);
                console.error('Error during logout:', error);
            }
        } else {
            console.log('No hay token');
        }
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logoutUser();
    }

    const handleProfile = () => {
        navigate('/');
    }

    const toggleDrawer = (newOpen) => () => {
        setDrawerOpen(newOpen);
    };

    return (
        <>
            {loading && <CirculoEspera />}
            <SideBar open={drawerOpen} toggleDrawer={toggleDrawer} />
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" sx={{ position: 'fixed' }}>
                    <Toolbar sx={{
                        backgroundColor: '#79553d',
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                            onClick={toggleDrawer(true)}
                        >
                            <MenuIcon fontSize="large" />
                        </IconButton>
                        {(
                            <div className='perfil'>
                                <div className="header-datos-usuario">
                                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                        {user.name}
                                    </Typography>
                                    <Typography variant="h12" component="div" sx={{ flexGrow: 1 }}>
                                        {user.role}
                                    </Typography>
                                </div>
                                <IconButton
                                    aria-label="account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={handleMenu}
                                    color="inherit"
                                    sx={{ width: '4.5rem', height: '4.5rem' }}
                                >
                                    <ImageAvatars
                                        name={user.name}
                                        avatar={user.avatar}
                                        size='3.5rem'
                                    />
                                </IconButton>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                >
                                    <MenuItem onClick={handleProfile}>Mi cuenta</MenuItem>
                                    <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
                                </Menu>
                            </div>
                        )}
                    </Toolbar>
                </AppBar>
            </Box >
        </>
    );
}