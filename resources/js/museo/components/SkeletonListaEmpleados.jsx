import { Box, Skeleton, Typography } from "@mui/material"

export const SkeletonListaEmpleados = () => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Typography component="div" key='h2' variant='h2' sx={{display: 'flex', gap: '1rem'}}>
                <Skeleton sx={{flex:'1'}} />
                <Skeleton sx={{flex:'1'}} />
                <Skeleton sx={{flex:'1'}} />
                <Skeleton sx={{flex:'1'}} />
                <Skeleton sx={{flex:'1'}} />
                <Skeleton sx={{flex:'1'}} />
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Skeleton />
                <Skeleton />
                <Skeleton />
                <Skeleton />
                <Skeleton />
                <Skeleton />
            </Box>
        </Box>
    )
}
