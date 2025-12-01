import React, { useState, useEffect } from "react";
import { useApi } from "../../../Services/Api";

const CategoryManagement = () => {
  const api = useApi();
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({
    categoryname: "",
    subcategory: "",
    thirdcategory: "",
  });
  const [editingCategory, setEditingCategory] = useState(null); // To hold the category being edited
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState("");

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.listCategory();
      setCategories(response.categories);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle adding a new category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    const { categoryname, subcategory, thirdcategory } = newCategory;
    if (!categoryname.trim() || !subcategory.trim() || !thirdcategory.trim()) {
      setFormError("All category fields are required.");
      return;
    }
    try {
      await api.addCategory(newCategory);
      setFormError("");
      setNewCategory({ categoryname: "", subcategory: "", thirdcategory: "" }); // Reset form
      fetchCategories(); // Refresh the list
    } catch (err) {
      setFormError(err.message);
    }
  };

  // Handle deleting a category
  const handleDeleteCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await api.deleteCategory(id);
        fetchCategories(); // Refresh the list
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Handle updating a category
  const handleUpdateCategory = async (id) => {
    const { categoryname, subcategory, thirdcategory } = editingCategory;
    if (!categoryname.trim() || !subcategory.trim() || !thirdcategory.trim()) {
      alert("All category fields are required.");
      return;
    }
    try {
      await api.editCategory(id, { categoryname, subcategory, thirdcategory });
      setEditingCategory(null); // Exit editing mode
      fetchCategories(); // Refresh the list
    } catch (err) {
      setError(err.message);
    }
  };

  // Enter editing mode
  const startEditing = (category) => {
    setEditingCategory({ ...category });
  };

  if (loading)
    return <div className="text-center p-4">Loading categories...</div>;
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
      <div className="bg-white">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Category Management
        </h2>

        {/* Add Category Form */}
        <form
          onSubmit={handleAddCategory}
          className="mb-6 p-4 border border-gray-200 rounded-lg"
        >
          <h3 className="text-lg font-semibold mb-2 text-gray-700">
            Add New Category
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <input
              type="text"
              name="categoryname"
              value={newCategory.categoryname}
              onChange={(e) =>
                setNewCategory({ ...newCategory, categoryname: e.target.value })
              }
              placeholder="Category Name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              name="subcategory"
              value={newCategory.subcategory}
              onChange={(e) =>
                setNewCategory({ ...newCategory, subcategory: e.target.value })
              }
              placeholder="Sub-category"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              name="thirdcategory"
              value={newCategory.thirdcategory}
              onChange={(e) =>
                setNewCategory({ ...newCategory, thirdcategory: e.target.value })
              }
              placeholder="Third-level Category"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            >
              Add Category
            </button>
          </div>
          {formError && <p className="text-red-500 text-sm mt-2">{formError}</p>}
        </form>

        {/* Categories Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sub-category</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Third-level</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category._id}>
                  {editingCategory && editingCategory._id === category._id ? (
                    <>
                      <td className="py-4 px-4">
                        <input type="text" value={editingCategory.categoryname} onChange={(e) => setEditingCategory({ ...editingCategory, categoryname: e.target.value })} className="w-full px-2 py-1 border border-gray-300 rounded-md"/>
                      </td>
                      <td className="py-4 px-4">
                        <input type="text" value={editingCategory.subcategory} onChange={(e) => setEditingCategory({ ...editingCategory, subcategory: e.target.value })} className="w-full px-2 py-1 border border-gray-300 rounded-md"/>
                      </td>
                      <td className="py-4 px-4">
                        <input type="text" value={editingCategory.thirdcategory} onChange={(e) => setEditingCategory({ ...editingCategory, thirdcategory: e.target.value })} className="w-full px-2 py-1 border border-gray-300 rounded-md"/>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <button onClick={() => handleUpdateCategory(category._id)} className="px-3 py-1 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 mr-2">Save</button>
                        <button onClick={() => setEditingCategory(null)} className="px-3 py-1 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600">Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-4 px-4">
                        <div className="text-sm font-medium text-gray-900">{category.categoryname}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-500">{category.subcategory || '-'}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-500">{category.thirdcategory}</div>
                      </td>
                      <td className="py-4 px-4 text-sm font-medium flex">
                        <button onClick={() => startEditing(category)} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2">Edit</button>
                        <button onClick={() => handleDeleteCategory(category._id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Delete</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CategoryManagement;
