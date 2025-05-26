// src/pages/barbier/Queue.jsx
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Toaster from "../../components/ui/Toaster";
import { toast, Toaster as HotToaster } from "react-hot-toast"; // Import Toaster component
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
  fetchBarberQueueAsync,
  markArrivedAsync,
  startSessionAsync,
  endSessionAsync,
  cancelClientAsync,
} from "../../store/slices/queueSlice";

// Loading spinner component
const LoadingSpinner = () => (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
    <div className="bg-white p-5 rounded-lg shadow-xl flex flex-col items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-3"></div>
      <p className="text-gray-700">Loading queue data...</p>
    </div>
  </div>
);

export function Queue() {
  const dispatch = useDispatch();
  
  // Add local loading state for immediate feedback
  const [isLoading, setIsLoading] = React.useState(true);

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
    
  // الحصول على معلومات المستخدم من Redux
  const { user } = useSelector((state) => state.auth);
  
  // Fetch barber-specific queue data when component mounts
  useEffect(() => {
    // Set local loading state to true immediately
    setIsLoading(true);
    
    // الحصول على معرف الصالون والحلاق من بيانات المستخدم
    // إذا لم تتوفر بيانات المستخدم، نستخدم القيمة الافتراضية
    const salonId = user?.salonId || 1; // معرف الصالون من بيانات المستخدم أو الافتراضي
    
    // تحقق مما إذا كان المستخدم حلاقًا وله معرف
    if (user && user.barberId) {
      // استدعاء القائمة الخاصة بالحلاق
      console.log(`Fetching queue for barber: ${user.barberId} in salon: ${salonId}`);
      dispatch(fetchBarberQueueAsync({ salonId, barberId: user.barberId }))
        .finally(() => {
          setIsLoading(false);
        });
    } else if (user && user.role === 'OWNER' && user.primarySalonId) {
      // إذا كان المستخدم مالك صالون، نستخدم معرف الصالون الرئيسي
      const ownerSalonId = user.primarySalonId;
      console.log(`Owner detected. Fetching queue for salon: ${ownerSalonId}`);
      dispatch(fetchActiveQueueAsync(ownerSalonId))
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      // إذا لم يكن لدينا معرف الحلاق، نستخدم القائمة العامة للصالون كاحتياطي
      console.log(`Using default salon ID: ${salonId}`);
      dispatch(fetchActiveQueueAsync(salonId))
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [dispatch, user]);

  // handlers يرسلوا الـ actions
  const handleClientAction = (section, clientId, action) => {
    // In a real app, you'd need to get the actual entryId from your data
    // For now, assuming entryId is the same as clientId
    const entryId = clientId;
    
    // For startSession, we need a barberId
    // Using the user's barberId from Redux
    const barberId = user?.barberId || 1;
    
    // For endSession, we need a servicePrice
    // For now, using a default value of 50
    const servicePrice = 50;
    
    switch (action) {
      case "start":
        // Check if there are already clients in the "in-session" section
        if (clients["in-session"] && clients["in-session"].length > 0) {
          // Show a more prominent toast notification
          toast.error("Cannot start a new session: Another client is already in service", {
            duration: 4000,
            style: {
              background: '#FEE2E2',
              color: '#991B1B',
              fontWeight: 'bold',
              padding: '16px',
              borderRadius: '8px',
            },
          });
          return; // Exit the function early to prevent the dispatch
        }
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
      {/* Custom error notifications from Redux */}
      <Toaster />
      
      {/* Hot Toast notification container - for immediate feedback */}
      <HotToaster position="top-right" />
      
      {/* Full-page loading overlay using local state for immediate feedback */}
      {isLoading && <LoadingSpinner />}
      
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Here's your queue overview
        </h1>
        
        {/* Only show error state */}
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
