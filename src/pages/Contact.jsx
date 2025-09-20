import React, { useState } from 'react';
import { api, handleResponse } from '../services/api';
import { BASE_URL } from '../config/config';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitStatus('');

    try {
      console.log('Submitting contact form:', form);
      
      const response = await api.submitContact(form);
      console.log('API response:', response);
      
      const result = await handleResponse(response);
      console.log('Processed result:', result);
      
      setSubmitStatus('success');
      setForm({ name: '', email: '', message: '' });
      
      alert(`Thanks for contacting us, ${form.name}! We'll get back to you soon.`);
    } catch (error) {
      console.error('Contact form error details:', error);
      console.error('Error message:', error.message);
      setSubmitStatus('error');
      alert(`Error: ${error.message || 'There was an error sending your message. Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  // Test function to check API connection
  const testApiConnection = async () => {
    try {
      const response = await fetch(`${BASE_URL}/health`);
      const data = await response.json();
      console.log('API health check:', data);
      alert(`API connection: ${response.ok ? 'OK' : 'Failed'}\n${JSON.stringify(data)}`);
    } catch (error) {
      console.error('API connection test failed:', error);
      alert(`API connection failed: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 md:p-6 pt-24 md:pt-6">
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-5xl gap-6 md:gap-8">
        {/* Left side - Contact information */}
        <div className="w-full md:w-2/5 flex flex-col justify-center text-gray-700 p-6 md:p-8 rounded-2xl bg-gray-50 border border-gray-200">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Get in Touch</h2>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-start">
              <div className="bg-gray-200 p-2 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Address</p>
                <p className="text-gray-600">Ground Floor, No.17, Lauries Place</p>
                <p className="text-gray-600">(R.A. De Mel Mawatha), Colombo 04</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-gray-200 p-2 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="CurrentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Phone</p>
                <p className="text-gray-600">+94 779330690</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-gray-200 p-2 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Email</p>
                <p className="text-gray-600">info.avstorelk@gmail.com</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <a
              href="https://www.avstore.lk/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <img
                src="/images/dlogo.png"
                alt="AVSTORE Logo"
                className="w-40 h-auto cursor-pointer hover:opacity-80 transition"
              />
            </a>
          </div>
        </div>

        {/* Right side - Contact form */}
        <div className="bg-white shadow-md rounded-2xl p-6 md:p-8 w-full md:w-3/5 border border-gray-200">
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Send us a Message
            </h1>
            <p className="text-gray-600">We'll get back to you as soon as possible</p>
          </div>

          {submitStatus === 'success' && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-4 text-sm md:text-base flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Message sent successfully! We'll get back to you soon.
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm md:text-base flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              There was an error sending your message. Please try again.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-300 bg-white placeholder-gray-400 text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition text-sm md:text-base"
                required
                disabled={loading}
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Your Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="john@example.com"
                value={form.email}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-300 bg-white placeholder-gray-400 text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition text-sm md:text-base"
                required
                disabled={loading}
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Your Message
              </label>
              <textarea
                name="message"
                id="message"
                placeholder="How can we help you?"
                value={form.message}
                onChange={handleChange}
                rows={4}
                className="w-full p-3 rounded-lg border border-gray-300 bg-white placeholder-gray-400 text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition resize-none text-sm md:text-base"
                required
                disabled={loading}
              ></textarea>
            </div>
            
            <button
              type="submit"
              className="w-full bg-gray-800 hover:bg-gray-900 transition-all text-white font-medium py-3 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed text-sm md:text-base flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  Send Message
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11.43a1 1 0 01.725-.962l5-1.429a1 1 0 00.255-1.784l-7-14z" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}