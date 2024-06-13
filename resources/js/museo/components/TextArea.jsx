import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';

const StyledTextField = styled(TextField)({
    '& .MuiInputBase-root': {
        overflow: 'hidden',
        '& textarea': {
            resize: 'none',
            height: 'auto',
            lineHeight: '1.5em',
        },
    },
});

export const TextArea = ({ label, manejarTexto }) => {
    const [value, setValue] = React.useState('');

    const handleChange = (event) => {
        const texto = event.target.value;
        setValue(texto);
        manejarTexto(texto);
    };

    return (
        <Box
            sx={{
                '& .MuiTextField-root': { m: 1, width: '300px' },
            }}
            noValidate
            autoComplete="off"
        >
            <div>
                <StyledTextField
                    color='secondary'
                    id="filled-multiline-static"
                    label={label}
                    multiline
                    value={value}
                    onChange={handleChange}
                    variant="filled"
                    inputProps={{
                        style: {
                            lineHeight: '1.5em',
                        },
                    }}
                    sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        "&:hover": {
                            backgroundColor: 'rgba(255, 255, 255, 0.4)'
                        },
                        "&:hover:focus-within, &:focus-within": {
                            backgroundColor: 'rgba(255, 255, 255, 0.5)'
                        },
                    }}
                />
            </div>
        </Box>
    );
}
