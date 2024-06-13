import { useState } from "react";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { SkeletonSelect } from "./SkeletonSelect";

const theme = createTheme(
    {
        palette: {
            primary: { main: '#9c27b0' },
        },
    }
);

export const SelectComponent = ({ users, manejarUsuario,  }) => {
    const [user, setUser] = useState('');

    const handleChange = (event) => {
        const selectedUserId = event.target.value;
        setUser(selectedUserId);
        manejarUsuario(selectedUserId);
    };

    return (
        <FormControl variant="filled" color="secondary" sx={{ m: 1, width: '300px' }}>
            <InputLabel id="demo-simple-select-filled-label">Selección</InputLabel>
            <ThemeProvider theme={theme}>
                <Select
                    labelId="demo-simple-select-filled-label"
                    id="demo-simple-select-filled"
                    value={user}
                    onChange={handleChange}
                    sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        "&:hover": {
                            backgroundColor: 'rgba(255, 255, 255, 0.4)'
                        },
                        "&:hover:focus-within, &:focus-within": {
                            backgroundColor: 'rgba(255, 255, 255, 0.5)'
                        }
                    }}
                    MenuProps={{
                        PaperProps: {
                            style: {
                                maxHeight: 150,
                            },
                        },
                    }}
                >
                    {users.length < 1 ? <SkeletonSelect /> : users.map((user) => (
                        <MenuItem key={user.id} value={user.id}>
                            {user.name}
                        </MenuItem>
                    ))}
                </Select>
            </ThemeProvider>
        </FormControl>
    )
}
