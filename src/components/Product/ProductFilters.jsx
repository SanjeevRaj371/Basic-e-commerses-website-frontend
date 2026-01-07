import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters, clearFilters } from '../../store/slices/productSlice';
import { X, Filter } from 'lucide-react';

const ProductFilters = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { filters } = useSelector(state => state.products);
  const dispatch = useDispatch();

  const categories = [
    'Electronics',
    'Clothing',
    'Books',
    'Home',
    'Sports',
    'Beauty',
    'Toys',
    'Other'
  ];

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Filter className="h-5 w-5 mr-2" />
          Filters
        </h3>
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
          >
            <X className="h-4 w-4 mr-1" />
            Clear All
          </button>
        )}
      </div>

      {/* Search */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search
        </label>
        <input
          type="text"
          placeholder="Search products..."
          value={filters.keyword}
          onChange={(e) => handleFilterChange('keyword', e.target.value)}
          className="input-field"
        />
      </div>

      {/* Category */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="input-field"
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price Range
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            className="input-field"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            className="input-field"
          />
        </div>
      </div>

      {/* Mobile Toggle */}
      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full btn-primary flex items-center justify-center"
        >
          <Filter className="h-4 w-4 mr-2" />
          {isOpen ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>
    </div>
  );
};

export default ProductFilters;
