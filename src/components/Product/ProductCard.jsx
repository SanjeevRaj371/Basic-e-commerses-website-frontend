import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Eye } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (product.countInStock === 0) {
      toast.error('Product is out of stock');
      return;
    }
    dispatch(addToCart({
      product: product._id,
      name: product.name,
      price: product.price,
      image: product.image || '/placeholder.jpg',
      stock: product.countInStock,
      quantity: 1
    }));
    toast.success('Product added to cart!');
  };

  // Safely get image URL
  const imageUrl = product.image || '/placeholder.jpg';
  const isOutOfStock = product.countInStock === 0;

  return (
    <div className="card group hover:shadow-lg transition-shadow duration-300">
      <div className="relative overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name || 'Product'}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = '/placeholder.jpg';
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
            <Link
              to={`/product/${product._id}`}
              className="bg-white text-gray-800 p-2 rounded-full hover:bg-primary-600 hover:text-white transition-colors"
            >
              <Eye className="h-4 w-4" />
            </Link>
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="bg-white text-gray-800 p-2 rounded-full hover:bg-primary-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          </div>
        </div>
        {isOutOfStock && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
            Out of Stock
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating || 0)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500 ml-1">
            ({product.numReviews || 0})
          </span>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {product.name || 'Unnamed Product'}
        </h3>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description || 'No description available'}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-primary-600">
            ₹{product.price != null ? product.price.toFixed(2) : '0.00'}
          </span>
          <Link
            to={`/product/${product._id}`}
            className="text-primary-600 hover:text-primary-700 font-medium text-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
