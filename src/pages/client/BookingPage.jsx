import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { MapPinIcon, SearchIcon, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { setSelectedCity, setSelectedNeighborhood, fetchActiveBooking } from '../../store/slices/bookingSlice';
import { getAvailableLocations } from '../../service/bookingService';

export const BookingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedCity, selectedNeighborhood, activeBooking } = useSelector(state => state.booking);
  const { user } = useSelector(state => state.auth);
  const [search, setSearch] = useState('');
  const [locationData, setLocationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Check if user already has an active booking
  useEffect(() => {
    if (user?.clientId) {
      dispatch(fetchActiveBooking(user.clientId));
    }
  }, [dispatch, user]);
  
  // Redirect to queue page if user has active booking
  useEffect(() => {
    if (activeBooking) {
      toast('You already have an active booking');
      navigate('/client/queue');
    }
  }, [activeBooking, navigate]);

  // Fetch available locations from backend
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        
        // Call the real API endpoint to get available locations
        const response = await getAvailableLocations();
        const data = response.data;
        

        // If API fails or returns empty data, use fallback data to ensure UI works
        if (!data || data.length === 0) {
          console.log('fuuuuuucj')
          // Fallback data
          setLocationData([
            {
              city: 'Taza',
              neighborhoods: ['Hay Al Qods 1']
            }
          ]);
          toast.warning('Using fallback location data');
        } else {
          setLocationData(data);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching locations:', err);
        // Fallback data in case of error
        setLocationData([
          {
            city: 'Taza',
            neighborhoods: ['Hay Al Qods 1']
          }
        ]);
        setError('Failed to load locations from server. Using fallback data.');
        setLoading(false);
        toast.error('Failed to load locations from server');
      }
    };
    
    fetchLocations();
  }, []);

  const filteredCities = locationData.filter(loc =>
    loc.city.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = () => {
    if (selectedCity && selectedNeighborhood) {
      try {
        // No need to pass city/neighborhood in location state since they're in Redux
        navigate('/client/select-salon');
      } catch (error) {
        toast.error('Error starting booking process');
      }
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl font-bold mb-6">Select Your City & Neighborhood</h1>

        {/* Loading state */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-2">Loading available locations...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">
            {error}
          </div>
        ) : (
          <>
            {/* 🔍 Search Input */}
            <div className="relative mb-6">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search city..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <SearchIcon className="absolute left-3 top-3 text-gray-400" size={18} />
            </div>

            {/* City selection */}
            <label className="block text-sm font-medium text-gray-700 mb-2">Select City</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6 max-h-[200px] overflow-y-auto">
              {filteredCities.map((loc) => (
                <button
                  key={loc.city}
                  onClick={() => {
                    dispatch(setSelectedCity(loc.city));
                    dispatch(setSelectedNeighborhood(''));
                  }}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    selectedCity === loc.city
                      ? 'bg-blue-50 text-blue-700 border-blue-300'
                      : 'bg-gray-50 text-gray-700 border-transparent hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center">
                    <MapPinIcon size={16} className="mr-2" />
                    {loc.city}
                  </div>
                </button>
              ))}
            </div>

            {/* Neighborhood selection */}
            {selectedCity && (
              <>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Neighborhood</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[250px] overflow-y-auto pr-2">
                  {locationData
                    .find((loc) => loc.city === selectedCity)
                    ?.neighborhoods.map((n) => (
                      <button
                        key={n}
                        onClick={() => dispatch(setSelectedNeighborhood(n))}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          selectedNeighborhood === n
                            ? 'bg-green-50 text-green-700 border-green-300'
                            : 'bg-gray-50 text-gray-700 border-transparent hover:bg-gray-100'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                </div>
              </>
            )}

            {/* Submit button */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={!selectedCity || !selectedNeighborhood}
                className={`px-6 py-3 rounded-xl text-white font-semibold transition-all ${
                  selectedCity && selectedNeighborhood
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                Continue
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};
