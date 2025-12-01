import React from "react";
import { Link, useLocation } from "react-router-dom";

const Nav: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="w-full px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between">
      <div className="text-xl font-bold text-blue-600">SRASM</div>

      <div className="flex gap-6">
        <Link
          to="/"
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all
            ${isActive("/") 
              ? "bg-blue-600 text-white shadow-sm" 
              : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            }`}
        >
          Home
        </Link>

        <Link
          to="/tree"
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all
            ${isActive("/tree") 
              ? "bg-blue-600 text-white shadow-sm" 
              : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            }`}
        >
          SRASM Tree
        </Link>

        <Link
          to="/chat"
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all
            ${isActive("/chat") 
              ? "bg-blue-600 text-white shadow-sm" 
              : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            }`}
        >
          AI Debugger
        </Link>
      </div>
    </nav>
  );
};

export default Nav;
