import React, { useState, useEffect } from "react";
import { useApi } from "../../../Services/Api";
import { useNavigate } from "react-router-dom";

const ShopDetails = ({ shopId, onClose }) => {
  const api = useApi();
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newMenuItem, setNewMenuItem] = useState({
    foodName: "",
    description: "",
    price: "",
    category: "",
    subcategory: "",
    thirdcategory: "",
    quantity: "",
  });
  const [editingMenuItem, setEditingMenuItem] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [editImageFile, setEditImageFile] = useState(null);

  useEffect(() => {
    const fetchShop = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.getShopById(shopId);
        console.log("Shop API Response:", response);
        setShop(response.data); // Use response.data to access the shop object
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShop();
  }, [shopId, api]);

  const handleDeleteShop = async (id) => {
    if (window.confirm("Are you sure you want to delete this shop?")) {
      try {
        await api.deleteShop(id);
        onClose();
        navigate("/admin/shops");
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleAddMenuItem = async () => {
    try {
      if (
        !newMenuItem.foodName ||
        !newMenuItem.price ||
        !newMenuItem.category ||
        !newMenuItem.subcategory ||
        !imageFile
      ) {
        alert("Please fill in all required fields including image.");
        return;
      }

      await api.addMenuItem(shopId, newMenuItem, imageFile);

      setNewMenuItem({
        foodName: "",
        description: "",
        price: "",
        category: "",
        subcategory: "",
        thirdcategory: "",
        quantity: "",
      });
      setImageFile(null);

      const response = await api.getShopById(shopId);
      setShop(response);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateMenuItem = async (itemId) => {
    try {
      if (
        !editingMenuItem.foodName ||
        !editingMenuItem.price ||
        !editingMenuItem.category ||
        !editingMenuItem.subcategory
      ) {
        alert("Please fill in all required fields.");
        return;
      }

      await api.updateMenuItem(shopId, itemId, editingMenuItem, editImageFile);

      setEditingMenuItem(null);
      setEditImageFile(null);

      const response = await api.getShopById(shopId);
      setShop(response);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteMenuItem = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this menu item?")) {
      try {
        await api.deleteMenuItem(shopId, itemId);
        const response = await api.getShopById(shopId);
        setShop(response);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-5 backdrop-blur-sm">
        <div className="text-lg font-semibold">Loading shop details...</div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-5 backdrop-blur-sm p-4">
      <div className="w-full max-w-6xl max-h-[90vh] rounded-lg bg-white shadow-2xl overflow-y-auto custom-scrollbar">
        <div className="sticky top-0 bg-white z-10 border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                {shop.storeName}
              </h2>
              <p className="text-sm text-gray-500 mt-1">Shop ID: {shop._id}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg shadow-md p-6 border border-indigo-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Shop Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-600">
                      Store Name
                    </p>
                    <p className="text-base text-gray-900 mt-1">
                      {shop.storeName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Owner</p>
                    <p className="text-base text-gray-900 mt-1">
                      {shop.shopOwner?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">
                      Contact
                    </p>
                    <p className="text-base text-gray-900 mt-1">
                      {shop.shopOwner?.contact || "N/A"}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-semibold text-gray-600">
                      Status
                    </p>
                    <span
                      className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${
                        shop.isOpen
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {shop.isOpen ? "Open" : "Closed"}
                    </span>
                    
                  </div>
                  
                  <div className="md:col-span-2">
                    <p className="text-sm font-semibold text-gray-600">
                      Address
                    </p>
                    <p className="text-base text-gray-900 mt-1">
                      {shop.address}
                    </p>
                  </div>
                  <div>
                    {shop.description && (
                    <div className="md:col-span-2">
                      <p className="text-sm font-semibold text-gray-600">
                        Description
                      </p>
                      <p className="text-base text-gray-900 mt-1">
                        {shop.description}
                      </p>
                    </div>
                  )}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="flex gap-3">
                <button
                  onClick={() =>
                    alert(
                      "Edit functionality for this modal is not yet implemented."
                    )
                  }
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit Shop
                </button>
                <button
                  onClick={() => handleDeleteShop(shop._id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete Shop
                </button>
              </div>
              {shop.image?.url ? (
                <div className="rounded-lg mt-5 overflow-hidden shadow-lg border-4 border-white ring-2 ring-gray-200">
                  <img
                    src={shop.image.url}
                    alt={shop.storeName}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="rounded-lg bg-gray-100 flex items-center justify-center h-64 border-2 border-dashed border-gray-300">
                  <p className="text-gray-400">No image available</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <svg
                className="w-6 h-6 mr-2 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Menu Management
            </h3>

            <div className="mb-6 bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-700 mb-4">
                Add New Menu Item
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Food Name *"
                  value={newMenuItem.foodName}
                  onChange={(e) =>
                    setNewMenuItem({ ...newMenuItem, foodName: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={newMenuItem.description}
                  onChange={(e) =>
                    setNewMenuItem({
                      ...newMenuItem,
                      description: e.target.value,
                    })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="number"
                  placeholder="Price *"
                  value={newMenuItem.price}
                  onChange={(e) =>
                    setNewMenuItem({ ...newMenuItem, price: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  placeholder="Category *"
                  value={newMenuItem.category}
                  onChange={(e) =>
                    setNewMenuItem({ ...newMenuItem, category: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  placeholder="Subcategory *"
                  value={newMenuItem.subcategory}
                  onChange={(e) =>
                    setNewMenuItem({
                      ...newMenuItem,
                      subcategory: e.target.value,
                    })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  placeholder="Third Category"
                  value={newMenuItem.thirdcategory}
                  onChange={(e) =>
                    setNewMenuItem({
                      ...newMenuItem,
                      thirdcategory: e.target.value,
                    })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  placeholder="Quantity (e.g., 200 gram)"
                  value={newMenuItem.quantity}
                  onChange={(e) =>
                    setNewMenuItem({ ...newMenuItem, quantity: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={handleAddMenuItem}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-200"
                >
                  Add Item
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Image
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Item Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Description
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Quantity
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {shop.menu?.length > 0 ? (
                    shop.menu.map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          {item.image?.url ? (
                            <img
                              src={item.image.url}
                              alt={item.foodName}
                              className="w-16 h-16 object-cover rounded"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                              No Image
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {editingMenuItem?._id === item._id ? (
                            <input
                              type="text"
                              value={editingMenuItem.foodName}
                              onChange={(e) =>
                                setEditingMenuItem({
                                  ...editingMenuItem,
                                  foodName: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          ) : (
                            <div className="font-medium text-gray-900">
                              {item.foodName}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {editingMenuItem?._id === item._id ? (
                            <input
                              type="text"
                              value={editingMenuItem.description}
                              onChange={(e) =>
                                setEditingMenuItem({
                                  ...editingMenuItem,
                                  description: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          ) : (
                            <div className="text-sm text-gray-500">
                              {item.description || "N/A"}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {editingMenuItem?._id === item._id ? (
                            <input
                              type="number"
                              value={editingMenuItem.price}
                              onChange={(e) =>
                                setEditingMenuItem({
                                  ...editingMenuItem,
                                  price: parseFloat(e.target.value),
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          ) : (
                            <div className="text-sm font-medium text-gray-700">
                              ₹{item.price}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {editingMenuItem?._id === item._id ? (
                            <div className="space-y-2">
                              <input
                                type="text"
                                placeholder="Category"
                                value={editingMenuItem.category}
                                onChange={(e) =>
                                  setEditingMenuItem({
                                    ...editingMenuItem,
                                    category: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                              <input
                                type="text"
                                placeholder="Subcategory"
                                value={editingMenuItem.subcategory}
                                onChange={(e) =>
                                  setEditingMenuItem({
                                    ...editingMenuItem,
                                    subcategory: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>
                          ) : (
                            <div className="text-sm text-gray-500">
                              {item.category} / {item.subcategory}
                              {item.thirdcategory && (
                                <div className="text-xs text-gray-400">
                                  {item.thirdcategory}
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {editingMenuItem?._id === item._id ? (
                            <input
                              type="text"
                              value={editingMenuItem.quantity || ""}
                              onChange={(e) =>
                                setEditingMenuItem({
                                  ...editingMenuItem,
                                  quantity: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          ) : (
                            <div className="text-sm text-gray-500">
                              {item.quantity || "N/A"}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {editingMenuItem?._id === item._id ? (
                            <div className="flex flex-col gap-2">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                  setEditImageFile(e.target.files[0])
                                }
                                className="text-xs"
                              />
                              <button
                                onClick={() => handleUpdateMenuItem(item._id)}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-200"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingMenuItem(null)}
                                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-200"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <button
                                onClick={() => setEditingMenuItem(item)}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-200"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteMenuItem(item._id)}
                                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-200"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        No menu items found. Add your first item above!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDetails;
