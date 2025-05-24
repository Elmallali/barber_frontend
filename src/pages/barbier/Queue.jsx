// src/pages/barbier/Queue.jsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { QueueSection } from "../../components/barbier/QueueSection";
import {
  startSession,
  endSession,
  cancelClient,
  markArrived,
  pauseSession,
  resumeSession,
  resetSession,
  fetchActiveQueueAsync
} from "../../store/slices/queueSlice";

export function Queue() {
  const dispatch = useDispatch();

  // نستورد البيانات من الـ Redux store
  const { clients, sessionStartTime, isSessionActive, sessionPaused, activeQueue, loading, error } =
    useSelector((state) => state.queue);
    
  // Fetch active queue data when component mounts
  useEffect(() => {
    // You can replace 1 with the actual salon ID from your context or state
    const salonId = 1; // Example salon ID
    dispatch(fetchActiveQueueAsync(salonId));
  }, [dispatch]);

  // handlers يرسلوا الـ actions
  const handleClientAction = (section, clientId, action) => {
    switch (action) {
      case "start":
        dispatch(startSession({ section, clientId }));
        break;
      case "end":
        dispatch(endSession({ clientId }));
        break;
      case "cancel":
        dispatch(cancelClient({ section, clientId }));
        break;
      case "mark-arrived":
        dispatch(markArrived({ clientId }));
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
