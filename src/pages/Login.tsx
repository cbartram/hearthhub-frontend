// @ts-ignore
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Logo from '@/assets/hearthhub_logo.png'

const Login = () => {
    const [loginForm, setLoginForm] = useState({ email: '', password: '' });
    const handleLogin = () => {};

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
            <div className="mb-8">
                <div className="w-36 h-36 rounded-2xl flex items-center justify-center">
                   <img src={Logo}  alt="Hearthhub Logo" />
                </div>
            </div>
            <Card className="w-96">
                <CardHeader>
                    <CardTitle>Login to Valheim Manager</CardTitle>
                    <CardDescription>Manage your mods and worlds</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                type="email"
                                placeholder="Email"
                                value={loginForm.email}
                                onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                            />
                            <Input
                                type="password"
                                placeholder="Password"
                                value={loginForm.password}
                                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                            />
                        </div>
                        <Button type="submit" className="w-full">Login</Button>
                        <Button variant="outline" className="w-full">Create Account</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default Login;