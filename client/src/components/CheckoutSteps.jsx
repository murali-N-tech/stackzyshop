import React from 'react';
import { FaCheckCircle, FaCreditCard, FaShippingFast, FaClipboardList } from 'react-icons/fa';

const CheckoutStep = ({ number, title, active, completed, icon }) => (
  <div className="flex items-center">
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition-all duration-300 ${
        completed ? 'bg-green-500' : active ? 'bg-blue-600' : 'bg-gray-400'
      }`}
    >
      {completed ? <FaCheckCircle size={20} /> : icon}
    </div>
    <span className={`ml-3 font-semibold hidden sm:inline ${active || completed ? 'text-gray-800' : 'text-gray-500'}`}>
      {title}
    </span>
  </div>
);

const CheckoutSteps = ({ currentStep }) => {
  const steps = [
    { title: 'Shipping', icon: <FaShippingFast size={20} /> },
    { title: 'Payment', icon: <FaCreditCard size={20} /> },
    { title: 'Place Order', icon: <FaClipboardList size={20} /> },
  ];

  return (
    <div className="flex justify-between items-center mb-12 bg-gray-50 p-4 rounded-xl shadow-sm">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <CheckoutStep
            number={index + 1}
            title={step.title}
            icon={step.icon}
            active={index + 1 === currentStep}
            completed={index + 1 < currentStep}
          />
          {index < steps.length - 1 && <div className={`flex-grow border-t-2 mx-4 transition-all duration-300 ${index + 1 < currentStep ? 'border-green-500' : 'border-gray-300'}`}></div>}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CheckoutSteps;