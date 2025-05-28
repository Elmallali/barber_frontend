import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ClockIcon, XIcon, MapPinIcon, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { QueueVisualizer } from '../../components/client/Booking/QueueVisualizer';
import { 
  fetchActiveBooking, 
  cancelActiveBooking,
  clearBookingData 
} from '../../store/slices/bookingSlice';

export const QueuePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { 
    activeBooking,
    queuePosition,
    totalInQueue,
    selectedSalon: salon,
    selectedBarber: barber,
    selectedCity: city,
    selectedNeighborhood: neighborhood,
    loadingActiveBooking,
    cancellingBooking,
    error
  } = useSelector(state => state.booking);
  const { user } = useSelector(state => state.auth);
  
  // Calculate estimated wait time based on barber service time and position
  const calculateEstimatedWait = () => {
    if (!barber || !queuePosition) return "--";
    
    // Use barber's average service time if available, otherwise default to 15 minutes
    const avgServiceTime = barber.avg_service_time || 15;
    
    // People ahead of you * average service time
    const peopleAhead = queuePosition - 1;
    const estimatedMinutes = peopleAhead * avgServiceTime;
    
    return estimatedMinutes;
  };
  
  // Poll for booking updates
  useEffect(() => {
    // Check for client ID in different possible locations
    const clientId = user?.clientId || user?.client?.id;
    
    if (!clientId) {
      console.log('No client ID found in user object:', user);
      return;
    }
    
    console.log('Fetching active booking for client ID:', clientId);
    
    // Initial fetch
    dispatch(fetchActiveBooking(clientId));
    
    // Set up polling interval
    const interval = setInterval(() => {
      dispatch(fetchActiveBooking(clientId));
    }, 10000); // Poll every 10 seconds
    
    return () => clearInterval(interval);
  }, [dispatch, user]);
  
  // If we don't have booking data yet and it's not loading, redirect back to booking page
  useEffect(() => {
    if (!loadingActiveBooking && !activeBooking && !error) {
      navigate('/client/booking');
    }
  }, [loadingActiveBooking, activeBooking, error, navigate]);

  const handleCancel = async () => {
    if (!activeBooking) {
      toast.error('No active booking found');
      return;
    }
    
    // Log the activeBooking structure to see what's available
    console.log('Active booking data:', activeBooking);
    
    // Find the entry ID - backend expects entry_id
    const entryId = activeBooking.id;
    
    if (!entryId) {
      toast.error('Cannot find entry ID');
      console.error('Entry ID not found in:', activeBooking);
      return;
    }
    
    try {
      console.log('Attempting to cancel booking with entry ID:', entryId);
      await dispatch(cancelActiveBooking(entryId)).unwrap();
      toast.success('Booking cancelled successfully');
      dispatch(clearBookingData());
      navigate('/client'); // Navigate to home page instead of booking page
    } catch (error) {
      console.error('Cancel booking error:', error);
      toast.error('Failed to cancel booking: ' + (error.message || 'Unknown error'));
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-bold text-green-600">Your Active Booking</h2>
            <div className="mt-2 sm:mt-0 flex items-center bg-blue-50 text-blue-700 px-4 py-1 rounded-full text-sm">
              <ClockIcon size={16} className="mr-2" />
              {loadingActiveBooking ? (
                <span className="flex items-center">
                  <Loader2 size={14} className="mr-2 animate-spin" />
                  Updating...
                </span>
              ) : (
                <span>Estimated wait: {calculateEstimatedWait()} min</span>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row">
            {/* LEFT - Booking Info */}
            <div className="w-full md:w-1/2 mb-6 md:mb-0 md:pr-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-medium mb-4">Booking Details</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Salon</div>
                    <div className="font-medium">{salon?.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Barber</div>
                    <div className="font-medium">
                      {barber?.name || (activeBooking?.entry?.barber?.name) || 'Unknown'}
                      {barber?.experience || (activeBooking?.entry?.barber?.experience) ? 
                        ` (${barber?.experience || activeBooking?.entry?.barber?.experience})` : ''}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Location</div>
                    <div className="font-medium flex items-center">
                      <MapPinIcon size={16} className="mr-1 text-gray-400" />
                      {city}, {neighborhood}
                    </div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCancel}
                  disabled={cancellingBooking}
                  className="mt-6 w-full bg-red-50 hover:bg-red-100 text-red-600 py-2 px-4 rounded-lg flex items-center justify-center transition-colors duration-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  {cancellingBooking ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <XIcon size={16} className="mr-2" />
                      Cancel Booking
                    </>
                  )}
                </motion.button>
              </div>
            </div>

            {/* RIGHT - Queue Visualizer */}
            <div className="w-full md:w-1/2">
              <div className="bg-gray-50 rounded-xl p-6 h-full">
                <h3 className="text-lg font-medium mb-4">Queue Status</h3>
                <div className="mb-6">
                  <QueueVisualizer position={queuePosition} total={totalInQueue} />
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Your position</span>
                    <span className="font-medium">
                      {queuePosition} of {totalInQueue}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{
                        width: `${((totalInQueue - queuePosition + 1) / totalInQueue) * 100}%`
                      }}
                    ></div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Estimated time until your turn: {calculateEstimatedWait()} minutes
                  </p>
                </div>
                <div className="mt-6 bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-700 mb-2">Ready Soon!</h4>
                  <p className="text-sm text-blue-600">
                    We'll notify you when it's almost your turn. Stay close to the salon!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
