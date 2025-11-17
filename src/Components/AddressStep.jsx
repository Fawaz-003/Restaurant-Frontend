import React from 'react';
import { PlusCircle, Edit2 } from 'lucide-react';

const AddressStep = ({
  addresses,
  selectedAddress,
  handleAddressSelect,
  handleAddNewAddress,
  handleEditAddress,
  onContinue,
}) => {
  const isContinueDisabled = !selectedAddress;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Delivery Address</h3>
      
      <div className="space-y-4">
        {addresses.map((addr) => {
          const isSelected = selectedAddress?._id === addr._id;
          return (
            <label
              key={addr._id}
              className={`p-4 border rounded-lg cursor-pointer transition-all flex items-start gap-4 ${
                isSelected
                  ? "border-indigo-500 ring-2 ring-indigo-200"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <input
                type="radio"
                name="address"
                checked={isSelected}
                onChange={() => handleAddressSelect(addr)}
                className="mt-1 h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <p className="font-semibold">{addr.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-gray-100 text-gray-600 font-medium px-2 py-0.5 rounded-full">{addr.label}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleEditAddress(addr);
                      }}
                      className="text-gray-500 hover:text-indigo-600 p-1 rounded-full hover:bg-gray-100"
                    >
                      <Edit2 size={14} />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  {addr.doorNo}, {addr.street}, {addr.city}, {addr.state} - {addr.postalCode}
                </p>
                <p className="text-sm text-gray-600">{addr.country} | Phone: {addr.phone}</p>
              </div>
            </label>
          );
        })}
        <button
          onClick={handleAddNewAddress}
          className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg transition-all border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-600"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Add new address</span>
        </button>
      </div>

      <div className="mt-8">
        <button
          onClick={onContinue}
          disabled={isContinueDisabled}
          className="w-full py-3 rounded-lg font-semibold text-white transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
};

export default AddressStep;