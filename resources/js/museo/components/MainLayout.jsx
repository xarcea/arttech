import React from 'react'
import { Header } from './Header'

export const MainLayout = ({children}) => {
    return (
        <>
            <Header />
            <div style={{display: 'flex', justifyContent: 'center', height: '100vh'}}>
                {children}
            </div>
        </>
    )
}
