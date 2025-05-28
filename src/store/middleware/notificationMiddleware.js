import { toast } from 'react-hot-toast';

export const notificationMiddleware = store => next => action => {
  // Execute all rejection actions
  if (action.type.endsWith('/rejected')) {
    toast.error(action.payload || 'An error occurred');
  }
  
  // Show specific success messages
  if (action.type === 'booking/createBooking/fulfilled') {
    toast.success('Booking created successfully!');
  }
  
  if (action.type === 'booking/cancelBooking/fulfilled') {
    toast.success('Booking cancelled successfully');
  }
  
  return next(action);
};
