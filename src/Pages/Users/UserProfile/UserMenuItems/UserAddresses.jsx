import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, MapPin } from "lucide-react";
import { toast } from "react-toastify";
import { useAppContext } from "../../../../Context/AppContext";
import AddressCardSkeleton from "../../../../Layout/Skeleton/AddressCardSkeleton";
import OpenModel from "../../../../Components/OpenModel";
import AddressModal from "../../../../Components/AddressModal";

const UserAddresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(null);
  const { axios, user } = useAppContext();
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    addressId: null,
  });

  useEffect(() => {
    const uid = user?._id;
    if (uid) {
      ensureProfile(uid).then(() => fetchAddresses(uid));
    } else {
      setLoading(false);
    }
  }, [user]);

  const ensureProfile = async (uid) => {
    try {
      await axios.post(`/api/profile/create/${uid}`);
    } catch (e) {
      // ignore if exists
    }
  };

  const fetchAddresses = async (uid) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/profile/${uid}`);
      const data = response.data;
      if (data && data.profile && Array.isArray(data.profile.addresses)) {
        setAddresses(data.profile.addresses);
      } else {
        setAddresses([]);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Failed to fetch addresses");
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditMode(false);
    setShowModal(true);
  };

  const handleEdit = (address) => {
    setEditMode(true);
    setCurrentAddress(address);
    setShowModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete(`/api/addresses/remove/${user._id}/${deleteModal.addressId}`);

      if (response.status === 200) {
        setAddresses(
          addresses.filter((addr) => addr._id !== deleteModal.addressId)
        );
        toast.success("Address deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Failed to delete address");
    } finally {
      setDeleteModal({ isOpen: false, addressId: null });
    }
  };

  const handleSaveAddress = async (formData) => {
    try {
      if (editMode) {
        const response = await axios.put(
          `/api/addresses/edit/${user._id}/${currentAddress._id}`,
          formData
        );
        if (response.status === 200) {
          fetchAddresses(user._id);
          toast.success("Address updated successfully");
          setShowModal(false);
        }
      } else {
        const response = await axios.post(`/api/addresses/add/${user._id}`, formData);
        if (response.status === 200 || response.status === 201) {
          fetchAddresses(user._id);
          toast.success("Address added successfully");
          setShowModal(false);
        }
      }
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error(editMode ? "Failed to update address" : "Failed to add address");
    }
  };

  return (
    <div>
      <div className="w-full">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Addresses
            </h1>
            <p className="text-gray-600 mt-1">Manage your delivery addresses</p>
          </div>
          <button
            onClick={handleAddNew}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm w-full sm:w-auto"
          >
            <Plus size={20} />
            Add New Address
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <AddressCardSkeleton />
            <AddressCardSkeleton />
          </div>
        ) : addresses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No addresses yet
            </h3>
            <p className="text-gray-600 mb-4">
              Add your first delivery address to get started
            </p>
            <button
              onClick={handleAddNew}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Address
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {addresses.map((address) => (
              <div
                key={address._id}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow relative"
              >
                <span className="absolute top-4 right-4 bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                  {address.label || "Home"}
                </span>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {address.name}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">{address.phone}</p>
                </div>
                <div className="text-gray-700 space-y-1 mb-4">
                  <p>
                    {address.doorNo}, {address.street}
                  </p>
                  <p>
                    {address.city}, {address.state} - {address.postalCode}
                  </p>
                  <p>{address.country}</p>
                </div>
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleEdit(address)}
                    className="flex items-center gap-2 flex-1 justify-center bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteModal({ isOpen: true, addressId: address._id })}
                    className="flex items-center gap-2 flex-1 justify-center bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddressModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        editMode={editMode}
        addressToEdit={currentAddress}
        userId={user?._id}
        onSave={handleSaveAddress}
      />

      <OpenModel
        isOpen={deleteModal.isOpen}
        title="Delete Address"
        message="Are you sure you want to delete this address? This action cannot be undone."
        btnMessage="Delete"
        onClose={() => setDeleteModal({ isOpen: false, addressId: null })}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default UserAddresses;
