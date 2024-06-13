import { Box, Skeleton } from "@mui/material"

export const SkeletonTareas = () => {
    return (
        <>
            <Box sx={{ display: 'flex', gap: '1rem', width: '100%' }}>
                <Box sx={{ display: 'flex', gap: '.5rem', flexDirection: 'column' }}>
                    <Skeleton variant="circular" width={30} height={30} />
                    <Skeleton variant="circular" width={30} height={30} />
                    <Skeleton variant="circular" width={30} height={30} />
                    <Skeleton variant="circular" width={30} height={30} />
                    <Skeleton variant="circular" width={30} height={30} />
                </Box>
                <Box sx={{ width: '100%', display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                    <Skeleton variant="text" sx={{ fontSize: '1.5rem', width: '50%' }} />
                    <Skeleton variant="text" sx={{ fontSize: '1.5rem', width: '50%' }} />
                    <Skeleton variant="text" sx={{ fontSize: '1.5rem', width: '50%' }} />
                    <Skeleton variant="text" sx={{ fontSize: '1.5rem', width: '50%' }} />
                    <Skeleton variant="text" sx={{ fontSize: '1.5rem', width: '50%' }} />
                </Box>
            </Box>
        </>
    )
}
