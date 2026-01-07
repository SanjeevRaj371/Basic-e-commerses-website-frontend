import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrders } from '../../store/slices/orderSlice';
import { getProducts } from '../../store/slices/productSlice';
import { 
  Package, 
  ShoppingCart, 
  DollarSign, 
  Users,
  TrendingUp,
  Clock
} from 'lucide-react';
import api from '../../utils/axios';
import { useState } from 'react';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { orders, loading: ordersLoading } = useSelector(state => state.orders);
  const { products, loading: productsLoading } = useSelector(state => state.products);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch orders and products (fetch all products for dashboard stats)
        await Promise.all([
          dispatch(getAllOrders()),
          dispatch(getProducts({ pageSize: 1000 }))
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    const calculateStats = async () => {
      try {
        // Fetch users count
        const usersResponse = await api.get('/api/users');
        const usersCount = usersResponse.data.users?.length || 0;

        // Calculate stats from current orders
        const totalRevenue = orders.reduce((sum, order) => {
          if (order.status === 'Delivered') {
            return sum + (order.totalPrice || 0);
          }
          return sum;
        }, 0);

        const pendingOrders = orders.filter(order => 
          order.status === 'Processing' || order.status === 'Shipped'
        ).length;

        const completedOrders = orders.filter(order => 
          order.status === 'Delivered'
        ).length;

        setStats({
          totalUsers: usersCount,
          totalRevenue,
          pendingOrders,
          completedOrders
        });
      } catch (error) {
        console.error('Error calculating stats:', error);
        // Set default stats if API fails
        const totalRevenue = orders.reduce((sum, order) => {
          if (order.status === 'Delivered') {
            return sum + (order.totalPrice || 0);
          }
          return sum;
        }, 0);

        const pendingOrders = orders.filter(order => 
          order.status === 'Processing' || order.status === 'Shipped'
        ).length;

        const completedOrders = orders.filter(order => 
          order.status === 'Delivered'
        ).length;

        setStats({
          totalUsers: 0,
          totalRevenue,
          pendingOrders,
          completedOrders
        });
      }
    };

    if (orders.length > 0 || !ordersLoading) {
      calculateStats();
    }
  }, [orders, ordersLoading]);

  const totalOrders = orders.length;
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === 'active').length;
  const activeProductsPercent = totalProducts
    ? Math.round((activeProducts / totalProducts) * 100)
    : 0;

  const deliveredPercent = totalOrders
    ? Math.round((stats.completedOrders / totalOrders) * 100)
    : 0;

  const pendingPercent = totalOrders
    ? Math.round((stats.pendingOrders / totalOrders) * 100)
    : 0;

  const statCards = [
    {
      title: 'Total Products',
      value: totalProducts,
      icon: Package,
      color: 'bg-blue-500',
      change: `${activeProductsPercent}% active`
    },
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: ShoppingCart,
      color: 'bg-green-500',
      change: totalOrders ? `${deliveredPercent}% delivered` : 'No orders yet'
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: DollarSign,
      color: 'bg-yellow-500',
      change: totalOrders ? `${pendingPercent}% in progress` : 'No orders yet'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-purple-500',
      change: '+5%'
    }
  ];

  const recentOrders = orders.slice(0, 5);

  if (loading || ordersLoading || productsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <div className="flex items-center mt-2 text-sm text-green-600">
                    <TrendingUp size={14} className="mr-1" />
                    <span>{stat.change}</span>
                  </div>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="text-yellow-500" size={20} />
                <span className="text-gray-700">Pending Orders</span>
              </div>
              <span className="text-xl font-bold text-gray-900">{stats.pendingOrders}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="text-green-500" size={20} />
                <span className="text-gray-700">Completed Orders</span>
              </div>
              <span className="text-xl font-bold text-gray-900">{stats.completedOrders}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <a
              href="/admin/products"
              className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Manage Products
            </a>
            <a
              href="/admin/orders"
              className="block w-full text-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              View All Orders
            </a>
            <a
              href="/admin/users"
              className="block w-full text-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Manage Users
            </a>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order._id.slice(-6)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.user?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{order.totalPrice != null ? order.totalPrice.toFixed(2) : '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === 'Delivered'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'Processing'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {order.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
