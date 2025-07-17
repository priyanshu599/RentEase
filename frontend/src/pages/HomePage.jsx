// src/pages/HomePage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { getAllProperties } from '../services/api';
import PropertyCard from '../components/PropertyCard';
import SearchFilterBar from '../components/SearchFilterBar'; // Import the new component

const HomePage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});

  // Use useCallback to memoize the fetch function
  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllProperties(filters);
      setProperties(data);
    } catch (err) {
      setError('Failed to load properties. Is the backend server running?');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]); // This function will be recreated only if 'filters' change

  // useEffect to call the fetch function when the component mounts or 'fetchProperties' changes
  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleSearch = (searchFilters) => {
    setFilters(searchFilters);
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">Find Your Next Home</h1>
        <p className="text-lg text-gray-600">The best place to find your next rental property.</p>
      </div>

      <SearchFilterBar onSearch={handleSearch} />

      {loading ? (
        <div className="text-center mt-20 text-xl">Searching for properties...</div>
      ) : error ? (
        <div className="text-center mt-20 text-red-500 text-xl">{error}</div>
      ) : (
        <>
          {properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {properties.map((prop) => (
                <PropertyCard key={prop._id} property={prop} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-gray-500">No properties match your search criteria.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HomePage;
