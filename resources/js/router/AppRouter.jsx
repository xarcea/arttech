import React from 'react'
import { Routes, Route, Navigate, BrowserRouter as Router } from 'react-router-dom'
import { HomePage } from '../museo/pages'
import { Login } from '../auth/pages'
import { ProtectedRouter } from '../auth/router'
import { LayoutAdmin, LayoutCoordinador, LayoutEmpleado } from '../auth/layouts'

export const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route element={<ProtectedRouter />} >
                    <Route path="/home" element={<HomePage />} />
                    <Route element={<LayoutAdmin />} >

                    </Route>
                    <Route element={<LayoutCoordinador />} >

                    </Route>
                    <Route element={<LayoutEmpleado />} >

                    </Route>
                </Route>
                <Route path="/login" element={<Login />} />
                <Route path="/*" element={<Navigate to="/home" />} />
            </Routes>
        </Router>
    )
}