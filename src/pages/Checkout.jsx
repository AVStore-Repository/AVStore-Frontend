import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config/config";
import axios from "axios";

export default function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    country: "Sri Lanka",
    address: "",
    city: "",
    zipCode: "00100",
    paymentMethod: "cash",
    deliveryMethod: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 2,
    }).format(amount);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const countries = [
    "Sri Lanka", "Afghanistan", "Albania", "Algeria", "Andorra", "Angola",
    "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
    "Bangladesh", "Belgium", "Bhutan", "Brazil", "Bulgaria",
    "Canada", "China", "Colombia", "Croatia", "Czech Republic",
    "Denmark", "Egypt", "Finland", "France", "Germany",
    "Greece", "Hungary", "India", "Indonesia", "Iran",
    "Iraq", "Ireland", "Israel", "Italy", "Japan",
    "Kenya", "Kuwait", "Malaysia", "Maldives", "Mexico",
    "Nepal", "Netherlands", "New Zealand", "Nigeria", "Norway",
    "Pakistan", "Philippines", "Poland", "Portugal", "Qatar",
    "Romania", "Russia", "Saudi Arabia", "Singapore", "South Africa",
    "South Korea", "Spain", "Sweden", "Switzerland",
    "Thailand", "Turkey", "Ukraine", "United Arab Emirates", "United Kingdom",
    "United States", "Vietnam", "Zimbabwe"
  ];

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const orderData = {
        customer: form,
        items: cart,
        total: total,
        deliveryMethod: form.deliveryMethod,
        paymentMethod: form.paymentMethod,
      };

      console.log("Submitting order:", orderData);

      const orderResponse = await fetch(
        `${BASE_URL}/orders`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        }
      );

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.error || "Failed to create order");
      }

      const order = await orderResponse.json();
      console.log("Order created:", order.id);

      if (form.paymentMethod === "card") {
        // Create session for Seylan Bank
        const res = await fetch(
          `${BASE_URL}/payment/create-session`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              amount: total.toFixed(2),
              description: `Order #${order.id}`,
            }),
          }
        );

        if (!res.ok) throw new Error("Failed to create payment session");
        const data = await res.json();
        console.log("Session data:", data);

        if (data.sessionId) {
          if (window.Checkout && typeof window.Checkout.configure === "function") {
            window.Checkout.configure({ session: { id: data.sessionId } });
            window.Checkout.showPaymentPage();
          } else {
            throw new Error("Checkout.js not loaded properly");
          }
        } else {
          throw new Error("Invalid session response");
        }
      } else {
        try {
          const res = await axios.post("http://localhost:5000/api/payment/create-koko-payment", {
            orderId: 123,
            amount: 15000,
            currency: "LKR",
            firstName: "Joe",
            lastName: "Kate",
            email: "webivox@gmail.com",
            mobile: "0777904054",
          });

          if (res.data.success) {
            const { actionUrl, formFields } = res.data;

            const form = document.createElement("form");
            form.method = "POST";
            form.action = actionUrl;

            Object.entries(formFields).forEach(([key, value]) => {
              const input = document.createElement("input");
              input.type = "hidden";
              input.name = key;
              input.value = value;
              form.appendChild(input);
            });

            document.body.appendChild(form);
            form.submit();
          } else {
            alert("Payment failed: " + res.data.message);
          }
        } catch (err) {
          console.error(err);
          alert("Error creating payment");
        }
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setError(error.message || "Failed to process order. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-6 transition-all duration-500">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 transform transition-transform duration-700 ease-in-out hover:scale-105">
          Checkout
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 transform transition-all duration-500 ease-in-out animate-pulse">
            {error}
          </div>
        )}

        <div className="bg-white shadow-xl rounded-2xl p-8 transform transition-all duration-700 ease-in-out hover:shadow-2xl">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block font-semibold mb-2 text-gray-700">
                Select Delivery Method:
              </label>
              <select
                name="deliveryMethod"
                value={form.deliveryMethod}
                onChange={handleChange}
                className="w-full p-3 border-2 rounded-lg transition-all duration-300 ease-in-out focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={loading}
              >
                <option value="">-- Choose an option --</option>
                <option value="delivery">Delivery</option>
                <option value="pickup">Store Pickup</option>
              </select>
            </div>

            {form.deliveryMethod && (
              <div className={`transition-all duration-700 ease-in-out ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b-2 border-blue-200 pb-2">
                      Customer Details
                    </h2>

                    <div className="space-y-4">
                      <div className="transform transition-all duration-300 ease-in-out hover:scale-[1.01]">
                        <label className="block mb-1 text-gray-600">Email *</label>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          className="w-full p-3 border-2 rounded-lg transition-all duration-300 ease-in-out focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                          disabled={loading}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="transform transition-all duration-300 ease-in-out hover:scale-[1.01]">
                          <label className="block mb-1 text-gray-600">First name *</label>
                          <input
                            type="text"
                            name="firstName"
                            value={form.firstName}
                            onChange={handleChange}
                            className="w-full p-3 border-2 rounded-lg transition-all duration-300 ease-in-out focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                            disabled={loading}
                          />
                        </div>
                        <div className="transform transition-all duration-300 ease-in-out hover:scale-[1.01]">
                          <label className="block mb-1 text-gray-600">Last name *</label>
                          <input
                            type="text"
                            name="lastName"
                            value={form.lastName}
                            onChange={handleChange}
                            className="w-full p-3 border-2 rounded-lg transition-all duration-300 ease-in-out focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                            disabled={loading}
                          />
                        </div>
                      </div>

                      <div className="transform transition-all duration-300 ease-in-out hover:scale-[1.01]">
                        <label className="block mb-1 text-gray-600">Phone *</label>
                        <input
                          type="text"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          className="w-full p-3 border-2 rounded-lg transition-all duration-300 ease-in-out focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>
                  </div>

                  {form.deliveryMethod === "delivery" && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b-2 border-blue-200 pb-2">
                        Delivery Details
                      </h2>

                      <div className="space-y-4">
                        <div className="transform transition-all duration-300 ease-in-out hover:scale-[1.01]">
                          <label className="block mb-1 text-gray-600">Country/Region *</label>
                          <select
                            name="country"
                            value={form.country}
                            onChange={handleChange}
                            className="w-full p-3 border-2 rounded-lg transition-all duration-300 ease-in-out focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                            disabled={loading}
                          >
                            {countries.map((country) => (
                              <option key={country} value={country}>
                                {country}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="transform transition-all duration-300 ease-in-out hover:scale-[1.01]">
                          <label className="block mb-1 text-gray-600">Address *</label>
                          <input
                            type="text"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            className="w-full p-3 border-2 rounded-lg transition-all duration-300 ease-in-out focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                            disabled={loading}
                          />
                        </div>

                        <div className="transform transition-all duration-300 ease-in-out hover:scale-[1.01]">
                          <label className="block mb-1 text-gray-600">City *</label>
                          <input
                            type="text"
                            name="city"
                            value={form.city}
                            onChange={handleChange}
                            className="w-full p-3 border-2 rounded-lg transition-all duration-300 ease-in-out focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                            disabled={loading}
                          />
                        </div>

                        <div className="transform transition-all duration-300 ease-in-out hover:scale-[1.01]">
                          <label className="block mb-1 text-gray-600">Zip / Postal code *</label>
                          <input
                            type="text"
                            name="zipCode"
                            value={form.zipCode}
                            onChange={handleChange}
                            className="w-full p-3 border-2 rounded-lg transition-all duration-300 ease-in-out focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                            disabled={loading}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t my-8 border-gray-200"></div>

                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b-2 border-blue-200 pb-2">
                    Order Summary
                  </h2>
                  <div className="bg-gray-50 p-6 rounded-xl shadow-inner transform transition-all duration-300 ease-in-out hover:shadow-md">
                    {cart.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between mb-3 py-2 border-b border-gray-100 transform transition-all duration-300 ease-in-out hover:bg-gray-100 hover:pl-2 rounded-md"
                      >
                        <span className="text-gray-700">{item.name} (x{item.quantity})</span>
                        <span className="font-medium text-gray-800">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                    <div className="border-t pt-4 mt-2 font-semibold">
                      <div className="flex justify-between text-lg">
                        <span className="text-gray-800">Total:</span>
                        <span className="text-blue-600">{formatCurrency(total)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b-2 border-blue-200 pb-2">
                    Payment
                  </h2>

                  <div className="mb-6">
                    <label className="block font-semibold mb-2 text-gray-700">
                      Payment Method:
                    </label>
                    <select
                      name="paymentMethod"
                      value={form.paymentMethod}
                      onChange={handleChange}
                      className="w-full p-3 border-2 rounded-lg transition-all duration-300 ease-in-out focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={loading}
                    >
                      <option value="koko">KOKO Pay(not update yet)</option>
                      <option value="card">Card Payment (Visa/MasterCard)</option>
                    </select>
                  </div>

                  {form.paymentMethod === "card" && (
                    <div className="bg-blue-50 p-4 rounded-lg mb-6 transform transition-all duration-500 ease-in-out hover:shadow-md">
                      <p className="text-blue-700 text-sm">
                        <strong>Note:</strong> You will be redirected to Seylan Bank's secure payment portal
                        to complete your card payment. Your payment details are processed securely
                        by Seylan Bank and are not stored on our servers.
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col md:flex-row justify-between items-center mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-inner">
                    <div className="font-bold text-xl text-gray-800 mb-4 md:mb-0">
                      Total: <span className="text-blue-600">{formatCurrency(total)}</span>
                    </div>
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-8 rounded-lg shadow-md hover:from-green-600 hover:to-green-700"
                      disabled={loading || cart.length === 0}
                    >
                      {loading ? "Processing..." : "Confirm & Pay"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}