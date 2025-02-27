import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Sidebar from "@/components/Sidebar.jsx";
import Navbar from "@/components/Navbar.jsx";
import {renderSkeleton} from "@/components/ServersList";

export const ProtectedRoute = ({ children, resource, requireSubscription = false }) => {
    const { user, getUser } = useAuth();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);
    const [authError, setAuthError] = useState(false);
    const [success, setSuccess] = useState(false)
    const [sessionId, setSessionId] = useState(null)
    const [canceled, setCanceled] = useState(false)
    const [progress, setProgress] = useState(0);
    const [processingComplete, setProcessingComplete] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await getUser(resource);
                setIsLoading(false);
            } catch (error) {
                console.error("Authentication failed:", error);
                setAuthError(true);
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        if (query.get('success')) {
            setSuccess(true);
            setSessionId(query.get('session_id'));
        }

        if(query.get("canceled")) {
            setCanceled(true)
        }
    }, [])

    // Progress bar timer effect for when success and sessionId are present
    useEffect(() => {
        if (success && sessionId && !processingComplete) {
            const totalTime = 15000;
            const interval = 100;
            const steps = totalTime / interval;
            const increment = 100 / steps;

            let currentProgress = 0;
            const timer = setInterval(() => {
                currentProgress += increment;
                setProgress(Math.min(currentProgress, 100));

                // When we reach 100%, mark processing as complete
                if (currentProgress >= 100) {
                    setProcessingComplete(true);
                    clearInterval(timer);
                }
            }, interval);

            return () => clearInterval(timer);
        }
    }, [success, sessionId, processingComplete]);


    // Show loading screen or progress bar when needed
    // TODO I don't love this since if 500 users all buy subscriptions at the exact same time 1500 messages are queued
    // each one taking 5 seconds to process. This means users may not get to use their subscription for possibly hours
    // depending on how many purchase at the same time. But for now it holds the user in place while their queued stripe
    // messages process and their account is updated to active
    if (isLoading || (success && sessionId && !processingComplete)) {
        return (
            <div className="flex h-screen">
                <Sidebar skeleton />
                <div className="flex-1 min-w-24">
                    <Navbar skeleton />
                    {success && sessionId ? (
                        <div className="flex flex-col items-center justify-center h-full px-6">
                            <h2 className="text-xl font-semibold mb-4">Processing your purchase...</h2>
                            <div className="w-full max-w-md bg-gray-200 rounded-full h-2.5 mb-6">
                                <div
                                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            <p className="text-gray-600">Please wait while we finalize your account setup.</p>
                        </div>
                    ) : (
                        renderSkeleton()
                    )}
                </div>
            </div>
        );
    }

    // The user is not logged in at all redirect to the login page
    if (authError || !user) {
        return (
            <Navigate
                to="/login"
                state={{ from: location }}
                replace
            />
        );
    }

    // The user is logged in but is trying to access a page that requires a stripe subscription and their
    // sub isn't active.
    if (requireSubscription && (!user.subscriptionStatus || user.subscriptionStatus !== 'active')) {
            return (
                <Navigate
                    to="/pricing"
                    state={{ from: location }}
                    replace
                />
            );
    }

    // The user is logged in with an active sub but is trying to access a page that doesn't require a sub.
    // i.e. why would a user want to look at /pricing when they have an active subscription.
    if (!requireSubscription && user.subscriptionStatus === 'active') {
        return (
            <Navigate to="/dashboard" state={{from: location }} replace />
        )
    }

    return children;
};