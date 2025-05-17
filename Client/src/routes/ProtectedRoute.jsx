import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";


const ProtectedRoute = () =>{
    const { token } = useSelector((state)=> state.auth);
    return token ? <Outlet /> : <Navigate to={"/login"} replace />
}

export default ProtectedRoute;