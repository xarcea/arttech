import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EventIcon from '@mui/icons-material/Event';
import BookIcon from '@mui/icons-material/Book';
import PhotoCameraBackIcon from '@mui/icons-material/PhotoCameraBack';
import PeopleIcon from '@mui/icons-material/People';
import HomeIcon from '@mui/icons-material/Home';
import { AuthUser } from '../../auth/components';
import { useNavigate } from 'react-router-dom';

export const SideBar = ({ open, toggleDrawer }) => { //TODO: probar que funcionen todos los links
    const { role } = AuthUser();
    const navigate = useNavigate();

    const modificarString = (cadena) => {
        if(role=='empleado' && cadena=='Tareas') return 'tareas-asignadas';
        cadena = cadena.toLowerCase();
        return cadena.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    const iconMap = {
        'Tareas': <AssignmentIcon sx={{ color: '#ffff', fontSize: 30 }} />,
        'Eventos': <EventIcon sx={{ color: '#ffff', fontSize: 30 }} />,
        'Bitácoras': <BookIcon sx={{ color: '#ffff', fontSize: 30 }} />,
        'Items': <PhotoCameraBackIcon sx={{ color: '#ffff', fontSize: 30 }} />,
        'Empleados': <PeopleIcon sx={{ color: '#ffff', fontSize: 30 }} />,
    };

    const lista = () => {
        switch (role) {
            case 'admin':
                return ['Empleados'];
            case 'empleado':
                return ['Tareas', 'Eventos', 'Bitácoras', 'Items'];
            case 'coordinador':
                return ['Tareas', 'Eventos', 'Bitácoras'];
            default:
                return [];
        }
    }

    const menuItems = lista();

    const handleClick = (ruta) => {
        navigate(ruta)
    }

    const DrawerList = (
        <Box sx={{ width: 250, 'backgroundColor': '#b8b6b7', 'height': '100vh' }} role="presentation" onClick={toggleDrawer(false)}>
            <List>
                <Box sx={{ 'display': 'flex', 'gap': '3rem', 'flexDirection': 'column' }}>
                    <Box sx={{ 'display': 'flex', 'justifyContent': 'center', 'marginTop': '3rem' }}>
                        <Box onClick={() => handleClick('/')} sx={{ 'display': 'flex', 'width': 'fit-content', 'cursor': 'pointer' }}>
                            <HomeIcon color="action" sx={{ 'width': '5rem', 'height': '5rem', color: '#ffff' }} />
                        </Box>
                    </Box>
                    <Box>
                        {menuItems.map((text) => (
                            <ListItem key={text} disablePadding>
                                <ListItemButton
                                    onClick={() => handleClick(`/${modificarString(text)}`)}
                                    sx={{
                                        "&:hover": {
                                            backgroundColor: '#b5aa98'
                                        },
                                    }}
                                >
                                    <ListItemIcon>
                                        {iconMap[text]}
                                    </ListItemIcon>
                                    <ListItemText primaryTypographyProps={{ variant: 'h6' }} sx={{ 'color': '#ffff' }} primary={text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </Box>
                </Box>
            </List>
        </Box>
    );

    return (
        <div>
            <Drawer open={open} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer>
        </div>
    );
}
