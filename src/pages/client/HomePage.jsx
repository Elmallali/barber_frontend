import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScissorsIcon, ClockIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { QueueJourneyToggle } from '../../components/client/Booking/QueueJourneyToggle';
import { fetchLastVisit } from '../../service/clientService';





export const HomePage = ({ user }) => {
  const navigate = useNavigate();
  const [lastVisit, setLastVisit] = useState({
    days_ago: null,
    salon_name: null,
    loading: true
  });

  useEffect(() => {
    const getLastVisit = async () => {
      try {
        const data = await fetchLastVisit();
        setLastVisit({
          days_ago: data.days_ago,
          salon_name: data.salon_name,
          loading: false
        });
      } catch (error) {
        console.error('Error fetching last visit:', error);
        setLastVisit({
          days_ago: null,
          salon_name: null,
          loading: false
        });
      }
    };

    getLastVisit();
  }, []);

  const handleBookNow = () => {
    navigate('booking');
  };

  return (
    <div className="flex flex-col md:flex-row h-full md:h-[calc(100vh-120px)]">
      <div className="w-full md:w-1/2 flex flex-col justify-center p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome back, {user.name.split(' ')[0]}!
          </h1>
          <p className="text-gray-600 text-lg">
            Ready for your next professional haircut?
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <button
            onClick={handleBookNow}
            className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-xl text-lg font-medium shadow-sm transition-all duration-200 hover:shadow-md flex items-center justify-center"
          >
            <ScissorsIcon className="mr-2" size={20} />
            Book Your Shave Now
          </button>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-medium">Last Visit</h3>
              {lastVisit.loading ? (
                <p className="text-gray-600">Loading...</p>
              ) : lastVisit.days_ago ? (
                <p className="text-gray-600">{lastVisit.days_ago.toFixed(0)} days ago</p>
              ) : (
                <p className="text-gray-600">No previous visits</p>
              )}
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-medium">Favorite Salon</h3>
              {lastVisit.loading ? (
                <p className="text-gray-600">Loading...</p>
              ) : lastVisit.salon_name ? (
                <p className="text-gray-600">{lastVisit.salon_name}</p>
              ) : (
                <p className="text-gray-600">No favorite salon yet</p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    <QueueJourneyToggle />
    </div>
  );
};
