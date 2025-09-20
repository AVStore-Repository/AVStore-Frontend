import React, { useState, useEffect } from "react";
import { BASE_URL } from "../config/config";

export default function PaymentPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://test-seylan.mtf.gateway.mastercard.com/static/checkout/checkout.min.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const createSession = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BASE_URL}/payment/create-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: "250.00",        
          description: "Laptop Bag",
        }),
      });

      if (!res.ok) throw new Error("Failed to create session");

      const data = await res.json();
      console.log("Session data:", data);

      if (data.sessionId) {
        // Configure Checkout.js with sessionId
        // eslint-disable-next-line no-undef
        Checkout.configure({
          session: { id: data.sessionId },
        });

        // Redirect payment page (hosted by Seylan/MPGS)
        // eslint-disable-next-line no-undef
        Checkout.showPaymentPage();
      } else {
        throw new Error("Invalid session response");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <button
          onClick={createSession}
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}
