// @ts-ignore
import React, {useEffect, useState} from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Logo from '@/assets/hearthhub_logo.png'
import {AlertCircle, Home} from "lucide-react";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import {discordRedirect} from "@/lib/utils";


const Login = () => {

    const [authFailedAlert, setAuthFailedAlert] = useState("")

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const value = urlParams.get('error');

        if(value === "auth_failed") {
            setAuthFailedAlert("Something went wrong authenticating with Discord. Please try again.")
        } else if(value == "no_user") {
            setAuthFailedAlert("Something went wrong logging you in. Please try again.")
        }
    }, []);

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
            <div className="mb-8">
                <div className="w-48 h-48 rounded-2xl flex items-center justify-center">
                   <img src={Logo}  alt="Hearthhub Logo" />
                </div>
            </div>
            {
                authFailedAlert.length > 0 ?
                    <div className="mb-3">
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>
                                {authFailedAlert}
                            </AlertDescription>
                        </Alert>
                    </div> : null
            }
            <Card className="w-96">
                <CardHeader>
                    <CardTitle>Login to HearthHub</CardTitle>
                    <CardDescription>Manage your server, mods, configuration and Valheim worlds</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button className="w-full bg-[#5865f2] hover:bg-[#707cfa] active:bg-[#4c5bfc] focus:outline-none focus:bg-[#4c5bfc]" onClick={discordRedirect}>
                        <span className="discord-icon" />
                        Sign In with Discord
                    </Button>

                    <Button className="w-full bg-gray-400 mt-3" onClick={() => window.location.href = "/"}>
                        <Home />
                        Home
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default Login;