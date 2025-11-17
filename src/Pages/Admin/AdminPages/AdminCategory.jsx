import { useEffect, useState } from "react";
import { useAppContext } from "../../../Context/AppContext";
import { toast } from "react-toastify";
import { Plus, Edit3, Trash2, Folder } from "lucide-react";
import OpenModel from "../../../Components/OpenModel.jsx";
import Loading from "../../../Components/Loading.jsx";

export default function CategoryListing() {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setisModalOpen] = useState(false);
  const [selectedId, setselectedId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { axios, navigate } = useAppContext();

  const getCategories = async () => {
    try {
      let response = await axios.get("/api/category/list");
      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (err) {
      console.error("Error fetching categories", err);
      toast.error("Failed to fetch categories", {
        position: "top-right",
        style: { margin: "45px" },
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      setIsLoading(true);
      const response = await axios.delete(`/api/category/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        },
      });

      if (response.data.success) {
        // ✅ Update categories state immediately
        setCategories((prev) => prev.filter((cat) => cat._id !== id));

        // ✅ Green toast for success
        toast.success(response.data.message || "Category deleted successfully", {
          position: "top-right",
          style: { margin: "45px" },
        });
      } else {
        toast.error(response.data.message || "Failed to delete category", {
          position: "top-right",
          style: { margin: "45px" },
        });
      }
    } catch (err) {
      console.error("Error deleting category", err);
      toast.error("Error deleting category", {
        position: "top-right",
        style: { margin: "45px" },
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
                <Folder className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  Category Management
                </h1>
                <p className="text-slate-600">Manage your product categories</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/admin/categories/addcategory")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              Create Category
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {categories.length === 0 ? (
          <div className="text-center py-16">
            <Folder className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">
              No categories found
            </h3>
            <p className="text-slate-500">
              Start by creating your first category 🚀
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gradient-to-r from-slate-50 to-slate-100">
                  <th className="px-4 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200 w-16">
                    S.No
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200 min-w-[150px]">
                    Category
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200 min-w-[200px]">
                    Subcategories
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200 w-48">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {categories.map((cat, index) => (
                  <tr
                    key={cat._id || index}
                    className="hover:bg-slate-50 transition-colors duration-200"
                  >
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      {index + 1}
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold text-slate-900">
                      {cat.name}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600">
                      {cat.subcategory?.length > 0
                        ? cat.subcategory.join(", ")
                        : "—"}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() =>
                            navigate(`/admin/categories/editcategory/${cat._id}`)
                          }
                          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-3 py-1.5 rounded-lg font-medium transition-all duration-300 flex items-center gap-1.5 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-xs"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <div>
                          <button
                            onClick={() => {
                              setselectedId(cat._id);
                              setisModalOpen(true);
                            }}
                            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-3 py-1.5 rounded-lg font-medium transition-all duration-300 flex items-center gap-1.5 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-xs"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>
                          <OpenModel
                            isOpen={isModalOpen}
                            title="Confirm Delete"
                            message="Are you sure you want to delete this category?"
                            btnMessage="Delete"
                            onClose={() => setisModalOpen(false)}
                            onConfirm={() => {
                              handleDelete(selectedId);
                              setisModalOpen(false);
                            }}
                          />
                          {isLoading && (
                            <Loading message="Deleting..." variant="red" />
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
