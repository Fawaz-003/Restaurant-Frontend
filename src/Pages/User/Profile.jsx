import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, LogOut, Plus, ChevronRight, Lock, MapPin } from "lucide-react";

import { ProfileHeader } from "../../Components/Profile/ProfileHeader";
import { MenuItem } from "../../Components/Profile/MenuItem";
import { AddressCard } from "../../Components/Profile/AddressCard";
import { Toast } from "../../Components/Profile/Toast";
import { Modal } from "../../Components/Profile/Modal";

import { AddressForm } from "../../Components/Profile/Forms/AddressForm";
import { ProfileForm } from "../../Components/Profile/Forms/ProfileForm";
import { PasswordForm } from "../../Components/Profile/Forms/PasswordForm";
import { useAppContext } from "../../Context/AppContext";

const Profile = () => {
  const navigate = useNavigate();
  const { userData, setUserData, logout, baseURL } = useAppContext();
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState("addresses");

  const [addresses, setAddresses] = useState([]);
  const [editingAddress, setEditingAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [notifyToggle, setNotifyToggle] = useState(userData?.notification_preferences || true);
  const [emailToggle, setEmailToggle] = useState(userData?.email_subscription || false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const fetchAddresses = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${baseURL}/api/users/addresses`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('user_token')}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setAddresses(data.addresses || []);
      } else {
        showToast("Failed to load addresses", "error");
        setAddresses([]);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      showToast("Network error. Please try again.", "error");
      setAddresses([]);
    } finally {
      setIsLoading(false);
    }
  };

  
  const fetchUserPreferences = async () => {
    try {
      const response = await fetch(`${baseURL}/api/users/preferences`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('user_token')}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotifyToggle(data.notifications_enabled || true);
        setEmailToggle(data.email_subscription || false);
      }
    } catch (error) {
      console.error("Error fetching preferences:", error);
    }
  };

  // Fetch user profile data
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('user_token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${baseURL}/api/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserData(data.user);
      } else if (response.status === 401) {
        logout();
        navigate('/login');
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), 100);
    
    const loadData = async () => {
      const token = localStorage.getItem('user_token');
      if (!token) {
        navigate('/login');
        return;
      }

      await fetchUserProfile();
      await fetchAddresses();
      await fetchUserPreferences();
    };

    loadData();
    
    return () => clearTimeout(t);
  }, [baseURL, navigate]);

  const handleSaveAddress = async (form) => {
    try {
      setIsSaving(true);
      const url = editingAddress 
        ? `${baseURL}/api/users/addresses/${editingAddress.id}`
        : `${baseURL}/api/users/addresses`;
      
      const method = editingAddress ? 'PUT' : 'POST';
      
      // Map form data to backend format
      const addressData = {
        label: form.label || "Home",
        street: form.line1 || form.street || "",
        address: form.line2 || form.address || form.city || "",
        phone: form.phone || "",
      };
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('user_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addressData),
      });
      
      if (response.ok) {
        await fetchAddresses(); 
        showToast(
          editingAddress ? "Address updated successfully!" : "Address added successfully!", 
          "success"
        );
        setShowAddressModal(false);
        setEditingAddress(null);
      } else {
        const errorData = await response.json();
        showToast(errorData.message || "Failed to save address", "error");
      }
    } catch (error) {
      console.error("Error saving address:", error);
      showToast("Network error. Please try again.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveProfile = async (form) => {
    try {
      setIsSaving(true);
      const response = await fetch(`${baseURL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('user_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserData(data.user); 
        showToast("Profile updated successfully!", "success");
        setShowProfileModal(false);
      } else {
        showToast("Failed to update profile", "error");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      showToast("Network error. Please try again.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePassword = async (form) => {
    try {
      setIsSaving(true);
      const response = await fetch(`${baseURL}/api/users/password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('user_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: form.current,
          newPassword: form.newPass,
        }),
      });
      
      if (response.ok) {
        showToast("Password changed successfully!", "success");
        setShowPasswordModal(false);
      } else {
        const errorData = await response.json();
        showToast(errorData.message || "Failed to change password", "error");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      showToast("Network error. Please try again.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const response = await fetch(`${baseURL}/api/users/addresses/${addressId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('user_token')}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        await fetchAddresses(); 
        showToast("Address deleted successfully!", "success");
      } else {
        showToast("Failed to delete address", "error");
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      showToast("Network error. Please try again.", "error");
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    try {
      const response = await fetch(`${baseURL}/api/users/addresses/${addressId}/set-default`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('user_token')}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        await fetchAddresses(); 
        showToast("Default address updated!", "success");
      } else {
        showToast("Failed to update default address", "error");
      }
    } catch (error) {
      console.error("Error setting default address:", error);
      showToast("Network error. Please try again.", "error");
    }
  };

  const handleUpdatePreferences = async (type, value) => {
    try {
      const response = await fetch(`${baseURL}/api/users/preferences`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('user_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          [type === 'notifications' ? 'notifications_enabled' : 'email_subscription']: value
        }),
      });
      
      if (!response.ok) {
        showToast("Failed to update preferences", "error");
      }
    } catch (error) {
      console.error("Error updating preferences:", error);
    }
  };

  const handleSignOut = () => {
    showToast("Signing out...", "info");
    setTimeout(() => {
      logout();
      navigate("/");
    }, 1000);
  };

  const renderAddressesContent = () => (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Saved Addresses</h2>
        <button
          onClick={() => {
            setEditingAddress(null);
            setShowAddressModal(true);
          }}
          disabled={isSaving}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 text-white font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" /> Add New Address
        </button>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading addresses...</p>
          </div>
        ) : addresses.length > 0 ? (
          addresses.map((addr) => (
            <AddressCard 
              key={addr.id} 
              address={addr} 
              onEdit={(address) => {
                setEditingAddress(address);
                setShowAddressModal(true);
              }}
              onDelete={handleDeleteAddress}
              onSetDefault={handleSetDefaultAddress}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
              <MapPin className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No addresses yet</h3>
            <p className="text-slate-500 mb-6">Add your first delivery address</p>
   
          </div>
        )}
      </div>
    </div>
  );

  const renderSettingsContent = () => (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">Settings</h2>

      <div className="space-y-6">
        <div
          onClick={() => setShowPasswordModal(true)}
          className="group bg-white rounded-2xl border border-slate-200 p-5 cursor-pointer flex items-center justify-between hover:shadow-lg hover:border-orange-200 transition-all duration-300"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 rounded-xl group-hover:bg-orange-200 transition-colors duration-300">
              <Lock className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <span className="font-semibold text-slate-900 block">Password Manager</span>
              <span className="text-sm text-slate-500">Change your password securely</span>
            </div>
          </div>

          <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all duration-300" />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="font-bold text-slate-900 mb-4">Account Settings</h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all duration-200">
              <div>
                <span className="text-slate-900 font-medium block">Notifications</span>
                <span className="text-sm text-slate-500">Receive important updates</span>
              </div>

              <button
                onClick={async () => {
                  const newValue = !notifyToggle;
                  setNotifyToggle(newValue);
                  await handleUpdatePreferences('notifications', newValue);
                }}
                className={`w-14 h-7 rounded-full relative transition-all duration-300 ${
                  notifyToggle ? "bg-green-500" : "bg-slate-300"
                }`}
              >
                <div
                  className={`absolute top-0.5 h-6 w-6 bg-white rounded-full shadow-md transition-all duration-300 ${
                    notifyToggle ? "left-7" : "left-0.5"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all duration-200">
              <div>
                <span className="text-slate-900 font-medium block">Email Updates</span>
                <span className="text-sm text-slate-500">Get newsletter and offers</span>
              </div>

              <button
                onClick={async () => {
                  const newValue = !emailToggle;
                  setEmailToggle(newValue);
                  await handleUpdatePreferences('email', newValue);
                }}
                className={`w-14 h-7 rounded-full relative transition-all duration-300 ${
                  emailToggle ? "bg-orange-500" : "bg-slate-300"
                }`}
              >
                <div
                  className={`absolute top-0.5 h-6 w-6 bg-white rounded-full shadow-md transition-all duration-300 ${
                    emailToggle ? "left-7" : "left-0.5"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl border-2 border-red-200 bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {toast.show && <Toast message={toast.message} type={toast.type} />}

      <ProfileHeader 
        user={userData} 
        onEditProfile={() => setShowProfileModal(true)} 
        isLoaded={isLoaded}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`flex flex-row gap-3 mb-6 lg:hidden overflow-x-auto pb-2 scrollbar-hide transition-all duration-700 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
        }`}>
          <button
            onClick={() => setActiveSection("addresses")}
            className={`flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
              activeSection === "addresses"
                ? "bg-white text-orange-600 shadow-lg border border-orange-100"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <MapPin className="w-5 h-5" />
            <span className="font-medium">Addresses</span>
          </button>
          
          <button
            onClick={() => setActiveSection("settings")}
            className={`flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
              activeSection === "settings"
                ? "bg-white text-orange-600 shadow-lg border border-orange-100"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </button>
        </div>

        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-4">
          <div
            className={`hidden lg:flex lg:col-span-1 lg:flex-col lg:space-y-3 transition-all duration-700 ${
              isLoaded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}
          >
            <MenuItem 
              icon={MapPin} 
              label="Addresses" 
              id="addresses" 
              activeSection={activeSection}
              onClick={setActiveSection}
            />
            <MenuItem 
              icon={Settings} 
              label="Settings" 
              id="settings" 
              activeSection={activeSection}
              onClick={setActiveSection}
            />
          </div>

          <div
            className={`lg:col-span-3 transition-all duration-700 delay-100 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {activeSection === "addresses" ? renderAddressesContent() : renderSettingsContent()}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddressModal && (
        <Modal
          title={editingAddress ? "Edit Address" : "Add New Address"}
          onClose={() => {
            setShowAddressModal(false);
            setEditingAddress(null);
          }}
        >
          <AddressForm
            initialData={
              editingAddress ? {
                label: editingAddress.label || "Home",
                line1: editingAddress.line1 || editingAddress.street || "",
                line2: editingAddress.line2 || editingAddress.address || editingAddress.city || "",
                phone: editingAddress.phone || "",
              } : {
                label: "Home",
                line1: "",
                line2: "",
                phone: userData?.phone || "",
              }
            }
            onCancel={() => {
              setShowAddressModal(false);
              setEditingAddress(null);
            }}
            onSave={handleSaveAddress}
            isLoading={isSaving}
          />
        </Modal>
      )}

      {showProfileModal && (
        <Modal title="Edit Profile" onClose={() => setShowProfileModal(false)}>
          <ProfileForm
            initialData={{
              name: userData?.name || "",
              email: userData?.email || "",
              phone: userData?.phone || "",
            }}
            onCancel={() => setShowProfileModal(false)}
            onSave={handleSaveProfile}
            isLoading={isSaving}
          />
        </Modal>
      )}

      {showPasswordModal && (
        <Modal
          title="Password Manager"
          onClose={() => setShowPasswordModal(false)}
        >
          <PasswordForm
            onCancel={() => setShowPasswordModal(false)}
            onSave={handleSavePassword}
            isLoading={isSaving}
          />
        </Modal>
      )}

    </div>
  );
};

export default Profile;