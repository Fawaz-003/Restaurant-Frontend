import React, { useState, useEffect } from "react";
import { useApi } from "../../../Services/Api";
import { useNavigate } from "react-router-dom";
import ShopDetails from "./ShopDetails";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  X, 
  Check,
  User,
  Phone,
  MapPin,
  Store
} from "lucide-react";

const ShopManagement = () => {
  const api = useApi();
  const navigate = useNavigate();
  const [shops, setShops] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [newShop, setNewShop] = useState({
    storeName: "",
    description: "",
    address: "",
    shopOwner: {
      name: "",
      contact: "",
    },
    seller: "",
  });
  const [editingShop, setEditingShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState("");
  const [selectedShopId, setSelectedShopId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  // Fetch all shops
  const fetchShops = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.listShops();
      setShops(response.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all users and filter for sellers
  const fetchSellers = async () => {
    try {
      const response = await api.getAllUsers();
      if (response && Array.isArray(response.users)) {
        const sellerUsers = response.users.filter(
          (user) => user.role === "Seller"
        );
        setSellers(sellerUsers);
      }
    } catch (err) {
      console.error("Failed to fetch sellers:", err);
    }
  };

  // Fetch shops on component mount
  useEffect(() => {
    fetchShops();
    fetchSellers();
  }, []);

  // Handle seller selection - auto-fill owner name
  const handleSellerChange = (sellerId) => {
    const selectedSeller = sellers.find((seller) => seller._id === sellerId);
    setNewShop((prev) => ({
      ...prev,
      seller: sellerId,
      shopOwner: {
        ...prev.shopOwner,
        name: selectedSeller ? selectedSeller.name : "",
        contact: selectedSeller?.contact || "",
      },
    }));
  };

  // Handle adding a new shop
  const handleAddShop = async (e) => {
    e.preventDefault();
    if (
      !newShop.storeName.trim() ||
      !newShop.shopOwner.name.trim() ||
      !newShop.shopOwner.contact.trim() ||
      !newShop.address.trim() ||
      !newShop.seller
    ) {
      setFormError("All fields, including selecting a seller, are required.");
      return;
    }
    try {
      await api.addShop(newShop);
      setFormError("");
      setNewShop({
        storeName: "",
        description: "",
        address: "",
        shopOwner: { name: "", contact: "" },
        seller: "",
      });
      setIsFormOpen(false);
      fetchShops();
    } catch (err) {
      setFormError(err.response?.data?.message || err.message);
    }
  };

  // Handle deleting a shop
  const handleDeleteShop = async (id) => {
    if (window.confirm("Are you sure you want to delete this shop?")) {
      try {
        await api.deleteShop(id);
        fetchShops();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Handle updating a shop
  const handleUpdateShop = async (id) => {
    const { storeName, shopOwner, address } = editingShop;
    if (
      !storeName.trim() ||
      !shopOwner.name.trim() ||
      !shopOwner.contact.trim() ||
      !address.trim()
    ) {
      alert("All shop fields are required.");
      return;
    }
    try {
      const { menu, reviews, ...updateData } = editingShop;
      await api.updateShop(id, updateData);
      setEditingShop(null);
      fetchShops();
    } catch (err) {
      setError(err.message);
    }
  };

  // Enter editing mode
  const startEditing = (shop) => {
    setEditingShop({
      ...shop,
      shopOwner: shop.shopOwner || { name: "", contact: "" },
    });
    setActiveMenu(null);
  };

  // Filter shops based on search term
  const filteredShops = shops.filter(shop => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      shop.storeName?.toLowerCase().includes(searchLower) ||
      shop.shopOwner?.name?.toLowerCase().includes(searchLower) ||
      shop.address?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading shops...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="p-4">
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <p className="font-semibold">Error Loading Shops</p>
        <p className="text-sm">{error}</p>
        <button 
          onClick={fetchShops}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
        >
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {selectedShopId && (
          <ShopDetails
            shopId={selectedShopId}
            onClose={() => setSelectedShopId(null)}
          />
        )}

        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                Shop Management
              </h2>
              <p className="text-gray-600 text-sm sm:text-base mt-1">
                Manage shops and their details
              </p>
            </div>
            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="flex items-center justify-center px-4 py-2 sm:py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out text-sm sm:text-base w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              {isFormOpen ? "Close Form" : "Add New Shop"}
            </button>
          </div>
        </div>

        {/* Add Shop Form */}
        {isFormOpen && (
          <div className="mb-6 p-4 sm:p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-700 flex items-center">
              <Store className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-indigo-600" />
              Add New Shop
            </h3>
            <form onSubmit={handleAddShop} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-xs sm:text-sm font-medium text-gray-700">Shop Name</label>
                  <input
                    type="text"
                    value={newShop.storeName}
                    onChange={(e) =>
                      setNewShop({ ...newShop, storeName: e.target.value })
                    }
                    placeholder="Enter shop name"
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs sm:text-sm font-medium text-gray-700">Seller</label>
                  <select
                    value={newShop.seller}
                    onChange={(e) => handleSellerChange(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="">Select a Seller</option>
                    {sellers.map((seller) => (
                      <option key={seller._id} value={seller._id}>
                        {seller.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs sm:text-sm font-medium text-gray-700">Contact Number</label>
                  <input
                    type="text"
                    value={newShop.shopOwner.contact}
                    onChange={(e) =>
                      setNewShop({
                        ...newShop,
                        shopOwner: { ...newShop.shopOwner, contact: e.target.value },
                      })
                    }
                    placeholder="Contact number"
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs sm:text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    value={newShop.address}
                    onChange={(e) =>
                      setNewShop({ ...newShop, address: e.target.value })
                    }
                    placeholder="Shop address"
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 sm:py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out text-sm sm:text-base flex items-center justify-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Shop
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsFormOpen(false);
                    setFormError("");
                  }}
                  className="flex-1 px-4 py-2 sm:py-2.5 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 ease-in-out text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
              
              {formError && (
                <p className="text-red-500 text-xs sm:text-sm mt-2">{formError}</p>
              )}
            </form>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-4 sm:mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search shops by name, owner, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>
        </div>

        {/* Shop Count */}
        <div className="mb-3 sm:mb-4">
          <p className="text-sm sm:text-base text-gray-600">
            Showing <span className="font-semibold">{filteredShops.length}</span> of{" "}
            <span className="font-semibold">{shops.length}</span> shops
          </p>
        </div>

        {/* Shops List */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-md overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shop
                  </th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Owner & Contact
                  </th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredShops.map((shop) => (
                  <tr key={shop._id} className="hover:bg-gray-50">
                    {editingShop && editingShop._id === shop._id ? (
                      // Edit Mode - Desktop
                      <>
                        <td className="py-4 px-6 space-y-2">
                          <input
                            type="text"
                            value={editingShop.storeName}
                            onChange={(e) =>
                              setEditingShop({
                                ...editingShop,
                                storeName: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                            placeholder="Shop Name"
                          />
                        </td>
                        <td className="py-4 px-6 space-y-2">
                          <input
                            type="text"
                            value={editingShop.shopOwner.name}
                            onChange={(e) =>
                              setEditingShop({
                                ...editingShop,
                                shopOwner: {
                                  ...editingShop.shopOwner,
                                  name: e.target.value,
                                },
                              })
                            }
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                            placeholder="Owner Name"
                          />
                          <input
                            type="text"
                            value={editingShop.shopOwner.contact}
                            onChange={(e) =>
                              setEditingShop({
                                ...editingShop,
                                shopOwner: {
                                  ...editingShop.shopOwner,
                                  contact: e.target.value,
                                },
                              })
                            }
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                            placeholder="Contact"
                          />
                        </td>
                        <td className="py-4 px-6">
                          <input
                            type="text"
                            value={editingShop.address}
                            onChange={(e) =>
                              setEditingShop({
                                ...editingShop,
                                address: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                            placeholder="Address"
                          />
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUpdateShop(shop._id)}
                              className="flex items-center px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                            >
                              <Check className="h-4 w-4 mr-2" />
                              Save
                            </button>
                            <button
                              onClick={() => setEditingShop(null)}
                              className="flex items-center px-3 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Cancel
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      // View Mode - Desktop
                      <>
                        <td className="py-4 px-6">
                          <div className="text-sm font-semibold text-gray-900">
                            {shop.storeName}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm text-gray-900">
                            {shop.shopOwner?.name || "N/A"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {shop.shopOwner?.contact || "N/A"}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm text-gray-500 max-w-xs truncate">
                            {shop.address}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex gap-2">
                            <button
                              onClick={() => setSelectedShopId(shop._id)}
                              className="flex items-center px-3 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </button>
                            <button
                              onClick={() => startEditing(shop)}
                              className="flex items-center px-3 py-2 bg-yellow-600 text-white text-sm rounded-md hover:bg-yellow-700"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteShop(shop._id)}
                              className="flex items-center px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile/Tablet Card View */}
          <div className="lg:hidden">
            {filteredShops.length === 0 ? (
              <div className="p-8 text-center">
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No shops found</p>
                <p className="text-gray-400 text-sm mt-1">
                  {searchTerm ? "Try a different search term" : "Add your first shop"}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredShops.map((shop) => (
                  <div key={shop._id} className="p-4 hover:bg-gray-50">
                    {editingShop && editingShop._id === shop._id ? (
                      // Edit Mode - Mobile
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={editingShop.storeName}
                            onChange={(e) =>
                              setEditingShop({
                                ...editingShop,
                                storeName: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            placeholder="Shop Name"
                          />
                          <input
                            type="text"
                            value={editingShop.shopOwner.name}
                            onChange={(e) =>
                              setEditingShop({
                                ...editingShop,
                                shopOwner: {
                                  ...editingShop.shopOwner,
                                  name: e.target.value,
                                },
                              })
                            }
                            className="w-full px-3 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            placeholder="Owner Name"
                          />
                          <input
                            type="text"
                            value={editingShop.shopOwner.contact}
                            onChange={(e) =>
                              setEditingShop({
                                ...editingShop,
                                shopOwner: {
                                  ...editingShop.shopOwner,
                                  contact: e.target.value,
                                },
                              })
                            }
                            className="w-full px-3 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            placeholder="Contact"
                          />
                          <input
                            type="text"
                            value={editingShop.address}
                            onChange={(e) =>
                              setEditingShop({
                                ...editingShop,
                                address: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            placeholder="Address"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateShop(shop._id)}
                            className="flex-1 flex items-center justify-center px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Save
                          </button>
                          <button
                            onClick={() => setEditingShop(null)}
                            className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // View Mode - Mobile
                      <div>
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-base font-semibold text-gray-900 mb-1">
                              {shop.storeName}
                            </h3>
                            <div className="flex items-center text-sm text-gray-600 mb-1">
                              <User className="h-4 w-4 mr-2 text-gray-400" />
                              {shop.shopOwner?.name || "N/A"}
                            </div>
                            <div className="flex items-center text-sm text-gray-600 mb-1">
                              <Phone className="h-4 w-4 mr-2 text-gray-400" />
                              {shop.shopOwner?.contact || "N/A"}
                            </div>
                            <div className="flex items-start text-sm text-gray-600">
                              <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
                              <span className="break-words">{shop.address}</span>
                            </div>
                          </div>
                          
                          {/* Mobile Menu Button */}
                          <div className="relative">
                            <button
                              onClick={() => setActiveMenu(activeMenu === shop._id ? null : shop._id)}
                              className="p-2 text-gray-400 hover:text-gray-600"
                            >
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                              </svg>
                            </button>
                            
                            {/* Dropdown Menu */}
                            {activeMenu === shop._id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                                <div className="py-1">
                                  <button
                                    onClick={() => {
                                      setSelectedShopId(shop._id);
                                      setActiveMenu(null);
                                    }}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    <Eye className="h-4 w-4 mr-3" />
                                    View Details
                                  </button>
                                  <button
                                    onClick={() => {
                                      startEditing(shop);
                                      setActiveMenu(null);
                                    }}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    <Edit className="h-4 w-4 mr-3" />
                                    Edit Shop
                                  </button>
                                  <button
                                    onClick={() => {
                                      handleDeleteShop(shop._id);
                                      setActiveMenu(null);
                                    }}
                                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4 mr-3" />
                                    Delete Shop
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Empty State */}
          {filteredShops.length === 0 && shops.length > 0 && (
            <div className="p-8 text-center">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No matching shops found</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your search</p>
            </div>
          )}

          {filteredShops.length === 0 && shops.length === 0 && (
            <div className="p-8 text-center">
              <Store className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No shops yet</p>
              <p className="text-gray-400 text-sm mt-1">Add your first shop to get started</p>
              <button
                onClick={() => setIsFormOpen(true)}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
              >
                Add Shop
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopManagement;