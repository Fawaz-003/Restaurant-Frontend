import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../../../Context/AppContext";
import { toast } from "react-toastify";
import { ArrowLeft, Layers, Tag, Save, Plus, Edit, Trash2 } from "lucide-react";

export default function EditCategory() {
  const { id } = useParams();
  const { axios } = useAppContext();
  const navigate = useNavigate();

  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");

  // ✅ Fetch category details
  const fetchCategory = async () => {
    try {
      const res = await axios.get(`/api/category/single/${id}`);
      if (res.data.success) {
        setCategory(res.data.Category.name);
        setSubcategories(res.data.Category.subcategory || []);
      } else {
        toast.error("❌ Failed to load category");
      }
    } catch (err) {
      toast.error("❌ Error fetching category");
    }
  };

  useEffect(() => {
    fetchCategory();
  }, [id]);

  // ✅ Add subcategory
  const handleAddSubcategory = () => {
    if (!subcategory.trim()) return;
    setSubcategories([...subcategories, subcategory.trim()]);
    setSubcategory("");
  };

  // ✅ Remove subcategory
  const handleRemove = (index) => {
    setSubcategories(subcategories.filter((_, i) => i !== index));
  };

  // ✅ Edit subcategory
  const handleEdit = (index) => {
    setEditIndex(index);
    setEditValue(subcategories[index]);
  };

  const handleSaveEdit = (index) => {
    if (!editValue.trim()) return;
    const updated = [...subcategories];
    updated[index] = editValue.trim();
    setSubcategories(updated);
    setEditIndex(null);
    setEditValue("");
  };

  // ✅ Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category.trim()) {
      toast.error("Category name is required", {
        position: "top-right",
        style: { margin: "45px" },
      });
      return;
    }

    const payload = { name: category, subcategory: subcategories };

    try {
      const response = await axios.put(`/api/category/edit/${id}`, payload);
      if (response.data.success) {
        toast.success(response.data.message || "Category updated successfully!", {
          position: "top-right", // Keep default position
        });
        navigate("/admin/categories");
      } else {
        throw new Error(response.data.message || "Failed to update category");
      }
    } catch (error) {
      toast.error(error.message || "Error updating category", {
        position: "top-right", // Keep default position
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-500 px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-white">Edit Category</h1>
                <p className="text-purple-100 mt-1">
                  Update category name and manage subcategories
                </p>
              </div>
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 border border-white text-white font-medium rounded-lg hover:bg-white hover:text-purple-700 transition-all duration-200 flex items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Tag className="w-4 h-4" />
                  Category Name *
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Enter category name"
                />
              </div>

              {/* Subcategory */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Layers className="w-4 h-4" />
                  Subcategories
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Enter subcategory"
                  />
                  <button
                    type="button"
                    onClick={handleAddSubcategory}
                    className="px-4 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>

              {/* Subcategory List */}
              {subcategories.length > 0 && (
                <ul className="space-y-2">
                  {subcategories.map((sub, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between border rounded-lg p-3 bg-gray-50"
                    >
                      {editIndex === index ? (
                        <>
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="flex-1 border rounded p-2 mr-2"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(index)}
                            className="px-3 py-1 bg-gradient-to-r from-purple-600 to-indigo-500 text-white rounded hover:from-purple-700 hover:to-indigo-600 mr-2"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditIndex(null)}
                            className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="text-gray-800">{sub}</span>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleEdit(index)}
                              className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded hover:from-yellow-600 hover:to-orange-600 flex items-center gap-1"
                            >
                              <Edit className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemove(index)}
                              className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded hover:from-red-600 hover:to-pink-600 flex items-center gap-1"
                            >
                              <Trash2 className="w-4 h-4" />
                              Remove
                            </button>
                          </div>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              )}

              {/* Submit */}
              <div className="pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-medium rounded-lg hover:from-purple-700 hover:to-indigo-600 focus:ring-4 focus:ring-purple-300 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Update Category
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
