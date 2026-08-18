import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState({ loading: false, error: "", success: false });

  // Use Vite's environment variable syntax
 // const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setStatus({ loading: false, error: "Passwords do not match", success: false });
    }

    if (password.length < 6) {
      return setStatus({ loading: false, error: "Password must be at least 8 characters", success: false });
    }

    setStatus({ loading: true, error: "", success: false });

    try {
      // Added missing slash before ${token}
      const response = await fetch(`https://newsportalbackend-oatr.onrender.com/api/v1/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      setStatus({ loading: false, error: "", success: true });
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      // Fixed error parameter reference
      setStatus({ loading: false, error: error.message, success: false });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        {status.success ? (
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900">Password Reset Successful!</h2>
            <p className="mt-2 text-sm text-gray-500">Redirecting to login page in 3 seconds...</p>
            <Link to="/login" className="mt-4 inline-block text-indigo-600 font-medium">
              Click here to login now
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-900 text-center">Reset Your Password</h2>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                />
              </div>

              {status.error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {status.error}
                </p>
              )}

              <button
                type="submit"
                disabled={status.loading}
                className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition"
              >
                {status.loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default ResetPassword