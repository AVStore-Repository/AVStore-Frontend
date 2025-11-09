import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const products = [
  { id: 1, name: 'Sound BoX', image: '/images/1.png' },
  { id: 2, name: 'Mixer', image: '/images/3.png' },
  { id: 3, name: 'Microphone', image: '/images/5.png' },
  { id: 4, name: 'Microphone', image: '/images/7.png' },
  { id: 5, name: 'Speakers', image: '/images/18.png' },
  { id: 6, name: 'Mixer', image: '/images/21.png' },
  { id: 7, name: 'Sound Box', image: '/images/23.png' },
  { id: 8, name: 'Mixer', image: '/images/28.png' },
  { id: 9, name: 'Microphone', image: '/images/30.png' },
  { id: 10, name: 'Speakers', image: '/images/84.png' },
];

const subcategories = [
  'All',
  'Studio Equipment',
  'Headphones & Earphones',
  'In Ear Monitors',
  'Accessories',
  'Amplifiers',
  'Wired Microphones',
  'Wireless Microphones',
  'Podium Microphones',
  'Active Speakers',
  'Active Subwoofers',
  'Passive Speakers',
  'Passive Subwoofers',
  'Portable Speakers',
  'Column Speakers',
  'Analog Mixers',
  'Digital Mixers'
];

