import { Navigate } from 'react-router-dom';

function ProtectedRoute({ user, loading, children, redirectTo = '/login' }) {
  // Still resolving Firebase session — render nothing to avoid flash
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return user ? children : <Navigate to={redirectTo} replace />;
}

export default ProtectedRoute;
