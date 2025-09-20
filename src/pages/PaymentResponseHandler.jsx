import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BASE_URL } from "../config/config";

export default function PaymentResponseHandler() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const processPaymentResponse = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const status = searchParams.get("status");
        const message = searchParams.get("message");
        const orderId = searchParams.get("order_id");
        const transactionRef = searchParams.get("transaction_ref");

        console.log("Payment response received:", { status, message, orderId, transactionRef });

        // If we have a transaction reference, verify with backend
        if (transactionRef) {
          try {
            const response = await fetch(
              `${BASE_URL}/payment/status/${transactionRef}`
            );
            
            if (response.ok) {
              const statusData = await response.json();
              if (statusData.status === "SUCCESS") {
                navigate(`/payment/success?orderId=${orderId || statusData.orderId}`);
                return;
              }
            }
          } catch (error) {
            console.error("Error verifying payment status:", error);
          }
        }

        // Fallback to URL parameters
        if (status === "SUCCESS" && orderId) {
          navigate(`/payment/success?orderId=${orderId}`);
        } else if (orderId) {
          navigate(`/payment/failed?message=${encodeURIComponent(message || "Payment failed")}&orderId=${orderId}`);
        } else {
          navigate(`/payment/failed?message=${encodeURIComponent(message || "Payment processing error")}`);
        }
      } catch (error) {
        console.error('Payment processing error:', error);
        navigate(`/payment/failed?message=${encodeURIComponent("Payment processing error")}`);
      }
    };

    processPaymentResponse();
  }, [location, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
        <h1 className="text-xl font-bold text-gray-800 mb-2">Processing Payment</h1>
        <p className="text-gray-600">Please wait while we verify your payment...</p>
      </div>
    </div>
  );
}