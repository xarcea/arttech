import React from 'react'
import { Routes, Route, Navigate, BrowserRouter as Router } from 'react-router-dom'
import { AsignarTarea, Empleados, HomePage, Items, UpdatePassword, Tareas, ChecklistTareas } from '../museo/pages'
import { Login } from '../auth/pages'
import { ProtectedRouter } from '../auth/router'
import { LayoutAdmin, LayoutCoordinador, LayoutEmpleado } from '../auth/layouts'
import { MainLayout } from '../museo/components'

export const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route element={<ProtectedRouter />} >
                    <Route element={<MainLayout />}>
                        <Route path="/home" element={<HomePage />} />
                        <Route path="/update-password" element={<UpdatePassword />} />
                        <Route element={<LayoutAdmin />} >
                            <Route path="/empleados" element={<Empleados />} />
                        </Route>
                        <Route element={<LayoutCoordinador />} >
                            <Route path="/tareas" element={<Tareas />} />
                            <Route path="/asignar-tarea" element={<AsignarTarea />} />
                        </Route>
                        <Route element={<LayoutEmpleado />} >
                            <Route path="/tareas-asignadas" element={<ChecklistTareas />} />
                        </Route>
                    </Route>
                </Route>
                <Route path="/login" element={<Login />} />
                <Route path="/*" element={<Navigate to="/home" />} />
            </Routes>
        </Router>
    )
}