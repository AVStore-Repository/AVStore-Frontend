import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { BASE_URL } from "../config/config";

export default function PaymentSuccess() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const orderId = searchParams.get("orderId");

        if (!orderId) {
          throw new Error("Order ID not found");
        }

        // Try with token first, but fallback to without token if not available
        const token = localStorage.getItem('token');
        const headers = token ? { "Authorization": `Bearer ${token}` } : {};
        
        const response = await fetch(
          `${BASE_URL}/orders/${orderId}`,
          { headers }
        );

        if (!response.ok) {
          // If unauthorized, try without token (public access)
          if (response.status === 401) {
            const publicResponse = await fetch(
              `${BASE_URL}/orders/${orderId}`
            );
            
            if (!publicResponse.ok) {
              throw new Error('Failed to fetch order details');
            }
            
            const orderData = await publicResponse.json();
            setOrder(orderData);
            return;
          }
          throw new Error('Failed to fetch order details');
        }

        const orderData = await response.json();
        setOrder(orderData);
      } catch (error) {
        console.error('Error fetching order:', error);
        setError(error.message || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [location]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 2,
    }).format(amount);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Something went wrong</h1>
          <p className="text-gray-600 mb-6">{error || "Order not found"}</p>
          <Link 
            to="/" 
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-green-100 px-6 py-4">
            <div className="flex items-center">
              <div className="bg-green-500 rounded-full p-2 mr-4">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Payment Successful!</h1>
                <p className="text-gray-600">Thank you for your purchase</p>
              </div>
            </div>
          </div>
          
          <div className="px-6 py-4">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-medium">{order.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="font-medium">{order.paymentMethod === "card" ? "Card Payment" : "Cash/KOKO Pay"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="font-bold text-green-600">{formatCurrency(order.total)}</p>
              </div>
            </div>

            <h2 className="text-lg font-bold mb-4">Order Items</h2>
            <div className="space-y-2 mb-6">
              {order.items && order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            <h2 className="text-lg font-bold mb-4">Customer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{order.customer?.firstName} {order.customer?.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{order.customer?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{order.customer?.phone}</p>
              </div>
              {order.deliveryMethod === "delivery" && (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">{order.customer?.address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">City</p>
                    <p className="font-medium">{order.customer?.city}</p>
                  </div>
                </>
              )}
            </div>

            <div className="text-center mt-8">
              <Link
                to="/"
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}