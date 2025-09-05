import React from 'react';
import { FaBox, FaShippingFast, FaCheckCircle } from 'react-icons/fa';

const OrderTracker = ({ status }) => {
  const steps = ['Processing', 'Shipped', 'Delivered'];
  const currentStepIndex = steps.indexOf(status);

  return (
    <div className="w-full my-8">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center text-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  index <= currentStepIndex ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                }`}
              >
                {index === 0 && <FaBox size={24} />}
                {index === 1 && <FaShippingFast size={24} />}
                {index === 2 && <FaCheckCircle size={24} />}
              </div>
              <p className={`mt-2 font-semibold ${index <= currentStepIndex ? 'text-gray-800' : 'text-gray-500'}`}>
                {step}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-grow h-1 mx-2 ${index < currentStepIndex ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default OrderTracker;