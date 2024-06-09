import * as React from 'react';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import { FilledInput, FormHelperText } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

export const InputComponent = ({ id, label, helperText, error, onChange, value, icon, complete }) => {
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
                        color="secondary"
                        id={id}
                        onChange={onChange}
                        value={value}
                        inputProps={{ autoComplete: complete ? 'on' : 'off' }}
                        endAdornment={icon ? <InputAdornment position="end"><AlternateEmailIcon /></InputAdornment> : null}
                    />
                    <FormHelperText error>{helperText}</FormHelperText>
                </FormControl>
            </div>
        </Box>
    );
}