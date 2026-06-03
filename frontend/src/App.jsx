import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Departments from './pages/Departments';
import Purchases from './pages/Purchases';
import Sales from './pages/Sales';
import Reports from './pages/Reports';

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/signup" element={isAuthenticated ? <Navigate to="/" replace /> : <Signup />} />

      <Route path="/" element={
        <ProtectedRoute>
          <Layout><Dashboard /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/employees" element={
        <ProtectedRoute>
          <Layout><Employees /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/departments" element={
        <ProtectedRoute>
          <Layout><Departments /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/purchases" element={
        <ProtectedRoute>
          <Layout><Purchases /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/sales" element={
        <ProtectedRoute>
          <Layout><Sales /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/reports" element={
        <ProtectedRoute>
          <Layout><Reports /></Layout>
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return <AppRoutes />;
}
