import { Outlet, Navigate } from 'react-router-dom'
import { AuthUser } from '../components'
import { useEffect } from 'react'

export const LayoutCoordinador = () => {
    const { getRole } = AuthUser()

    useEffect(() => {
        if (getRole !== 'coordinador') {
            return <Navigate to="/" />
        }
    }, [])
    
    return (
        <Outlet />
    )
}
