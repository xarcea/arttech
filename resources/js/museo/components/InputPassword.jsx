import * as React from 'react';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import { FilledInput, FormHelperText } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';

export const InputPassword = ({ id, value, onChange, helperText, error, label }) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <Box autoComplete="off">
            <div>
                <FormControl sx={{ width: '500px' }} variant="filled" error={error}>
                    <InputLabel color="secondary" htmlFor={id}>{label}</InputLabel>
                    <FilledInput
                        sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                            "&:hover": {
                                backgroundColor: 'rgba(255, 255, 255, 0.4)'
                            },
                            "&:hover:focus-within, &:focus-within": {
                                backgroundColor: 'rgba(255, 255, 255, 0.5)'
                            },
                        }}
                        id={id}
                        value={value}
                        onChange={onChange}
                        type={showPassword ? 'text' : 'password'}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                        color="secondary"
                    />
                    <FormHelperText error>{helperText}</FormHelperText>
                </FormControl>
            </div>
        </Box>
    );
}