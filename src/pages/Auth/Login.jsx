import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router";
import Instances from "../../instances/Instances";
import { setUser } from '../../redux/authSlice';
import { toast } from "react-toastify";
import Register from "./Register";
import Home from "../Home/Home";
import { loginUser,registerUser } from "../../services/authServices";
const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await loginUser(formData);

            dispatch(setUser(response.user));
            toast.success(response.message);

           
                navigate('/home');
            
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Login failed";
            toast.error(errorMessage);
        }
    }

    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    return (
        <div className="min-h-screen flex text-gray-900 font-serif">
            {/* Left Side: Newspaper Background Overlay */}
            <div 
                className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center items-end p-12"
                style={{ 
                    backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 100%), url('https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1600&auto=format&fit=crop')` 
                }}
            >
                <div className="relative z-10 text-white max-w-lg">
                    <span className="inline-block px-2 py-1 bg-red-700 text-[10px] font-sans font-bold uppercase tracking-widest mb-3">
                        Live Coverage
                    </span>
                    <h2 className="text-4xl font-black leading-tight tracking-tight uppercase border-b-2 border-white/30 pb-4 mb-3">
                        "The Truth In Print, Every Single Day."
                    </h2>
                    <p className="text-sm font-sans text-gray-300 italic">
                        Access exclusive investigative reports, breaking front-page headlines, and subscriber-only editorial commentary.
                    </p>
                </div>
            </div>

            {/* Right Side: Clean Newspaper Login Portal */}
            <div className="w-full lg:w-1/2 bg-[#F9F8F6] flex items-center justify-center p-6 sm:p-12">
                <div className="max-w-md w-full bg-white border-2 border-black p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
                    
                    {/* Compact Editorial Header */}
                    <div className="text-center border-b-2 border-black pb-3 mb-6">
                        <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-gray-500 mb-1">
                            {currentDate} • Member Access
                        </p>
                        <Link to="/">
                            <h1 className="text-3xl font-extrabold tracking-tight uppercase border-y-2 border-black py-1">
                                Daily Pulse
                            </h1>
                        </Link>
                    </div>

                    {/* Form Header */}
                    <div className="mb-6">
                        <h3 className="text-lg font-bold font-sans uppercase tracking-wide text-gray-900">
                            Subscriber Login
                        </h3>
                        <p className="text-xs font-sans text-gray-600 mt-0.5">
                            Don't have a subscription?{' '}
                            <Link to="/Register" className="font-bold text-black underline hover:text-red-700">
                                Register now
                            </Link>
                        </p>
                    </div>

                    {/* Login Form */}
                    <form className="space-y-4 font-sans" onSubmit={handleLogin}>
                        <div>
                            <label htmlFor="email-address" className="block text-[11px] font-bold uppercase tracking-wider text-gray-800 mb-1">
                                Email Address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                required
                                className="w-full px-3 py-2 border-2 border-black focus:outline-none focus:bg-amber-50/30 text-sm rounded-none"
                                placeholder="example@gmail.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label htmlFor="password" className="block text-[11px] font-bold uppercase tracking-wider text-gray-800">
                                    Password
                                </label>
                                <Link to="/forgot-password" className="text-xs text-gray-500 hover:text-black underline">
    Forgot?
</Link>
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="w-full px-3 py-2 border-2 border-black focus:outline-none focus:bg-amber-50/30 text-sm rounded-none"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full mt-2 py-3 bg-black text-white font-bold text-xs uppercase tracking-widest hover:bg-red-700 transition-colors border-2 border-black rounded-none shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)]"
                        >
                            Sign In
                        </button>
                    </form>

                    
                </div>
            </div>
        </div>
    );
};

export default Login;