import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext.jsx';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import AuthCallback from "@/components/AuthCallback.jsx";
import Login from '@/pages/Login.tsx'
import Dashboard from '@/pages/Dashboard.jsx'

import { RedirectIfAuthenticated } from '@/components/RedirectIfAuthenticated'

import './index.css'

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <AuthProvider>
            <Routes>
                <Route
                    path="/"
                    element={
                        <RedirectIfAuthenticated>
                            <Login />
                        </RedirectIfAuthenticated>
                    }
                />
                <Route
                    path="/login"
                    element={
                        <RedirectIfAuthenticated>
                            <Login />
                        </RedirectIfAuthenticated>
                    }
                />
                <Route path="/discord/oauth" element={<AuthCallback />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </AuthProvider>
    </BrowserRouter>
);
