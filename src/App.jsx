import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Auth pages
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Main pages
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Invoices from './pages/Invoices';
import Payments from './pages/Payments';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

// Panels
import AdminPanel from './pages/AdminPanel';
import CSRPanel from './pages/CSRPanel';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Protected layout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* Default route */}
            <Route index element={<Navigate to="/dashboard" replace />} />

            {/* Dashboard */}
            <Route
              path="dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin', 'csr']}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Projects */}
            <Route
              path="projects"
              element={
                <ProtectedRoute allowedRoles={['admin', 'csr']}>
                  <Projects />
                </ProtectedRoute>
              }
            />
            <Route
              path="projects/:id"
              element={
                <ProtectedRoute allowedRoles={['admin', 'csr']}>
                  <ProjectDetail />
                </ProtectedRoute>
              }
            />

            {/* Invoices */}
            <Route
              path="invoices"
              element={
                <ProtectedRoute allowedRoles={['admin', 'csr']}>
                  <Invoices />
                </ProtectedRoute>
              }
            />

            {/* Payments */}
            <Route
              path="payments"
              element={
                <ProtectedRoute allowedRoles={['admin', 'csr']}>
                  <Payments />
                </ProtectedRoute>
              }
            />

            {/* Reports */}
            <Route
              path="reports"
              element={
                <ProtectedRoute allowedRoles={['admin', 'csr']}>
                  <Reports />
                </ProtectedRoute>
              }
            />

            {/* Settings */}
            <Route
              path="settings"
              element={
                <ProtectedRoute allowedRoles={['admin', 'csr']}>
                  <Settings />
                </ProtectedRoute>
              }
            />

            {/* Admin */}
            <Route
              path="admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />

            {/* CSR */}
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
