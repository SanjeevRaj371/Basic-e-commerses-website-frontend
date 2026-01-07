import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFromCart, updateCartItemQuantity } from '../store/slices/cartSlice';
import { createOrder } from '../store/slices/orderSlice';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector(state => state.cart);
  const { isAuthenticated } = useSelector(state => state.auth);
  const { loading } = useSelector(state => state.orders);

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      dispatch(removeFromCart(productId));
      toast.success('Item removed from cart');
    } else {
      // Check stock availability
      const item = cartItems.find(x => x.product === productId);
      if (item && newQuantity > item.stock) {
        toast.error(`Only ${item.stock} items available in stock`);
        return;
      }
      dispatch(updateCartItemQuantity({ productId, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId));
    toast.success('Item removed from cart');
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please login to proceed with checkout');
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    // Calculate order data
    const orderItems = cartItems.map(item => ({
      product: item.product,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: item.quantity
    }));

    const itemsPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    const taxPrice = itemsPrice * 0.1;
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    const orderData = {
      orderItems,
      shippingInfo: {
        address: '123 Main St',
        city: 'City',
        state: 'State',
        zipCode: '12345',
        country: 'Country',
        phoneNo: '1234567890'
      },
      paymentInfo: {
        id: 'payment_id',
        status: 'succeeded'
      },
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice
    };

    dispatch(createOrder(orderData));
    navigate('/checkout/success');
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <ShoppingBag className="h-24 w-24 text-gray-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <button
              onClick={() => navigate('/products')}
              className="btn-primary"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="card">
              {cartItems.map((item) => (
                <div key={item.product} className="flex items-center p-6 border-b border-gray-200 last:border-b-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1 ml-6">
                    <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
              <p className="text-gray-600">₹{item.price}</p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.product, item.quantity - 1)}
                        className="p-2 hover:bg-gray-100"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-4 py-2">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product, item.quantity + 1)}
                        className="p-2 hover:bg-gray-100"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-800">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => handleRemoveItem(item.product)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">
                {shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
              <span className="font-semibold">₹{tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-800">Total</span>
                <span className="text-lg font-bold text-primary-600">₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Proceed to Checkout'}
              </button>

              {subtotal < 100 && (
                <p className="text-sm text-gray-600 mt-4 text-center">
              Add ₹{(100 - subtotal).toFixed(2)} more for free shipping!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
