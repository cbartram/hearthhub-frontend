// @ts-ignore
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from "@/assets/hearthhub_logo.png";
import {BASE_URL} from "@/constants.ts";
// @ts-ignore
import {useAuth} from "@/context/AuthContext"

const AuthCallback = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        const handleCallback = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');

            if (code) {
                try {
                    console.log(`Exchanging OAuth access token with code: ${code}`)
                    const response = await fetch(`${BASE_URL}/prod/api/v1/discord/oauth`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ code }),
                    });

                    if(response.status == 200) {
                        const data = await response.json()
                        console.log(data)
                        localStorage.setItem('accessToken', data.access_token);
                        localStorage.setItem('refreshToken', data.refresh_token);

                        // We have retrieved the tokens from Discord meaning the user has been authenticated
                        // but we still need to get user details from Discord via login()
                        if(await login()) {
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
        <div className="flex items-center justify-center min-h-screen">
            <div className="mb-8">
                <div className="w-48 h-48 rounded-2xl flex items-center justify-center">
                    <img src={Logo} alt="Hearthhub Logo"/>
                </div>
            </div>
            <h3 className="text-lg">Completing authentication...</h3>
        </div>
    );
};

export default AuthCallback;