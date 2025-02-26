import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from "lucide-react";

export const RedirectIfAuthenticated = ({ children }) => {
    const { user, getUser } = useAuth();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await getUser();
            } catch (error) {
                console.error("Authentication check failed:", error);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [getUser]);

    if (isLoading) {
        return (
            <div className="h-screen w-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    // TODO Check needs to occur here if the user is a subscriber. If so redirect to /dashboard else to /pricing
    if (user && user.subscriber) {
        // Redirect to dashboard, preserving any intended destination from state
        const from = location.state?.from?.pathname || "/dashboard";
        return <Navigate to={from} replace />;
    }

    if (user && !user.subscriber) {
        return <Navigate to="/pricing" replace />;
    }

    return children;
};