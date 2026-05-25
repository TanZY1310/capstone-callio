import { Navigate } from "react-router-dom";

function ProtectedRoute({ isAuthenticated, children }) {
    console.log(isAuthenticated)
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return children;
}

export default ProtectedRoute;