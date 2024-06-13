import { Outlet, useNavigate } from 'react-router-dom'
import { AuthUser } from '../components'
import { useEffect, useState } from 'react'
import { CirculoEspera } from '../../museo/components';

export const LayoutAdmin = () => {
    const [loading, setLoading] = useState(true);

    const { getRole } = AuthUser()
    const navigate = useNavigate();

    useEffect(() => {
        if (getRole() !== 'admin') {
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
