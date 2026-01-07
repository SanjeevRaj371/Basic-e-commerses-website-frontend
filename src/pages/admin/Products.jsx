import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getProducts, 
  deleteProduct, 
  createProduct, 
  updateProduct 
} from '../../store/slices/productSlice';
import { Plus, Edit, Trash2, Search, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../../utils/axios';

const Products = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector(state => state.products);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');
  const { register, handleSubmit, reset, formState: { errors }, watch, setValue } = useForm();
  const imageUrl = watch('image') || '';
  const features = watch('features') || [];
  const [featureInput, setFeatureInput] = useState('');

  useEffect(() => {
    // For admin management, load all products (no pagination limit)
    dispatch(getProducts({ pageSize: 1000 }));
  }, [dispatch]);

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await dispatch(deleteProduct(id)).unwrap();
        toast.success('Product deleted successfully');
      } catch (error) {
        toast.error(error || 'Failed to delete product');
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    reset({
      name: product.name || '',
      description: product.description || '',
      shortDescription: product.shortDescription || '',
      price: product.price || '',
      compareAtPrice: product.compareAtPrice || '',
      category: product.category || '',
      subcategory: product.subcategory || '',
      countInStock: product.countInStock || '',
      image: product.image || '',
      sku: product.sku || '',
      barcode: product.barcode || '',
      brand: product.brand || '',
      model: product.model || '',
      manufacturer: product.manufacturer || '',
      weightValue: product.weight?.value || '',
      weightUnit: product.weight?.unit || 'kg',
      length: product.dimensions?.length || '',
      width: product.dimensions?.width || '',
      height: product.dimensions?.height || '',
      dimensionUnit: product.dimensions?.unit || 'cm',
      color: product.color || '',
      material: product.material || '',
      size: product.size || '',
      features: product.features || [],
      warranty: product.warranty || '',
      warrantyPeriod: product.warrantyPeriod?.value || '',
      warrantyUnit: product.warrantyPeriod?.unit || 'months',
      shippingWeightValue: product.shippingWeight?.value || '',
      shippingWeightUnit: product.shippingWeight?.unit || 'kg',
      status: product.status || 'active',
      featured: product.featured || false,
      metaTitle: product.metaTitle || '',
      metaDescription: product.metaDescription || '',
      keywords: product.keywords?.join(', ') || '',
    });
    setShowModal(true);
    setActiveTab('basic');
  };

  const handleCreate = () => {
    setEditingProduct(null);
    reset({
      name: '',
      description: '',
      shortDescription: '',
      price: '',
      compareAtPrice: '',
      category: '',
      subcategory: '',
      countInStock: '',
      image: '',
      sku: '',
      barcode: '',
      brand: '',
      model: '',
      manufacturer: '',
      weightValue: '',
      weightUnit: 'kg',
      length: '',
      width: '',
      height: '',
      dimensionUnit: 'cm',
      color: '',
      material: '',
      size: '',
      features: [],
      warranty: '',
      warrantyPeriod: '',
      warrantyUnit: 'months',
      shippingWeightValue: '',
      shippingWeightUnit: 'kg',
      status: 'active',
      featured: false,
      metaTitle: '',
      metaDescription: '',
      keywords: '',
    });
    setShowModal(true);
    setActiveTab('basic');
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      const newFeatures = [...features, featureInput.trim()];
      setValue('features', newFeatures);
      setFeatureInput('');
    }
  };

  const removeFeature = (index) => {
    const newFeatures = features.filter((_, i) => i !== index);
    setValue('features', newFeatures);
  };

  const onSubmit = async (data) => {
    try {
      // Ensure all required fields are present and not empty
      if (!data.name || !data.name.trim()) {
        toast.error('Product name is required');
        return;
      }
      if (!data.description || !data.description.trim()) {
        toast.error('Description is required');
        return;
      }
      if (!data.category || !data.category.trim()) {
        toast.error('Category is required');
        return;
      }

      // Build product data object
      const productData = {
        name: data.name.trim(),
        description: data.description.trim(),
        shortDescription: data.shortDescription?.trim() || '',
        category: data.category.trim(),
        subcategory: data.subcategory?.trim() || '',
        price: parseFloat(data.price) || 0,
        compareAtPrice: data.compareAtPrice ? parseFloat(data.compareAtPrice) : null,
        countInStock: parseInt(data.countInStock) || 0,
        image: data.image || '',
        sku: data.sku?.trim() || '',
        barcode: data.barcode?.trim() || '',
        brand: data.brand?.trim() || '',
        model: data.model?.trim() || '',
        manufacturer: data.manufacturer?.trim() || '',
        weight: {
          value: data.weightValue ? parseFloat(data.weightValue) : 0,
          unit: data.weightUnit || 'kg',
        },
        dimensions: {
          length: data.length ? parseFloat(data.length) : 0,
          width: data.width ? parseFloat(data.width) : 0,
          height: data.height ? parseFloat(data.height) : 0,
          unit: data.dimensionUnit || 'cm',
        },
        color: data.color?.trim() || '',
        material: data.material?.trim() || '',
        size: data.size?.trim() || '',
        features: data.features || [],
        warranty: data.warranty?.trim() || '',
        warrantyPeriod: data.warrantyPeriod ? {
          value: parseFloat(data.warrantyPeriod),
          unit: data.warrantyUnit || 'months',
        } : null,
        shippingWeight: {
          value: data.shippingWeightValue ? parseFloat(data.shippingWeightValue) : 0,
          unit: data.shippingWeightUnit || 'kg',
        },
        status: data.status || 'active',
        featured: data.featured || false,
        metaTitle: data.metaTitle?.trim() || '',
        metaDescription: data.metaDescription?.trim() || '',
        keywords: data.keywords ? data.keywords.split(',').map(k => k.trim()).filter(k => k) : [],
      };

      if (editingProduct) {
        await dispatch(updateProduct({ id: editingProduct._id, productData })).unwrap();
        toast.success('Product updated successfully');
      } else {
        await dispatch(createProduct(productData)).unwrap();
        toast.success('Product created successfully');
      }
      setShowModal(false);
      reset();
      // Refresh full list after create/update
      dispatch(getProducts({ pageSize: 1000 }));
    } catch (error) {
      // Show detailed error message
      const errorMessage = error || 'Failed to save product';
      toast.error(errorMessage);
      console.error('Product save error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products Management</h1>
          <p className="text-gray-600 mt-1">Manage your product inventory</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>Add Product</span>
        </button>
      </div>

      {/* Search */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600 gap-1">
          <span>Total products: {products.length}</span>
          {searchTerm && (
            <span>
              Showing {filteredProducts.length} of {products.length} products
            </span>
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {product.image && (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-12 w-12 rounded-lg object-cover mr-3"
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.category || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₹{product.price != null ? product.price.toFixed(2) : '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.countInStock > 0
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {product.countInStock || 0} in stock
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
              <h2 className="text-xl font-semibold">
                {editingProduct ? 'Edit Product' : 'Create Product'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Tabs */}
            <div className="border-b px-6">
              <div className="flex space-x-4">
                {['basic', 'details', 'shipping', 'seo', 'status'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-3 px-4 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              {/* Basic Information Tab */}
              {activeTab === 'basic' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name *
                    </label>
                    <input
                      {...register('name', { required: 'Product name is required' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Short Description
                    </label>
                    <input
                      {...register('shortDescription')}
                      placeholder="Brief product summary"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Description *
                    </label>
                    <textarea
                      {...register('description', { required: 'Description is required' })}
                      rows="4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        {...register('price', { required: 'Price is required', min: 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {errors.price && (
                        <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Compare At Price
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        {...register('compareAtPrice')}
                        placeholder="Original price (optional)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category *
                      </label>
                      <input
                        {...register('category', { required: 'Category is required' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {errors.category && (
                        <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subcategory
                      </label>
                      <input
                        {...register('subcategory')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      {...register('countInStock', { required: 'Stock is required', min: 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.countInStock && (
                      <p className="text-red-500 text-sm mt-1">{errors.countInStock.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Image URL
                    </label>
                    <input
                      type="url"
                      {...register('image')}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {imageUrl && (
                      <div className="mt-2">
                        <img
                          src={imageUrl}
                          alt="Preview"
                          className="h-32 w-32 object-cover rounded-lg border border-gray-300"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/128?text=Invalid+URL';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Product Details Tab */}
              {activeTab === 'details' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        SKU
                      </label>
                      <input
                        {...register('sku')}
                        placeholder="Product SKU"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Barcode
                      </label>
                      <input
                        {...register('barcode')}
                        placeholder="Barcode/UPC"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Brand
                      </label>
                      <input
                        {...register('brand')}
                        placeholder="Brand name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Model
                      </label>
                      <input
                        {...register('model')}
                        placeholder="Model number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Manufacturer
                      </label>
                      <input
                        {...register('manufacturer')}
                        placeholder="Manufacturer name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Color
                      </label>
                      <input
                        {...register('color')}
                        placeholder="Product color"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Material
                      </label>
                      <input
                        {...register('material')}
                        placeholder="Material type"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Size
                      </label>
                      <input
                        {...register('size')}
                        placeholder="Size variant"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Weight
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        step="0.01"
                        {...register('weightValue')}
                        placeholder="Weight value"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <select
                        {...register('weightUnit')}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="kg">kg</option>
                        <option value="g">g</option>
                        <option value="lb">lb</option>
                        <option value="oz">oz</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dimensions (L × W × H)
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      <input
                        type="number"
                        step="0.01"
                        {...register('length')}
                        placeholder="Length"
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="number"
                        step="0.01"
                        {...register('width')}
                        placeholder="Width"
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="number"
                        step="0.01"
                        {...register('height')}
                        placeholder="Height"
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <select
                        {...register('dimensionUnit')}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="cm">cm</option>
                        <option value="m">m</option>
                        <option value="in">in</option>
                        <option value="ft">ft</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Features
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={featureInput}
                        onChange={(e) => setFeatureInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                        placeholder="Add a feature and press Enter"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={addFeature}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {features.map((feature, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {feature}
                          <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Shipping & Warranty Tab */}
              {activeTab === 'shipping' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Shipping Weight
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        step="0.01"
                        {...register('shippingWeightValue')}
                        placeholder="Shipping weight"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <select
                        {...register('shippingWeightUnit')}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="kg">kg</option>
                        <option value="g">g</option>
                        <option value="lb">lb</option>
                        <option value="oz">oz</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Warranty Description
                    </label>
                    <input
                      {...register('warranty')}
                      placeholder="Warranty details"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Warranty Period
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        {...register('warrantyPeriod')}
                        placeholder="Warranty period"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <select
                        {...register('warrantyUnit')}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="days">Days</option>
                        <option value="months">Months</option>
                        <option value="years">Years</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* SEO Tab */}
              {activeTab === 'seo' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meta Title
                    </label>
                    <input
                      {...register('metaTitle')}
                      placeholder="SEO title (50-60 characters)"
                      maxLength={60}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Recommended: 50-60 characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meta Description
                    </label>
                    <textarea
                      {...register('metaDescription')}
                      rows="3"
                      placeholder="SEO description (150-160 characters)"
                      maxLength={160}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Recommended: 150-160 characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Keywords
                    </label>
                    <input
                      {...register('keywords')}
                      placeholder="Comma-separated keywords"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Separate keywords with commas
                    </p>
                  </div>
                </div>
              )}

              {/* Status Tab */}
              {activeTab === 'status' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Status
                    </label>
                    <select
                      {...register('status')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      {...register('featured')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Feature this product
                    </label>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t sticky bottom-0 bg-white">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
