import React, { useState, useEffect } from "react";

export default function AboutUs() {
  const [expanded, setExpanded] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    setIsVisible(true);
  }, []);

  const toggleBox = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  const sections = [
    {
      id: 1,
      title: "About Us",
      color: "bg-gradient-to-r from-white to-gray-50 border-gray-300",
      textColor: "text-black",
      text1: `
      • Welcome to AV Store, Sri Lanka's premier destination for all your professional Audio equipment catering to all spectrums of the market, covering every budget from affordable to high-end.  
      `,
      text2:`• As passionate audio enthusiasts, we cater to audiophiles, home cinema buffs, and professional sound engineers alike.Our carefully curated selection includes premium audio equipment from globally renowned brands, ensuring impeccable sound quality, aesthetic excellence, and reliable performance for every listening space.With expert guidance and a dedication to quality, we aim to enhance your auditory journey, bringing clarity and richness to every note, beat, and soundscape… powered by Dynamic AV Technologies (Pvt.) Ltd.`
    
    }
  ];


  return (
    <div className="min-h-screen bg-white p-4 md:p-6 overflow-hidden relative">
      {/* Animated background elements - subtle gray version */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gray-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gray-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow animation-delay-2000"></div>
      </div>

      {/* Page Title with animation */}
      <h1 className={`text-3xl md:text-4xl font-bold text-center mb-6 md:mb-10 mt-16 md:mt-20 text-black transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
        About AVSTORE
      </h1>

      {/* Content with Image */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-10">
        {/* Left Side - Text Content */}
        <div className="flex-1 w-full">
          {sections.map((section) => (
            <div
              key={section.id}
              onClick={() => toggleBox(section.id)}
              className={`cursor-pointer shadow-md rounded-lg p-4 md:p-6 border-l-4 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-lg ${section.color} text-black ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}
              style={{
                maxHeight: expanded === section.id ? "600px" : "600px",
                overflow: "hidden",
                transition: "all 0.5s ease-in-out",
              }}
            >
              <h2 className="text-xl md:text-2xl font-semibold mb-2 flex items-center">
                {section.title}
                <span className="ml-2 text-black transform transition-transform duration-500">
                  {expanded === section.id ? '▼' : '▶'}
                </span>
              </h2>
              <p
                className={`text-black transition-all duration-700 text-sm md:text-base mb-2 ${expanded === section.id
                    ? "opacity-100 translate-y-0"
                    : "opacity-70 translate-y-2"
                  }`}
              >
                {section.text1}
                
              </p>
              <p className={`text-black transition-all duration-700 text-sm md:text-base ${expanded === section.id
                    ? "opacity-100 translate-y-0"
                    : "opacity-70 translate-y-2"
                  }`}>{section.text2}</p>
            </div>
          ))}
        </div>

        {/* Right Side - Image with animation */}
        <div className={`flex-1 flex justify-center w-full mt-6 md:mt-0 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
          <div className="w-full max-w-md h-64 md:h-96 bg-gray-100 rounded-lg overflow-hidden shadow-md transform transition-transform duration-700 hover:scale-105">
            <img
              src="https://res.cloudinary.com/drkm7uelu/image/upload/v1759215058/AV_Store_Red_1_inpx6c.png"
              alt="About AV Store"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
            />
          </div>
        </div>
      </div>







      {/* Additional decorative elements */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg
          className="relative block w-full h-12 text-white"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path d="M0,0V6c0,21.6,291,111.46,741,110.26,445.39,3.6,459-88.3,459-110.26V0Z" className="fill-current text-gray-100"></path>
        </svg>
      </div>
    </div>
  );
}