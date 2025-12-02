import React, { useState, useEffect } from "react";
import { useApi } from "../../../Services/Api";
import { useNavigate } from "react-router-dom";
import CategorySelector from "../../../Components/CategorySelector";

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
  const [isEditingShopDetails, setIsEditingShopDetails] = useState(false);
  const [editedShopDetails, setEditedShopDetails] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isMenuActionLoading, setIsMenuActionLoading] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState(null);
  const [resetCategoryTrigger, setResetCategoryTrigger] = useState(0);

  useEffect(() => {
    const fetchShop = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.getShopById(shopId);
        console.log("Shop API Response:", response);
        setShop(response.data);
      } catch (err) {
        console.error("Failed to fetch shop details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShop();
  }, [shopId]);

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
      setIsMenuActionLoading(true);
      if (
        !newMenuItem.foodName ||
        !newMenuItem.price ||
        !newMenuItem.category ||
        !newMenuItem.subcategory ||
        !imageFile
      ) {
        alert("Please fill in all required fields including image.");
        setIsMenuActionLoading(false);
        return;
      }

      await api.addMenuItem(shopId, newMenuItem, imageFile);

      // Reset form
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
      setResetCategoryTrigger(prev => prev + 1); // Trigger category reset

      const response = await api.getShopById(shopId);
      setShop(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsMenuActionLoading(false);
    }
  };

  const handleUpdateMenuItem = async () => {
    try {
      setIsMenuActionLoading(true);
      if (!editingMenuItem) return;

      if (
        !newMenuItem.foodName ||
        !newMenuItem.price ||
        !newMenuItem.category ||
        !newMenuItem.subcategory
      ) {
        alert("Please fill in all required fields.");
        setIsMenuActionLoading(false);
        return;
      }

      await api.updateMenuItem(
        shopId,
        editingMenuItem._id,
        newMenuItem,
        imageFile
      );

      // Reset form after update
      setEditingMenuItem(null);
      setImageFile(null);
      setNewMenuItem({
        foodName: "",
        description: "",
        price: "",
        category: "",
        subcategory: "",
        thirdcategory: "",
        quantity: "",
      });
      setResetCategoryTrigger(prev => prev + 1); // Trigger category reset

      const response = await api.getShopById(shopId);
      setShop(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsMenuActionLoading(false);
    }
  };

  const handleDeleteMenuItem = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this menu item?")) {
      try {
        setDeletingItemId(itemId);
        await api.deleteMenuItem(shopId, itemId);
        const response = await api.getShopById(shopId);
        setShop(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setDeletingItemId(null);
      }
    }
  };

  const handleEditShopDetails = () => {
    setIsEditingShopDetails(true);
    setEditedShopDetails({
      storeName: shop.storeName,
      description: shop.description,
      address: shop.address,
      shopOwner: {
        name: shop.shopOwner?.name || "",
        contact: shop.shopOwner?.contact || "",
      },
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveShopDetails = async () => {
    try {
      await api.updateShop(shop._id, editedShopDetails, imageFile);
      setIsEditingShopDetails(false);
      setEditedShopDetails(null);
      setImageFile(null);
      const response = await api.getShopById(shopId);
      setShop(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancelEditShopDetails = () => {
    setIsEditingShopDetails(false);
    setEditedShopDetails(null);
    setImageFile(null);
  };

  const handleNewMenuCategoryChange = (selection) => {
    setNewMenuItem((prev) => ({ 
      ...prev, 
      category: selection.category,
      subcategory: selection.subcategory,
      thirdcategory: selection.thirdcategory
    }));
  };

  const startEditingMenuItem = (item) => {
    setEditingMenuItem(item);
    setNewMenuItem({
      foodName: item.foodName,
      description: item.description,
      price: item.price,
      category: item.category,
      subcategory: item.subcategory,
      thirdcategory: item.thirdcategory || "",
      quantity: item.quantity || "",
    });
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingMenuItem(null);
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
    setResetCategoryTrigger(prev => prev + 1); // Trigger category reset
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
                    <label className="block text-sm font-semibold text-gray-600">
                      Store Name
                    </label>
                    {isEditingShopDetails ? (
                      <input
                        type="text"
                        value={editedShopDetails.storeName}
                        onChange={(e) =>
                          setEditedShopDetails({
                            ...editedShopDetails,
                            storeName: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
                      />
                    ) : (
                      <p className="text-base text-gray-900 mt-1">
                        {shop.storeName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600">
                      Owner Name
                    </label>
                    {isEditingShopDetails ? (
                      <input
                        type="text"
                        value={editedShopDetails.shopOwner.name}
                        onChange={(e) =>
                          setEditedShopDetails({
                            ...editedShopDetails,
                            shopOwner: {
                              ...editedShopDetails.shopOwner,
                              name: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
                      />
                    ) : (
                      <p className="text-base text-gray-900 mt-1">
                        {shop.shopOwner?.name || "N/A"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600">
                      Contact
                    </label>
                    {isEditingShopDetails ? (
                      <input
                        type="text"
                        value={editedShopDetails.shopOwner.contact}
                        onChange={(e) =>
                          setEditedShopDetails({
                            ...editedShopDetails,
                            shopOwner: {
                              ...editedShopDetails.shopOwner,
                              contact: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
                      />
                    ) : (
                      <p className="text-base text-gray-900 mt-1">
                        {shop.shopOwner?.contact || "N/A"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600">
                      Status
                    </label>
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
                    <label className="block text-sm font-semibold text-gray-600">
                      Address
                    </label>
                    {isEditingShopDetails ? (
                      <input
                        type="text"
                        value={editedShopDetails.address}
                        onChange={(e) =>
                          setEditedShopDetails({
                            ...editedShopDetails,
                            address: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
                      />
                    ) : (
                      <p className="text-base text-gray-900 mt-1">
                        {shop.address}
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-600">
                      Description
                    </label>
                    {isEditingShopDetails ? (
                      <textarea
                        value={editedShopDetails.description}
                        onChange={(e) =>
                          setEditedShopDetails({
                            ...editedShopDetails,
                            description: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
                        rows="3"
                      ></textarea>
                    ) : (
                      <p className="text-base text-gray-900 mt-1">
                        {shop.description || "N/A"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="flex flex-col gap-3">
                {isEditingShopDetails ? (
                  <>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveShopDetails}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                      >
                        Save Shop Details
                      </button>
                      <button
                        onClick={handleCancelEditShopDetails}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                      >
                        Cancel Edit
                      </button>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files[0])}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleEditShopDetails}
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
                )}
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
                <div className="rounded-lg mt-5 bg-gray-100 flex items-center justify-center h-64 border-2 border-dashed border-gray-300">
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
                {editingMenuItem ? "Edit Menu Item" : "Add New Menu Item"}
              </h4>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Food Name *"
                    value={newMenuItem.foodName}
                    onChange={(e) =>
                      setNewMenuItem({
                        ...newMenuItem,
                        foodName: e.target.value,
                      })
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
                </div>
                
                <CategorySelector
                  onCategoryChange={handleNewMenuCategoryChange}
                  initialValue={editingMenuItem ? newMenuItem : {}}
                  resetTrigger={editingMenuItem ? 0 : resetCategoryTrigger}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Quantity (e.g., 200 gram)"
                    value={newMenuItem.quantity}
                    onChange={(e) =>
                      setNewMenuItem({
                        ...newMenuItem,
                        quantity: e.target.value,
                      })
                    }
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex items-center gap-4">
                  {editingMenuItem ? (
                    <>
                      <button
                        onClick={handleUpdateMenuItem}
                        disabled={isMenuActionLoading}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-200 disabled:opacity-50"
                      >
                        {isMenuActionLoading ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        onClick={cancelEdit}
                        disabled={isMenuActionLoading}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-200 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleAddMenuItem}
                      disabled={isMenuActionLoading}
                      className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-200 disabled:opacity-50"
                    >
                      {isMenuActionLoading ? "Adding..." : "Add Item"}
                    </button>
                  )}
                </div>
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
                          <div className="font-medium text-gray-900">
                            {item.foodName}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-500">
                            {item.description || "N/A"}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm font-medium text-gray-700">
                            ₹{item.price}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-500">
                            {item.category} / {item.subcategory}
                            {item.thirdcategory && (
                              <div className="text-xs text-gray-400">
                                {item.thirdcategory}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-500">
                            {item.quantity || "N/A"}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEditingMenuItem(item)}
                              disabled={isMenuActionLoading || deletingItemId}
                              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-200 disabled:opacity-50"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteMenuItem(item._id)}
                              disabled={
                                isMenuActionLoading || deletingItemId === item._id
                              }
                              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-200 disabled:opacity-50"
                            >
                              {deletingItemId === item._id
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </div>
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