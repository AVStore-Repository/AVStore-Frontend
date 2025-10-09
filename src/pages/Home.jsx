import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const products = [
  { id: 1, name: 'Sound Box', image: '/images/1.png' },
  { id: 2, name: 'Mixer', image: '/images/3.png' },
  { id: 3, name: 'Microphone', image: '/images/5.png' },
  { id: 4, name: 'Microphone', image: '/images/7.png' },
  { id: 5, name: 'Speakers', image: '/images/18.png' },
  { id: 6, name: 'Mixer', image: '/images/21.png' },
  { id: 1, name: 'Sound Box', image: '/images/23.png' },
  { id: 2, name: 'Mixer', image: '/images/28.png' },
  { id: 3, name: 'Microphone', image: '/images/30.png' },
  { id: 4, name: 'Speakers', image: '/images/84.png' },

];

export default function Home() {
  const scrollContainerRef = useRef(null);
  const [visibleCards, setVisibleCards] = useState({});
  const navigate = useNavigate();

  // Product card animation observer
  useEffect(() => {
    if (!scrollContainerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-id');
            setVisibleCards((prev) => ({ ...prev, [id]: true }));
          }
        });
      },
      { root: scrollContainerRef.current, threshold: 0.5 }
    );

    const cards = scrollContainerRef.current.querySelectorAll('.product-card');
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  // Section fade-in animation observer
  useEffect(() => {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.2 }
    );

    const sections = document.querySelectorAll('.fade-in-section');
    sections.forEach((section) => sectionObserver.observe(section));

    return () => sectionObserver.disconnect();
  }, []);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleQuickView = (product) => {
    alert(`Quick view: ${product.name}`);
  };

  const handleShopNow = () => {
    navigate('/shop');
  };

  return (
    <>
      <style>
        {`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .fade-slide-up {
            transition: opacity 0.5s ease-out, transform 0.5s ease-out;
          }

          /* Fade in section animation */
          .fade-in-section {
            opacity: 0;
            transform: translateY(40px);
            transition: opacity 0.8s ease-out, transform 0.8s ease-out;
          }
          .fade-in-section.visible {
            opacity: 1;
            transform: translateY(0);
          }

          /* 3D carousel styles */
          .carousel-container {
            perspective: 1000px;
            width: 100%;
            height: 400px;
            position: relative;
            overflow: visible;
          }
          .carousel {
            width: 100%;
            height: 100%;
            position: absolute;
            transform-style: preserve-3d;
            animation: spin 9s linear infinite;
          }
          .carousel-item {
            position: absolute;
            width: 150px;
            height: 150px;
            top: 50%;
            left: 50%;
            transform-style: preserve-3d;
            transition: transform 0.5s;
          }
          .carousel-item img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            border-radius: 12px;
            box-shadow: 0 10px 20px rgba(0,0,0,0.4);
          }
          .carousel-item:hover img {
            transform: scale(1.2);
            z-index: 10;
          }

          @keyframes spin {
            15% { transform: rotateY(0deg); }
            20% { transform: rotateY(60deg); }
            35% { transform: rotateY(60deg); }
            40% { transform: rotateY(120deg); }
            55% { transform: rotateY(120deg); }
            60% { transform: rotateY(180deg); }
            75% { transform: rotateY(180deg); }
            80% { transform: rotateY(240deg); }
            95% { transform: rotateY(240deg); }
            100% { transform: rotateY(300deg); }
          }
        `}
      </style>

      <div className="bg-white min-h-screen text-black">
        {/* Hero section */}
        <section className="fade-in-section min-h-screen bg-cover bg-center bg-white flex flex-col items-center justify-start pt-40 text-black px-6">
          <h1 className="text-6xl font-bold mb-2 drop-shadow-lg">Welcome to AVSTO</h1>
          <h4 className="text-2xl font-bold mb-2 drop-shadow-lg">Your One-Stop shop for Professional Audio-Visual Equipment </h4>
          <p className="text-xl max-w-2xl text-center drop-shadow-md mb-6">
            Discover the best in Pro-AV Solutions from world leading brands in Profesional Audio visual buisness, which carries the assurance of Quality, Authencity, and Genuineness.<br />
            Whether you’re a beginner, or a professional, we got the right solution at the right price.
          </p>
          <button
            onClick={handleShopNow}
            className="mt-[10px] bg-white hover:bg-gray-400 transition-colors duration-300 text-black font-semibold py-3 px-8 rounded shadow-lg drop-shadow-md"
          >
            Shop Now
          </button>

          {/* 🔽 Banner placed right under Shop Now button */}
          <div className="mt-10 w-full flex justify-center">
            <img
              src="/images/Banner.png"
              alt="Promotional Banner"
              className="w-full h-30 max-w-6xl rounded-lg shadow-lg"
            />
          </div>
        </section>

        {/* 3D Spinning Carousel Section */}
        <section className="fade-in-section min-h-screen bg-cover bg-center flex flex-col items-center justify-start pt-10 text-black text px-6"
          style={{ backgroundImage: "url('/images/.jpg')" }}
        >
          <h2 className="text-5xl font-bold mb-12">Featured Products</h2>
          <p className="text-lg font-semibold max-w-3xl text-center drop-shadow-sm px-6 mb-10">
            Experience sound in its purest form. Our featured gear is engineered for the critical listener, delivering unparalleled clarity, depth, and immersive audio that reveals every nuance of your music.
          </p>
          <div className="carousel-container">
            <div className="carousel">
              {products.map((product, index) => {
                const angle = (360 / products.length) * index;
                return (
                  <div
                    key={product.id}
                    className="carousel-item"
                    style={{
                      transform: `rotateY(${angle}deg) translateZ(400px)`,
                    }}
                  >
                    <img src={product.image} alt={product.name} />
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Explore the Collection */}
        <section className="fade-in-section min-h-screen bg-cover bg-center flex flex-col items-center justify-start pt-40 text-black relative">
          <h2 className="text-5xl font-bold mb-8 drop-shadow-md">Explore the Collection</h2>
          <p className="text-lg font-semibold max-w-3xl text-center drop-shadow-sm px-6 mb-10">
            Explore our curated collection of premium audio products designed to enhance your listening experience...
          </p>

          <button
            onClick={() => scroll('left')}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-10 hover:bg-opacity-100 rounded-full p-2 shadow-lg z-10 text-gray-900"
          >
            &#8249;
          </button>
          <button
            onClick={() => scroll('right')}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full p-2 shadow-lg z-10 text-gray-900"
          >
            &#8250;
          </button>

          <div className="w-full flex justify-center px-6">
            <div
              ref={scrollContainerRef}
              className="overflow-x-auto no-scrollbar"
              style={{ scrollSnapType: 'x mandatory', width: 'calc(6 * 12rem + 3 * 1.5rem)' }}
            >
              <div className="flex space-x-6">
                {products.map((product) => {
                  const isVisible = visibleCards[product.id];
                  return (
                    <div
                      key={product.id}
                      data-id={product.id}
                      className={`product-card relative flex-shrink-0 w-48 h-64 bg-white bg-opacity-60 rounded-lg p-4 fade-slide-up ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-90'
                        } hover:scale-105 cursor-pointer shadow-lg flex flex-col items-center scroll-snap-align-start`}
                    >
                      <div className="relative w-full h-40 mb-4 rounded overflow-hidden">
                        <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                        <button
                          onClick={() => handleQuickView(product)}
                          className="absolute inset-0 bg-black bg-opacity-60 opacity-0 hover:opacity-100 flex items-center justify-center text-white font-semibold transition-opacity rounded"
                        >
                          Quick View
                        </button>
                      </div>
                      <h3 className="text-lg font-semibold text-center">{product.name}</h3>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Middle Banner */}
        <div className="w-full flex justify-center my-12 px-6">
          <img
            src="/images/XS1 Banner.png"
            alt="Mid Banner"
            className="w-full  h-30 max-w-6xl object-cover rounded-lg shadow-lg"
          />
        </div>


        {/* Special Deals Section */}
        <section
          className="fade-in-section min-h-screen flex flex-col md:flex-row items-center justify-center px-6 py-12 text-black"
          style={{ backgroundImage: "url('/images/deals.jpg')" }}
        >
          {/* Left side - Product Image */}
          <div className="w-full md:w-1/2 flex justify-center mb-10 md:mb-0">
            <div className="relative max-w-sm rounded-lg overflow-hidden shadow-lg bg-gray-100">
              <img
                src="https://res.cloudinary.com/drkm7uelu/image/upload/v1759216697/Bundle_Offer_lysgsl.png"
                alt="B1X Speaker"
                className="w-full h-auto object-contain"
              />
              <div
                className="absolute top-0 right-0 w-12 h-12 bg-white rounded-bl-full"
                style={{
                  boxShadow: "-5px 5px 5px rgba(0,0,0,0.1)",
                  clipPath: "polygon(100% 0, 0 100%, 100% 100%)",
                }}
              />
            </div>
          </div>

          {/* Right side - Text and button */}
          <div className="w-full md:w-1/2 max-w-lg md:pl-16 text-center md:text-left">
            <h2 className="text-5xl font-bold mb-6">Special Deals</h2>
            <p className="text-lg mb-8 leading-relaxed">
              All-in-One Portable 250-Watt Speaker with Battery Operation, Digital Mixer, Effects, Remote Control via iOS/Android Mobile App, Bluetooth Audio Streaming and Wireless Microphone Option
            </p>
            <button
              onClick={() => navigate('/shop')}
              className="bg-black text-white px-8 py-3 rounded-full flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors duration-300 mx-auto md:mx-0"
            >
              <span>Shop Now</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </section>

        {/* Our Brands Section */}
        <section className="fade-in-section min-h-screen bg-cover bg-center bg-white flex flex-col items-center justify-start pt-10 text-black px-6">
          <h2 className="text-4xl font-bold mb-12">OUR BRANDS</h2>
          <div className="w-full flex justify-center mb-10">
            <img
              src="/images/AV Store Our Brands.png"
              alt="Brands Banner"
              className="w-full max-w-5xl object-cover rounded-lg shadow-lg"
            />
          </div>
        </section>

        {/* Footer Section */}
        <footer className="bg-white/70 text-black py-10 px-6 mt-16">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center">

            {/* Left: Logo & Description */}
            <div className="flex flex-col items-start">
              <img
                src="/images/dlogo.png"   // <-- replace with your logo path
                alt="Company Logo"
                className="w-28 mb-4"
              />
              <p className="text-sm text-black">
                We are Sri Lanka’s trusted distribution group for music products.
              </p>
            </div>

            {/* Middle: Contact Info */}
            <div className="text-center md:text-left">
              <h3 className="text-lg font-bold mb-3">Contact Us</h3>
              <p className="text-sm text-black">Ground Floor </p>
              <p className="text-sm text-black">No.17, Lauries Place (R.A. De Mel Mawatha), Colombo 04</p>
              <p className="text-sm text-black">Email: info.avstorelk@gmail</p>
              <p className="text-sm text-black">Phone: +94 779330690</p>
            </div>

            {/* Right: Social Media Icons */}
            <div className="flex justify-center md:justify-end space-x-4">
              <a href="https://www.facebook.com/dynamicavlk?mibextid=kFxxJD" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                <img src="/images/facebook.png" alt="Facebook" className="w-9 h-9" />
              </a>
              <a href="https://wa.me/94779330690" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                <img src="/images/whatsapp.png" alt="WhatsApp" className="w-9 h-9" />
              </a>
              <a href="https://www.instagram.com/dynamic_av_official?igsh=Y3I4dnQwdzlmMjBt" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                <img src="/images/instagram.png" alt="Instagram" className="w-9 h-9" />
              </a>

              <a href="https://www.tiktok.com/@avstore.lk?_t=ZS-8zM28E9khOh&_r=1" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                <img src="/images/tik-tok.png" alt="TikTok" className="w-9 h-9" />
              </a>
            </div>
          </div>

          {/* Bottom Text */}

        </footer>
      </div>
    </>
  );
}
