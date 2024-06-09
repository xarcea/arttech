import * as React from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { ListaEmpleados, AgregarEmpleado } from '../';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box>
                    {children}
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

export const Empleados = () => {
    const theme = useTheme();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };

    return (
        <Box sx={{ width: '100%', marginTop: '102px' }}>
            <AppBar position="static" sx={{ backgroundColor: '#b8b6b7', boxShadow: 'none' }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="none"
                    textColor="inherit"
                    aria-label="full width tabs example"
                    sx={{
                        paddingLeft: '8rem'
                    }}
                >
                    <Tab sx={{
                        minWidth: 'fit-content',
                        padding: '0 2rem 0 2rem',
                        backgroundColor: value === 0 ? '#b5aa98' : 'transparent',
                    }}
                        label="Lista de empleados" {...a11yProps(0)} />
                    <Tab sx={{
                        minWidth: 'fit-content',
                        padding: '0 2rem 0 2rem',
                        backgroundColor: value === 1 ? '#b5aa98' : 'transparent',
                    }} label="Agregar empleado" {...a11yProps(1)} />
                </Tabs>
            </AppBar>
            <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={value}
                onChangeIndex={handleChangeIndex}
            >
                <TabPanel value={value} index={0} dir={theme.direction}>
                    <ListaEmpleados />
                </TabPanel>
                <TabPanel value={value} index={1} dir={theme.direction}>
                    <AgregarEmpleado />
                </TabPanel>
            </SwipeableViews>
        </Box>
    );
}
