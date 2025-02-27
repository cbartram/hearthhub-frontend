import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import AuthCallback from "@/components/AuthCallback";
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import Landing from "@/pages/Landing";
import Pricing from "@/pages/Pricing"

import { RedirectIfAuthenticated } from '@/components/RedirectIfAuthenticated'
import './index.css'

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <AuthProvider>
            <Routes>
                <Route
                    path="/"
                    element={
                        <RedirectIfAuthenticated resource="landing">
                            <Landing />
                        </RedirectIfAuthenticated>
                    }
                />
                <Route
                    path="/login"
                    element={
                        <RedirectIfAuthenticated resource="login">
                            <Login />
                        </RedirectIfAuthenticated>
                    }
                />
                <Route path="/discord/oauth" element={<AuthCallback />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute resource="dashboard" requireSubscription>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/pricing"
                    element={
                    <ProtectedRoute resource="pricing">
                        <Pricing />
                    </ProtectedRoute>
                    }
                />
            </Routes>
        </AuthProvider>
    </BrowserRouter>
);
