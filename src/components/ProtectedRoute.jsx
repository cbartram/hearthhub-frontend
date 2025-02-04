import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from "lucide-react";

export const ProtectedRoute = ({ children }) => {
    const { user, getUser } = useAuth();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);
    const [authError, setAuthError] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await getUser();
                setIsLoading(false);
            } catch (error) {
                console.error("Authentication failed:", error);
                setAuthError(true);
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (isLoading) {
        // TODO Change this to a skeleton loading page
        return (
            <div className="h-screen w-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (authError || !user) {
        return (
            <Navigate
                to="/login"
                state={{ from: location }}
                replace
            />
        );
    }

    return children;
};