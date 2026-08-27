import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { useAuth } from './hooks/useAuth';

// Layouts
import { AdminLayout } from './layouts/AdminLayout';
import { TrainerLayout } from './layouts/TrainerLayout';
import { MemberLayout } from './layouts/MemberLayout';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { HomePage } from './pages/HomePage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ManageMembers } from './pages/admin/ManageMembers';
import { ManageTrainers } from './pages/admin/ManageTrainers';
import { ManagePlans } from './pages/admin/ManagePlans';
import { TemplatesPage } from './pages/admin/TemplatesPage';

// Trainer Pages
import { TrainerDashboard } from './pages/trainer/TrainerDashboard';
import { AssignedMembers } from './pages/trainer/AssignedMembers';
import { WorkoutPlanBuilder } from './pages/trainer/WorkoutPlanBuilder';
import { DietPlanBuilder } from './pages/trainer/DietPlanBuilder';
import { MemberProgressView } from './pages/trainer/MemberProgressView';

// Member Pages
import { MemberDashboard } from './pages/member/MemberDashboard';
import { GymsBooking } from './pages/member/GymsBooking';
import { DailyTracker } from './pages/member/DailyTracker';
import { MySubscription } from './pages/member/MySubscription';
import { WorkoutPlanView } from './pages/member/WorkoutPlanView';
import { DietPlanView } from './pages/member/DietPlanView';
import { ProgressTracker } from './pages/member/ProgressTracker';

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-dark text-white">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
    if (user.role === 'TRAINER') return <Navigate to="/trainer" replace />;
    return <Navigate to="/member" replace />;
  }

  return children;
};



export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="members" element={<ManageMembers />} />
              <Route path="trainers" element={<ManageTrainers />} />
              <Route path="plans" element={<ManagePlans />} />
              <Route path="templates" element={<TemplatesPage />} />
            </Route>

            {/* Protected Trainer Routes */}
            <Route
              path="/trainer"
              element={
                <ProtectedRoute allowedRoles={['TRAINER']}>
                  <TrainerLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<TrainerDashboard />} />
              <Route path="members" element={<AssignedMembers />} />
              <Route path="workout-builder" element={<WorkoutPlanBuilder />} />
              <Route path="diet-builder" element={<DietPlanBuilder />} />
              <Route path="member/:id/progress" element={<MemberProgressView />} />
            </Route>

            {/* Protected Member Routes */}
            <Route
              path="/member"
              element={
                <ProtectedRoute allowedRoles={['MEMBER']}>
                  <MemberLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<MemberDashboard />} />
              <Route path="gyms" element={<GymsBooking />} />
              <Route path="tracker" element={<DailyTracker />} />
              <Route path="subscription" element={<MySubscription />} />
              <Route path="workout" element={<WorkoutPlanView />} />
              <Route path="diet" element={<DietPlanView />} />
              <Route path="progress" element={<ProgressTracker />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
