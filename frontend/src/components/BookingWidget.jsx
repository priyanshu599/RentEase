// src/components/BookingWidget.jsx
import React, { useState, useEffect } from 'react';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { differenceInCalendarDays } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { createBooking, getBookedDates } from '../services/api';
import toast from 'react-hot-toast';

const BookingWidget = ({ property }) => {
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);
  const [disabledDates, setDisabledDates] = useState([]);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
      if (!property._id) return;
      const fetchBookedDates = async () => {
          try {
              const dates = await getBookedDates(property._id);
              setDisabledDates(dates.map(date => new Date(date)));
          } catch (error) {
              console.error("Could not fetch booked dates");
          }
      };
      fetchBookedDates();
  }, [property._id]);

  const numberOfNights = differenceInCalendarDays(dateRange[0].endDate, dateRange[0].startDate);
  
  // FIX: Calculate a daily rate from the monthly price for an accurate total.
  // We assume an average of 30 days in a month for this calculation.
  const dailyRate = property.price / 30;
  const totalPrice = numberOfNights * dailyRate;

  const handleBooking = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (numberOfNights <= 0) {
      toast.error('Please select at least one night.');
      return;
    }

    const bookingData = {
      propertyId: property._id,
      startDate: dateRange[0].startDate,
      endDate: dateRange[0].endDate,
      totalPrice,
    };

    const bookingPromise = createBooking(bookingData);
    toast.promise(bookingPromise, {
        loading: 'Sending booking request...',
        success: 'Booking request sent successfully!',
        error: (err) => err.message || 'Failed to send booking request.'
    }).then(() => {
        // FIX: Navigate to the "My Bookings" page after a successful request.
        // We will build this page in the next step.
        navigate('/my-bookings');
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border">
      <h2 className="text-2xl font-bold mb-4">Book this property</h2>
      <div className="flex justify-center">
        <DateRange
          editableDateInputs={true}
          onChange={item => setDateRange([item.selection])}
          moveRangeOnFirstSelection={false}
          ranges={dateRange}
          minDate={new Date()}
          disabledDates={disabledDates}
        />
      </div>
      {numberOfNights > 0 && (
        <div className="mt-4">
          <p className="text-lg text-gray-700">
            <span className="font-semibold">Total for {numberOfNights} nights:</span> ₹{totalPrice.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </p>
          <button
            onClick={handleBooking}
            className="w-full mt-4 px-6 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700"
          >
            Request to Book
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingWidget;
