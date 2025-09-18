import React from "react";
import { useLocation, Link } from "react-router-dom";

export default function PaymentFailed() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const errorMessage = searchParams.get("message") || "Payment processing failed";
  const orderId = searchParams.get("orderId") || "";

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
            <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Payment Failed</h2>
          <p className="mt-2 text-gray-600">
            We couldn't process your payment. Please try again.
          </p>
        </div>

        <div className="mt-6 bg-red-50 border-l-4 border-red-400 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {errorMessage}
              </p>
            </div>
          </div>
        </div>

        {orderId && (
          <div className="mt-4 bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600">
              Order Reference: <span className="font-medium">{orderId}</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Please keep this reference number for customer support.
            </p>
          </div>
        )}

        <div className="mt-6 space-y-3">
          {orderId && (
            <Link
              to={`/checkout?orderId=${orderId}`}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 font-medium block text-center"
            >
              Try Payment Again
            </Link>
          )}
          
          <Link
            to="/cart"
            className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 font-medium block text-center"
          >
            View Cart
          </Link>
          
          <Link
            to="/"
            className="w-full bg-green-100 text-green-700 py-2 px-4 rounded-md hover:bg-green-200 font-medium block text-center"
          >
            Continue Shopping
          </Link>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Need help? Contact our support team at support@yourstore.com
          </p>
        </div>
      </div>
    </div>
  );
}