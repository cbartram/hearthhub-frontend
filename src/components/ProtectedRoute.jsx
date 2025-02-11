import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Sidebar from "@/components/Sidebar.jsx";
import Navbar from "@/components/Navbar.jsx";
import {renderSkeleton} from "@/components/ServersList";

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
        return (
            <div className="flex h-screen">
                <Sidebar skeleton />
                <div className="flex-1 min-w-24">
                    <Navbar skeleton />
                    {renderSkeleton()}
                </div>
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