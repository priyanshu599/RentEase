// src/pages/LandlordDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { getMyProperties } from '../services/api';
import { Link } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';

const LandlordDashboardPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getMyProperties();
        setProperties(data);
      } catch (err) {
        setError('Failed to load your properties.');
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  if (loading) return <div className="text-center mt-20 text-xl">Loading Dashboard...</div>;
  if (error) return <div className="text-center mt-20 text-red-500 text-xl">{error}</div>;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">My Properties</h1>
        <Link to="/property/new" className="px-6 py-2 font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700">
          + List New Property
        </Link>
      </div>
      
      {properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {properties.map((prop) => (
            <div key={prop._id} className="flex flex-col">
              <PropertyCard property={prop} />
              <Link
                to={`/property/${prop._id}/bookings`}
                className="block text-center w-full mt-2 px-4 py-2 bg-gray-800 text-white rounded-b-lg hover:bg-gray-900"
              >
                Manage Bookings
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <p className="text-xl text-gray-500">You haven't listed any properties yet.</p>
          <Link to="/property/new" className="mt-4 inline-block px-6 py-2 font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700">
            List Your First Property
          </Link>
        </div>
      )}
    </div>
  );
};

export default LandlordDashboardPage;
