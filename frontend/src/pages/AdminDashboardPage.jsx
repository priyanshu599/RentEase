// src/pages/AdminDashboardPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboardPage = () => {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/admin/users" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow">
          <h2 className="text-2xl font-semibold mb-2">Manage Users</h2>
          <p className="text-gray-600">View, edit, or delete users on the platform.</p>
        </Link>
        <Link to="/admin/properties" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow">
          <h2 className="text-2xl font-semibold mb-2">Manage Properties</h2>
          <p className="text-gray-600">View or delete property listings.</p>
        </Link>
        <Link to="/admin/analytics" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow">
          <h2 className="text-2xl font-semibold mb-2">Platform Analytics</h2>
          <p className="text-gray-600">View statistics and platform growth.</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
