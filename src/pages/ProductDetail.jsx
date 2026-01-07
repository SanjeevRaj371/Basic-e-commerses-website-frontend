import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProduct, createProductReview } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import { Star, ShoppingCart, Heart, Share2, Minus, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { product, loading } = useSelector(state => state.products);
  const { isAuthenticated } = useSelector(state => state.auth);
  
  const [quantity, setQuantity] = useState(1);
  const [review, setReview] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    dispatch(getProduct(id));
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (product.countInStock < quantity) {
      toast.error('Not enough stock available');
      return;
    }

    dispatch(addToCart({
      product: product._id,
      name: product.name,
      price: product.price,
      image: product.image || '/placeholder.jpg',
      stock: product.countInStock,
      quantity
    }));
    toast.success('Product added to cart!');
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to submit a review');
      navigate('/login');
      return;
    }

    dispatch(createProductReview({ id, reviewData: review }));
    setReview({ rating: 5, comment: '' });
    toast.success('Review submitted successfully!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="animate-pulse">
              <div className="h-96 bg-gray-300 rounded-lg"></div>
            </div>
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded mb-4"></div>
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded mb-4"></div>
              <div className="h-12 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Product not found</h1>
          <button
            onClick={() => navigate('/products')}
            className="btn-primary"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li><a href="/" className="hover:text-primary-600">Home</a></li>
            <li>/</li>
            <li><a href="/products" className="hover:text-primary-600">Products</a></li>
            <li>/</li>
            <li className="text-gray-800">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            <div className="mb-4">
              <img
                src={product.image || '/placeholder.jpg'}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = '/placeholder.jpg';
                }}
              />
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
            
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating || 0)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-2">
                ({product.numReviews || 0} reviews)
              </span>
            </div>

            <p className="text-3xl font-bold text-primary-600 mb-6">
              ₹{product.price != null ? product.price.toFixed(2) : '0.00'}
            </p>

            <p className="text-gray-600 mb-6">{product.description}</p>

            <div className="mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.countInStock || 0, quantity + 1))}
                    className="p-2 hover:bg-gray-100"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  {product.countInStock || 0} in stock
                </span>
              </div>
            </div>

            <div className="flex space-x-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={product.countInStock === 0}
                className="flex-1 btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </button>
              <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Heart className="h-5 w-5" />
              </button>
              <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Share2 className="h-5 w-5" />
              </button>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Details</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span>{product.category || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Stock:</span>
                  <span>{product.countInStock || 0} available</span>
                </div>
                <div className="flex justify-between">
                  <span>Rating:</span>
                  <span>{product.rating?.toFixed(1) || '0.0'} / 5.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">Customer Reviews</h2>
          
          {/* Review Form */}
          {isAuthenticated && (
            <div className="card p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Write a Review</h3>
              <form onSubmit={handleReviewSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setReview({ ...review, rating: i + 1 })}
                        className={`h-6 w-6 ${
                          i < review.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      >
                        <Star className="h-full w-full" />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comment
                  </label>
                  <textarea
                    value={review.comment}
                    onChange={(e) => setReview({ ...review, comment: e.target.value })}
                    className="input-field h-24"
                    placeholder="Share your thoughts about this product..."
                    required
                  />
                </div>
                <button type="submit" className="btn-primary">
                  Submit Review
                </button>
              </form>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-6">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((review, index) => (
              <div key={index} className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-800">{review.name}</h4>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
              ))
            ) : (
              <div className="card p-6 text-center text-gray-500">
                <p>No reviews yet. Be the first to review this product!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
