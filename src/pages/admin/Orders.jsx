import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrders, updateOrder } from '../../store/slices/orderSlice';
import { Search, Eye, X } from 'lucide-react';
import toast from 'react-hot-toast';

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector(state => state.orders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await dispatch(updateOrder({ id: orderId, orderData: { status: newStatus } })).unwrap();
      toast.success('Order status updated successfully');
      setSelectedOrder(null);
    } catch (error) {
      toast.error(error || 'Failed to update order status');
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusOptions = (currentStatus) => {
    const allStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
    return allStatuses.filter(status => status !== currentStatus);
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
        <p className="text-gray-600 mt-1">View and manage all orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search orders by ID, customer name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
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
                  Items
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order._id.slice(-8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.user?.name || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{order.user?.email || ''}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.orderItems?.length || 0} items
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₹{order.totalPrice != null ? order.totalPrice.toFixed(2) : '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye size={18} />
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

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Order Details #{selectedOrder._id.slice(-8)}</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <p><span className="font-medium">Name:</span> {selectedOrder.user?.name || 'N/A'}</p>
                  <p><span className="font-medium">Email:</span> {selectedOrder.user?.email || 'N/A'}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Order Items</h3>
                <div className="space-y-2">
                  {selectedOrder.orderItems?.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {item.image && (
                          <img src={item.image} alt={item.name} className="h-12 w-12 rounded object-cover" />
                        )}
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-medium">₹{item.price != null ? item.price.toFixed(2) : '0.00'}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              {selectedOrder.shippingAddress && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Shipping Address</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p>{selectedOrder.shippingAddress.address}</p>
                    <p>
                      {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}
                    </p>
                    <p>{selectedOrder.shippingAddress.country}</p>
                  </div>
                </div>
              )}

              {/* Order Summary */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Order Summary</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{selectedOrder.itemsPrice != null ? selectedOrder.itemsPrice.toFixed(2) : '0.00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>₹{selectedOrder.shippingPrice != null ? selectedOrder.shippingPrice.toFixed(2) : '0.00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>₹{selectedOrder.taxPrice != null ? selectedOrder.taxPrice.toFixed(2) : '0.00'}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total:</span>
                    <span>₹{selectedOrder.totalPrice != null ? selectedOrder.totalPrice.toFixed(2) : '0.00'}</span>
                  </div>
                </div>
              </div>

              {/* Status Update */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Update Status</h3>
                <div className="flex flex-wrap gap-2">
                  {getStatusOptions(selectedOrder.status).map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusUpdate(selectedOrder._id, status)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        status === 'Delivered'
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : status === 'Shipped'
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : status === 'Processing'
                          ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                          : 'bg-red-600 text-white hover:bg-red-700'
                      }`}
                    >
                      Mark as {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
