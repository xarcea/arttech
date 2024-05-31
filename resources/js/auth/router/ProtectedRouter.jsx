import { Outlet, Navigate } from "react-router-dom"
import { AuthUser } from "../components"

export const ProtectedRouter = () => {
    const { getToken } = AuthUser()
    if (!getToken()) {
        return <Navigate to="/login" />
    }
    return (
        <Outlet />
    )
}