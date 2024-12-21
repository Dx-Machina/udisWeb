//=========================================================================================================
// App.js
//=========================================================================================================
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import "../src/styles/Global.css";
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import EducationPage from './pages/EducationPage';
import LandingPage from './pages/LandingPage';
import RegistrationPage from './pages/RegisterPage';
import HealthcarePage from './pages/HealthcarePage';
import FinancePage from './pages/FinancePage';
import TeacherPage from './pages/TeacherPage';
import WalletPage from './pages/WalletPage';
import ErrorPage from './pages/ErrorPage';
import DoctorPage from './pages/DoctorPage';

const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

const ProtectedRoute = ({ element, allowedRoles }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  
  const userRole = localStorage.getItem('userRole');
  if (!allowedRoles.includes(userRole)) {
    return <ErrorPage />;
  }

  return element;
};

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />

          {/* Citizen-only pages */}
          <Route path="/home" element={<ProtectedRoute element={<HomePage />} allowedRoles={['Citizen']}  />} />
          <Route path="/education" element={<ProtectedRoute element={<EducationPage />} allowedRoles={['Citizen']} />} />
          <Route path="/healthcare" element={<ProtectedRoute element={<HealthcarePage />} allowedRoles={['Citizen']} />} />
          <Route path="/finance" element={<ProtectedRoute element={<FinancePage />} allowedRoles={['Citizen']} />} />
          <Route path="/wallet" element={<ProtectedRoute element={<WalletPage />} allowedRoles={['Citizen']} />} />

          {/* Teacher-only page */}
          <Route path="/teacher" element={<ProtectedRoute element={<TeacherPage />} allowedRoles={['Teacher']} />} />

          {/* Doctor-only page */}
          <Route path="/doctor" element={<ProtectedRoute element={<DoctorPage />} allowedRoles={['Doctor']} />} />

          {/* Fallback */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;