import { Outlet, Navigate } from 'react-router-dom'
import { AuthUser } from '../components'
import { useEffect } from 'react'

export const LayoutAdmin = () => {
    const { getRole } = AuthUser()

    useEffect(() => {
        if (getRole !== 'admin') {
            return <Navigate to="/" />
        }
    }, [])
    
    return (
        <Outlet />
    )
}
