import React, { useState, useContext, useEffect, useRef } from "react";
import { FaShoppingCart, FaCheck } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { CartContext } from "../context/CartContext";
import { BASE_URL } from "../config/config";

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
    subcategories: ['Active speaker', 'Passive speaker', 'Portable speaker', 'Passive Subwoofers', 'Portable Speakers', 'Column Speakers']
  },
  {
    name: 'Microphones',
    subcategories: ['Wired microphone', 'Wireless microphone', 'Podium microphone']
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
  const [openCategory, setOpenCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const { cart, addToCart } = useContext(CartContext);
  const [availableProduct, setAvailableProduct] = useState([]);

  const dropdownRef = useRef();

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

  const getAvailableProduct = async ()=>{
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

  useEffect(()=>{
     getAvailableProduct();
  },[])
  

  console.log(availableProduct);
  

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat p-6 relative">
      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-4 mt-24 mb-4 relative" ref={dropdownRef}>
        {productCategories.map((category) => (
          <div key={category.name} className="relative w-auto">
            <button
              className={`text-lg font-medium flex items-center gap-1 transition-colors px-2 py-1 rounded ${
                selectedCategory === category.name
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
                  className={`text-xs inline-block transition-transform duration-300 ${
                    openCategory === category.name ? "rotate-180" : "rotate-0"
                  }`}
                >
                  ▼
                </span>
              )}
            </button>

            {category.subcategories && openCategory === category.name && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 animate-slideDown">
                {category.subcategories.map((subcategory) => (
                  <button
                    key={subcategory}
                    onClick={() => handleCategorySelect(subcategory)}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                      selectedCategory === subcategory ? "bg-blue-100 font-medium" : ""
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
          filteredProducts.map((p, index) => (
            <div
              key={p.id}
              className="bg-white rounded-lg shadow-md p-4 text-center transform transition-transform duration-300 hover:scale-105"
            >
              <img src={p.images[0]} alt={p.name} className="w-full h-50 object-cover rounded-md mb-3" />
              <h2 className="text-lg font-semibold">{p.name}</h2>
              {p.discountPrice ? (
                <p className="mt-1 text-gray-700 text-base flex justify-center items-center gap-2">
                  <span className="line-through text-gray-500">{formatCurrency(p.price)}</span>
                  <span className="font-bold text-red-600">{formatCurrency(p.discountPrice)}</span>
                </p>
              ) : (
                <p className="mt-1 text-gray-700 text-base">{formatCurrency(p.price)}</p>
              )}
              <p className="text-xs text-gray-500">{p.category}</p>
              {
                p.stock === 0 ?
                  <p className="text-xs text-red-500">Out of Stock</p> : p.stock <= 5 ?
                    <p className="text-xs text-orange-500">Low Stock ({p.stock} items left)</p> :
                    <p className="text-xs text-green-500">In Stock</p>
              }

              <div className="flex justify-center gap-3 mt-3">
                <button
                  onClick={() => addToCart(p)}
                  className="bg-gray-200/70 p-2 rounded-full hover:bg-gray-300/70 transition-colors"
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
          ))
        ) : (
          <div className="col-span-3 text-center text-gray-700 py-10">
            <p className="text-xl mb-2">No products found</p>
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

      {/* Product details modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-lg shadow-lg max-w-2xl w-full">
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
            <p className="font-bold text-lg mb-6">{formatCurrency(selectedProduct.price)}</p>

            <button
              onClick={() => setSelectedProduct(null)}
              className="bg-red-500/90 text-white px-4 py-2 rounded-lg hover:bg-red-400/90"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}