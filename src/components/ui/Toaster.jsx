import React from 'react';
import { useSelector } from 'react-redux';

const Toaster = () => {
  const { actionErrors } = useSelector(state => state.queue);
  
  // If no errors, don't show anything
  if (!actionErrors.markArrived && 
      !actionErrors.startSession && 
      !actionErrors.endSession && 
      !actionErrors.cancelClient) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      {actionErrors.markArrived && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-3 rounded shadow-md">
          <p className="font-bold">Error marking arrived</p>
          <p>{actionErrors.markArrived.message}</p>
        </div>
      )}
      
      {actionErrors.startSession && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-3 rounded shadow-md">
          <p className="font-bold">Error starting session</p>
          <p>{actionErrors.startSession.message}</p>
        </div>
      )}
      
      {actionErrors.endSession && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-3 rounded shadow-md">
          <p className="font-bold">Error ending session</p>
          <p>{actionErrors.endSession.message}</p>
        </div>
      )}
      
      {actionErrors.cancelClient && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-3 rounded shadow-md">
          <p className="font-bold">Error canceling client</p>
          <p>{actionErrors.cancelClient.message}</p>
        </div>
      )}
    </div>
  );
};

export default Toaster;
