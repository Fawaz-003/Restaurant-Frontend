import React from 'react';
import { Check, User, Truck, CreditCard } from 'lucide-react';

const ProgressBar = ({ currentStep, onStepClick }) => {
  const steps = [
    { number: 1, label: 'Login', icon: User },
    { number: 2, label: 'Address', icon: Truck },
    { number: 3, label: 'Payment', icon: CreditCard },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center text-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  currentStep >= step.number ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {currentStep > step.number ? <Check className="w-5 h-5" /> : step.number}
              </div>
              <p className={`mt-2 text-xs font-medium ${currentStep >= step.number ? 'text-gray-900' : 'text-gray-500'}`}>{step.label}</p>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-auto border-t-2 transition-colors duration-300 mx-4 mb-5 ${
                currentStep > index + 1 ? 'border-indigo-600' : 'border-gray-200'
              }`}></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;