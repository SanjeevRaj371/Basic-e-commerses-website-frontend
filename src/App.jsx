import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store/store';
import { loadUser } from './store/slices/authSlice';

// Components
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import AdminLayout from './components/Layout/AdminLayout';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Orders from './pages/Orders';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import AdminUsers from './pages/admin/Users';

// Protected Route Component
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  useEffect(() => {
    // Load user on app start if token exists
    const token = localStorage.getItem('token');
    if (token) {
      store.dispatch(loadUser());
    }
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                }
              />
              
              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute adminOnly>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/products" element={
                <ProtectedRoute adminOnly>
                  <AdminLayout>
                    <AdminProducts />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/orders" element={
                <ProtectedRoute adminOnly>
                  <AdminLayout>
                    <AdminOrders />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute adminOnly>
                  <AdminLayout>
                    <AdminUsers />
                  </AdminLayout>
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster position="top-right" />
      </Router>
    </Provider>
  );
}

export default App;