import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    const location = useLocation();

    console.log(`Rendering protected route with user: ${user}`)
    if (!user) {
        return <Navigate to="/login?error=no_user" state={{ from: location }} replace />;
    }

    return children;
};