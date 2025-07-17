// src/pages/PropertyDetailsPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getPropertyById } from '../services/api';
import { useAuth } from '../context/AuthContext';
import MapComponent from '../components/MapComponent';
import BookingWidget from '../components/BookingWidget';

const IMAGES_BASE_URL = 'http://localhost:5000/images/';

const PropertyDetailsPage = () => {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { id } = useParams();
  const { user } = useAuth();
  
  // Create a ref to attach to the booking widget section
  const bookingWidgetRef = useRef(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const data = await getPropertyById(id);
        setProperty(data);
      } catch (err) {
        setError('Failed to load property details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  // Function to handle the smooth scroll
  const handleScrollToBooking = () => {
    bookingWidgetRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (loading) return <div className="text-center mt-20 text-xl">Loading...</div>;
  if (error) return <div className="text-center mt-20 text-red-500 text-xl">{error}</div>;
  if (!property) return <div className="text-center mt-20 text-xl">Property not found.</div>;

  const imageUrl = property.image
    ? `${IMAGES_BASE_URL}${property.image}`
    : 'https://via.placeholder.com/1200x600.png?text=No+Image+Available';
    
  const isOwner = user?._id === property.createdBy;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <img className="w-full h-64 md:h-96 object-cover" src={imageUrl} alt={property.title} />
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{property.title}</h1>
              <p className="text-lg text-gray-600">{property.address}</p>
            </div>
            {/* This button scrolls down to the BookingWidget */}
            {!isOwner && (
              <div className="mt-4 md:mt-0">
                <button
                  onClick={handleScrollToBooking}
                  className="w-full md:w-auto px-6 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700"
                >
                  Reserve or Book Now
                </button>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            {/* Main content area */}
            <div className="lg:col-span-2">
                <h2 className="text-2xl font-semibold mb-3 text-gray-900">Description</h2>
                <p className="text-gray-700 leading-relaxed">
                    {property.description || 'No description provided.'}
                </p>
                <h2 className="text-2xl font-semibold mt-8 mb-3 text-gray-900">Location</h2>
                {property.location?.coordinates && (
                    <MapComponent 
                        position={property.location.coordinates} 
                        address={property.address} 
                    />
                )}
            </div>
            
            {/* Booking Widget Area */}
            {!isOwner && (
                // Attach the ref to this div so we can scroll to it
                <div ref={bookingWidgetRef}>
                    <BookingWidget property={property} />
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsPage;
