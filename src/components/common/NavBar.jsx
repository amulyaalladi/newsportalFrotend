import { useState } from "react";
import { Link } from "react-router"
import UserMenu from "./UserMenu";


const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-slate-950 text-slate-50 shadow-md shadow-slate-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <a href="/" className="text-2xl font-bold tracking-wider text-white  px-3 py-1 rounded-lg shadow-md hover:bg-cyan-700">
              Daily<span className="text-red-600">Pulse</span>
            </a>
           
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <Link
          to="/login"
          className="text-slate-200 transition hover:text-cyan-400"
        >
          Login
        </Link>
            <a href="/register" className="px-3 py-2 rounded-md text-sm font-medium bg-cyan-600 text-white hover:bg-cyan-700 transition">Register</a>

           
          

          
           
            
            <button
              aria-label="Toggle menu"
              type="button"
              onClick={() => setMenuOpen(open => !open)}
              className="p-2 rounded-md text-slate-100 bg-white/5 hover:bg-white/10 transition"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <UserMenu/>
          </div>
       </div>
      </div>
    
     
    </nav>
  )
}





export default NavBar;