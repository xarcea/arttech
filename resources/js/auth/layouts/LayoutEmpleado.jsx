import { Outlet, useNavigate } from 'react-router-dom'
import { AuthUser } from '../components'
import { useEffect } from 'react'

export const LayoutEmpleado = () => {
    const { getRole } = AuthUser()
    const navigate = useNavigate()

    useEffect(() => {
        if (getRole() !== 'empleado') {
            navigate('/')
        }
    }, [])
    
    return (
        <Outlet />
    )
}
