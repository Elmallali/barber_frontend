import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { SalonCard } from '../../components/client/Booking/SalonCard';
import { UserIcon, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { 
  fetchSalonsByLocation, 
  fetchBarbersForSalon,
  setSelectedSalon,
  setSelectedBarber
} from '../../store/slices/bookingSlice';

export const SelectSalonPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { 
    selectedCity, 
    selectedNeighborhood,
    salons,
    selectedSalon,
    selectedBarber,
    barbers,
    loadingSalons,
    loadingBarbers,
    error 
  } = useSelector(state => state.booking);
  
  useEffect(() => {
    // If we don't have city/neighborhood data in Redux, go back to booking page
    if (!selectedCity || !selectedNeighborhood) {
      navigate('/client/booking');
      return;
    }
    
    // Fetch salons based on selected city/neighborhood
    dispatch(fetchSalonsByLocation({ 
      city: selectedCity, 
      neighborhood: selectedNeighborhood 
    }));
  }, [dispatch, selectedCity, selectedNeighborhood, navigate]);

  // We're now getting salons from Redux state

  const handleSalonSelect = (salon) => {
    dispatch(setSelectedSalon(salon));
    dispatch(setSelectedBarber(null)); // reset barber when changing salon
    console.log(salon.id);
    dispatch(fetchBarbersForSalon(salon.id));
  };

  const handleConfirm = () => {
    if (selectedSalon && selectedBarber) {
      // No need to pass data via location state since it's in Redux
      navigate('/client/confirmation');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Select a Salon in {selectedCity}, {selectedNeighborhood}</h1>
      
      {/* Error display */}
      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">{error}</div>}
      
      {/* Loading state */}
      {loadingSalons && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="animate-spin text-blue-500" size={32} />
          <span className="ml-2 text-gray-600">Loading salons...</span>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 mb-10">
        {salons.map((salon) => (
          <SalonCard
            key={salon.id}
            salon={salon}
            isSelected={selectedSalon?.id === salon.id}
            onSelect={() => handleSalonSelect(salon)}
          />
        ))}
      </div>

      {selectedSalon && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow p-6"
        >
          <h2 className="text-lg font-semibold mb-4">Select a Barber at {selectedSalon.name}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {/* Loading state for barbers */}
            {loadingBarbers && (
              <div className="col-span-2 flex justify-center items-center py-6">
                <Loader2 className="animate-spin text-blue-500" size={24} />
                <span className="ml-2 text-gray-600">Loading barbers...</span>
              </div>
            )}
            
            {/* Display barbers list */}
            {!loadingBarbers && barbers.length === 0 && (
              <div className="col-span-2 p-4 border rounded-xl border-orange-200 bg-orange-50 text-orange-700">
                <p className="text-center">
                  No barbers found for this salon. Please try another salon or check back later.
                </p>
                <p className="text-center text-sm mt-2">
                  (The backend data hasn't been fully seeded yet)
                </p>
              </div>
            )}
            
            {!loadingBarbers && barbers.map((barber) => (
              <motion.button
                key={barber.id}
                onClick={() => dispatch(setSelectedBarber(barber))}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 border rounded-xl flex items-center justify-between transition-all duration-200 ${
                  selectedBarber?.id === barber.id
                    ? 'border-blue-500 bg-blue-50 text-blue-800'
                    : 'border-gray-200 text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <UserIcon size={20} />
                  <span className="font-medium">{barber.name}</span>
                </div>
                <span className="text-sm text-gray-500">{barber.experience}</span>
              </motion.button>
            ))}

          </div>

          <div className="mt-6 text-right">
            <button
              onClick={handleConfirm}
              disabled={!selectedBarber}
              className={`px-6 py-3 rounded-xl font-semibold transition ${
                selectedBarber
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Continue to Confirmation
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
