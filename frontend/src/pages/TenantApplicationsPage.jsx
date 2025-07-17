// src/pages/TenantApplicationsPage.jsx
import React, { useState, useEffect } from 'react';
import { getMyApplications, createPayment } from '../services/api';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const StatusBadge = ({ status }) => {
  const baseClasses = 'px-3 py-1 text-xs font-medium text-white rounded-full';
  let colorClass = '';

  switch (status) {
    case 'approved':
      colorClass = 'bg-green-500';
      break;
    case 'rejected':
      colorClass = 'bg-red-500';
      break;
    default: // pending
      colorClass = 'bg-yellow-500';
      break;
  }

  return <span className={`${baseClasses} ${colorClass}`}>{status}</span>;
};

const TenantApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await getMyApplications();
        setApplications(data);
      } catch (err) {
        setError('Failed to load your applications.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handlePayment = (property) => {
    if (!property.price) {
      toast.error('Cannot process payment: Price is not available.');
      return;
    }

    const paymentData = {
      propertyId: property._id,
      amount: property.price,
    };

    const paymentPromise = createPayment(paymentData);

    toast.promise(paymentPromise, {
      loading: 'Processing payment...',
      success: 'Payment successful! Your first month is paid.',
      error: 'Payment failed. Please try again.',
    });
  };

  if (loading) {
    return <div className="text-center mt-20 text-xl">Loading Your Applications...</div>;
  }

  if (error) {
    return <div className="text-center mt-20 text-red-500 text-xl">{error}</div>;
  }

  // Filter out applications where the property data is missing or incomplete
  const validApplications = applications.filter(app => app && app.property && typeof app.property === 'object');

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-bold mb-8">My Applications</h1>
      
      {validApplications.length > 0 ? (
        <div className="space-y-4">
          {validApplications.map((app) => (
            <div key={app._id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
              <div>
                <Link to={`/property/${app.property._id}`} className="text-lg font-semibold text-indigo-600 hover:underline">
                  {app.property.title || 'Property Not Available'}
                </Link>
                <p className="text-sm text-gray-500">{app.property.address || 'Address not available'}</p>
                {app.property.price ? (
                  <p className="text-sm font-semibold mt-1">Price: ${app.property.price.toLocaleString()}</p>
                ) : (
                  <p className="text-sm text-red-500 mt-1">Price not available</p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <StatusBadge status={app.status} />
                {/* Only show Pay Now button if approved AND price is available */}
                {app.status === 'approved' && app.property.price && (
                  <button
                    onClick={() => handlePayment(app.property)}
                    className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-md hover:bg-green-700"
                  >
                    Pay Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <p className="text-xl text-gray-500">You haven't applied to any properties yet.</p>
        </div>
      )}
    </div>
  );
};

export default TenantApplicationsPage;
