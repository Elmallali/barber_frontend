import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ClockIcon, XIcon, MapPinIcon, Loader2, BellIcon, CheckCircleIcon, ChevronUpIcon, ChevronDownIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { QueueVisualizer } from '../../components/client/Booking/QueueVisualizer';
import { 
  fetchActiveBooking, 
  cancelActiveBooking,
  clearBookingData,
  updateNotificationThreshold,
  confirmBooking
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
    updatingThreshold,
    confirmingBooking,
    error
  } = useSelector(state => state.booking);
  const { user } = useSelector(state => state.auth);
  
  // Local state for notification threshold editing
  const [isEditingThreshold, setIsEditingThreshold] = useState(false);
  const [thresholdValue, setThresholdValue] = useState(3);
  
  // Update local threshold value when active booking changes
  useEffect(() => {
    if (activeBooking?.notification_threshold) {
      setThresholdValue(activeBooking.notification_threshold);
    }
  }, [activeBooking]);
  
  // Calculate estimated wait time based on barber service time and position
  const calculateEstimatedWait = () => {
    if (!queuePosition) return "--";
    
    // Use barber's average service time if available, otherwise default to 15 minutes
    const avgServiceTime = activeBooking?.barber?.avg_service_time || barber?.avg_service_time || 15;
    
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
      // Instead of returning early, we can try to get clientId from localStorage
      const storedClientId = localStorage.getItem('clientId');
      if (storedClientId) {
        console.log('Using stored client ID from localStorage:', storedClientId);
        dispatch(fetchActiveBooking(storedClientId));
      } else {
        console.log('No client ID available, cannot fetch booking data');
        return;
      }
    } else {
      // Store clientId in localStorage for persistence across refreshes
      localStorage.setItem('clientId', clientId);
      console.log('Fetching active booking for client ID:', clientId);
      
      // Initial fetch
      dispatch(fetchActiveBooking(clientId));
    }
    
    // Set up polling interval using the available clientId
    const intervalClientId = clientId || localStorage.getItem('clientId');
    if (intervalClientId) {
      const interval = setInterval(() => {
        console.log('Polling for booking updates...');
        dispatch(fetchActiveBooking(intervalClientId));
      }, 10000); // Poll every 10 seconds
      
      return () => clearInterval(interval);
    }
  }, [dispatch, user]);
  
  // If we don't have booking data yet and it's not loading, redirect back to booking page
  useEffect(() => {
    // Only redirect if we've attempted to load and found nothing
    // This prevents immediate redirect on page refresh before data loads
    if (!loadingActiveBooking && !activeBooking && !error) {
      // Add a small delay to allow for data fetching to complete
      const redirectTimer = setTimeout(() => {
        // Check one more time before redirecting
        if (!activeBooking) {
          console.log('No active booking found after delay, redirecting to booking page');
          navigate('/client/booking');
        }
      }, 2000); // 2 second delay
      
      return () => clearTimeout(redirectTimer);
    }
  }, [loadingActiveBooking, activeBooking, error, navigate]);
  
  // Debug logging for activeBooking data structure
  useEffect(() => {
    if (activeBooking) {
      console.log('Active booking data structure:', activeBooking);
      // Check if we have the entry object with barber info
      if (activeBooking.entry && activeBooking.entry.barber) {
        console.log('Barber info from entry:', activeBooking.entry.barber);
      }
      // Check if we have direct barber info
      if (activeBooking.barber) {
        console.log('Direct barber info:', activeBooking.barber);
      }
    }
  }, [activeBooking]);

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
  
  // Handle notification threshold update
  const handleUpdateThreshold = async () => {
    if (!activeBooking) {
      toast.error('No active booking found');
      return;
    }
    
    try {
      await dispatch(updateNotificationThreshold({
        entryId: activeBooking.id,
        threshold: thresholdValue
      })).unwrap();
      
      toast.success('Notification threshold updated');
      setIsEditingThreshold(false);
    } catch (error) {
      console.error('Update threshold error:', error);
      toast.error('Failed to update threshold: ' + (error.message || 'Unknown error'));
    }
  };
  
  // Handle "I'm on my way" confirmation
  const handleConfirmOnWay = async () => {
    if (!activeBooking) {
      toast.error('No active booking found');
      return;
    }
    
    try {
      await dispatch(confirmBooking(activeBooking.id)).unwrap();
      toast.success('Thanks for confirming! The barber has been notified you are on your way.');
    } catch (error) {
      console.error('Confirm booking error:', error);
      toast.error('Failed to confirm: ' + (error.message || 'Unknown error'));
    }
  };
  
  // Check if the client's status is INVITED
  const isInvited = activeBooking?.status === 'INVITED';

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
                    <div className="font-medium">
                      {activeBooking?.queue?.salon?.name || salon?.name || 'Unknown'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Barber</div>
                    <div className="font-medium">
                      {activeBooking?.barber?.name || barber?.name || 'Unknown'}
                      {activeBooking?.barber?.experience || barber?.experience ? 
                        ` (${activeBooking?.barber?.experience || barber?.experience})` : ''}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Location</div>
                    <div className="font-medium flex items-center">
                      <MapPinIcon size={16} className="mr-1 text-gray-400" />
                      {activeBooking?.queue?.salon?.location_city || city || ''}
                      {(activeBooking?.queue?.salon?.location_city || city) && (activeBooking?.queue?.salon?.location_neighborhood || neighborhood) ? ', ' : ''}
                      {activeBooking?.queue?.salon?.location_neighborhood || neighborhood || ''}
                    </div>
                  </div>
                  
                  {/* Notification Threshold Setting */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-sm text-gray-500">Notification Threshold</div>
                      <button 
                        onClick={() => setIsEditingThreshold(!isEditingThreshold)}
                        className="text-blue-600 text-sm hover:text-blue-800 transition-colors"
                      >
                        {isEditingThreshold ? 'Cancel' : 'Edit'}
                      </button>
                    </div>
                    
                    {isEditingThreshold ? (
                      <div className="mt-2">
                        <div className="flex items-center mb-2">
                          <button 
                            onClick={() => setThresholdValue(prev => Math.max(1, prev - 1))}
                            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                            disabled={thresholdValue <= 1}
                          >
                            <ChevronDownIcon size={16} />
                          </button>
                          <div className="mx-3 font-medium text-lg w-8 text-center">{thresholdValue}</div>
                          <button 
                            onClick={() => setThresholdValue(prev => Math.min(10, prev + 1))}
                            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                            disabled={thresholdValue >= 10}
                          >
                            <ChevronUpIcon size={16} />
                          </button>
                          <button
                            onClick={handleUpdateThreshold}
                            disabled={updatingThreshold || thresholdValue === activeBooking?.notification_threshold}
                            className="ml-3 bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center"
                          >
                            {updatingThreshold ? (
                              <>
                                <Loader2 size={14} className="mr-1 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              'Save'
                            )}
                          </button>
                        </div>
                        <p className="text-sm text-gray-500">
                          You'll be notified when you're position #{thresholdValue} in line.
                        </p>
                      </div>
                    ) : (
                      <div className="font-medium flex items-center">
                        <BellIcon size={16} className="mr-1 text-blue-500" />
                        Notify me at position #{activeBooking?.notification_threshold || 3}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* "I'm on my way" button for INVITED status */}
                {isInvited && (
                  <div className="mt-4 mb-4">
                    <button
                      onClick={handleConfirmOnWay}
                      disabled={confirmingBooking}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg flex items-center justify-center transition-colors duration-200 disabled:bg-green-400 disabled:cursor-not-allowed"
                    >
                      {confirmingBooking ? (
                        <>
                          <Loader2 size={18} className="mr-2 animate-spin" />
                          Confirming...
                        </>
                      ) : (
                        <>
                          <CheckCircleIcon size={18} className="mr-2" />
                          I'm on my way!
                        </>
                      )}
                    </button>
                    <p className="text-sm text-center mt-2 text-gray-600">
                      It's almost your turn! Click to confirm you're heading to the salon.
                    </p>
                  </div>
                )}
                
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
                
                {/* Status-specific messages */}
                {isInvited ? (
                  <div className="mt-6 bg-green-50 rounded-lg p-4">
                    <h4 className="font-medium text-green-700 mb-2">It's Almost Your Turn!</h4>
                    <p className="text-sm text-green-600">
                      Please confirm you're on your way using the button on the left.
                    </p>
                  </div>
                ) : activeBooking?.status === 'ON_WAY' ? (
                  <div className="mt-6 bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-700 mb-2">On Your Way!</h4>
                    <p className="text-sm text-blue-600">
                      Thanks for confirming. Your barber is expecting you soon.
                    </p>
                  </div>
                ) : (
                  <div className="mt-6 bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-700 mb-2">Ready Soon!</h4>
                    <p className="text-sm text-blue-600">
                      We'll notify you when it's almost your turn. Stay close to the salon!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
