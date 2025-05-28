import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ClockIcon, CheckIcon, XIcon, MapPinIcon, ScissorsIcon, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { QueueVisualizer } from '../../components/client/Booking/QueueVisualizer';
import { createNewBooking, fetchActiveBooking, fetchQueueInfo } from '../../store/slices/bookingSlice';

export const ConfirmationPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { 
    selectedSalon: salon,
    selectedBarber: barber,
    selectedCity: city,
    selectedNeighborhood: neighborhood,
    creatingBooking,
    activeBooking
  } = useSelector(state => state.booking);
  const { user } = useSelector(state => state.auth);
  
  // Queue information
  const { 
    estimatedPosition, 
    activeClientsCount, 
    totalInQueue, 
    loadingQueueInfo 
  } = useSelector(state => state.booking);
  
  // Use estimated position or default to 1 more than active clients
  const queuePosition = estimatedPosition || (activeClientsCount ? activeClientsCount + 1 : 3);
  // Use total in queue or default to 7 if not available
  const displayTotalInQueue = totalInQueue || (activeClientsCount ? activeClientsCount + 3 : 7);
  
  // Check if user already has an active booking
  useEffect(() => {
    if (user?.clientId) {
      dispatch(fetchActiveBooking(user.clientId));
    }
  }, [dispatch, user]);
  
  // Fetch queue information for the selected barber and salon
  useEffect(() => {
    if (salon?.id && barber?.id) {
      dispatch(fetchQueueInfo({ salonId: salon.id, barberId: barber.id }));
    }
  }, [dispatch, salon, barber]);
  
  // Redirect to queue page if user has active booking
  useEffect(() => {
    if (activeBooking) {
      toast('You already have an active booking'); // Using default toast instead of toast.info
      navigate('/client/queue');
    }
  }, [activeBooking, navigate]);
  
  // Calculate estimated wait time based on barber service time and position
  const calculateEstimatedWait = () => {
    if (!barber) return "15-20";
    
    // Use barber's average service time if available, otherwise default to 15 minutes
    const avgServiceTime = barber.avg_service_time || 15;
    
    // People ahead of you * average service time
    const estimatedMinutes = (queuePosition - 1) * avgServiceTime;
    
    // Add a range for more realistic estimation
    const minTime = Math.max(0, estimatedMinutes - 5);
    const maxTime = estimatedMinutes + 5;
    
    return minTime === maxTime ? minTime : `${minTime}-${maxTime}`;
  };
  
  // If we don't have salon or barber data in Redux, go back
  if (!salon || !barber) {
    navigate('/client/select-salon');
    return null;
  }

  const handleConfirm = async () => {
    // Check if user already has an active booking before proceeding
    if (activeBooking) {
      toast.error('You already have an active booking');
      navigate('/client/queue');
      return;
    }
    
    try {
      // Create booking using API
      await dispatch(createNewBooking({
        salonId: salon.id,
        barberId: barber.id,
        clientId: user?.clientId || user?.client?.id || 1 // Try both formats with fallback to ID 1 for testing
      })).unwrap();
      
      // If successful, show toast and navigate to queue page
      toast.success('Booking confirmed successfully!');
      
      // Slight delay before navigation to allow toast to show
      setTimeout(() => {
        navigate('/client/queue');
      }, 500);
    } catch (error) {
      toast.error('Booking failed. Please try again.');
    }
  };

  const handleCancel = () => {
    // If not yet booked, go back to the booking page
    navigate('/client/booking');
  };



  // Original confirmation page before confirming
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold mb-2">Confirm Your Appointment</h1>
          <p className="text-gray-600">You're about to book an appointment at:</p>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h2 className="text-xl font-medium">{salon?.name}</h2>
              <p className="text-gray-600 flex items-center mt-1">
                <MapPinIcon size={16} className="mr-1 text-gray-400" />
                {city}, {neighborhood}
              </p>
              <p className="text-gray-600 flex items-center mt-1">
                <ScissorsIcon size={16} className="mr-1 text-gray-400" />
                Barber: {barber?.name} ({barber?.experience})
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-full">
              <ClockIcon size={18} className="mr-2" />
              <span>
                {loadingQueueInfo ? (
                  <span className="flex items-center">
                    <Loader2 size={14} className="mr-2 animate-spin" />
                    Calculating wait time...
                  </span>
                ) : (
                  `Estimated wait: ${calculateEstimatedWait()} min`
                )}
              </span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-medium mb-4">Current Queue Status</h3>
            <div className="mb-6">
              <QueueVisualizer position={queuePosition} total={displayTotalInQueue} />
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Your position</span>
                <span className="font-medium">
                  {queuePosition} of {displayTotalInQueue}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${(queuePosition / displayTotalInQueue) * 100}%` }}
                ></div>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Estimated time until your turn: {calculateEstimatedWait()} minutes
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleConfirm}
              disabled={creatingBooking}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-medium flex items-center justify-center transition-colors duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {creatingBooking ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  Creating Booking...
                </>
              ) : (
                <>
                  <CheckIcon size={18} className="mr-2" />
                  Confirm Booking
                </>
              )}
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-medium flex items-center justify-center transition-colors duration-200"
            >
              <XIcon size={18} className="mr-2" />
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
