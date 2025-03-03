import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Sidebar from "@/components/Sidebar.jsx";
import Navbar from "@/components/Navbar.jsx";
import SkeletonLoading from "@/components/SkeletonLoading.jsx";

const ROUTE_RULES = {
    // exemptWithSubscription will redirect users with active subs away
    '/dashboard': { requireAuth: true, requireSubscription: true },
    '/pricing': { requireAuth: true, requireSubscription: false, exemptWithSubscription: true },
    '/profile': { requireAuth: true, requireSubscription: false, exemptWithSubscription: false },
    '/login': {requireAuth: false, requireSubscription: false}
};

const DEFAULT_RULE = { requireAuth: true, requireSubscription: false };

export const ProtectedRoute = ({ children, resource }) => {
    const { user, getUser } = useAuth();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);
    const [authError, setAuthError] = useState(false);
    const [paymentState, setPaymentState] = useState({
        success: false,
        sessionId: null,
        canceled: false,
        progress: 0,
        processingComplete: false
    });

    const getRouteRules = (path) => {
        if (ROUTE_RULES[path]) {
            return ROUTE_RULES[path];
        }

        const matchingRule = Object.entries(ROUTE_RULES).find(([routePath]) => {
            return path.startsWith(routePath) && path !== routePath;
        });

        return matchingRule ? matchingRule[1] : DEFAULT_RULE;
    };

    const currentRouteRules = getRouteRules(location.pathname);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await getUser(resource);
                setIsLoading(false);
            } catch (error) {
                console.error("user authentication failed:", error);
                setAuthError(true);
                setIsLoading(false);
            }
        }

        checkAuth();
    }, [paymentState.processingComplete]);

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        if (query.get('success')) {
            setPaymentState(prev => ({
                ...prev,
                success: true,
                sessionId: query.get('session_id')
            }));
        }

        if (query.get("canceled")) {
            setPaymentState(prev => ({
                ...prev,
                canceled: true
            }));
        }
    }, []);

    useEffect(() => {
        if (paymentState.success && paymentState.sessionId && !paymentState.processingComplete) {
            const totalTime = 15000;
            const interval = 100;
            const steps = totalTime / interval;
            const increment = 100 / steps;

            let currentProgress = 0;
            const timer = setInterval(() => {
                currentProgress += increment;
                setPaymentState(prev => ({
                    ...prev,
                    progress: Math.min(currentProgress, 100)
                }));

                if (currentProgress >= 100) {
                    setPaymentState(prev => ({
                        ...prev,
                        processingComplete: true
                    }));
                    clearInterval(timer);
                    window.location.href = '/dashboard'
                }
            }, interval);

            return () => clearInterval(timer);
        }
    }, [paymentState.success, paymentState.sessionId, paymentState.processingComplete]);

    // Loading or processing payment
    if (isLoading || (paymentState.success && paymentState.sessionId && !paymentState.processingComplete)) {
        return renderLoadingState(paymentState);
    }

    // Authentication check
    if (currentRouteRules.requireAuth && (authError || !user)) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Subscription check
    const hasActiveSubscription = user?.subscriptionStatus === 'active';

    // Redirect to pricing if subscription required but not active
    if (currentRouteRules.requireSubscription && !hasActiveSubscription) {
        return <Navigate to="/pricing" state={{ from: location }} replace />;
    }

    // Redirect subscribed users away from non-subscription pages (except exempted ones)
    if (currentRouteRules.exemptWithSubscription && hasActiveSubscription) {
        return <Navigate to="/dashboard" state={{ from: location }} replace />;
    }

    return children;
};

const renderLoadingState = (paymentState) => {
    if (paymentState.success && paymentState.sessionId) {
        return (
            <div className="flex h-screen">
                <Sidebar skeleton />
                <div className="flex-1 min-w-24">
                    <Navbar skeleton />
                    <div className="flex flex-col items-center justify-center h-full px-6">
                        <h2 className="text-xl font-semibold mb-4">Processing your purchase...</h2>
                        <div className="w-full max-w-md bg-gray-200 rounded-full h-2.5 mb-6">
                            <div
                                className="bg-orange-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                                style={{ width: `${paymentState.progress}%` }}
                            ></div>
                        </div>
                        <p className="text-gray-600">Please wait while we finalize your account setup.</p>
                    </div>
                </div>
            </div>
        )
    }

    return <SkeletonLoading />
};