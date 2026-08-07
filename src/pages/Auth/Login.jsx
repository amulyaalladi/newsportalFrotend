import registerBg from "../../assets/Register-image.png";
import { Link, useNavigate } from "react-router";
//import { useDispatch } from "react-redux";
import { setUser } from '../../redux/authSlice';
import { loginUser } from "../../services/authServices";
import { useState } from "react";
import ForgotPassword from "./ForgotPassword";

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    //const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await loginUser(formData);

            dispatch(setUser(response.user));
            toast.success(response.message);

            if (response.user.role === 'admin') {
                navigate('/admin/dashboard');
            } else if (response.user.role === 'editor') {
                navigate('/editor/dashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Login failed";
            toast.error(errorMessage);
        }
    
  }
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 overflow-hidden">
      <div className="relative flex min-h-screen items-center justify-center px-4 py-10">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${registerBg})`, filter: 'brightness(0.95)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/35 via-slate-950/50 to-slate-950/55" />

        <div className="relative z-10 w-full max-w-xl rounded-[2rem] border border-white/15 bg-white/85 p-8 shadow-2xl shadow-slate-950/25 backdrop-blur-xl sm:p-10">
          <div className="mb-8 text-center">
            <a href="/" className="text-xl font-semibold uppercase tracking-[0.4em] text-cyan-600">
             <span className="text-white">Daily</span> <span className="text-white">Pulse</span>
            </a>
            <h2 className="mt-4 text-xl font-semibold text-slate-950 sm:text-2xl">
              Welcome back
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              Login to continue managing news, publishing articles, and staying connected.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Email</span>
              <input
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e)=>setFormData({...formData,email:e.target.value})}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 transition focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Password</span>
              <input
                type="password"
                value={formData.password}
                onChange={(e)=>setFormData({...formData,password:e.target.value})}
                placeholder="Enter your password"
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 transition focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200"
              />
            </label>

            <button
              type="submit"
              className="flex w-full items-center justify-center rounded-2xl bg-cyan-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-700"
            >
              Login
            </button>
          </form>

          <div className="mt-6 flex flex-col gap-3 text-center text-sm text-slate-600 sm:flex-row sm:justify-between sm:text-left">
            <p>
              Don't have an account?{' '}
              <a href="/register" className="font-semibold text-cyan-600 transition hover:text-cyan-700">
                Register
              </a>
            </p>
            <p>
            
                <Link
              to="/forgot-password"
              className="text-sm font-medium text-cyan-600 hover:text-cyan-500"
            >
              Forgot password?
            </Link>
              <Link to="/"
                className="text-sm text-blue-600 hover:text-blue-500"
            >Back to Home</Link>
             
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
