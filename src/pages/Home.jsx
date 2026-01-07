import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../store/slices/productSlice';
import ProductCard from '../components/Product/ProductCard';
import { ArrowRight, Star, Truck, Shield, Headphones } from 'lucide-react';

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector(state => state.products);

  useEffect(() => {
    dispatch(getProducts({ pageSize: 8, featured: true }));
  }, [dispatch]);

  const features = [
    {
      icon: <Truck className="h-8 w-8" />,
      title: 'Free Shipping',
      description: 'Free shipping on orders over ₹4,000'
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Secure Payment',
      description: '100% secure payment processing'
    },
    {
      icon: <Headphones className="h-8 w-8" />,
      title: '24/7 Support',
      description: 'Round-the-clock customer support'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to ShopEase
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Discover amazing products at unbeatable prices
            </p>
            <a
              href="/products"
              className="inline-flex items-center bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Shop Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Featured Products
            </h2>
            <p className="text-gray-600">
              Discover our most popular and highly-rated products
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
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
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <a
              href="/products"
              className="inline-flex items-center btn-primary"
            >
              View All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Stay Updated
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Subscribe to our newsletter for the latest deals and updates
          </p>
          <div className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-l-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
            <button className="bg-primary-800 text-white px-6 py-3 rounded-r-lg hover:bg-primary-900 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
