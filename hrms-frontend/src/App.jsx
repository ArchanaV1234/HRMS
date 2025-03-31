import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Auth/Login.jsx';
import RegistrationForm from './components/Auth/Register';
import HRDashboard from './components/Dashboard/HRDashboard';
import EmployeeDashboard from './components/Dashboard/EmployeeManagement';
import RecruiterDashboard from './components/Dashboard/RecruiterDashboard';
import FinanceDashboard from './components/Dashboard/FinanceDashboard';
import LandingPage from './components/Auth/LandingPage.jsx';

function App() {
  return (
    <Router>
      <Routes>
        {/* Add this route for the root path */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/hr-dashboard" element={<HRDashboard />} />
        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
        <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
        <Route path="/finance-dashboard" element={<FinanceDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;