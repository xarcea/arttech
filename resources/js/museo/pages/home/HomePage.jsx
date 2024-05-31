import { useState } from 'react'
import { MainLayout } from '../../components'
import './home.css'

export const HomePage = () => {
    const [empleado, setEmpleado] = useState({ puesto: 'Puesto', nombre: 'Nombre', id: 'ID', correo: 'Correo' });

    return (
        <MainLayout>
            <div className='hp-componente'>
                <div className="h1">
                    <h1>{empleado.puesto}</h1>
                </div>
                <div className="datos-usuario">
                    <img className='img-datos-usuario' src='/assets/imgs/account_circle.svg' />
                    <div className="datos-usuario-texto">
                        <h2>{empleado.nombre}</h2>
                        <h2>{empleado.id}</h2>
                        <h2>{empleado.correo}</h2>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}
