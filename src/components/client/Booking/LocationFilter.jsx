import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPinIcon, XIcon, SearchIcon } from 'lucide-react';

export const LocationFilter = ({ locations, onLocationSelect }) => {
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('');
  const [availableNeighborhoods, setAvailableNeighborhoods] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (selectedCity) {
      const cityData = locations.find(loc => loc.city === selectedCity);
      setAvailableNeighborhoods(cityData?.neighborhoods || []);
      setSelectedNeighborhood('');
    }
  }, [selectedCity, locations]);

  useEffect(() => {
    if (searchQuery) {
      const allCities = locations.map(loc => loc.city);
      const allNeighborhoods = locations.flatMap(loc => loc.neighborhoods);

      const matchingCities = allCities
        .filter(city => city.toLowerCase().includes(searchQuery.toLowerCase()))
        .map(city => ({ type: 'city', value: city }));

      const matchingNeighborhoods = allNeighborhoods
        .filter(nb => nb.toLowerCase().includes(searchQuery.toLowerCase()))
        .map(nb => ({ type: 'neighborhood', value: nb }));

      setSuggestions([...matchingCities, ...matchingNeighborhoods]);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, locations]);

  const handleCitySelect = (city) => {
    setSelectedCity(city);
  };

  const handleNeighborhoodSelect = (neighborhood) => {
    setSelectedNeighborhood(neighborhood);
    onLocationSelect(selectedCity, neighborhood);
  };

  const clearSelection = () => {
    setSelectedCity('');
    setSelectedNeighborhood('');
  };

  const handleSuggestionSelect = (suggestion) => {
    if (suggestion.type === 'city') {
      handleCitySelect(suggestion.value);
    } else {
      const city = locations.find(loc => loc.neighborhoods.includes(suggestion.value));
      if (city) {
        handleCitySelect(city.city);
        handleNeighborhoodSelect(suggestion.value);
      }
    }
    setSearchQuery('');
  };

  return (
    <div className="space-y-6">
      <div className="sticky top-0 bg-white z-10 pb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search for city or neighborhood..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
          />
          {searchQuery && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute mt-1 w-full bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50"
            >
              {suggestions.map((suggestion) => (
                <motion.button
                  key={`${suggestion.type}-${suggestion.value}`}
                  whileHover={{ backgroundColor: 'rgb(243 244 246)' }}
                  onClick={() => handleSuggestionSelect(suggestion)}
                  className="w-full px-4 py-3 text-left flex items-center space-x-2 hover:bg-gray-50"
                >
                  <MapPinIcon size={16} className={suggestion.type === 'city' ? 'text-blue-500' : 'text-green-500'} />
                  <span className="flex-1">{suggestion.value}</span>
                  <span className="text-xs text-gray-400 capitalize">{suggestion.type}</span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Select City</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {locations.map(location => (
            <motion.button
              key={location.city}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCitySelect(location.city)}
              className={`p-4 rounded-xl text-left transition-all duration-200 ${
                selectedCity === location.city
                  ? 'bg-blue-50 text-blue-700 border-2 border-blue-200 shadow-sm'
                  : 'bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center">
                <MapPinIcon size={18} className={`mr-2 ${selectedCity === location.city ? 'text-blue-500' : 'text-gray-400'}`} />
                <span className="font-medium">{location.city}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedCity && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <label className="block text-sm font-medium text-gray-700 mb-3">Select Neighborhood</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableNeighborhoods.map(neighborhood => (
                <motion.button
                  key={neighborhood}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleNeighborhoodSelect(neighborhood)}
                  className={`p-4 rounded-xl text-left transition-all duration-200 ${
                    selectedNeighborhood === neighborhood
                      ? 'bg-green-50 text-green-700 border-2 border-green-200 shadow-sm'
                      : 'bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100'
                  }`}
                >
                  <span className="font-medium">{neighborhood}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(selectedCity || selectedNeighborhood) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex items-center space-x-2"
          >
            <div className="flex flex-wrap gap-2">
              {selectedCity && (
                <motion.span
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-blue-50 text-blue-700 border border-blue-200"
                >
                  {selectedCity}
                  <button onClick={clearSelection} className="ml-2 text-blue-400 hover:text-blue-500 transition-colors">
                    <XIcon size={14} />
                  </button>
                </motion.span>
              )}
              {selectedNeighborhood && (
                <motion.span
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-green-50 text-green-700 border border-green-200"
                >
                  {selectedNeighborhood}
                  <button onClick={() => setSelectedNeighborhood('')} className="ml-2 text-green-400 hover:text-green-500 transition-colors">
                    <XIcon size={14} />
                  </button>
                </motion.span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
