import React, { useState, useContext, useEffect, useRef } from "react";
import { FaShoppingCart, FaCheck, FaTag, FaCreditCard } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { CartContext } from "../context/CartContext";
import { BASE_URL } from "../config/config";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useLocation } from 'react-router-dom';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 2,
  }).format(amount);
};

const productCategories = [
  { name: "All Products" },
  {
    name: 'Mixers',
    subcategories: ['Analog Mixers', 'Digital Mixers']
  },
  {
    name: 'Speakers',
    subcategories: ['Active Speakers', 'Active Subwoofers', 'Passive Speakers', 'Passive Subwoofers', 'Portable Speakers', 'Column Speakers']
  },
  {
    name: 'Microphones',
    subcategories: ['Wired Microphones', 'Wireless Microphones', 'Podium Microphones']
  },
  {
    name: 'Amplifiers',
    subcategories: []
  },
  {
    name: 'Other',
    subcategories: ['Studio Equipment', 'Headphones & Earphones', 'In Ear Monitors', 'Accessories']
  }
];

export default function Shop() {
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const location = useLocation();
  const subcategory = location.state;
  const [openCategory, setOpenCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(subcategory == 'All' ? "All Products" : subcategory || "All Products");
  const { cart, addToCart } = useContext(CartContext);
  const [availableProduct, setAvailableProduct] = useState([]);
  const navigate = useNavigate();

  // Promo code states
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [currentPromoProduct, setCurrentPromoProduct] = useState(null);
  const [enteredPromoCode, setEnteredPromoCode] = useState("");
  const [appliedPromos, setAppliedPromos] = useState({});
  const [promoError, setPromoError] = useState("");
  const [loadingPromos, setLoadingPromos] = useState(true);

  const dropdownRef = useRef();

  // Fetch applied promos from backend on mount
  useEffect(() => {
    const fetchAppliedPromos = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoadingPromos(false);
        return;
      }

      try {
        const response = await axios.get(`${BASE_URL}/auth/user-promocodes`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          }
        });

        if (response.data && response.data.promos) {
          const promosObj = {};
          response.data.promos.forEach(promo => {
            promosObj[promo.productId] = {
              code: promo.promoCode,
              appliedAt: promo.appliedAt,
              discount: promo.discount || 0
            };
          });
          setAppliedPromos(promosObj);
        }
      } catch (error) {
        console.error("Error fetching applied promos:", error);
      } finally {
        setLoadingPromos(false);
      }
    };

    fetchAppliedPromos();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenCategory(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setOpenCategory(null);
  };

  const filteredProducts = availableProduct.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "All Products" ||
      p.category.toLowerCase() === selectedCategory.toLowerCase() ||
      productCategories.some((category) => {
        if (category.name.toLowerCase() === selectedCategory.toLowerCase() && category.subcategories) {
          return category.subcategories.some(
            (sub) => sub.toLowerCase() === p.category.toLowerCase()
          );
        }
        return false;
      });
    return matchesSearch && matchesCategory;
  });

  const getAvailableProduct = async () => {
    const response = await fetch(
      `${BASE_URL}/products/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      }
    );
    const data = await response.json();
    setAvailableProduct(data);
  }

  const calculateDiscountedPrice = (product, discount) => {
    if (discount) {
      const discountAmount = (product.price * discount) / 100;
      return product.price - discountAmount;
    }
    return product.price;
  };

  const handleAddToCart = (product) => {
    // const token = localStorage.getItem("token");

    // if (!token) {
    //   navigate("/login");
    //   return;
    // }

    const appliedPromo = appliedPromos[product.id];

    if (appliedPromo) {
      const discountedPrice = calculateDiscountedPrice(product, appliedPromo.discount);
      addToCart({
        ...product,
        price: discountedPrice,
        appliedPromoCode: appliedPromo.code,
        promoDiscount: appliedPromo.discount,
        originalPrice: product.price
      });
    } else {
      addToCart({
        ...product,
        price: product.discountPrice || product.price,
        appliedPromoCode: null,
        promoDiscount: null,
        originalPrice: null
      });
    }
  };

  const openPromoModal = (product) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    setCurrentPromoProduct(product);
    setShowPromoModal(true);
    setEnteredPromoCode("");
    setPromoError("");
  };

  const closePromoModal = () => {
    setShowPromoModal(false);
    setCurrentPromoProduct(null);
    setEnteredPromoCode("");
    setPromoError("");
  };

  const handleApplyPromo = async () => {
    if (!currentPromoProduct) return;

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    if (enteredPromoCode.toUpperCase() !== currentPromoProduct.promoCode) {
      setPromoError("Invalid promo code. Please try again.");
      return;
    }

    if (appliedPromos[currentPromoProduct.id]) {
      setPromoError("You have already applied a promo code to this product.");
      return;
    }

    const newAppliedPromos = {
      ...appliedPromos,
      [currentPromoProduct.id]: {
        code: enteredPromoCode.toUpperCase(),
        appliedAt: new Date().toISOString(),
        discount: currentPromoProduct.promoDiscount
      },
    };
    setAppliedPromos(newAppliedPromos);

    const discountedPrice = calculateDiscountedPrice(currentPromoProduct, currentPromoProduct.promoDiscount);
    addToCart({
      ...currentPromoProduct,
      price: discountedPrice,
      appliedPromoCode: enteredPromoCode.toUpperCase(),
      promoDiscount: currentPromoProduct.promoDiscount,
      originalPrice: currentPromoProduct.price
    });

    closePromoModal();
    alert(`Promo code applied! You saved ${currentPromoProduct.promoDiscount || 0}%. Product added to cart with discount.`);
  };

  const getDisplayPrice = (product) => {
    if (appliedPromos[product.id]) {
      return calculateDiscountedPrice(product, appliedPromos[product.id].discount);
    }
    return product.discountPrice || product.price;
  };

  const isPromoApplied = (productId) => {
    return appliedPromos[productId] !== undefined;
  };

  useEffect(() => {
    getAvailableProduct();
  }, [])

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat p-6 relative">
      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-24 mb-4 relative px-2" ref={dropdownRef}>
        {productCategories.map((category) => (
          <div key={category.name} className="relative">
            <button
              className={`text-sm sm:text-base md:text-lg font-medium flex items-center gap-1 transition-colors px-2 sm:px-3 py-1 sm:py-2 rounded whitespace-nowrap ${selectedCategory === category.name
                  ? "text-yellow-400 underline"
                  : "text-black hover:text-yellow-300"
                }`}
              onClick={() => {
                if (category.subcategories && category.subcategories.length > 0) {
                  setOpenCategory(openCategory === category.name ? null : category.name);
                } else {
                  handleCategorySelect(category.name);
                }
              }}
            >
              {category.name}
              {category.subcategories && (
                <span
                  className={`text-xs inline-block transition-transform duration-300 ${openCategory === category.name ? "rotate-180" : "rotate-0"
                    }`}
                >
                  ▼
                </span>
              )}
            </button>

            {category.subcategories && openCategory === category.name && (
              <div className="absolute top-full left-0 mt-2 w-40 sm:w-48 bg-white rounded-lg shadow-lg py-2 z-50 animate-slideDown max-h-60 overflow-y-auto">
                {category.subcategories.map((subcategory) => (
                  <button
                    key={subcategory}
                    onClick={() => handleCategorySelect(subcategory)}
                    className={`block w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm hover:bg-gray-100 ${selectedCategory === subcategory ? "bg-blue-100 font-medium" : ""
                      }`}
                  >
                    {subcategory}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Shop Heading */}
      <h1 className="text-4xl font-bold text-center mb-6 text-black drop-shadow-lg">Shop</h1>

      {/* Search */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-lg w-full max-w-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white/80 backdrop-blur-sm"
        />
      </div>

      {/* Active filter */}
      {selectedCategory && selectedCategory !== "All Products" && (
        <div className="mb-4 flex items-center justify-center">
          <span className="bg-blue-100/70 text-blue-800 px-3 py-1 rounded-full text-sm mr-2">
            {selectedCategory}
          </span>
          <button
            onClick={() => setSelectedCategory("All Products")}
            className="text-sm text-gray-500 hover:text-black"
          >
            Clear filter
          </button>
        </div>
      )}

      {/* Products grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((p) => {
            const displayPrice = getDisplayPrice(p);
            const hasPromo = p.promoCode && p.promoDiscount;
            const promoApplied = isPromoApplied(p.id);
            const promoInfo = appliedPromos[p.id];
            const promoDiscountedPrice = promoApplied && promoInfo ? calculateDiscountedPrice(p, promoInfo.discount) : null;
            const hasInstallment = p.kokoInstallment && p.kokoInstallmentCount && p.kokoInstallmentPrice;

            return (
              <div
                key={p.id}
                className="bg-white rounded-lg shadow-md p-4 text-center transform transition-transform duration-300 hover:scale-105 relative"
              >
                {hasPromo && !promoApplied && (
                  <div className="absolute top-2 right-2 bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <FaTag size={10} />
                    {p.promoDiscount}% OFF
                  </div>
                )}
                {promoApplied && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    Already Applied
                  </div>
                )}

                <img src={p.images[0]} alt={p.name} className="w-full h-50 object-cover rounded-md mb-3" />
                <h2 className="text-lg font-semibold">{p.name}</h2>

                {/* Price Display Logic */}
                {promoApplied && promoDiscountedPrice ? (
                  <p className="mt-1 text-gray-700 text-base flex justify-center items-center gap-2">
                    <span className="text-gray-500">{formatCurrency(p.price)}</span>
                  </p>
                ) : p.discountPrice ? (
                  <p className="mt-1 text-gray-700 text-base flex justify-center items-center gap-2">
                    <span className="line-through text-gray-500">{formatCurrency(p.price)}</span>
                    <span className="font-bold text-red-600">{formatCurrency(p.discountPrice)}</span>
                  </p>
                ) : (
                  <p className="mt-1 text-gray-700 text-base">{formatCurrency(p.price)}</p>
                )}

                {promoApplied && (
                  <p className="text-xs text-green-600 mt-1 font-medium">
                    You Already Applied Promo Code!
                  </p>
                )}

                {/* Koko Installment Badge */}
                {hasInstallment && (
                  <div className="mt-2 rounded-lg p-2">
                    <p className="text-xs text-green-800 font-semibold">
                      or with {p.kokoInstallmentCount} installments of {formatCurrency(p.kokoInstallmentPrice)}
                    </p>
                    <div className="flex items-center justify-center gap-2 text-green-700 mb-0">
                      <img
                        src="https://www.seylan.lk/uploads/KOKO.jpg"
                        alt="Koko Payment"
                        className="h-8 w-auto object-contain"
                      />
                    </div>
                  </div>
                )}

                <p className="text-xs text-gray-500">{p.category}</p>
                {
                  p.stock === 0 ?
                    <p className="text-xs text-red-500">Out of Stock</p> : p.stock <= 5 ?
                      <p className="text-xs text-orange-500">Low Stock ({p.stock} items left)</p> :
                      <p className="text-xs text-green-500">In Stock</p>
                }

                {/* Promo Code Button - Only show if promo hasn't been used */}
                {hasPromo && !promoApplied && (
                  <button
                    onClick={() => openPromoModal(p)}
                    className="w-full mt-2 bg-purple-500 text-white px-3 py-2 rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                    disabled={loadingPromos}
                  >
                    <FaTag size={12} />
                    Apply Promo Code
                  </button>
                )}

                <div className="flex justify-center gap-3 mt-3">
                  <button
                    onClick={() => handleAddToCart(p)}
                    className="bg-gray-200/70 p-2 rounded-full hover:bg-gray-300/70 transition-colors"
                    disabled={p.stock === 0}
                  >
                    {cart.some((item) => item.name === p.name) ? (
                      <FaCheck className="text-green-600 text-lg" />
                    ) : (
                      <FaShoppingCart className="text-black text-lg" />
                    )}
                  </button>

                  <button
                    onClick={() => setSelectedProduct(p)}
                    className="bg-blue-500/90 text-white px-3 py-1 rounded-lg hover:bg-blue-400/90 transition-colors text-sm"
                  >
                    Details
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-3 text-center text-gray-700 py-10">
            <p className="text-xl mb-2">Loading...</p>
            {(search || selectedCategory !== "All Products") && (
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("All Products");
                }}
                className="text-blue-500 hover:text-blue-700"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Promo Code Modal */}
      {showPromoModal && currentPromoProduct && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <FaTag className="text-purple-500" />
                Apply Promo Code
              </h2>
              <button onClick={closePromoModal} className="text-gray-500 hover:text-gray-700">
                <IoMdClose size={24} />
              </button>
            </div>

            <div className="mb-4">
              <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-purple-800 font-medium">Save {currentPromoProduct.promoDiscount}% with promo code!</p>
                <p className="text-lg font-bold text-purple-600 mt-1">
                  New Price: {formatCurrency(calculateDiscountedPrice(currentPromoProduct, currentPromoProduct.promoDiscount))}
                </p>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg p-4 mb-4 text-center">
                <p className="text-white text-sm font-medium mb-2">Available Promo Code</p>
                <div className="bg-white rounded-lg py-3 px-4 inline-block">
                  <p className="text-2xl font-bold text-purple-600 tracking-wider">{currentPromoProduct.promoCode}</p>
                </div>
                <p className="text-white text-xs mt-2 opacity-90">Copy and use this code below</p>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4">
                <p className="text-yellow-800 text-xs font-medium">
                  Note: Promo codes can only be used once per product. After using this code, you can still purchase this product but at the regular price.
                </p>
              </div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Enter Promo Code
              </label>
              <input
                type="text"
                value={enteredPromoCode}
                onChange={(e) => {
                  setEnteredPromoCode(e.target.value.toUpperCase());
                  setPromoError("");
                }}
                placeholder="Enter code here"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all uppercase text-center text-lg font-bold"
              />
              {promoError && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <span>⚠</span>
                  <span>{promoError}</span>
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={closePromoModal}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyPromo}
                disabled={!enteredPromoCode.trim()}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${enteredPromoCode.trim()
                  ? 'bg-purple-500 text-white hover:bg-purple-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
              >
                Apply Code
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product details modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
              <button onClick={() => setSelectedProduct(null)}>
                <IoMdClose size={24} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              {selectedProduct.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${selectedProduct.name} ${i}`}
                  className="w-50 h-40 object-cover rounded"
                />
              ))}
            </div>

            <p className="text-gray-700 mb-2">{selectedProduct.description}</p>
            <p className="text-gray-600 mb-4">Category: {selectedProduct.category}</p>
            <p className="font-bold text-lg mb-4">{formatCurrency(getDisplayPrice(selectedProduct))}</p>

            {selectedProduct.promoCode && !isPromoApplied(selectedProduct.id) && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-purple-800 font-medium">
                  Special offer available! Use promo code to save {selectedProduct.promoDiscount}%
                </p>
              </div>
            )}

            {isPromoApplied(selectedProduct.id) && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-green-700 font-medium">
                  You have applied a {appliedPromos[selectedProduct.id]?.discount}% promo discount to this product!
                </p>
              </div>
            )}

            {/* Koko Installment Details */}
            {selectedProduct.kokoInstallment && selectedProduct.kokoInstallmentCount && selectedProduct.kokoInstallmentPrice && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <FaCreditCard className="text-green-600" size={20} />
                  <h3 className="text-lg font-bold text-green-800">Koko Payment Plan Available</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Number of Installments:</span>
                    <span className="font-bold text-green-700">{selectedProduct.kokoInstallmentCount} payments</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Per Installment:</span>
                    <span className="font-bold text-green-700">{formatCurrency(selectedProduct.kokoInstallmentPrice)}</span>
                  </div>
                  <div className="border-t border-green-200 pt-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-700">Total Amount:</span>
                      <span className="font-bold text-lg text-green-800">
                        {formatCurrency(selectedProduct.kokoInstallmentPrice * selectedProduct.kokoInstallmentCount)}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-green-700 mt-3 text-center italic">
                  Pay in {selectedProduct.kokoInstallmentCount} easy installments with Koko Payment
                </p>
              </div>
            )}

            <button
              onClick={() => setSelectedProduct(null)}
              className="bg-red-500/90 text-white px-4 py-2 rounded-lg hover:bg-red-400/90 w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
