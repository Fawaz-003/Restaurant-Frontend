import { useState, useEffect } from "react";
import { Edit3, Save, X, Camera, User } from "lucide-react";
import { toast } from "react-toastify";
import { useAppContext } from "../../../../Context/AppContext";
import PersonalInfoSkeleton from "../../../../Layout/Skeleton/PersonalInfoSkeleton";

const PersonalInfo = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    avatar: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [profileData, setProfileData] = useState({
    phone: "",
    gender: "",
    dateOfBirth: "",
    wishlist: [],
    reviews: [],
  });
  const [originalProfileData, setOriginalProfileData] = useState({
    name: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    wishlist: [],
    reviews: [],
  });
  const { axios } = useAppContext();

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      // Validation
      if (profileData.phone && !/^\d{10}$/.test(profileData.phone)) {
        toast.error("Please enter a valid 10-digit phone number");
        return;
      }

      if (!profileData.gender) {
        toast.error("Please select a gender");
        return;
      }

      if (!profileData.dateOfBirth) {
        toast.error("Please select a date of birth");
        return;
      }

      const userId = user._id || user.id;
      if (!userId) {
        toast.error("User ID not found");
        return;
      }

      // Convert date from dd/mm/yyyy to yyyy-mm-dd for backend
      let dobFormatted = "";
      if (profileData.dateOfBirth) {
        if (profileData.dateOfBirth.includes("/")) {
          // Already in dd/mm/yyyy format
          dobFormatted = profileData.dateOfBirth.split("/").reverse().join("-");
        } else {
          // Already in yyyy-mm-dd format from date input
          dobFormatted = profileData.dateOfBirth;
        }
      }

      const updatedData = {
        name: profileData.name,
        phone: profileData.phone,
        gender: profileData.gender,
        dob: dobFormatted,
      };

      const token = localStorage.getItem("user-token");
      await axios.put(`/api/profile/edit/${userId}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update original profile to reflect saved changes
      setOriginalProfileData(profileData);
      setIsEditing(false);
      setImagePreview(null);
      
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(
        error?.response?.data?.message || "Failed to update profile. Please try again."
      );
    }
  };

  const handleProfileChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value.trimStart() }));
  };

  const handleCancel = () => {
    // Restore original values
    setProfileData(originalProfileData);
    setIsEditing(false);
    setImagePreview(null);
    toast.info("Changes discarded");
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user")) || {};
    const uid = userData._id || userData.id;

    const fetchCurrentUser = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("user-token");
        const res = await axios.get("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const me = res.data.user || {};
        const avatar = me.avatar || userData.avatar || "";
        setUser({ ...me, avatar });
        const meId = me._id || me.id || uid;
        if (meId && (me.role === 0 || userData.role === 0)) {
          await ensureProfile(meId).then(() => fetchUserProfile(meId));
        }
      } catch (err) {
        const avatar = userData.avatar || "";
        setUser({ ...userData, avatar });
        if (uid && userData.role === 0) {
          await ensureProfile(uid).then(() => fetchUserProfile(uid));
        }
      } finally {
        // A small delay to prevent flickering if data loads too fast
        setTimeout(() => setLoading(false), 300);
      }
    };

    fetchCurrentUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ensureProfile = async (userId) => {
    try {
      await axios.post(`/api/profile/create/${userId}`);
    } catch (e) {
      // ignore if exists
    }
  };

  const fetchUserProfile = async (userId) => {
    try {
      const response = await axios.get(`/api/profile/${userId}`);
      const data = response.data.profile;
      let formattedDate = "";
      if (data.dob || data.dateOfBirth) {
        const raw = data.dob || data.dateOfBirth;
        const dateObj = new Date(raw);
        const day = String(dateObj.getDate()).padStart(2, "0");
        const month = String(dateObj.getMonth() + 1).padStart(2, "0");
        const year = dateObj.getFullYear();
        formattedDate = `${day}/${month}/${year}`;
      }
      
      setUser(prevUser => ({ ...prevUser, avatar: data.avatar || prevUser.avatar }));

      const profileData = {
        phone: data.phone || "",
        gender: data.gender || "",
        dateOfBirth: formattedDate || "",
        wishlist: data.wishlist || [],
        reviews: data.reviews || [],
        name: data.name || user.name,
      };

      setProfileData(profileData);
      setOriginalProfileData(profileData);
    } catch (error) {
      if (error?.response?.status === 404) {
        const emptyProfile = { name: user.name, phone: "", gender: "", dateOfBirth: "", wishlist: [], reviews: [] };
        setProfileData(emptyProfile);
        setOriginalProfileData(emptyProfile);
      } else {
        console.error("Error fetching user profile:", error);
        toast.error("Failed to load profile data");
      }
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  if (loading) {
    return <PersonalInfoSkeleton />;
  }

  return (
    <>
      <div>
        <div className="p-2">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Personal Information
            </h1>
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Edit3 className="w-4 h-4" /> Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4" /> Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden">
                  {imagePreview || user.avatar ? (
                    <img
                      src={imagePreview || user.avatar}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-600">
                      <User className="w-8 h-8 text-white" />
                    </div>
                  )}
                </div>
                {isEditing && (
                  <label className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1.5 cursor-pointer hover:bg-blue-700 transition-colors">
                    <Camera className="w-3 h-3 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900">Profile Photo</p>
                <p className="text-sm text-gray-500">
                  {isEditing
                    ? "Click the camera icon to change your photo"
                    : "Recommended size: 200x200 pixels"}
                </p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text" 
                value={isEditing ? profileData.name : user.name}
                disabled={!isEditing}
                onChange={(e) => handleProfileChange("name", e.target.value)}
                placeholder="Enter your full name"
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${
                  !isEditing ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                placeholder="Enter your email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => handleProfileChange("phone", e.target.value)}
                  placeholder="Enter your phone number"
                  maxLength="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900 py-2 px-3 border border-gray-200 rounded-lg bg-gray-50">
                  {profileData.phone || "Not provided"}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender *
              </label>
              {isEditing ? (
                <select
                  value={profileData.gender}
                  onChange={(e) =>
                    handleProfileChange("gender", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              ) : (
                <p className="text-gray-900 py-2 px-3 border border-gray-200 rounded-lg bg-gray-50 capitalize">
                  {profileData.gender || "Not provided"}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth *
              </label>
              {isEditing ? (
                <input
                  type="date"
                  value={
                    profileData.dateOfBirth
                      ? profileData.dateOfBirth.split("/").reverse().join("-")
                      : ""
                  }
                  onChange={(e) =>
                    handleProfileChange("dateOfBirth", e.target.value)
                  }
                  max={new Date().toISOString().split("T")[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900 py-2 px-3 border border-gray-200 rounded-lg bg-gray-50">
                  {profileData.dateOfBirth || "Not provided"}
                </p>
              )}
            </div>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">
                Account Stats
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Orders:</span>
                  <span className="font-medium"> 0 </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Wishlist Items:</span>
                  <span className="font-medium"> {profileData.wishlist.length} </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Reviews Given:</span>
                  <span className="font-medium"> {profileData.reviews.length} </span>
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Wallet</h3>
              <div className="text-2xl font-bold text-green-600">₹0</div>
              <p className="text-sm text-gray-600">Available Balance</p>
              <button className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                Add Money
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PersonalInfo;