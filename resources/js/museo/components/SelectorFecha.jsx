import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

const theme = createTheme(
    {
        palette: {
            primary: { main: '#9c27b0' },
        },
    }
);

export const SelectorFecha = ({ label, valor, manejarFecha }) => {
    const [value, setValue] = React.useState(valor ? dayjs(valor) : null);

    const handleChange = (newValue) => {
        setValue(newValue);
        manejarFecha(newValue);
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <ThemeProvider theme={theme}>
                <DatePicker
                    label={label}
                    value={value}
                    onChange={handleChange}
                    sx={{
                        width: '300px',
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        "&:hover": {
                            backgroundColor: 'rgba(255, 255, 255, 0.4)'
                        },
                        "&:hover:focus-within, &:focus-within": {
                            backgroundColor: 'rgba(255, 255, 255, 0.5)'
                        },
                        borderRadius: '5px'
                    }}
                />
            </ThemeProvider>
        </LocalizationProvider>
    );
}