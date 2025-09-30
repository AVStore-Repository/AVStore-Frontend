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

      {/* Policy Sections */}
      <div className="max-w-6xl mx-auto mt-16 md:mt-24 mb-12">
        <h2 className={`text-2xl md:text-3xl font-bold text-center mb-8 text-black transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
          Our Policies
        </h2>

        <div className="space-y-4">
          {/* Refund Policy */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <button
              onClick={() => toggleBox('refund')}
              className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-gray-50 transition-colors duration-200 rounded-lg"
            >
              <h3 className="text-lg md:text-xl font-semibold text-black">Refund Policy</h3>
              <span className="text-black transform transition-transform duration-300">
                {expanded === 'refund' ? '−' : '+'}
              </span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-500 ${
                expanded === 'refund' ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-6 pb-6 text-gray-700 space-y-4 text-sm md:text-base">
                <p>Thank you for shopping at avstore.lk! Your satisfaction is our top priority, and we are committed to providing you with the best online shopping experience.</p>
                
                <div>
                  <h4 className="font-semibold text-black mb-2">Returns</h4>
                  <p>We accept returns within 7 days of purchase, provided the item is unused, in its original packaging, and accompanied by proof of purchase. Items that show signs of wear, damage or missing accessories may not be eligible for return.</p>
                </div>

                <div>
                  <h4 className="font-semibold text-black mb-2">Refunds</h4>
                  <p>Once your return is received and inspected, we will notify you of the approval or rejection of your refund. Approved refunds will be processed within 5 days, and the amount will be credited to your original payment method. Processing times may vary depending on your bank or payment provider.</p>
                </div>

                <div>
                  <h4 className="font-semibold text-black mb-2">Exchanges</h4>
                  <p>If you receive a defective or damaged item, you may request an exchange for the same product. If the item is out of stock, you may choose a replacement of equal value or opt for a refund.</p>
                </div>

                <div>
                  <h4 className="font-semibold text-black mb-2">Non-Returnable Items</h4>
                  <p className="mb-2">Certain products are not eligible for return, including:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Custom orders or personalized items</li>
                    <li>Gift cards</li>
                    <li>Software, digital downloads and consumables (e.g., ear pieces & etc.)</li>
                    <li>Items that have been used or damaged due to misuse</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-black mb-2">Return Shipping</h4>
                  <p>Customers are responsible for return shipping costs unless the return is due to our error (e.g., wrong item sent, defective product). We recommend using a trackable shipping service to ensure safe delivery.</p>
                </div>

                <div>
                  <h4 className="font-semibold text-black mb-2">Processing Time</h4>
                  <p>Returns and exchanges typically take 10 business days to process once received. We will notify you via email once your refund or exchange has been processed.</p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-black mb-2">Contact Us</h4>
                  <p>For any refund or return inquiries, please contact us at:</p>
                  <p className="mt-1">Phone: +94 77 933 0690</p>
                  <p>Address: No. 17, Lauries place, Colombo 04.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy Policy */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <button
              onClick={() => toggleBox('privacy')}
              className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-gray-50 transition-colors duration-200 rounded-lg"
            >
              <h3 className="text-lg md:text-xl font-semibold text-black">Privacy Policy</h3>
              <span className="text-black transform transition-transform duration-300">
                {expanded === 'privacy' ? '−' : '+'}
              </span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-500 ${
                expanded === 'privacy' ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-6 pb-6 text-gray-700 space-y-4 text-sm md:text-base">
                <div>
                  <h4 className="font-semibold text-black mb-2">Information We Collect</h4>
                  <p>We collect information such as your name, email address, phone number, shipping address and payment details when you make a purchase. We may also gather data from cookies, website analytics and customer support interactions.</p>
                </div>

                <div>
                  <h4 className="font-semibold text-black mb-2">Use of Information</h4>
                  <p className="mb-2">Your information is used to:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Process orders and transactions</li>
                    <li>Improve customer experience</li>
                    <li>Send order updates and promotional offers (if subscribed)</li>
                    <li>Ensure security and prevent fraud</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-black mb-2">Data Security</h4>
                  <p>We use industry-standard security measures to safeguard your personal data against unauthorized access, modification, or disclosure. However, no online transmission is 100% secure, and we encourage you to protect your login credentials.</p>
                </div>

                <div>
                  <h4 className="font-semibold text-black mb-2">Cookies and Tracking Technologies</h4>
                  <p>Our website uses cookies and similar tracking technologies to enhance user experience, analyze site traffic, and personalize content. You can adjust cookie preferences through your browser settings.</p>
                </div>

                <div>
                  <h4 className="font-semibold text-black mb-2">Changes to the Privacy Policy</h4>
                  <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.</p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-black mb-2">Contact Us</h4>
                  <p>For any privacy-related concerns, please contact us using the details provided on our website.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <button
              onClick={() => toggleBox('terms')}
              className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-gray-50 transition-colors duration-200 rounded-lg"
            >
              <h3 className="text-lg md:text-xl font-semibold text-black">Terms and Conditions</h3>
              <span className="text-black transform transition-transform duration-300">
                {expanded === 'terms' ? '−' : '+'}
              </span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-500 ${
                expanded === 'terms' ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-6 pb-6 text-gray-700 space-y-4 text-sm md:text-base">
                <div>
                  <h4 className="font-semibold text-black mb-2">Use of the Website</h4>
                  <p>By accessing avstore.lk, you agree to use the website lawfully and refrain from activities that may disrupt its functionality.</p>
                </div>

                <div>
                  <h4 className="font-semibold text-black mb-2">Product Information and Pricing</h4>
                  <p>We strive to provide accurate product descriptions and pricing. However, errors may occur, and we reserve the right to correct any inaccuracies and update prices without prior notice.</p>
                </div>

                <div>
                  <h4 className="font-semibold text-black mb-2">Orders and Payments</h4>
                  <p>All orders are subject to availability and confirmation of payment. In case of payment failure, your order may be delayed or canceled.</p>
                </div>

                <div>
                  <h4 className="font-semibold text-black mb-2">Shipping and Delivery</h4>
                  <p>We offer shipping based on your location. Estimated delivery times vary based on location and shipping method. We are not responsible for delays caused by couriers.</p>
                </div>

                <div>
                  <h4 className="font-semibold text-black mb-2">Returns and Refunds</h4>
                  <p>Our return and refund policy is outlined in our Refund Policy section.</p>
                </div>

                <div>
                  <h4 className="font-semibold text-black mb-2">Intellectual Property</h4>
                  <p>All content on avstore.lk, including images, text, logos, and trademarks, is the property of dynamic av technologies Pvt Ltd and may not be used without permission.</p>
                </div>

                <div>
                  <h4 className="font-semibold text-black mb-2">Limitation of Liability</h4>
                  <p>We are not liable for any indirect, incidental or consequential damages arising from the use of our products or website.</p>
                </div>

                <div>
                  <h4 className="font-semibold text-black mb-2">Amendments and Termination</h4>
                  <p>We reserve the right to modify these terms at any time. Continued use of our website implies acceptance of any changes.</p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p>For any inquiries, please contact us at +94 77 933 0690</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}