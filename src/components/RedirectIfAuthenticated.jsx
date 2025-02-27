import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Sidebar from "@/components/Sidebar.jsx";
import Navbar from "@/components/Navbar.jsx";
import {renderSkeleton} from "@/components/ServersList";

export const RedirectIfAuthenticated = ({ children, resource }) => {
    const { user, getUser } = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await getUser(resource);
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
            <div className="flex h-screen">
                <Sidebar skeleton />
                <div className="flex-1 min-w-24">
                    <Navbar skeleton />
                    {renderSkeleton()}
                </div>
            </div>
        );
    }

    if (user && user.subscriptionStatus === "active") {
        return <Navigate to="/dashboard" replace />;
    }

    if (user && user.subscriptionStatus !== "active") {
        console.log(`user exists with sub status: ${user.subscriptionStatus} redirecting to /pricing`)
        return <Navigate to="/pricing" replace />;
    }

    return children;
};