// src/components/SearchFilterBar.jsx
import React, { useState } from 'react';

const SearchFilterBar = ({ onSearch }) => {
  const [location, setLocation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch({ location, minPrice, maxPrice });
  };

  const clearFilters = () => {
    setLocation('');
    setMinPrice('');
    setMaxPrice('');
    onSearch({}); // Trigger a search with no filters
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        <div className="md:col-span-2">
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., 'New York', 'San Francisco'"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700">Min Price</label>
          <input
            type="number"
            id="minPrice"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="₹1,000"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700">Max Price</label>
          <input
            type="number"
            id="maxPrice"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="₹50,000"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="flex space-x-2">
            <button type="submit" className="w-full h-10 px-6 font-semibold text-white bg-indigo-600 rounded-md shadow-md hover:bg-indigo-700">
                Search
            </button>
            <button type="button" onClick={clearFilters} className="w-full h-10 px-6 font-semibold text-gray-700 bg-gray-200 rounded-md shadow-md hover:bg-gray-300">
                Clear
            </button>
        </div>
      </form>
    </div>
  );
};

export default SearchFilterBar;
