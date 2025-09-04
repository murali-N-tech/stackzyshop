import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const CheckoutStep = ({ number, title, active, completed }) => (
  <div className="flex items-center">
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
        completed ? 'bg-green-500' : active ? 'bg-blue-600' : 'bg-gray-400'
      }`}
    >
      {completed ? <FaCheckCircle /> : number}
    </div>
    <span className={`ml-3 font-semibold ${active || completed ? 'text-gray-800' : 'text-gray-500'}`}>
      {title}
    </span>
  </div>
);

const CheckoutSteps = ({ currentStep }) => {
  const steps = ['Shipping', 'Payment', 'Place Order'];
  const stepKey = {
    'Shipping': 1,
    'Payment': 2,
    'Place Order': 3,
  };

  return (
    <div className="flex justify-between items-center mb-8 bg-gray-100 p-4 rounded-lg">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <CheckoutStep
            number={index + 1}
            title={step}
            active={stepKey[step] === currentStep}
            completed={stepKey[step] < currentStep}
          />
          {index < steps.length - 1 && <div className="flex-grow border-t-2 mx-4 border-gray-300"></div>}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CheckoutSteps;