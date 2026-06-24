import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Shield, Bell, User, LogOut, Menu } from 'lucide-react';
import { useSocket } from '../../contexts/SocketContext';

const Navbar = ({ toggleSidebar }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const { notifications } = useSocket();
  const location = useLocation();
  const unreadCount = notifications?.filter(n => !n.read).length || 0;

  return (
    <nav className="glass-card sticky top-0 z-50 rounded-none border-t-0 border-l-0 border-r-0 border-b border-emerald-900/10 px-4 py-3 flex justify-between items-center">
      <div className="flex items-center gap-4">
        {isAuthenticated && (
          <button onClick={toggleSidebar} className="md:hidden text-stone-700 hover:text-stone-900">
            <Menu size={24} />
          </button>
        )}
        <Link to="/" className="flex items-center gap-2">
          <Shield size={28} className="text-emerald-800" />
          <span className="text-xl font-bold text-emerald-800 hidden sm:block">DisasterGuard</span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <div className="relative cursor-pointer text-stone-700 hover:text-stone-900 transition">
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-stone-900 text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <Link to="/profile" className="flex items-center gap-2 text-sm text-stone-700 hover:text-stone-900 transition">
              <div className="bg-emerald-700 rounded-full p-1">
                <User size={16} />
              </div>
              <span className="hidden md:block">{user?.name}</span>
            </Link>
            <button onClick={logout} className="text-stone-600 hover:text-red-400 transition" title="Logout">
              <LogOut size={20} />
            </button>
          </>
        ) : (
          <div className="flex gap-3">
            <Link to="/login" className="px-4 py-2 text-sm font-medium text-stone-700 hover:text-stone-900 transition">Login</Link>
            <Link to="/register" className="px-4 py-2 text-sm font-medium bg-emerald-700 hover:bg-emerald-600 rounded-lg text-stone-900 transition">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
