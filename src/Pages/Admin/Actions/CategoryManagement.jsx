import React, { useState, useEffect } from "react";
import { useApi } from "../../../Services/Api";
import { PlusCircle, Edit, Trash2, Save, X, ChevronDown, ChevronUp, Menu } from "lucide-react";

const CategoryManagement = () => {
  const api = useApi();
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({
    categoryname: "",
    subcategory: "",
    thirdcategory: "",
  });
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState("");
  const [showMobileForm, setShowMobileForm] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.listCategory();
      setCategories(response.categories || []);
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
      const payload = {
        ...newCategory,
        subcategory: subcategory.split(',').map(s => s.trim()).filter(Boolean),
        thirdcategory: thirdcategory.split(',').map(s => s.trim()).filter(Boolean),
      };
      await api.addCategory(payload);
      setFormError("");
      setNewCategory({ categoryname: "", subcategory: "", thirdcategory: "" });
      setShowMobileForm(false);
      fetchCategories();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setFormError(err.response.data.message);
      } else {
        setFormError(err.message);
      }
    }
  };

  // Handle deleting a category
  const handleDeleteCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await api.deleteCategory(id);
        fetchCategories();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Handle updating a category
  const handleUpdateCategory = async (id) => {
    const { categoryname, subcategory, thirdcategory } = editingCategory;
    if (!categoryname.trim() || !subcategory.trim() || !thirdcategory.trim()) {
      setFormError("All category fields are required.");
      return;
    }
    try {
      const payload = {
        categoryname,
        subcategory: Array.isArray(subcategory) ? subcategory : subcategory.split(',').map(s => s.trim()).filter(Boolean),
        thirdcategory: Array.isArray(thirdcategory) ? thirdcategory : thirdcategory.split(',').map(s => s.trim()).filter(Boolean),
      };
      await api.editCategory(id, payload);
      setEditingCategory(null);
      setFormError("");
      fetchCategories();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setFormError(err.response.data.message);
      } else {
        setError(err.message);
      }
    }
  };

  // Enter editing mode
  const startEditing = (category) => {
    setEditingCategory({ 
      ...category,
      subcategory: Array.isArray(category.subcategory) ? category.subcategory.join(', ') : category.subcategory,
      thirdcategory: Array.isArray(category.thirdcategory) ? category.thirdcategory.join(', ') : category.thirdcategory
    });
    setExpandedCategory(category._id);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading categories...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mx-4 md:mx-0" role="alert">
      <div className="flex items-center">
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <span className="font-medium">Error: {error}</span>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">
            Category Management
          </h2>
          
          {/* Mobile Add Button */}
          <button
            onClick={() => setShowMobileForm(!showMobileForm)}
            className="md:hidden flex items-center justify-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-150 ease-in-out"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            {showMobileForm ? "Cancel" : "Add Category"}
          </button>
        </div>

        {/* Add Category Form */}
        <div className={`${showMobileForm ? 'block' : 'hidden md:block'} mb-6 md:mb-8 bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-200`}>
          <h3 className="text-lg md:text-xl font-semibold mb-4 text-gray-700 flex items-center">
            <PlusCircle className="mr-2 h-5 w-5 text-indigo-600" />
            Add New Category
          </h3>
          <form onSubmit={handleAddCategory}>
            <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-1 lg:grid-cols-4 md:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  name="categoryname"
                  value={newCategory.categoryname}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, categoryname: e.target.value })
                  }
                  placeholder="e.g., Electronics"
                  className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm md:text-base"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sub-categories
                </label>
                <input
                  type="text"
                  name="subcategory"
                  value={newCategory.subcategory}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, subcategory: e.target.value })
                  }
                  placeholder="e.g., Phones, Laptops, Tablets"
                  className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm md:text-base"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Third-level Categories
                </label>
                <input
                  type="text"
                  name="thirdcategory"
                  value={newCategory.thirdcategory}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, thirdcategory: e.target.value })
                  }
                  placeholder="e.g., iPhone, Samsung, MacBook"
                  className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm md:text-base"
                />
              </div>
              
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full md:w-auto px-4 md:px-6 py-2 md:py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out text-sm md:text-base flex items-center justify-center"
                >
                  <PlusCircle className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                  Add Category
                </button>
              </div>
            </div>
            {formError && (
              <p className="text-red-500 text-sm mt-3 px-1">{formError}</p>
            )}
          </form>
        </div>

        {/* Categories List - Mobile Card View */}
        <div className="md:hidden space-y-4">
          {categories.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <div className="text-gray-400 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No Categories Yet</h3>
              <p className="text-gray-500">Start by adding your first category above.</p>
            </div>
          ) : (
            categories.map((category) => (
              <div key={category._id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                {editingCategory && editingCategory._id === category._id ? (
                  <div className="p-4">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                        <input
                          type="text"
                          value={editingCategory.categoryname}
                          onChange={(e) => setEditingCategory({ ...editingCategory, categoryname: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sub-categories</label>
                        <input
                          type="text"
                          value={editingCategory.subcategory}
                          onChange={(e) => setEditingCategory({ ...editingCategory, subcategory: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          placeholder="Comma-separated values"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Third-level</label>
                        <input
                          type="text"
                          value={editingCategory.thirdcategory}
                          onChange={(e) => setEditingCategory({ ...editingCategory, thirdcategory: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          placeholder="Comma-separated values"
                        />
                      </div>
                      <div className="flex space-x-2 pt-2">
                        <button
                          onClick={() => handleUpdateCategory(category._id)}
                          className="flex-1 px-3 py-2 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 flex items-center justify-center"
                        >
                          <Save className="h-4 w-4 mr-1" />
                          Save
                        </button>
                        <button
                          onClick={() => { setEditingCategory(null); setFormError(""); }}
                          className="flex-1 px-3 py-2 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600 flex items-center justify-center"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </button>
                      </div>
                      {formError && <p className="text-red-500 text-xs mt-2">{formError}</p>}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium text-gray-900">{category.categoryname}</h3>
                          <button
                            onClick={() => setExpandedCategory(expandedCategory === category._id ? null : category._id)}
                            className="flex items-center text-sm text-gray-500 hover:text-gray-700 mt-1"
                          >
                            {expandedCategory === category._id ? (
                              <>
                                <ChevronUp className="h-4 w-4 mr-1" />
                                Hide Details
                              </>
                            ) : (
                              <>
                                <ChevronDown className="h-4 w-4 mr-1" />
                                Show Details
                              </>
                            )}
                          </button>
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => startEditing(category)}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      {expandedCategory === category._id && (
                        <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                          <div>
                            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Sub-categories</h4>
                            <p className="text-sm text-gray-700">
                              {Array.isArray(category.subcategory) ? category.subcategory.join(', ') : (category.subcategory || '-')}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Third-level</h4>
                            <p className="text-sm text-gray-700">
                              {Array.isArray(category.thirdcategory) ? category.thirdcategory.join(', ') : (category.thirdcategory || '-')}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 md:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="py-3 px-4 md:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sub-category
                  </th>
                  <th className="py-3 px-4 md:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Third-level
                  </th>
                  <th className="py-3 px-4 md:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category._id} className="hover:bg-gray-50">
                    {editingCategory && editingCategory._id === category._id ? (
                      <>
                        <td className="py-4 px-4 md:px-6">
                          <input
                            type="text"
                            value={editingCategory.categoryname}
                            onChange={(e) => setEditingCategory({ ...editingCategory, categoryname: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </td>
                        <td className="py-4 px-4 md:px-6">
                          <input
                            type="text"
                            value={editingCategory.subcategory}
                            onChange={(e) => setEditingCategory({ ...editingCategory, subcategory: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            placeholder="Comma-separated values"
                          />
                        </td>
                        <td className="py-4 px-4 md:px-6">
                          <input
                            type="text"
                            value={editingCategory.thirdcategory}
                            onChange={(e) => setEditingCategory({ ...editingCategory, thirdcategory: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            placeholder="Comma-separated values"
                          />
                        </td>
                        <td className="py-4 px-4 md:px-6 whitespace-nowrap">
                          <div className="flex flex-col space-y-2">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleUpdateCategory(category._id)}
                                className="px-3 py-1 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 flex items-center"
                              >
                                <Save className="h-4 w-4 mr-1" />
                                Save
                              </button>
                              <button
                                onClick={() => { setEditingCategory(null); setFormError(""); }}
                                className="px-3 py-1 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600 flex items-center"
                              >
                                <X className="h-4 w-4 mr-1" />
                                Cancel
                              </button>
                            </div>
                            {formError && <p className="text-red-500 text-xs mt-1">{formError}</p>}
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-4 px-4 md:px-6">
                          <div className="text-sm font-medium text-gray-900">
                            {category.categoryname}
                          </div>
                        </td>
                        <td className="py-4 px-4 md:px-6">
                          <div className="text-sm text-gray-600 max-w-xs overflow-hidden">
                            {Array.isArray(category.subcategory) ? (
                              <div className="flex flex-wrap gap-1">
                                {category.subcategory.map((sub, index) => (
                                  <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {sub}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              category.subcategory || '-'
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4 md:px-6">
                          <div className="text-sm text-gray-600 max-w-xs overflow-hidden">
                            {Array.isArray(category.thirdcategory) ? (
                              <div className="flex flex-wrap gap-1">
                                {category.thirdcategory.map((third, index) => (
                                  <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    {third}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              category.thirdcategory || '-'
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4 md:px-6 text-sm font-m edium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => startEditing(category)}
                              className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-md hover:bg-indigo-200 flex items-center transition duration-150"
                              title="Edit"
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(category._id)}
                              className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-md hover:bg-red-200 flex items-center transition duration-150"
                              title="Delete"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-12 text-center">
                      <div className="text-gray-400 mb-2">
                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No Categories Yet</h3>
                      <p className="text-gray-500">Start by adding your first category above.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryManagement;