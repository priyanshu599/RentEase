// src/pages/ManageBookingsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBookingsForProperty, updateBookingStatus } from '../services/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const ManageBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { propertyId } = useParams();

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getBookingsForProperty(propertyId);
      setBookings(data);
    } catch (err) {
      setError('Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleUpdateStatus = (bookingId, status) => {
    const actionPromise = updateBookingStatus(bookingId, status);

    toast.promise(actionPromise, {
      loading: 'Updating status...',
      success: `Booking has been ${status}.`,
      error: `Failed to update booking.`,
    }).then(() => {
      fetchBookings(); // Refresh the list
    });
  };

  if (loading) return <div className="text-center mt-20 text-xl">Loading Bookings...</div>;
  if (error) return <div className="text-center mt-20 text-red-500 text-xl">{error}</div>;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-8">
        <Link to="/dashboard/landlord" className="text-indigo-600 hover:text-indigo-800">&larr; Back to Dashboard</Link>
        <h1 className="text-4xl font-bold mt-2">Manage Booking Requests</h1>
      </div>

      {bookings.length > 0 ? (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {bookings.map((booking) => (
              <li key={booking._id} className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="mb-4 md:mb-0">
                  <p className="font-semibold text-lg">{booking.tenant?.name || 'Unknown User'}</p>
                  <p className="text-gray-600">{booking.tenant?.email || 'No email'}</p>
                  <p className="text-sm font-semibold mt-1">
                    {format(new Date(booking.startDate), 'MMM dd, yyyy')} - {format(new Date(booking.endDate), 'MMM dd, yyyy')}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {booking.status === 'pending' ? (
                    <>
                      <button onClick={() => handleUpdateStatus(booking._id, 'confirmed')} className="px-3 py-1 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600">Confirm</button>
                      <button onClick={() => handleUpdateStatus(booking._id, 'cancelled')} className="px-3 py-1 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600">Cancel</button>
                    </>
                  ) : (
                    <span className={`px-3 py-1 text-sm font-medium text-white rounded-full ${booking.status === 'confirmed' ? 'bg-green-500' : 'bg-red-500'}`}>
                      {booking.status}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <p className="text-xl text-gray-500">No booking requests for this property yet.</p>
        </div>
      )}
    </div>
  );
};

export default ManageBookingsPage;