export default function Home() {
  const scrollContainerRef = useRef(null);
  const categoryScrollRef = useRef(null);
  const [visibleCards, setVisibleCards] = useState({});
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const navigate = useNavigate();

  // Check scroll position for category navigation
  // const checkScroll = () => {
  //   if (categoryScrollRef.current) {
  //     const { scrollLeft, scrollWidth, clientWidth } = categoryScrollRef.current;
  //     setCanScrollLeft(scrollLeft > 0);
  //     setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  //   }
  // };

  useEffect(() => {
    checkScroll();
    const scrollEl = categoryScrollRef.current;
    if (scrollEl) {
      scrollEl.addEventListener('scroll', checkScroll);
      return () => scrollEl.removeEventListener('scroll', checkScroll);
    }
  }, []);

  // const scrollCategories = (direction) => {
  //   if (categoryScrollRef.current) {
  //     const scrollAmount = 400;
  //     categoryScrollRef.current.scrollBy({
  //       left: direction === 'left' ? -scrollAmount : scrollAmount,
  //       behavior: 'smooth',
  //     });
  //   }
  // };

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

  // Check scroll position for category navigation
  const checkScroll = () => {
    if (categoryScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = categoryScrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const scrollEl = categoryScrollRef.current;
    if (scrollEl) {
      scrollEl.addEventListener('scroll', checkScroll);
      return () => scrollEl.removeEventListener('scroll', checkScroll);
    }
  }, []);

  const scrollCategories = (direction) => {
    if (categoryScrollRef.current) {
      const scrollAmount = 400;
      categoryScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleShopNow = () => {
    // alert('Navigating to Shop page...');
    navigate('/shop')
  };

  const handleSubcategoryClick = (subcategory) => {
    // alert(`Navigating to shop with filter: ${subcategory}`);
    navigate('/shop',{state:subcategory})
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
            perspective: 1500px;
            width: 100%;
            height: 250px;
            position: relative;
            overflow: visible;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          @media (min-width: 640px) {
            .carousel-container {
              height: 300px;
            }
          }
          
          @media (min-width: 768px) {
            .carousel-container {
              height: 350px;
            }
          }
          
          @media (min-width: 1024px) {
            .carousel-container {
              height: 400px;
            }
          }
          
          .carousel {
            width: 0;
            height: 0;
            position: absolute;
            top: 50%;
            left: 50%;
            transform-style: preserve-3d;
            animation: spin 20s linear infinite;
          }
          .carousel-item {
            position: absolute;
            width: 100px;
            height: 100px;
            left: -50px;
            top: -50px;
            transform-style: preserve-3d;
            backface-visibility: visible;
          }
          
          @media (min-width: 640px) {
            .carousel-item {
              width: 120px;
              height: 120px;
              left: -60px;
              top: -60px;
            }
          }
          
          @media (min-width: 1024px) {
            .carousel-item {
              width: 150px;
              height: 150px;
              left: -75px;
              top: -75px;
            }
          }
          
          .carousel-item img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            border-radius: 12px;
            box-shadow: 0 10px 20px rgba(0,0,0,0.4);
            transition: transform 0.3s;
          }
          .carousel-item:hover img {
            transform: scale(1.2);
            z-index: 10;
          }

          @keyframes spin {
            from { transform: rotateY(0deg); }
            to { transform: rotateY(360deg); }
          }
          
          /* Responsive carousel translateZ adjustments */
          @media (max-width: 639px) {
            .carousel-item {
              transform: rotateY(var(--angle)) translateZ(200px);
            }
          }
          
          @media (min-width: 640px) and (max-width: 1023px) {
            .carousel-item {
              transform: rotateY(var(--angle)) translateZ(300px);
            }
          }
          
          @media (min-width: 1024px) {
            .carousel-item {
              transform: rotateY(var(--angle)) translateZ(400px);
            }
          }
        `}
      </style>

      <div className="bg-white min-h-screen text-black">
        {/* Hero section */}
        <section className="fade-in-section bg-cover bg-center bg-white flex flex-col items-center justify-start pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-8 sm:pb-10 md:pb-12 text-black px-4 sm:px-6">
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-3 sm:mb-4 drop-shadow-lg text-center tracking-tight leading-tight max-w-full">
            Welcome to AVSTORE
          </h1>
          <h4 className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-semibold mb-5 sm:mb-6 md:mb-7 drop-shadow-lg text-center px-2 text-gray-700 max-w-4xl leading-relaxed">
            Your One-Stop Shop for Professional Audio-Visual Equipment
          </h4>
          <div className="w-full max-w-7xl mx-auto mb-8 sm:mb-10">
            <div className="relative p-6 sm:p-8 md:p-10">
              {/* Navigation Arrows */}
              {canScrollLeft && (
                <button
                  onClick={() => scrollCategories('left')}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 sm:p-3 shadow-lg transition-all duration-300 hover:scale-110"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              )}

              {canScrollRight && (
                <button
                  onClick={() => scrollCategories('right')}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 sm:p-3 shadow-lg transition-all duration-300 hover:scale-110"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              )}

              {/* Scrollable Subcategories Container */}
              <div
                ref={categoryScrollRef}
                className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar px-10 sm:px-12 py-2 scroll-smooth"
              >
                {subcategories.map((subcategory, index) => (
                  <button
                    key={index}
                    onClick={() => handleSubcategoryClick(subcategory)}
                    className="subcategory-chip flex-shrink-0 bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-medium shadow-lg border border-gray-600 whitespace-nowrap cursor-pointer"
                  >
                    {subcategory}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={handleShopNow}
            className="bg-black hover:bg-gray-800 transition-all duration-300 text-white font-semibold py-2.5 sm:py-3 md:py-4 px-6 sm:px-8 md:px-12 rounded-full shadow-xl text-sm sm:text-base md:text-lg hover:shadow-2xl transform hover:scale-105"
          >
            Shop Now
          </button>

          {/* Banner placed right under Shop Now button */}
          <div className="mt-6 sm:mt-7 md:mt-8 w-full flex justify-center px-4">
            <img
              src="https://res.cloudinary.com/dtscqhcop/image/upload/v1762700431/11_11_Banner_sxywlf.png"
              alt="Promotional Banner"
              className="w-full h-auto max-w-6xl rounded-lg shadow-lg"
            />
          </div>
        </section>

        {/* 3D Spinning Carousel Section */}
        <section className="fade-in-section bg-cover bg-center flex flex-col items-center justify-start pt-10 sm:pt-12 md:pt-14 lg:pt-16 pb-10 sm:pb-12 md:pb-14 lg:pb-16 text-black px-4 sm:px-6"
          style={{ backgroundImage: "url('/images/.jpg')" }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 md:mb-5 text-center leading-tight">
            Featured Products
          </h2>
          <p className="text-sm sm:text-base md:text-lg font-medium max-w-3xl text-center text-gray-700 px-4 sm:px-6 mb-6 sm:mb-7 md:mb-8 leading-relaxed">
            Experience sound in its purest form. Our featured gear is engineered for the critical listener, delivering unparalleled clarity, depth, and immersive audio that reveals every nuance of your music.
          </p>
          <div className="carousel-container">
            <div className="carousel">
              {products.map((product, index) => {
                const angle = (360 / products.length) * index;
                return (
                  <div
                    key={`${product.id}-${index}`}
                    className="carousel-item"
                    style={{
                      '--angle': `${angle}deg`,
                      transform: window.innerWidth < 640
                        ? `rotateY(${angle}deg) translateZ(200px)`
                        : window.innerWidth < 1024
                          ? `rotateY(${angle}deg) translateZ(300px)`
                          : `rotateY(${angle}deg) translateZ(400px)`,
                    }}
                  >
                    <img src={product.image} alt={product.name} />
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Middle Banner */}
        <div className="w-full flex justify-center my-8 sm:my-10 md:my-12 px-4 sm:px-6">
          <img
            src="/images/XS1 Banner.png"
            alt="Mid Banner"
            className="w-full h-auto max-w-6xl object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Special Deals Section */}
        <section
          className="fade-in-section flex flex-col md:flex-row items-center justify-center px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-14 lg:py-16 text-black"
          style={{ backgroundImage: "url('/images/deals.jpg')" }}
        >
          {/* Left side - Product Image */}
          <div className="w-full md:w-1/2 flex justify-center mb-6 sm:mb-8 md:mb-0 md:pr-6 lg:pr-10">
            <div className="relative max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg rounded-lg overflow-hidden shadow-2xl bg-gray-100">
              <img
                src="https://res.cloudinary.com/drkm7uelu/image/upload/v1759216697/Bundle_Offer_lysgsl.png"
                alt="B1X Speaker"
                className="w-full h-auto object-contain"
              />
              <div
                className="absolute top-0 right-0 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-bl-full"
                style={{
                  boxShadow: "-5px 5px 5px rgba(0,0,0,0.1)",
                  clipPath: "polygon(100% 0, 0 100%, 100% 100%)",
                }}
              />
            </div>
          </div>

          {/* Right side - Text and button */}
          <div className="w-full md:w-1/2 max-w-lg md:pl-6 lg:pl-10 text-center md:text-left px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 md:mb-5 leading-tight">
              Special Deals
            </h2>
            <p className="text-sm sm:text-base md:text-lg mb-5 sm:mb-6 md:mb-7 leading-relaxed text-gray-700">
              All-in-One Portable 250-Watt Speaker with Battery Operation, Digital Mixer, Effects, Remote Control via iOS/Android Mobile App, Bluetooth Audio Streaming and Wireless Microphone Option
            </p>
            <button
              onClick={() => navigate('/shop')}
              className="bg-black text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full flex items-center justify-center gap-2 hover:bg-gray-800 transition-all duration-300 mx-auto md:mx-0 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span className="text-sm sm:text-base font-semibold">Shop Now</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 sm:h-5 sm:w-5"
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
        <section className="fade-in-section bg-cover bg-center bg-white flex flex-col items-center justify-start pt-10 sm:pt-12 md:pt-14 pb-10 sm:pb-12 md:pb-14 text-black px-4 sm:px-6">
          <div className="w-full flex justify-center">
            <img
              src="https://res.cloudinary.com/drkm7uelu/image/upload/v1760011434/OUR_BRANDS_cypqxq.png"
              alt="Brands Banner"
              className="w-full max-w-5xl object-cover rounded-lg shadow-lg"
            />
          </div>
        </section>

        {/* Footer Section */}
        <footer className="bg-white/70 text-black py-8 sm:py-10 md:py-12 px-4 sm:px-6 border-t border-gray-200">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 items-start">

            {/* Left: Logo & Description */}
            <div className="flex flex-col items-start">
              <img
                src="/images/dlogo.png"
                alt="Company Logo"
                className="w-24 sm:w-28 md:w-32 mb-3 sm:mb-4"
              />
              <p className="text-sm text-gray-700 leading-relaxed">
                We are Sri Lanka's trusted distribution group for music products.
              </p>
            </div>

            {/* Middle: Contact Info */}
            <div className="text-left md:text-left">
              <h3 className="text-base sm:text-lg font-bold mb-2 sm:mb-3">Contact Us</h3>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">Ground Floor</p>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">No.17, Lauries Place (R.A. De Mel Mawatha), Colombo 04</p>
              <p className="text-xs sm:text-sm text-gray-700 mt-2">Email: info.avstorelk@gmail</p>
              <p className="text-xs sm:text-sm text-gray-700">Phone: +94 779330690</p>
            </div>

            {/* Right: Social Media Icons */}
            <div className="flex justify-start sm:justify-center md:justify-end space-x-3 sm:space-x-4 items-center">
              <a href="https://www.facebook.com/dynamicavlk?mibextid=kFxxJD" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform duration-300">
                <img src="/images/facebook.png" alt="Facebook" className="w-8 h-8 sm:w-9 sm:h-9" />
              </a>
              <a href="https://wa.me/94779330690" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform duration-300">
                <img src="/images/whatsapp.png" alt="WhatsApp" className="w-8 h-8 sm:w-9 sm:h-9" />
              </a>
              <a href="https://www.instagram.com/dynamic_av_official?igsh=Y3I4dnQwdzlmMjBt" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform duration-300">
                <img src="/images/instagram.png" alt="Instagram" className="w-8 h-8 sm:w-9 sm:h-9" />
              </a>
              <a href="https://www.tiktok.com/@avstore.lk?_t=ZS-8zM28E9khOh&_r=1" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform duration-300">
                <img src="/images/tik-tok.png" alt="TikTok" className="w-8 h-8 sm:w-9 sm:h-9" />
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
