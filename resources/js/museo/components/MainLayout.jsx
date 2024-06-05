import React from 'react'
import { Header } from './header/Header'
import { Outlet } from 'react-router-dom'

export const MainLayout = () => {
    return (
        <>
            <Header />
            <div style={{display: 'flex', justifyContent: 'center', height: '100vh'}}>
                <Outlet />
            </div>
        </>
    )
}
