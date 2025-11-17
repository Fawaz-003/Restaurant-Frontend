import React, { useState, useEffect } from "react";
import {
  Upload,
  X,
  Plus,
  Package,
  IndianRupee,
  Badge,
  FileText,
  Tag,
  ArrowLeft,
  Save,
  AlertCircle,
  Layers,
  Settings,
} from "lucide-react";
import { useAppContext } from "../../../Context/AppContext";
import { toast } from "react-toastify";

const AddProducts = () => {
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    category: "",
    subcategory: "",
    brand: "",
    isfeatured: false,
    instock: true,
  });

  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [variants, setVariants] = useState([
    { size: "", color: "", price: "", quantity: "" },
  ]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const { axios } = useAppContext();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (productData.category) {
      const selectedCategory = categories.find(
        (cat) => cat._id === productData.category
      );
      if (selectedCategory && selectedCategory.subcategory) {
        setSubcategories(selectedCategory.subcategory);
      } else {
        setSubcategories([]);
      }
    } else {
      setSubcategories([]);
    }
    setProductData((prev) => ({ ...prev, subcategory: "" }));
  }, [productData.category, categories]);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await axios.get("api/category/list");
      const data = response.data;

      if (data.success) {
        setCategories(data.categories || []);
      } else {
        throw new Error(data.message || "Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  const addVariant = () => {
    setVariants((prev) => [...prev, { size: "", color: "", price: "", quantity: "" }]);
  };

  const removeVariant = (index) => {
    if (variants.length > 1) {
      const newVariants = variants.filter((_, i) => i !== index);
      setVariants(newVariants);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 4) {
      return;
    }

    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImages((prev) => [
            ...prev,
            {
              file: file,
              preview: e.target.result,
              name: file.name,
            },
          ]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!productData.name.trim()) newErrors.name = "Product name is required";
    if (!productData.description.trim()) newErrors.description = "Description is required";
    if (!productData.category) newErrors.category = "Category is required";
    if (!productData.subcategory) newErrors.subcategory = "Subcategory is required";
    if (images.length === 0) newErrors.images = "At least one image is required";
    
    // Validate variants - at least one complete variant is required
    const validVariants = variants.filter(v => 
      v.size.trim() && v.color.trim() && v.price && parseFloat(v.price) > 0 && v.quantity && parseInt(v.quantity) >= 0
    );
    
    if (validVariants.length === 0) {
      newErrors.variants = "At least one complete variant is required (size, color, price, quantity)";
    }

    // Validate individual variants
    variants.forEach((variant, index) => {
      if (variant.size || variant.color || variant.price || variant.quantity) {
        if (!variant.size.trim()) newErrors[`variant_${index}_size`] = "Size is required";
        if (!variant.color.trim()) newErrors[`variant_${index}_color`] = "Color is required";
        if (!variant.price || parseFloat(variant.price) <= 0) newErrors[`variant_${index}_price`] = "Valid price is required";
        if (!variant.quantity || parseInt(variant.quantity) < 0) newErrors[`variant_${index}_quantity`] = "Valid quantity is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setProductData({
      name: "",
      description: "",
      category: "",
      subcategory: "",
      brand: "",
      isfeatured: false,
      instock: true,
    });
    setImages([]);
    setVariants([{ size: "", color: "", price: "", quantity: "" }]);
    setErrors({});
    setSubcategories([]);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const formData = new FormData();
      
      // Filter and format variants
      const validVariants = variants.filter(v => 
        v.size.trim() && v.color.trim() && v.price && v.quantity
      ).map(v => ({
        size: v.size.trim(),
        color: v.color.trim(),
        price: parseFloat(v.price),
        quantity: parseInt(v.quantity)
      }));

      const completeProductData = {
        name: productData.name,
        description: productData.description,
        category: productData.category, // This is already ObjectId string
        subcategory: productData.subcategory,
        brand: productData.brand,
        isfeatured: productData.isfeatured,
        instock: productData.instock,
        variant: validVariants,
      };

      formData.append("productData", JSON.stringify(completeProductData));

      images.forEach((image) => {
        formData.append("images", image.file);
      });

      const response = await axios.post("/api/products/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(response.data.message || "Product added successfully",{
          position: "top-right",
          style: { margin: "45px" },
        });
      setTimeout(() => window.history.back(), 100);
      resetForm();
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error(error.response?.data?.message || "Error adding product",{
          position: "top-right",
          style: { margin: "45px" },
        });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Package className="w-8 h-8 text-white" />
                <div>
                  <h1 className="text-2xl font-bold text-white">Add New Product</h1>
                  <p className="text-green-100 mt-1">Create a new product for your store</p>
                </div>
              </div>
              <button
                onClick={() => window.history.back()}
                className="px-4 py-2 bg-white bg-opacity-20 text-gray-900 font-medium rounded-lg hover:bg-opacity-30 transition-all duration-200 flex items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Basic Information Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Product Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Package className="w-4 h-4" />
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={productData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.name ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                  placeholder="Enter product name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Brand */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Badge className="w-4 h-4" />
                  Brand
                </label>
                <input
                  type="text"
                  name="brand"
                  value={productData.brand}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter brand name (optional)"
                />
              </div>
            </div>

            {/* Category and Subcategory */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Tag className="w-4 h-4" />
                  Category *
                </label>
                <select
                  name="category"
                  value={productData.category}
                  onChange={handleInputChange}
                  disabled={loadingCategories}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.category ? "border-red-500 bg-red-50" : "border-gray-300"
                  } ${loadingCategories ? "bg-gray-100 cursor-not-allowed" : ""}`}
                >
                  <option value="">
                    {loadingCategories ? "Loading categories..." : "Select a category"}
                  </option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.category}
                  </p>
                )}
              </div>

              {/* Subcategory */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Layers className="w-4 h-4" />
                  Subcategory *
                </label>
                <select
                  name="subcategory"
                  value={productData.subcategory}
                  onChange={handleInputChange}
                  disabled={!productData.category}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.subcategory ? "border-red-500 bg-red-50" : "border-gray-300"
                  } ${!productData.category ? "bg-gray-100 cursor-not-allowed" : ""}`}
                >
                  <option value="">
                    {!productData.category ? "Select a category first" : "Select a subcategory"}
                  </option>
                  {subcategories.map((subcategory, index) => (
                    <option key={index} value={subcategory}>
                      {subcategory}
                    </option>
                  ))}
                </select>
                {errors.subcategory && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.subcategory}
                  </p>
                )}
              </div>
            </div>

            {/* Status Toggles */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                <Settings className="w-4 h-4" />
                Product Settings
              </label>
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isfeatured"
                    checked={productData.isfeatured}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Featured Product</span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="instock"
                    checked={productData.instock}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">In Stock</span>
                </label>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4" />
                Description *
              </label>
              <textarea
                name="description"
                value={productData.description}
                onChange={handleInputChange}
                placeholder="Enter product description..."
                rows="4"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
                  errors.description ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.description}
                </p>
              )}
            </div>

            {/* Product Variants */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Package className="w-4 h-4" />
                  Product Variants *
                </label>
                <button
                  type="button"
                  onClick={addVariant}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 hover:bg-blue-50 px-3 py-1 rounded transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Variant
                </button>
              </div>

              {errors.variants && (
                <p className="mb-3 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.variants}
                </p>
              )}

              {variants.map((variant, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border-gray-300 bg-gray-50 rounded-lg mb-3 border">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Size *</label>
                    <input
                      type="text"
                      value={variant.size}
                      onChange={(e) => handleVariantChange(index, "size", e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors[`variant_${index}_size`] ? "border-red-500 bg-red-50" : "border-gray-300"
                      }`}
                      placeholder="e.g., XL, 42"
                    />
                    {errors[`variant_${index}_size`] && (
                      <p className="mt-1 text-xs text-red-600">{errors[`variant_${index}_size`]}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Color *</label>
                    <input
                      type="color"
                      value={variant.color}
                      onChange={(e) => handleVariantChange(index, "color", e.target.value)}
                      className={`w-full h-10 px-1 py-1 border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer ${
                        errors[`variant_${index}_color`] ? "border-red-500 bg-red-50" : "border-gray-300"
                      }`}
                      title="Select a color"
                    />
                    {errors[`variant_${index}_color`] && (
                      <p className="mt-1 text-xs text-red-600">{errors[`variant_${index}_color`]}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Price (₹) *</label>
                    <input
                      type="number"
                      value={variant.price}
                      onChange={(e) => handleVariantChange(index, "price", e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors[`variant_${index}_price`] ? "border-red-500 bg-red-50" : "border-gray-300"
                      }`}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                    {errors[`variant_${index}_price`] && (
                      <p className="mt-1 text-xs text-red-600">{errors[`variant_${index}_price`]}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Quantity *</label>
                    <input
                      type="number"
                      value={variant.quantity}
                      onChange={(e) => handleVariantChange(index, "quantity", e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors[`variant_${index}_quantity`] ? "border-red-500 bg-red-50" : "border-gray-300"
                      }`}
                      placeholder="0"
                      min="0"
                    />
                    {errors[`variant_${index}_quantity`] && (
                      <p className="mt-1 text-xs text-red-600">{errors[`variant_${index}_quantity`]}</p>
                    )}
                  </div>
                  <div className="flex items-end">
                    {variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="w-full px-3 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Images Upload */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Upload className="w-4 h-4" />
                Product Images (Upload up to 4 images) *
              </label>
              
              <div className="space-y-4">
                {/* Upload Area */}
                <div className="relative">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                    disabled={images.length >= 4}
                  />
                  <label
                    htmlFor="image-upload"
                    className={`flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
                      images.length >= 4
                        ? "border-gray-300 bg-gray-50 cursor-not-allowed"
                        : errors.images
                        ? "border-red-300 bg-red-50 hover:border-red-500"
                        : "border-blue-300 hover:border-blue-500 hover:bg-blue-50"
                    }`}
                  >
                    <div className="text-center">
                      <Plus className={`w-8 h-8 mx-auto mb-2 ${
                        images.length >= 4 
                          ? "text-gray-300" 
                          : errors.images 
                          ? "text-red-400"
                          : "text-blue-400"
                      }`} />
                      <p className={`${
                        images.length >= 4 
                          ? "text-gray-400" 
                          : errors.images 
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}>
                        {images.length >= 4
                          ? "Maximum 4 images reached"
                          : "Click to upload images or drag and drop"}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {images.length}/4 images uploaded • PNG, JPG, WebP
                      </p>
                    </div>
                  </label>
                </div>
                {errors.images && (
                  <p className="text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.images}
                  </p>
                )}

                {/* Image Preview Grid */}
                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square overflow-hidden rounded-lg border-2 border-gray-200">
                          <img
                            src={image.preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-lg"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <p className="text-xs text-gray-500 mt-2 truncate px-1">
                          {image.name}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 focus:ring-4 focus:ring-green-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Adding Product...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Add Product
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProducts;