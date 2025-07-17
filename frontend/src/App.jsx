// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import FloatingChatButton from './components/FloatingChatButton';

// Import all page components
import HomePage from './pages/HomePage';
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LandlordDashboardPage from './pages/LandlordDashboardPage';
import MyBookingsPage from './pages/MyBookingsPage';
//import TenantApplicationsPage from './pages/TenantApplicationsPage';
//import PropertyApplicationsPage from './pages/PropertyApplicationsPage';
import CreatePropertyPage from './pages/CreatePropertyPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminUserManagementPage from './pages/AdminUserManagementPage';
import ManageBookingsPage from './pages/ManageBookingsPage';
import AdminPropertyManagementPage from './pages/AdminPropertyManagementPage';
import AdminAnalyticsPage from './pages/AdminAnalyticsPage';
import InboxPage from './pages/InboxPage';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gray-800 hover:text-indigo-600">
          Rentify
        </Link>
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              {user?.role === 'admin' && ( <Link to="/admin/dashboard" className="px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100">Admin Panel</Link> )}
              {user?.role === 'landlord' && ( <Link to="/dashboard/landlord" className="px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100">My Dashboard</Link> )}
              {user?.role === 'tenant' && ( 
                <Link to="/my-bookings" className="px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100">
                  My Bookings
                </Link> 
              )}
              <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100">Login</Link>
              <Link to="/register" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const MainLayout = () => {
  const { isAuthenticated } = useAuth();
  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen">
      <Navbar />
      <main>
       <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/property/:id" element={<PropertyDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Landlord Routes */}
          <Route path="/dashboard/landlord" element={<ProtectedRoute role="landlord"><LandlordDashboardPage /></ProtectedRoute>} />
          <Route path="/property/new" element={<ProtectedRoute role="landlord"><CreatePropertyPage /></ProtectedRoute>} />
          <Route path="/property/:propertyId/bookings" element={<ProtectedRoute role="landlord"><ManageBookingsPage /></ProtectedRoute>} />

          {/* Protected Tenant Route */}
          <Route path="/my-bookings" element={<ProtectedRoute role="tenant"><MyBookingsPage /></ProtectedRoute>} />

          {/* Protected Admin Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboardPage /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute role="admin"><AdminUserManagementPage /></ProtectedRoute>} />
          <Route path="/admin/properties" element={<ProtectedRoute role="admin"><AdminPropertyManagementPage /></ProtectedRoute>} />
          <Route path="/admin/analytics" element={<ProtectedRoute role="admin"><AdminAnalyticsPage /></ProtectedRoute>} />
          
          {/* Protected Messaging Route */}
          <Route path="/inbox" element={<ProtectedRoute><InboxPage /></ProtectedRoute>} />
        </Routes>
      </main>
      {isAuthenticated && <FloatingChatButton />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-center" reverseOrder={false} />
        <MainLayout />
      </AuthProvider>
    </Router>
  );
}

export default App;
