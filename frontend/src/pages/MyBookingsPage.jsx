// src/pages/MyBookingsPage.jsx
import React, { useState, useEffect } from 'react';
import { getMyBookings, createRazorpayOrder, verifyPayment } from '../services/api';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const StatusBadge = ({ status }) => {
  let colorClass = '';
  switch (status) {
    case 'confirmed':
      colorClass = 'bg-green-500';
      break;
    case 'cancelled':
      colorClass = 'bg-red-500';
      break;
    default: // pending
      colorClass = 'bg-yellow-500';
      break;
  }
  return <span className={`px-3 py-1 text-xs font-medium text-white rounded-full ${colorClass}`}>{status}</span>;
};

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchBookings = async () => {
    try {
      const data = await getMyBookings();
      setBookings(data);
    } catch (err) {
      setError('Failed to load your bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handlePayment = async (booking) => {
    console.log("Attempting to handle payment for booking:", booking); // DEBUG
    try {
      console.log("Step 1: Creating Razorpay order on backend..."); // DEBUG
      const order = await createRazorpayOrder({ amount: booking.totalPrice });
      console.log("Step 2: Backend returned order:", order); // DEBUG

      if (!order || !order.id) {
        console.error("Failed to get a valid order from the backend.");
        toast.error("Could not create a payment order.");
        return;
      }

      const options = {
        key: 'rzp_test_Mfaqv1nSQwgl2N', // Replace with your Key ID
        amount: order.amount,
        currency: order.currency,
        name: 'Rentify',
        description: `Payment for ${booking.property.title}`,
        order_id: order.id,
        handler: async function (response) {
          console.log("Payment successful, now verifying...", response); // DEBUG
          const verificationData = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            amount: booking.totalPrice,
            propertyId: booking.property._id,
            bookingId: booking._id,
          };
          
          const verificationPromise = verifyPayment(verificationData);

          toast.promise(verificationPromise, {
            loading: 'Verifying payment...',
            success: 'Payment successful!',
            error: 'Payment verification failed.',
          }).then(() => {
            fetchBookings();
          });
        },
        prefill: { name: user.name, email: user.email },
        theme: { color: '#5E2BFF' }
      };

      console.log("Step 3: Initializing Razorpay checkout with options:", options); // DEBUG
      
      // Check if Razorpay script is loaded
      if (!window.Razorpay) {
        console.error("Razorpay script not loaded!");
        toast.error("Payment gateway is not available. Please refresh.");
        return;
      }

      const rzp = new window.Razorpay(options);
      console.log("Step 4: Opening Razorpay modal..."); // DEBUG
      rzp.open();

    } catch (err) {
      console.error("Error in handlePayment function:", err); // DEBUG
      toast.error('Could not initiate payment. See console for details.');
    }
  };

  if (loading) return <div className="text-center mt-20 text-xl">Loading...</div>;
  if (error) return <div className="text-center mt-20 text-red-500 text-xl">{error}</div>;

  const validBookings = bookings.filter(booking => booking && booking.property && typeof booking.property === 'object');

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-bold mb-8">My Bookings</h1>
      {validBookings.length > 0 ? (
        <div className="space-y-4">
          {validBookings.map((booking) => (
            <div key={booking._id} className="bg-white p-4 rounded-lg shadow-md flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="flex items-center gap-4">
                <img 
                  src={booking.property?.image ? `http://localhost:5000/images/${booking.property.image}` : 'https://via.placeholder.com/150'} 
                  alt={booking.property?.title || 'Property'}
                  className="w-24 h-24 object-cover rounded-md"
                />
                <div>
                  <Link to={`/property/${booking.property._id}`} className="text-lg font-semibold text-indigo-600 hover:underline">
                    {booking.property?.title || 'Property Not Available'}
                  </Link>
                  <p className="text-sm text-gray-500">{booking.property?.address || 'Address not available'}</p>
                  <p className="text-sm font-semibold mt-1">
                    {format(new Date(booking.startDate), 'MMM dd, yyyy')} - {format(new Date(booking.endDate), 'MMM dd, yyyy')}
                  </p>
                  <p className="text-sm font-semibold">
                    Total Price: ₹{booking.totalPrice?.toLocaleString() || 'N/A'}
                  </p>
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex items-center gap-4">
                <StatusBadge status={booking.status} />
                {booking.status === 'confirmed' && !booking.isPaid && (
                  <button
                    onClick={() => handlePayment(booking)}
                    className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-md hover:bg-green-700"
                  >
                    Pay Now
                  </button>
                )}
                {booking.isPaid && (
                  <div className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-md">
                    ✓ Paid
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <p className="text-xl text-gray-500">You haven't made any bookings yet.</p>
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
