import { useState } from 'react';
import { Link } from 'react-router';
import { forgotPassword } from '../../services/authServices';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Calls the forgotPassword API service with the user's email
      await forgotPassword(email);
      setIsSubmitted(true);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Failed to send password reset email. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-3xl bg-white p-8 shadow-xl">
        
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Forgot password?
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {!isSubmitted
              ? "Enter your email address and we'll send you a link to reset your password."
              : "Check your inbox for reset instructions."}
          </p>
        </div>

        {!isSubmitted ? (
          /* Forgot Password Form */
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 sm:text-sm"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center rounded-2xl bg-cyan-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-700 disabled:opacity-50"
            >
              {isLoading ? 'Sending link...' : 'Send reset instructions'}
            </button>
          </form>
        ) : (
          /* Success View */
          <div className="mt-8 space-y-6 text-center">
            <div className="rounded-xl bg-cyan-50 p-4 text-sm text-cyan-800">
              We have sent a password reset link to <span className="font-semibold">{email}</span>.
            </div>
            <button
              onClick={() => setIsSubmitted(false)}
              className="text-sm font-medium text-cyan-600 hover:text-cyan-500"
            >
              Didn't receive the email? Click to try again
            </button>
          </div>
        )}

        {/* Back to Login Link */}
        <div className="text-center mt-4">
          <Link
            to="/login"
            className="text-sm font-medium text-gray-600 hover:text-cyan-600 transition"
          >
             Back to login
          </Link>
        </div>

      </div>
    </div>
  );
}