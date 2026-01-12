import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminPanel from './pages/AdminPanel';
import CSRPanel from './pages/CSRPanel';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/csr" replace />} />
            <Route 
              path="admin" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminPanel />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="csr" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'csr']}>
                  <CSRPanel />
                </ProtectedRoute>
              } 
            />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
