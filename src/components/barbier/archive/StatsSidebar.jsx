// import React from 'react';
// import {
//   UsersIcon,
//   ClockIcon,
//   AlertTriangleIcon,
//   StarIcon
// } from 'lucide-react';

// export function StatsSidebar() {
//   const stats = [
//     {
//       label: 'Total served today',
//       value: '12',
//       icon: <UsersIcon size={16} className="text-blue-500" />
//     },
//     {
//       label: 'Avg session time',
//       value: '32 min',
//       icon: <ClockIcon size={16} className="text-green-500" />
//     },
//     {
//       label: 'Late clients',
//       value: '15%',
//       icon: <AlertTriangleIcon size={16} className="text-amber-500" />
//     },
//     {
//       label: 'Trust average',
//       value: '4.8/5',
//       icon: <StarIcon size={16} className="text-purple-500" />
//     }
//   ];

//   return (
//     <div className="w-64 bg-white rounded-lg border border-gray-200 shadow-sm p-4 h-fit">
//       <h3 className="text-lg font-medium text-gray-800 mb-4">Today's Stats</h3>
//       <div className="space-y-4">
//         {stats.map((stat, index) => (
//           <div key={index} className="flex items-center">
//             <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
//               {stat.icon}
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">{stat.label}</p>
//               <p className="font-medium text-gray-800">{stat.value}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
