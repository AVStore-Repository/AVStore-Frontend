import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { FaMinus, FaPlus, FaTrash, FaArrowLeft, FaShoppingBag } from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 2,
  }).format(amount);
};

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, clearCart, getCartTotal } = useContext(CartContext);
  const navigate = useNavigate();

  const total = getCartTotal();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-700 hover:text-gray-900 transition-colors font-medium"
          >
            <FaArrowLeft className="mr-2" />
            Continue Shopping
          </button>
          <h1 className="text-3xl font-bold text-gray-900 py-14  flex items-center">
            <FaShoppingBag className="mr-3" />
            Shopping Cart
          </h1>
          <div className="w-24"></div> {/* Spacer for alignment */}
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="mx-auto w-24 h-24 flex items-center justify-center rounded-full bg-gray-100 mb-6">
              <FaShoppingBag className="text-4xl text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
            <button
              onClick={() => navigate("/")}
              className="bg-black hover:bg-gray-800 text-white font-medium py-3 px-8 rounded-lg transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Cart Header */}
            <div className="border-b border-gray-200 bg-white p-4 sm:p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Cart Items ({cart.length})</h2>
                <button
                  onClick={clearCart}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-medium transition-colors text-sm"
                >
                  Clear Cart
                </button>
              </div>
            </div>
            
            {/* Cart Items */}
            <div className="divide-y divide-gray-100">
              {cart.map((item, i) => (
                <div key={i} className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    {/* Product Info */}
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <img
                        src={item.images?.[0] || "/images/placeholder.jpg"}
                        alt={item.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg flex-shrink-0 shadow-sm border border-gray-200"
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg truncate">{item.name}</h3>
                        <p className="text-gray-600 font-medium mt-1">{formatCurrency(item.price)}</p>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between w-full sm:w-auto">
                      <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                        <button
                          onClick={() => updateQuantity(item.name, -1)}
                          className="p-2 text-gray-700 hover:text-black hover:bg-gray-100 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <FaMinus size={14} />
                        </button>
                        <span className="px-4 py-2 text-gray-900 font-medium min-w-[2.5rem] text-center border-x border-gray-300">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => {
                            const currentItem = cart.find(cartItem => cartItem.name === item.name);
                            if (currentItem && currentItem.quantity < currentItem.stock) {
                              updateQuantity(item.name, 1);
                            } else if (currentItem) {
                              toast.error(`Only ${currentItem.stock} items of ${currentItem.name} are available.`);
                            }
                          }}
                          className="p-2 text-gray-700 hover:text-black hover:bg-gray-100 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <FaPlus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.name)}
                        className="ml-4 p-3 bg-black text-white hover:bg-gray-800 rounded-lg transition-colors"
                        aria-label="Remove item"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                    <span className="text-gray-600 font-medium">Item total:</span>
                    <span className="font-bold text-gray-900 text-lg">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="border-t border-gray-200 bg-gray-50 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Order Total</h2>
                <span className="text-2xl font-bold text-gray-900">{formatCurrency(total)}</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <button
                  onClick={() => navigate("/")}
                  className="px-6 py-3 border border-gray-300 bg-white text-gray-800 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={() => navigate("/checkout")}
                  className="px-8 py-3 bg-black hover:bg-gray-800 text-white rounded-lg font-medium transition-colors"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    <ToastContainer />
    </div>
  );
} 