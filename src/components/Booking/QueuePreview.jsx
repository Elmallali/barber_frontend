import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarCheck,
  ClockIcon,
  BellIcon,
  UserCheckIcon,
  ScissorsIcon
} from 'lucide-react';

const steps = [
  {
    id: 'Booking',
    label: 'Booking Confirmed',
    icon: CalendarCheck
  },
  {
    id: 'queue',
    label: 'In Queue',
    icon: ClockIcon
  },
  {
    id: 'invited',
    label: 'Invited',
    icon: BellIcon
  },
  {
    id: 'onsite',
    label: 'Waiting On Site',
    icon: UserCheckIcon
  },
  {
    id: 'service',
    label: 'On Service',
    icon: ScissorsIcon
  }
];

export const QueuePreview = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 3000); // كل 3 ثواني تتغير المرحلة

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Queue Journey</h3>
      <div className="flex items-center justify-center space-x-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isDone = index < currentStep;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`flex flex-col items-center text-center ${
                isDone ? 'text-green-500' : isActive ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-full border-2 ${
                  isDone
                    ? 'border-green-500 bg-green-100'
                    : isActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 bg-gray-100'
                }`}
              >
                <Icon size={20} />
              </div>
              <span className="text-xs mt-2 w-20">{step.label}</span>
            </motion.div>
          );
        })}
      </div>
      <p className="mt-6 text-sm text-gray-600 text-center max-w-md">
        You are currently in the <span className="font-semibold text-blue-600">{steps[currentStep].label}</span> phase. This will auto-advance to simulate your journey.
      </p>


<br />
      <p className="mt-6 text-xs text-gray-500 text-center">
      We notify you when it’s your turn. Join the virtual queue and relax.
    </p>
    </div>
  );
};
