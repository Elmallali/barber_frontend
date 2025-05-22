import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPinIcon, SearchIcon } from 'lucide-react';

export const BookingPage = () => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('');
  const [search, setSearch] = useState('');

  const locationData = [
    {
      city: 'Taza',
      neighborhoods: [
        'Hay Al Qods 1',
        'Hay Al Qods 2',
        'Hay Al Qods 3',
        'Hay Al Massira 1',
        'Hay Al Massira 2',
        'Hay Saada',
        'Hay Ourida',
        'Hay El Wifaq',
        'Hay Tariq Al Wahda',
        'Hay Al Muntazah',
        'Hay Al Amal',
        'Hay Yasmin',
        'Hay Messaoudia',
        'Hay Moulay Youssef',
        'Hay Rachad',
        'Hay Rbaiz',
        'Hay John Kennedy',
        'Douar Mimouna',
        'Hay Afriwatto',
        'Hay Chariaa',
        'Hay Bin Jerradi',
        'Douar Ayad',
        'Douar Jadid',
        'Hay Melha',
        'Bayt Ghlam',
        'Draâ Louz',
        'Lkadda',
        'Hay Lhajra',
        'Jamiae Lkbir',
        'Lahrach',
        'Lamsila',
        'Bab Titi',
        'Bab Rih',
        'Gnawa',
        'Lqloaa',
        'Zawiya',
        'Qattanin',
        'Mchouar',
        'Bab Chari3a',
        'Zqaq Lwali'
      ]
    },
    {
      city: 'Fes',
      neighborhoods: ['Fes El Bali', 'Agdal', 'Sidi Brahim']
    },
    {
      city: 'Rabat',
      neighborhoods: ['Agdal', 'Hay Riad', 'Yacoub El Mansour']
    },
    {
      city: 'Casablanca',
      neighborhoods: ['Maarif', 'Ain Diab', 'Sidi Moumen']
    }
  ];

  const filteredCities = locationData.filter(loc =>
    loc.city.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = () => {
    if (selectedCity && selectedNeighborhood) {
      navigate('/client/select-salon', {
        state: { city: selectedCity, neighborhood: selectedNeighborhood }
      });
    }
  };
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl font-bold mb-6">Select Your City & Neighborhood</h1>

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
                setSelectedCity(loc.city);
                setSelectedNeighborhood('');
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
                    onClick={() => setSelectedNeighborhood(n)}
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
      </motion.div>
    </div>
  );
};
