// src/components/PropertyCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const IMAGES_BASE_URL = 'http://localhost:5000/images/';

const PropertyCard = ({ property }) => {
  const imageUrl = property.image
    ? `${IMAGES_BASE_URL}${property.image}`
    : 'https://via.placeholder.com/400x250.png?text=No+Image';

  return (
    <Link to={`/property/${property._id}`} className="block">
      {/* FIX: Removed the "border" class to get rid of the outline */}
      <div className="rounded-lg overflow-hidden shadow-lg bg-white h-full transform hover:scale-105 transition-transform duration-300 ease-in-out">
        <img className="w-full h-48 object-cover" src={imageUrl} alt={property.title} />
        <div className="p-4">
          <h3 className="text-xl font-bold mb-2 truncate">{property.title}</h3>
          <p className="text-gray-700 mb-2">
            <strong>Location:</strong> {property.address}
          </p>
          <p className="text-2xl font-semibold text-indigo-600">
            ₹{property.price.toLocaleString()}{' '}
            <span className="text-base font-normal text-gray-500">/ month</span>
          </p>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
