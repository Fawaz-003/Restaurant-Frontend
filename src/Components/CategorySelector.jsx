import React, { useState, useEffect } from 'react';
import { useApi } from '../Services/Api';

const CategorySelector = ({ onCategoryChange, initialValue = {}, resetTrigger }) => {
  const api = useApi();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [selectedThirdCategory, setSelectedThirdCategory] = useState('');

  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [thirdCategoryOptions, setThirdCategoryOptions] = useState([]);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.listCategory();
        if (response.categories) {
          setCategories(response.categories);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Update options when category changes
  useEffect(() => {
    if (selectedCategory && categories.length > 0) {
      const category = categories.find(c => c.categoryname === selectedCategory);
      if (category) {
        setSubCategoryOptions(category.subcategory || []);
        setThirdCategoryOptions(category.thirdcategory || []);
      }
    } else {
      setSubCategoryOptions([]);
      setThirdCategoryOptions([]);
    }
  }, [selectedCategory, categories]);

  // Load initial values when editing
  useEffect(() => {
    if (initialValue.category) {
      setSelectedCategory(initialValue.category);
      setSelectedSubCategory(initialValue.subcategory || '');
      setSelectedThirdCategory(initialValue.thirdcategory || '');
    }
  }, [initialValue.category, initialValue.subcategory, initialValue.thirdcategory]);

  // Reset when resetTrigger changes
  useEffect(() => {
    if (resetTrigger) {
      setSelectedCategory('');
      setSelectedSubCategory('');
      setSelectedThirdCategory('');
      setSubCategoryOptions([]);
      setThirdCategoryOptions([]);
    }
  }, [resetTrigger]);

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategory(value);
    setSelectedSubCategory('');
    setSelectedThirdCategory('');
    
    onCategoryChange({
      category: value,
      subcategory: '',
      thirdcategory: '',
    });
  };

  const handleSubCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedSubCategory(value);
    
    onCategoryChange({
      category: selectedCategory,
      subcategory: value,
      thirdcategory: selectedThirdCategory,
    });
  };

  const handleThirdCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedThirdCategory(value);
    
    onCategoryChange({
      category: selectedCategory,
      subcategory: selectedSubCategory,
      thirdcategory: value,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category *</label>
        <select
          id="category"
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.categoryname}>{cat.categoryname}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700">Sub-category *</label>
        <select
          id="subcategory"
          value={selectedSubCategory}
          onChange={handleSubCategoryChange}
          disabled={!selectedCategory || subCategoryOptions.length === 0}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-50"
        >
          <option value="">Select Sub-category</option>
          {subCategoryOptions.map((sub) => (
            <option key={sub} value={sub}>{sub}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="thirdcategory" className="block text-sm font-medium text-gray-700">Third-level Category</label>
        <select
          id="thirdcategory"
          value={selectedThirdCategory}
          onChange={handleThirdCategoryChange}
          disabled={!selectedCategory || thirdCategoryOptions.length === 0}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-50"
        >
          <option value="">Select Third-level</option>
          {thirdCategoryOptions.map((third) => (
            <option key={third} value={third}>{third}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CategorySelector;