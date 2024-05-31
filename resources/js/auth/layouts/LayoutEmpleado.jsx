import { Outlet, Navigate } from 'react-router-dom'
import { AuthUser } from '../components'
import { useEffect } from 'react'

export const LayoutEmpleado = () => {
    const { getRole } = AuthUser()

    useEffect(() => {
        if (getRole !== 'empleado') {
            return <Navigate to="/" />
        }
    }, [])
    
    return (
        <Outlet />
    )
}
