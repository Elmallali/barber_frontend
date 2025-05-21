import React from 'react';
import { FilterIcon, MapPinIcon } from 'lucide-react';

export function FilterBar() {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <div className="flex-1 min-w-[200px]">
        <div className="relative">
          <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <select className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent">
            <option value="">All Locations</option>
            <option value="downtown">Downtown</option>
            <option value="uptown">Uptown</option>
          </select>
        </div>
      </div>
      <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
        <FilterIcon size={16} />
        <span>Filters</span>
      </button>
    </div>
  );
}
