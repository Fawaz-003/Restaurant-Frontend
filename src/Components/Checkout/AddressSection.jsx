import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Home, Check, X, Navigation, Plus } from "lucide-react";

const AnimatedInput = ({ label, value, onChange, placeholder, example, type = "text", maxLength }) => {
  const [isFocused, setIsFocused] = useState(false);
  const isFilled = Boolean(value && String(value).length > 0);

  return (
    <motion.div className="relative w-full h-[70px]">
      <motion.label
        htmlFor={label}
        className="absolute left-4 text-gray-500 text-sm pointer-events-none"
        animate={
          isFilled || isFocused
            ? { top: 6, fontSize: "11px", color: "#16A34A" }
            : { top: 22, fontSize: "14px", color: "#6B7280" }
        }
        transition={{ duration: 0.25 }}
      >
        {label}
      </motion.label>

      <motion.input
        id={label}
        value={value}
        onChange={onChange}
        type={type}
        maxLength={maxLength}
        className={`w-full px-4 pt-6 pb-2 text-sm sm:text-base border rounded-xl focus:outline-none
          ${isFocused ? "border-green-500 ring-2 ring-green-200" : "border-gray-300"}`}
        placeholder={isFocused ? placeholder : ""}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        whileFocus={{ y: -2 }}
        transition={{ type: "spring", stiffness: 250, damping: 20 }}
      />

      {isFocused && example && (
        <span className="absolute left-4 bottom-[-18px] text-xs sm:text-sm text-gray-400">{example}</span>
      )}

      <div className="absolute left-4 right-4 bottom-2 h-[2px] bg-gray-200 rounded overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: isFocused || isFilled ? "100%" : "0%" }}
          transition={{ duration: 0.3 }}
          className="h-full bg-green-500"
        />
      </div>
    </motion.div>
  );
};

const modalBackdrop = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
const modalCard = {
  hidden: { opacity: 0, scale: 0.96, y: 8 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.22, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.98, y: 6, transition: { duration: 0.18 } },
};
const btnTap = { scale: 0.98 };

