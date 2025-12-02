import React, { useState, useEffect } from "react";
import { useApi } from "../../../Services/Api";
import { useNavigate } from "react-router-dom";
import ShopDetails from "./ShopDetails";

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

  // Fetch all shops
  const fetchShops = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.listShops();
      setShops(response.data);
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
        const sellerUsers = response.users.filter(user => user.role === 'Seller');
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
    const selectedSeller = sellers.find(seller => seller._id === sellerId);
    setNewShop({
      ...newShop,
      seller: sellerId,
      shopOwner: {
        ...newShop.shopOwner,
        name: selectedSeller ? selectedSeller.name : "",
      }
    });
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
      // Call the API with the newShop state object
      await api.addShop(newShop);
      
      setFormError("");
      setNewShop({
        storeName: "",
        description: "",
        address: "",
        shopOwner: { name: "", contact: "" },
        seller: "",
      });
      fetchShops();
    } catch (err) {
      setFormError(err.message);
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
  };

  if (loading) return <div className="text-center p-4">Loading shops...</div>;
  if (error)
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        Error: {error}
      </div>
    );

  return (
    <div className="p-6">
      {selectedShopId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
          <ShopDetails shopId={selectedShopId} onClose={() => setSelectedShopId(null)} />
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4 text-gray-800">Shop Management</h2>

      {/* Add Shop Form */}
      <form
        onSubmit={handleAddShop}
        className="mb-6 p-4 border border-gray-200 rounded-lg"
      >
        <h3 className="text-lg font-semibold mb-2 text-gray-700">
          Add New Shop
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-end">
          <input
            type="text"
            value={newShop.storeName}
            onChange={(e) =>
              setNewShop({ ...newShop, storeName: e.target.value })
            }
            placeholder="Shop Name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={newShop.seller}
            onChange={(e) => handleSellerChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="" disabled>
              Select a Seller
            </option>
            {sellers.map((seller) => (
              <option key={seller._id} value={seller._id}>
                {seller.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={newShop.shopOwner.contact}
            onChange={(e) =>
              setNewShop({
                ...newShop,
                shopOwner: { ...newShop.shopOwner, contact: e.target.value },
              })
            }
            placeholder="Contact Number"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            value={newShop.address}
            onChange={(e) =>
              setNewShop({ ...newShop, address: e.target.value })
            }
            placeholder="Address"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
          >
            Add Shop
          </button>
        </div>
        {formError && <p className="text-red-500 text-sm mt-2">{formError}</p>}
      </form>

      {/* Shops Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Shop Name
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Owner
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Address
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {Array.isArray(shops) &&
              shops.map((shop) => (
                <tr
                  key={shop._id}
                  className="hover:bg-gray-50"
                >
                  {editingShop && editingShop._id === shop._id ? (
                    <>
                      <td
                        className="py-4 px-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="text"
                          value={editingShop.storeName}
                          onChange={(e) =>
                            setEditingShop({
                              ...editingShop,
                              storeName: e.target.value,
                            })
                          }
                          className="w-full px-2 py-1 border border-gray-300 rounded-md"
                        />
                      </td>
                      <td
                        className="py-4 px-4"
                        onClick={(e) => e.stopPropagation()}
                      >
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
                          className="w-full px-2 py-1 border border-gray-300 rounded-md"
                        />
                      </td>
                      <td
                        className="py-4 px-4"
                        onClick={(e) => e.stopPropagation()}
                      >
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
                          className="w-full px-2 py-1 border border-gray-300 rounded-md"
                        />
                      </td>
                      <td
                        className="py-4 px-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="text"
                          value={editingShop.address}
                          onChange={(e) =>
                            setEditingShop({
                              ...editingShop,
                              address: e.target.value,
                            })
                          }
                          className="w-full px-2 py-1 border border-gray-300 rounded-md"
                        />
                      </td>
                      <td
                        className="py-4 px-4 whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => handleUpdateShop(shop._id)}
                          className="px-3 py-1 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 mr-2"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingShop(null)}
                          className="px-3 py-1 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-4 px-4">
                        <div className="text-sm font-medium text-gray-900">
                          {shop.storeName}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-500">
                          {shop.shopOwner?.name}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-500">
                          {shop.shopOwner?.contact}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-500">
                          {shop.address}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm font-medium">
                        <div className="flex">
                          <button
                            onClick={() => setSelectedShopId(shop._id)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mr-2"
                          >
                            View Details
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
    </div>
  );
};

export default ShopManagement;