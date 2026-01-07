import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { getProducts, setFilters } from '../store/slices/productSlice';
import ProductCard from '../components/Product/ProductCard';
import ProductFilters from '../components/Product/ProductFilters';
import { Grid, List, SlidersHorizontal } from 'lucide-react';

const Products = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  
  const { products, loading, pagination, filters } = useSelector(state => state.products);

  useEffect(() => {
    // Get filters from URL params
    const keyword = searchParams.get('keyword') || '';
    const category = searchParams.get('category') || '';
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';
    
    dispatch(setFilters({ keyword, category, minPrice, maxPrice }));
  }, [dispatch, searchParams]);

  useEffect(() => {
    const params = {
      page: currentPage,
      pageSize: 12,
      ...filters
    };
    dispatch(getProducts(params));
  }, [dispatch, currentPage, filters]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    if (pagination.pages <= 1) return null;

    const pages = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(pagination.pages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 mx-1 rounded ${
            currentPage === i
              ? 'bg-primary-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex justify-center items-center mt-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 mx-1 rounded bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        {pages}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === pagination.pages}
          className="px-3 py-2 mx-1 rounded bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Products</h1>
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              Showing {products.length} of {pagination.count} products
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${
                  viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${
                  viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters */}
          <div className="lg:col-span-1">
            <ProductFilters />
          </div>

          {/* Products */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="card animate-pulse">
                    <div className="h-48 bg-gray-300 rounded-t-lg"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {products.map(product => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
                {renderPagination()}
              </>
            ) : (
              <div className="text-center py-12">
                <SlidersHorizontal className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your filters or search terms
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
