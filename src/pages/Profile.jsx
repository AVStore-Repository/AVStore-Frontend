import { useState, useEffect } from 'react';
import { Package, X, Calendar, ShoppingBag, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from '../config/config';
import { useNavigate } from 'react-router-dom';

export default function UserProfile() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch orders when component mounts
    fetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication token not found. Please login again.');
        navigate('/login');
        return;
      }

      const response = await axios.get(`${BASE_URL}/auth/get-each-user-orders`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        }
      });
      
      // Handle the response structure from your backend
      if (response.data && response.data.orders) {
        setOrders(response.data.orders);
      } else if (Array.isArray(response.data)) {
        setOrders(response.data);
      } else {
        setOrders([]);
      }
      
      // Reset to first page when orders are fetched
      setCurrentPage(1);
      
    } catch (err) {
      console.error('Error fetching orders:', err);
      
      // Handle different error types
      if (err.response) {
        // Server responded with error
        if (err.response.status === 401) {
          setError('Session expired. Please login again.');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setTimeout(() => navigate('/login'), 2000);
        } else if (err.response.status === 500) {
          setError('Server error. Please contact support if this persists.');
        } else {
          setError(err.response.data?.message || 'Failed to load orders.');
        }
      } else if (err.request) {
        // Request made but no response
        setError('Network error. Please check your connection.');
      } else {
        setError('Failed to load orders. Please try again.');
      }
      
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    try {
      // Handle Firestore timestamp object
      if (timestamp._seconds) {
        const date = new Date(timestamp._seconds * 1000);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
      
      // Handle ISO string or regular date
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return 'Invalid Date';
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Invalid Date';
    }
  };

  const formatPrice = (price) => {
    if (!price || isNaN(price)) return 'Rs. 0';
    return `Rs. ${Number(price).toLocaleString()}`;
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      delivered: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  // Pagination calculations
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = orders.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mt-12">
          {/* Messages */}
          {error && (
            <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-red-600">{error}</span>
            </div>
          )}

          {/* Orders Content */}
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Order History</h2>
                {orders.length > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    Showing {startIndex + 1}-{Math.min(endIndex, orders.length)} of {orders.length} orders
                  </p>
                )}
              </div>
              <button
                onClick={fetchOrders}
                disabled={isLoading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {isLoading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
            
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <p className="mt-4 text-gray-600">Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No orders found</p>
                <p className="text-gray-500 text-sm mt-2">Your order history will appear here</p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {currentOrders.map((order, index) => (
                    <div key={order.id || index} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              Order #{order.id ? order.id.substring(0, 8).toUpperCase() : startIndex + index + 1}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                              {order.status || 'Unknown'}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(order.createdAt)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-indigo-600">
                            {formatPrice(order.total)}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {order.items?.length || 0} item(s)
                          </p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4 text-sm">
                        <div>
                          <p className="text-gray-600">Payment Method</p>
                          <p className="font-semibold capitalize">{order.paymentMethod || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Delivery Method</p>
                          <p className="font-semibold capitalize">{order.deliveryMethod || 'N/A'}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="w-full mt-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 transition"
                      >
                        View Order Details
                      </button>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center space-x-2">
                    <button
                      onClick={handlePrevious}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="flex items-center space-x-1">
                      {getPageNumbers().map((page, index) => (
                        page === '...' ? (
                          <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-400">
                            ...
                          </span>
                        ) : (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-4 py-2 rounded-lg font-medium transition ${
                              currentPage === page
                                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                                : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
                            }`}
                          >
                            {page}
                          </button>
                        )
                      ))}
                    </div>

                    <button
                      onClick={handleNext}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      aria-label="Next page"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Order ID</p>
                    <p className="font-semibold">{selectedOrder.id || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Order Date</p>
                    <p className="font-semibold">{formatDate(selectedOrder.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status || 'Unknown'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment Method</p>
                    <p className="font-semibold capitalize">{selectedOrder.paymentMethod || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Delivery Method</p>
                    <p className="font-semibold capitalize">{selectedOrder.deliveryMethod || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p><span className="text-gray-600">Name:</span> <span className="font-semibold">{selectedOrder.customer?.firstName || ''} {selectedOrder.customer?.lastName || ''}</span></p>
                  <p><span className="text-gray-600">Email:</span> <span className="font-semibold">{selectedOrder.customer?.email || 'N/A'}</span></p>
                  <p><span className="text-gray-600">Phone:</span> <span className="font-semibold">{selectedOrder.customer?.phone || 'N/A'}</span></p>
                  {selectedOrder.customer?.address && (
                    <p><span className="text-gray-600">Address:</span> <span className="font-semibold">{selectedOrder.customer?.address}, {selectedOrder.customer?.city}, {selectedOrder.customer?.country} {selectedOrder.customer?.zipCode}</span></p>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-4 bg-gray-50 rounded-lg p-4">
                      <img
                        src={item.images?.[0] || '/placeholder.png'}
                        alt={item.name || 'Product'}
                        className="w-20 h-20 object-cover rounded"
                        onError={(e) => { e.target.src = '/placeholder.png'; }}
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{item.name || 'Unknown Product'}</h4>
                        <p className="text-sm text-gray-600">{item.category || 'N/A'}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity || 1}</p>
                        {item.appliedPromoCode && (
                          <p className="text-xs text-green-600 mt-1">
                            Promo: {item.appliedPromoCode} ({item.promoDiscount}% off)
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        {item.originalPrice && item.originalPrice !== item.price && (
                          <p className="text-sm text-gray-400 line-through">{formatPrice(item.originalPrice)}</p>
                        )}
                        <p className="font-bold text-indigo-600">{formatPrice(item.price)}</p>
                        <p className="text-sm text-gray-600">Each</p>
                      </div>
                    </div>
                  )) || <p className="text-gray-500">No items found</p>}
                </div>
              </div>

              {/* Applied Promo Codes */}
              {selectedOrder.customer?.promoCodeList && selectedOrder.customer.promoCodeList.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Applied Promotions</h3>
                  <div className="bg-green-50 rounded-lg p-4 space-y-2">
                    {selectedOrder.customer.promoCodeList.map((promo, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="text-gray-700">Promo Code: <span className="font-semibold">{promo.promoCode}</span></span>
                        <span className="text-green-600">Product ID: {promo.productId?.substring(0, 8)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Total */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total Amount</span>
                  <span className="text-indigo-600">{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}