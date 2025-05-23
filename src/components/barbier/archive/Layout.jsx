// import React, { useState } from 'react';
// import { Sidebar } from './Sidebar';
// import { NotificationBell } from './NotificationBell';
// import { UserCircle } from 'lucide-react';

// export function Layout({ children, activePage, onNavigate }) {
//   const [showProfileMenu, setShowProfileMenu] = useState(false);
//   console.log(showProfileMenu);
//   return (
//     <div className="flex w-full min-h-screen bg-[#f9fafb]">
//       <Sidebar activePage={activePage} onNavigate={onNavigate} />
//       <div className="flex-1 flex flex-col">
//         <header className="h-16 bg-white border-b border-[#e5e7eb] flex items-center justify-end px-6 shadow-sm">
//           <div className="flex items-center gap-4">
//             <NotificationBell />
//             <div className="relative">
//               <button
//                 onClick={() => setShowProfileMenu(!showProfileMenu)}
//                 className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200"
//               >
//                 <img
//                   src="https://randomuser.me/api/portraits/men/85.jpg"
//                   alt="Barber"
//                   className="w-8 h-8 rounded-full object-cover"
//                 />
//                 <UserCircle size={20} className="text-gray-400" />
//               </button>
//               {showProfileMenu && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#e5e7eb] py-1 z-10">
//                   <button className="w-full text-left px-4 py-2 text-sm text-[#111827] hover:bg-gray-50 transition-colors duration-200">
//                     View Profile
//                   </button>
//                   <button className="w-full text-left px-4 py-2 text-sm text-[#111827] hover:bg-gray-50 transition-colors duration-200">
//                     Settings
//                   </button>
//                   <div className="border-t border-[#e5e7eb] my-1"></div>
//                   <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors duration-200">
//                     Sign Out
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </header>
//         <main className="flex-1 p-6 overflow-auto bg-[#f9fafb]">{children}</main>
//       </div>
//     </div>
//   );
// }
