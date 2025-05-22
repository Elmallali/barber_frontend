import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SalonCard } from '../../components/client/Booking/SalonCard';
import { UserIcon } from 'lucide-react';

export const SelectSalonPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { city, neighborhood } = location.state || {};

  const [selectedSalon, setSelectedSalon] = useState(null);
  const [selectedBarber, setSelectedBarber] = useState(null);

  const salons = [
    {
      id: 1,
      name: 'Salon Al Afdal',
      description: 'Traditional Moroccan barbershop with modern techniques',
      waitTime: '~15 min',
      barbers: [
        { id: 101, name: 'Yassine', experience: '5 yrs' },
        { id: 102, name: 'Khalid', experience: '3 yrs' }
      ]
    },
    {
      id: 2,
      name: 'Zine Coiffure',
      description: 'Luxury grooming experience for the modern gentleman',
      waitTime: '~25 min',
      barbers: [
        { id: 201, name: 'Hamza', experience: '6 yrs' },
        { id: 202, name: 'Anas', experience: '4 yrs' }
      ]
    }
  ];

  const handleSalonSelect = (salon) => {
    setSelectedSalon(salon);
    setSelectedBarber(null); // reset barber when changing salon
  };

  const handleConfirm = () => {
    if (selectedSalon && selectedBarber) {
      navigate('/client/confirmation', {
        state: {
          salon: selectedSalon,
          barber: selectedBarber,
          city,
          neighborhood
        }
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Select a Salon in {city}, {neighborhood}</h1>

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
            {selectedSalon.barbers.map((barber) => (
              <motion.button
                key={barber.id}
                onClick={() => setSelectedBarber(barber)}
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
