import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/temp';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import Checkout from "./pages/Checkout";
import Cart from './pages/Cart';
import { CartProvider } from './context/CartContext';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailed from './pages/PaymentFailed';
import PaymentResponseHandler from './pages/PaymentResponseHandler';
import PaymentPage from './pages/Payment';

function App() {
  return (
    <CartProvider>
      <Router>
        <Navbar />
        <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/failed" element={<PaymentFailed />} />
            <Route path="/payment/response" element={<PaymentResponseHandler />} />
            <Route path="/payment" element={<PaymentPage />} />
          </Routes>
        </main>   
        <Footer />
      </Router>
    </CartProvider>
  );
}

export default App;