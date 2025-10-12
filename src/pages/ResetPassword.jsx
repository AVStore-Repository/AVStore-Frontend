import { useState } from 'react';
import { Mail, X, CheckCircle, ArrowLeft } from 'lucide-react';
import { BASE_URL } from '../config/config';

export default function ResetPasswordPopup() {
  const [isOpen, setIsOpen] = useState(true);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resetLink, setResetLink] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email) {
      setError("Please enter your email address");
      setIsLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/auth/resetPassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset email');
      }

      if (data.success && data.resetLink) {
        setResetLink(data.resetLink);
        setIsSuccess(true);
        
        // Optional: Auto-navigate to reset link after a short delay
        setTimeout(() => {
          window.location.href = data.resetLink;
        }, 2000);
      }
      
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.error('Password reset error:', err);
      
      if (err.message.includes('user-not-found') || err.message.includes('not found')) {
        setError("No account found with this email address");
      } else if (err.message.includes('invalid-email') || err.message.includes('Invalid email')) {
        setError("Invalid email address");
      } else if (err.message.includes('too-many-requests')) {
        setError("Too many requests. Please try again later");
      } else {
        setError(err.message || "Failed to send reset email. Please try again");
      }
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    window.location.href = '/login';
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleBackToLogin = () => {
    window.location.href = '/login';
  };

  const handleNavigateToReset = () => {
    if (resetLink) {
      window.location.href = resetLink;
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn"
      onClick={handleOverlayClick}
    >
      <div className="w-full max-w-md animate-slideUp">
        <div className="bg-white rounded-2xl shadow-2xl p-8 relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {!isSuccess ? (
            <>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-4">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
                <p className="text-gray-600">
                  Enter your email address and we'll send you a link to reset your password
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSubmit(e);
                        }
                      }}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                      placeholder="you@example.com"
                      autoFocus
                    />
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>

              <button
                onClick={handleBackToLogin}
                className="mt-8 w-full flex items-center justify-center text-sm text-gray-600 hover:text-gray-900 transition"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign In
              </button>
            </>
          ) : (
            <>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Link Generated!</h1>
                <p className="text-gray-600 mb-6">
                  Password reset link has been generated for
                </p>
                <p className="text-indigo-600 font-semibold mb-8">
                  {email}
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-700 mb-3">
                    You will be automatically redirected to the reset password page in a moment.
                  </p>
                  <p className="text-xs text-gray-600">
                    Or click the button below to proceed manually.
                  </p>
                </div>
                <button
                  onClick={handleNavigateToReset}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition mb-4"
                >
                  Reset Password Now
                </button>
                <button
                  onClick={handleBackToLogin}
                  className="w-full flex items-center justify-center text-sm text-gray-600 hover:text-gray-900 transition"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Sign In
                </button>
                <button
                  onClick={() => {
                    setIsSuccess(false);
                    setEmail('');
                    setError('');
                    setResetLink('');
                  }}
                  className="mt-4 text-sm text-gray-600 hover:text-gray-900 transition"
                >
                  Try with a different email
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}