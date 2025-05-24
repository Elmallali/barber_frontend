// src/pages/barbier/Queue.jsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Toaster from "../../components/ui/Toaster";
import { QueueSection } from "../../components/barbier/QueueSection";
import {
  startSession,
  endSession,
  cancelClient,
  markArrived,
  pauseSession,
  resumeSession,
  resetSession,
  fetchActiveQueueAsync,
  markArrivedAsync,
  startSessionAsync,
  endSessionAsync,
  cancelClientAsync,
} from "../../store/slices/queueSlice";

export function Queue() {
  const dispatch = useDispatch();

  // نستورد البيانات من الـ Redux store
  const { 
    clients, 
    sessionStartTime, 
    isSessionActive, 
    sessionPaused, 
    activeQueue, 
    loading, 
    error,
    // Get action-specific loading states
    actionLoading,
    actionErrors
  } = useSelector((state) => state.queue);
    
  // Fetch active queue data when component mounts
  useEffect(() => {
    // You can replace 1 with the actual salon ID from your context or state
    const salonId = 1; // Example salon ID
    dispatch(fetchActiveQueueAsync(salonId));
  }, [dispatch]);

  // handlers يرسلوا الـ actions
  const handleClientAction = (section, clientId, action) => {
    // In a real app, you'd need to get the actual entryId from your data
    // For now, assuming entryId is the same as clientId
    const entryId = clientId;
    
    // For startSession, we need a barberId
    // For now, using a default value of 1
    const barberId = 1;
    
    // For endSession, we need a servicePrice
    // For now, using a default value of 50
    const servicePrice = 50;
    
    switch (action) {
      case "start":
        dispatch(startSessionAsync({ section, clientId, entryId, barberId }));
        break;
      case "end":
        dispatch(endSessionAsync({ clientId, entryId, servicePrice }));
        break;
      case "cancel":
        dispatch(cancelClientAsync({ section, clientId, entryId }));
        break;
      case "mark-arrived":
        dispatch(markArrivedAsync({ clientId, entryId }));
        break;
      default:
        break;
    }
  };

  const handleSessionControl = (cmd) => {
    switch (cmd) {
      case "pause":
        dispatch(pauseSession());
        break;
      case "resume":
        dispatch(resumeSession());
        break;
      case "reset":
        dispatch(resetSession());
        break;
      default:
        break;
    }
  };

  // نحضّر الأقسام مباشرة من state.clients
  const queueSections = [
    { type: "in-session", title: "In Session", clients: clients["in-session"] },
    { type: "on-site", title: "On Site Waiting", clients: clients["on-site"] },
    { type: "on-way", title: "On The Way", clients: clients["on-way"] },
    { type: "invited", title: "Invited", clients: clients["invited"] },
  ];

  return (
    <>
      {/* Toast notifications for errors */}
      <Toaster />
      
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Here's your queue overview
        </h1>
        
        {/* Show loading and error states */}
        {loading && <p className="text-blue-600 mt-2">Loading queue data...</p>}
        {error && <p className="text-red-600 mt-2">Error: {error}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {queueSections.map((section) => (
          <QueueSection
            key={section.type}
            title={section.title}
            type={section.type}
            clients={section.clients}
            onClientAction={handleClientAction}
            isSessionActive={isSessionActive}
            sessionStartTime={sessionStartTime}
            sessionPaused={sessionPaused}
            handleSessionControl={handleSessionControl}
            // Pass loading states
            actionLoading={actionLoading}
            actionErrors={actionErrors}
          />
        ))}
      </div>
    </>
  );
}

// import { QueueSection } from "../../components/barbier/QueueSection";

// export function Queue({
//   queueSections,
//   onClientAction,
//   isSessionActive,
//   sessionStartTime,
//   sessionPaused,
//   handleSessionControl
// }) {

//   return (
//     <>
//       <div className="mb-6">
//         <h1 className="text-2xl font-semibold text-gray-800">
//           Here's your queue overview
//         </h1>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {queueSections.map((section) => (
//           <QueueSection
//             key={section.type}
//             title={section.title}
//             type={section.type}
//             clients={section.clients}
//             onClientAction={onClientAction}
//             isSessionActive={isSessionActive}
//             sessionStartTime={sessionStartTime}
//             sessionPaused={sessionPaused}
//             handleSessionControl={handleSessionControl}
//           />
//         ))}
//       </div>
//     </>
//   );
// }
