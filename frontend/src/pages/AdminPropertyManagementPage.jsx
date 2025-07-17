// src/pages/AdminPropertyManagementPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast'; // Import toast
import { getAllPropertiesForAdmin, deletePropertyAsAdmin } from '../services/api';

const AdminPropertyManagementPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllPropertiesForAdmin();
      setProperties(data);
    } catch (err) {
      setError('Failed to load properties.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleDeleteProperty = (propertyId, propertyTitle) => {
    toast((t) => (
      <div className="flex flex-col items-center gap-2">
        <p className="text-center">
          Delete property: <strong>{propertyTitle}</strong>?
        </p>
        <div className="flex gap-2">
          <button
            className="px-4 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            onClick={() => {
              deletePropertyAsAdmin(propertyId)
                .then(() => {
                  toast.success('Property deleted.');
                  fetchProperties(); // Refresh list
                })
                .catch(() => {
                  toast.error('Failed to delete property.');
                });
              toast.dismiss(t.id);
            }}
          >
            Delete
          </button>
          <button
            className="px-4 py-1 text-sm font-medium text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: 6000,
    });
  };

  if (loading) {
    return <div className="text-center mt-20 text-xl">Loading Properties...</div>;
  }

  if (error) {
    return <div className="text-center mt-20 text-red-500 text-xl">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-8">
        <Link to="/admin/dashboard" className="text-indigo-600 hover:text-indigo-800">&larr; Back to Admin Dashboard</Link>
        <h1 className="text-4xl font-bold mt-2">Property Management</h1>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {properties.map((prop) => (
              <tr key={prop._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{prop.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{prop.address}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${prop.price.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleDeleteProperty(prop._id, prop.title)} className="text-red-600 hover:text-red-900">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPropertyManagementPage;
