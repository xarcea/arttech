import { Outlet, useNavigate } from 'react-router-dom'
import { AuthUser } from '../components'
import { useEffect, useState } from 'react'
import { CirculoEspera } from '../../museo/components';

export const LayoutEmpleado = () => {
    const [loading, setLoading] = useState(true);

    const { getRole } = AuthUser()
    const navigate = useNavigate()

    useEffect(() => {
        if (getRole() !== 'empleado') {
            navigate('/')
        } else {
            setLoading(false)
        }
    }, [])
    
    return (
        <>
            {loading ? <CirculoEspera /> : <Outlet />}
        </>
    )
}
