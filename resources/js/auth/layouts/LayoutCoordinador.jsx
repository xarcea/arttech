import { Outlet, useNavigate } from 'react-router-dom'
import { AuthUser } from '../components'
import { useEffect } from 'react'

export const LayoutCoordinador = () => {
    const { getRole } = AuthUser()
    const navigate = useNavigate()

    useEffect(() => {
        if (getRole() !== 'coordinador') {
            navigate('/')
        }
    }, [])
    
    return (
        <Outlet />
    )
}
