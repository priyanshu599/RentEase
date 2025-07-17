// src/pages/AdminAnalyticsPage.jsx
import React, { useState, useEffect } from 'react';
import { getPlatformAnalytics } from '../services/api';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex items-center">
      <div className="p-3 bg-indigo-100 rounded-full">
        {icon}
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

const AdminAnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getPlatformAnalytics();
        setAnalytics(data);
      } catch (err) {
        setError('Failed to load analytics data.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="text-center mt-20 text-xl">Loading Analytics...</div>;
  if (error) return <div className="text-center mt-20 text-red-500 text-xl">{error}</div>;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-8">
        <Link to="/admin/dashboard" className="text-indigo-600 hover:text-indigo-800">&larr; Back to Admin Dashboard</Link>
        <h1 className="text-4xl font-bold mt-2">Platform Analytics</h1>
      </div>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Users" value={analytics.totalUsers} icon={'👤'} />
        <StatCard title="Total Properties" value={analytics.totalProperties} icon={'🏠'} />
        <StatCard title="Total Bookings" value={analytics.totalBookings} icon={'📅'} />
        <StatCard title="Total Revenue" value={`₹${analytics.totalRevenue.toLocaleString()}`} icon={'💰'} />
      </div>

      {/* User Signups Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">New User Signups (Last 7 Days)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analytics.userSignups}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" name="New Users" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