const AddressSection = ({ addresses, selectedAddress, onSelectAddress, onAddNewAddress }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: "",
    street: "",
    address: "",
    phone: "",
    area: "",
  });

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const detectLocation = () => {
    setIsDetectingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            const detectedAddress = data.display_name || "";
            const area =
              data.address?.suburb ||
              data.address?.neighbourhood ||
              data.address?.city ||
              "";
            setNewAddress((prev) => ({ ...prev, address: detectedAddress, area }));
          } catch {
            alert("Could not detect address.");
          } finally {
            setIsDetectingLocation(false);
          }
        },
        () => {
          alert("Location access denied.");
          setIsDetectingLocation(false);
        }
      );
    } else {
      alert("Geolocation not supported.");
      setIsDetectingLocation(false);
    }
  };

  const handleAddAddress = () => {
    if (newAddress.label && newAddress.street && newAddress.address && newAddress.phone) {
      const newAddr = {
        id: addresses.length + 1,
        ...newAddress,
        deliveryTime: "45-60 MINS",
      };
      onAddNewAddress(newAddr);
      setShowAddForm(false);
      setNewAddress({ label: "", street: "", address: "", phone: "", area: "" });
    } else {
      alert("Please fill all fields.");
    }
  };

  if (selectedAddress) {
    return (
      <div className="bg-white lg:bg-gray-100 lg:p-6">
        <div className="flex flex-row justify-between items-center mb-4 lg:mb-6 gap-2 lg:gap-3">

          <div className="flex items-center gap-2 w-auto">
            <div className="bg-black p-2 rounded flex-shrink-0">
              <MapPin className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
            </div>

            <div className="flex items-center gap-2 min-w-0">
              <h2 className="text-base lg:text-xl font-semibold truncate">
                Delivery address
              </h2>

              {/* Green tick only on desktop */}
              <div className="bg-green-500 rounded-full p-1 hidden lg:block flex-shrink-0">
                <Check className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
              </div>
            </div>
          </div>

          <button
            onClick={() => onSelectAddress(null)}
            className="text-orange-500 font-semibold text-sm hover:text-orange-600 flex-shrink-0"
          >
            CHANGE
          </button>

        </div>


        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-4 lg:p-6 border border-green-500/40">
          <div className="flex items-start gap-3 lg:gap-4">
            <div className="p-2 rounded bg-gray-50 flex-shrink-0">
              <Home className="w-5 h-5 lg:w-6 lg:h-6 text-black" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg lg:text-xl font-semibold mb-2">{selectedAddress.label}</h2>
              <p className="text-gray-600 text-sm mb-1 lg:mb-2">{selectedAddress.street}</p>
              <p className="text-gray-600 text-sm mb-1 lg:mb-2 line-clamp-2">{selectedAddress.address}</p>
              <p className="text-gray-800 font-medium text-sm lg:text-base">{selectedAddress.phone}</p>
              {/* <p className="text-green-600 font-semibold text-sm mt-2 lg:mt-3">{selectedAddress.deliveryTime}</p> */}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white lg:bg-gray-100">
      <div className="max-w-6xl mx-auto px-0 lg:px-0">
        <div className="flex items-start lg:items-center gap-3 mb-4 lg:mb-6 px-4">
          <div className="bg-black p-2 rounded flex-shrink-0 mt-1 lg:mt-0">
            <MapPin className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base lg:text-xl font-semibold mb-1">Select delivery address</h1>
            <p className="text-gray-600 text-xs lg:text-sm">You have a saved address in this location</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-6 px-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="border border-gray-200 bg-white rounded-xl p-4 lg:p-6 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded bg-gray-50 flex-shrink-0">
                  <Home className="w-5 h-5 lg:w-6 lg:h-6 text-gray-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base lg:text-lg font-semibold">{addr.label}</h3>
                  <p className="text-gray-600 text-xs lg:text-sm mt-1 line-clamp-2">{addr.address}</p>
                  <p className="text-gray-800 text-xs lg:text-sm mt-1">{addr.phone}</p>
                  {/* <p className="text-green-600 font-semibold text-xs lg:text-sm mt-2">{addr.deliveryTime}</p> */}
                </div>
              </div>

              <motion.button
                onClick={() => onSelectAddress(addr)}
                whileTap={btnTap}
                className="w-full mt-3 lg:mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold text-sm py-2 lg:py-3 rounded-lg"
              >
                DELIVER HERE
              </motion.button>
            </div>
          ))}

          <div className="border border-gray-200 bg-white rounded-xl p-4 lg:p-6 shadow-sm flex flex-col">
            <div className="flex items-start gap-3 mb-3 lg:mb-4">
              <div className="p-2 rounded bg-gray-50 flex-shrink-0">
                <Plus className="w-5 h-5 lg:w-6 lg:h-6 text-gray-700" />
              </div>
              <div>
                <h3 className="text-base lg:text-lg font-semibold">Add New Address</h3>
                <p className="text-gray-600 text-xs lg:text-sm mt-1">Add a new delivery location</p>
              </div>
            </div>

            <motion.button
              onClick={() => setShowAddForm(true)}
              whileTap={btnTap}
              className="w-full border-2 border-green-500 text-green-600 font-semibold py-2 text-sm lg:py-3 rounded-lg hover:bg-green-50"
            >
              ADD NEW
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div
            className="fixed inset-0 z-50 flex items-start lg:items-center justify-center p-2 lg:p-4 overflow-y-auto"
            variants={modalBackdrop}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className="relative bg-white rounded-2xl shadow-2xl p-4 lg:p-6 md:p-8 w-full max-w-md lg:max-w-lg my-4 lg:my-0"
              variants={modalCard}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <button
                onClick={() => setShowAddForm(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-xl lg:text-2xl font-semibold mb-4">Add New Address</h2>

              <div className="space-y-3 lg:space-y-4">
                <div>
                  <label className="text-sm lg:text-base font-medium">Select Label</label>
                  <div className="flex gap-2 lg:gap-3 mt-2 flex-wrap">
                    {["Home", "Office", "Hotel"].map((item) => (
                      <motion.button
                        key={item}
                        onClick={() => setNewAddress((p) => ({ ...p, label: item }))}
                        whileTap={{ scale: 0.97 }}
                        className={`px-3 py-1 lg:px-4 lg:py-2 rounded-lg border text-sm lg:text-base font-medium ${newAddress.label === item
                            ? "bg-green-500 text-white border-green-600"
                            : "border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                      >
                        {item}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <AnimatedInput
                  label="Street Name"
                  value={newAddress.street}
                  onChange={(e) => setNewAddress((p) => ({ ...p, street: e.target.value }))}
                  placeholder="Eg: Mosque Street"
                />

                <div>
                  <label className="text-sm lg:text-base font-medium block mb-2">Full Address</label>
                  <motion.textarea
                    rows={3}
                    value={newAddress.address}
                    onChange={(e) => setNewAddress((p) => ({ ...p, address: e.target.value }))}
                    whileFocus={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 250, damping: 20 }}
                    className="w-full px-4 py-3 border rounded-xl text-sm lg:text-base focus:outline-none"
                    placeholder="Enter complete address"
                  />
                </div>

                <AnimatedInput
                  label="Phone Number"
                  value={newAddress.phone}
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setNewAddress((p) => ({ ...p, phone: cleaned }));
                  }}
                  placeholder="10-digit mobile number"
                  type="tel"
                  maxLength={10}
                />

                <motion.button
                  onClick={detectLocation}
                  whileTap={{ scale: 0.98 }}
                  disabled={isDetectingLocation}
                  className="flex items-center gap-2 text-green-600 font-medium"
                >
                  <Navigation className="w-4 h-4 lg:w-5 lg:h-5" />
                  {isDetectingLocation ? "Detecting..." : "Use current location"}
                </motion.button>

                {newAddress.area && (
                  <div className="bg-green-50 p-2 text-sm lg:text-base rounded-lg">
                    Detected Area: <span className="font-semibold">{newAddress.area}</span>
                  </div>
                )}

                <div className="flex flex-col lg:flex-row gap-2 lg:gap-3 mt-3">
                  <motion.button
                    onClick={() => setShowAddForm(false)}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 border border-gray-300 py-2 rounded-lg"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={handleAddAddress}
                    whileTap={{ scale: 0.98 }}
                    disabled={
                      !newAddress.label ||
                      !newAddress.street ||
                      !newAddress.address ||
                      !newAddress.phone
                    }
                    className={`flex-1 py-2 rounded-lg text-white ${newAddress.label &&
                        newAddress.street &&
                        newAddress.address &&
                        newAddress.phone
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-gray-300 cursor-not-allowed"
                      }`}
                  >
                    Save Address
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddressSection;