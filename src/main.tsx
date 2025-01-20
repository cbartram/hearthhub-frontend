import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// @ts-ignore
import { AuthProvider } from '@/context/AuthContext';
// @ts-ignore
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Login from '@/pages/Login.tsx'
import Dashboard from '@/pages/Dashboard.tsx'
import AuthCallback from "@/components/AuthCallback.tsx";
import './index.css'

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
      <BrowserRouter>
          <AuthProvider>
              <Routes>
                  <Route path="/" element={<Login />} />
                  <Route path="/login" element={<Login />} />
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
  // </StrictMode>,
)
