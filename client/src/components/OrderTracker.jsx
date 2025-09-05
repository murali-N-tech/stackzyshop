import React from 'react';
import { FaBox, FaShippingFast, FaCheckCircle } from 'react-icons/fa';

const OrderTracker = ({ status }) => {
  const steps = ['Processing', 'Shipped', 'Delivered'];
  const currentStepIndex = steps.indexOf(status);

  const getStepClass = (index) => {
    if (index < currentStepIndex) return 'completed';
    if (index === currentStepIndex) return 'active';
    return 'upcoming';
  };

  const icons = [<FaBox size={24} />, <FaShippingFast size={24} />, <FaCheckCircle size={24} />];

  return (
    <div className="w-full my-12">
      <div className="flex justify-between items-center relative">
        {/* Progress Bar */}
        <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-200 transform -translate-y-1/2">
          <div
            className="absolute left-0 top-0 h-full bg-green-500 transition-all duration-500 ease-in-out"
            style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>

        {steps.map((step, index) => (
          <div key={step} className="z-10 flex flex-col items-center text-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                ${getStepClass(index) === 'completed' ? 'bg-green-500 text-white' : ''}
                ${getStepClass(index) === 'active' ? 'bg-blue-600 text-white scale-110' : ''}
                ${getStepClass(index) === 'upcoming' ? 'bg-gray-300 text-gray-600' : ''}
              `}
            >
              {icons[index]}
            </div>
            <p className={`mt-3 font-semibold text-sm sm:text-base transition-colors duration-300
              ${getStepClass(index) === 'upcoming' ? 'text-gray-500' : 'text-gray-800'}
            `}>
              {step}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderTracker;