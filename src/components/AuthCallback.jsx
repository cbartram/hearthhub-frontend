import React, { useEffect, useState } from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import Logo from "@/assets/hearthhub_logo.png";
import {K8S_BASE_URL} from "@/lib/constants";
import {useAuth} from "@/context/AuthContext"
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import {Button} from "@/components/ui/button";


const SpinnerRing = () => {
    return (
        <div className="absolute inset-0 w-full h-full">
            <svg className="absolute inset-0" viewBox="0 0 100 100">
                <circle
                    cx="50"
                    cy="50"
                    fill="none"
                    stroke="#e0e0e0"
                    strokeWidth="4"
                    r="38"
                    strokeDasharray="180 180"
                />
                <circle
                    cx="50"
                    cy="50"
                    fill="none"
                    stroke="#F18121"
                    strokeWidth="4"
                    r="38"
                    strokeDasharray="180 180"
                    strokeDashoffset="60"
                    className="animate-spin-slow origin-center"
                    style={{
                        transformOrigin: "center",
                        animation: "spin 1.5s linear infinite"
                    }}
                />
            </svg>
        </div>
    );
};

const AuthCallback = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState(null);
    const location = useLocation();


    useEffect(() => {
        const handleCallback = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');

            const errorParam = urlParams.get('error');
            const errorDescription = urlParams.get('error_description');

            if (errorParam) {
                setError({
                    type: errorParam,
                    description: errorDescription ? errorDescription.replace(/\+/g, ' ') : 'Authentication failed'
                });
                return
            }

            if (code) {
                try {
                    const response = await fetch(`${K8S_BASE_URL}/api/v1/discord/oauth`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ code }),
                    });

                    if(response.status === 200) {
                        const data = await response.json()
                        // We have retrieved the tokens from Discord meaning the user has been authenticated
                        // but we still need to get user details from Discord via login(). Login() will also
                        // create the user in Cognito if they do not already exist.
                        if(await login(data.access_token)) {
                            navigate('/dashboard');
                        }
                    } else {
                        console.log(`Unexpected response code received: ${response.status}`)
                        navigate('/login?error=auth_failed');
                    }
                } catch (error) {
                    console.error('Authentication error:', error);
                    navigate('/login?error=auth_failed');
                }
            }
        };

        handleCallback().catch(err => {
            console.log(`Error: ${err}`)
        })
    }, [navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-slate-50 to-white p-4">
            {
                error &&
                <div className="w-full max-w-md">
                    <Alert variant="destructive" className="mb-6 border-red-600">
                        <AlertCircle className="h-5 w-5" />
                        <AlertTitle className="font-semibold">Authentication Error: {error.type}</AlertTitle>
                        <AlertDescription className="mt-2">
                            {error.description}
                        </AlertDescription>
                        <div className="mt-4">
                            <Button
                                onClick={() => window.location.href = '/login'}
                            >
                                Return to login
                            </Button>
                        </div>
                    </Alert>
                </div>
            }
            <div className="mb-12 md:mb-16 relative">
                <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-2xl flex items-center justify-center bg-white shadow-lg">
                    <img src={Logo} alt="Hearthhub Logo" className="w-24 h-24 md:w-36 md:h-36 object-contain" />
                    <SpinnerRing />
                </div>
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-slate-800">Completing authentication...</h3>
            <p className="mt-2 text-slate-500 text-sm md:text-base">Please wait while we set up your account</p>
        </div>
    );
};

export default AuthCallback;