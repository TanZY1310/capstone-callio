import { Navigate } from "react-router-dom";

function ProtectedRoute({ isAuthenticated, children, redirectTo = "/login" }) {
    console.log(isAuthenticated);
    return isAuthenticated ? children : <Navigate to={redirectTo} />;
}

export default ProtectedRoute;