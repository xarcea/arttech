import { Box, Skeleton } from '@mui/material'
import React from 'react'

export const SkeletonSelect = () => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', padding: '0 1rem 0 1rem' }}>
                <Skeleton />
                <Skeleton />
                <Skeleton />
                <Skeleton />
                <Skeleton />
        </Box>
    )
}
