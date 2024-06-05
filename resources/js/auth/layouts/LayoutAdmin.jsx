import { Outlet, useNavigate } from 'react-router-dom'
import { AuthUser } from '../components'
import { useEffect } from 'react'

export const LayoutAdmin = () => {
    const { getRole } = AuthUser()
    const navigate = useNavigate();

    useEffect(() => {
        if (getRole() !== 'admin') {
            navigate('/')
        }
    }, [])
    
    return (
        <Outlet />
    )
}
