import { useEffect, useState } from "react";
import { useAppContext } from "../../../Context/AppContext.jsx";
import { Package, Plus, Search, Filter, Edit3, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import OpenModel from "../../../Components/OpenModel.jsx";
import Loading from "../../../Components/Loading.jsx";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setisModalOpen] = useState(false);
  const [selectedId, setselectedId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { axios, navigate } = useAppContext();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/products/list");
        const list = res.data?.products || [];

        const resCategories = await axios.get("/api/category/list");
        const categoriesList = resCategories.data?.categories || [];

        const productsWithCategoryName = list.map((product) => {
          const category = categoriesList.find(
            (c) => c._id === product.category
          );
          return {
            ...product,
            categoryName: category ? category.name : "Unknown",
          };
        });

        setProducts(productsWithCategoryName);
        setFilteredProducts(productsWithCategoryName);
        setCategories(categoriesList.map((c) => c.name));
      } catch (error) {
        console.log(error);
      }
    };

    fetchProducts();
  }, [axios]);

  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name?.toLowerCase().includes(term) ||
          product.brand?.toLowerCase().includes(term) ||
          product.categoryName?.toLowerCase().includes(term)
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (product) => product.categoryName === selectedCategory
      );
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory]);

  const handleEdit = (id) => {
    navigate(`/admin/products/edit/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      setIsLoading(true);
      const res = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("user-token")}`,
          },
        }
      );

      setProducts((prev) => prev.filter((p) => p._id !== id));
      setFilteredProducts((prev) => prev.filter((p) => p._id !== id));

      toast.success(res.data.message,{
          position: "top-right",
          style: { margin: "45px" },
        });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete product",{
          position: "top-right",
          style: { margin: "45px" },
        });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  Product Management
                </h1>
                <p className="text-slate-600">Manage your product inventory</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/admin/products/add")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              Add New Product
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, brand, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="lg:w-64">
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {/* Results Count */}
        <div className="mt-4 text-sm text-slate-600">
          Showing {filteredProducts.length} of {products.length} products
          {selectedCategory && (
            <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
              {selectedCategory}
            </span>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">
              No products found
            </h3>
            <p className="text-slate-500">
              {searchTerm || selectedCategory
                ? "Try adjusting your search or filter criteria"
                : "Start by adding your first product"}
            </p>
          </div>
        ) : (
          <>
            {/* Mobile cards */}
            <div className="block md:hidden divide-y divide-slate-200">
              {filteredProducts.map((product, index) => (
                <div key={product._id || index} className="p-4">
                  <div className="flex items-start gap-4">
                    {product.images && product.images.length > 0 && (
                      <img
                        src={product.images[0]?.url}
                        alt={product.name}
                        className="w-20 h-24 object-cover rounded"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-base font-semibold text-slate-900 truncate">
                          {product.name}
                        </h4>
                        <span className="text-xs text-slate-500 shrink-0">
                          #
                          {products.findIndex(
                            (p) =>
                              (p._id || p.id) === (product._id || product.id)
                          ) + 1}
                        </span>
                      </div>
                      <div className="mt-1 text-sm font-bold text-green-600">
                        ₹
                        {Number(product.variant[0]?.price || 0).toLocaleString(
                          "en-IN"
                        )}
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {product.categoryName}
                        </span>
                        {product.brand && (
                          <span className="text-xs text-slate-600">
                            {product.brand}
                          </span>
                        )}
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleEdit(product._id)}
                          className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <Edit3 className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setselectedId(product._id);
                            setisModalOpen(true);
                          }}
                          className={
                            "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                          }
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                        <OpenModel
                          isOpen={isModalOpen}
                          title="Confirm Delete"
                          message="Are you sure you want to Delete this product?"
                          btnMessage="Delete"
                          onClose={() => setisModalOpen(false)}
                          onConfirm={() => {
                            handleDelete(selectedId);
                            setisModalOpen(false);
                          }}
                        />
                        {isLoading && <Loading message="Deleting..." variant="red" />}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50 to-slate-100">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                      S.No
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                      Images
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                      Product Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                      Brand
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredProducts.map((product, index) => (
                    <tr
                      key={product._id || index}
                      className="hover:bg-slate-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                        {products.findIndex(
                          (p) => (p._id || p.id) === (product._id || product.id)
                        ) + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                        {product.images && product.images.length > 0 && (
                          <img
                            src={product.images[0]?.url}
                            alt={product.name}
                            className="w-13 h-16 object-cover rounded"
                          />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-slate-900">
                          {product.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-green-600">
                          ₹
                          {Number(
                            product.variant[0]?.price || 0
                          ).toLocaleString("en-IN")}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {product.categoryName}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-700">
                          {product.brand}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleEdit(product._id || product.id)
                            }
                            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 hover:cursor-pointer text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                          >
                            <Edit3 className="w-4 h-4" />
                            Edit
                          </button>
                          <div>
                            <button
                              onClick={() => {
                                setselectedId(product._id);
                                setisModalOpen(true);
                              }}
                              className={
                                "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                              }
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                            <OpenModel
                              isOpen={isModalOpen}
                              title="Confirm Delete"
                              message="Are you sure you want to Delete this product?"
                              btnMessage="Delete"
                              onClose={() => setisModalOpen(false)}
                              onConfirm={() => {
                                handleDelete(selectedId);
                                setisModalOpen(false);
                              }}
                            />
                            {isLoading && <Loading message="Deleting..." variant="red" />}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
