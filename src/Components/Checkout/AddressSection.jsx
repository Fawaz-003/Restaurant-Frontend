import React, { useState } from 'react';
import { MapPin, Home, Plus, X } from 'lucide-react';

const AddressSection = ({ 
  addresses, 
  selectedAddress, 
  onSelectAddress, 
  onAddNewAddress 
}) => {
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: 'Home',
    street: '',
    city: '',
    state: '',
    pincode: ''
  });

  const handleAddAddress = () => {
    if (newAddress.street && newAddress.city && newAddress.state && newAddress.pincode) {
      const fullAddress = `${newAddress.street}, ${newAddress.city}, ${newAddress.state} ${newAddress.pincode}, India`;
      onAddNewAddress({
        id: Date.now(),
        label: newAddress.label,
        address: fullAddress,
        deliveryTime: '40 mins'
      });
      setNewAddress({ label: 'Home', street: '', city: '', state: '', pincode: '' });
      setShowAddressForm(false);
    }
  };

  if (showAddressForm) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-800">Add New Address</h3>
          <button
            onClick={() => setShowAddressForm(false)}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            {['Home', 'Work', 'Other'].map((label) => (
              <button
                key={label}
                onClick={() => setNewAddress({ ...newAddress, label })}
                className={`px-4 py-3 border rounded-lg font-medium transition ${
                  newAddress.label === label
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 text-gray-600 hover:border-gray-400'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Street Address *"
            value={newAddress.street}
            onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="City *"
              value={newAddress.city}
              onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
            />
            <input
              type="text"
              placeholder="State *"
              value={newAddress.state}
              onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
            />
          </div>
          <input
            type="text"
            placeholder="Pincode *"
            value={newAddress.pincode}
            onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
          />
          <button
            onClick={handleAddAddress}
            disabled={!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.pincode}
            className={`w-full py-4 rounded-lg font-semibold transition ${
              newAddress.street && newAddress.city && newAddress.state && newAddress.pincode
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Save Address
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
          <MapPin className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Select Delivery Address</h2>
          <p className="text-sm text-gray-500">Choose where to deliver your order</p>
        </div>
      </div>

      <div className="space-y-4">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            onClick={() => onSelectAddress(addr.id)}
            className={`border-2 rounded-xl p-4 cursor-pointer transition ${
              selectedAddress === addr.id
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <Home className="w-5 h-5 text-gray-600 mt-1" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-800">{addr.label}</h3>
                  <span className="text-sm font-medium text-gray-600">{addr.deliveryTime}</span>
                </div>
                <p className="text-sm text-gray-600">{addr.address}</p>
              </div>
              {selectedAddress === addr.id && (
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </div>
          </div>
        ))}

        <button
          onClick={() => setShowAddressForm(true)}
          className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center gap-3 text-gray-600 hover:border-green-500 hover:text-green-600 transition group"
        >
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition">
            <Plus className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-center">
            <div className="font-semibold">Add New Address</div>
            <div className="text-sm mt-1">Add a new delivery location</div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default AddressSection;