import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Shield, User, Mail, Phone, LogOut } from 'lucide-react';

const ProfilePage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-stone-900 mb-6">Your Profile</h1>
      
      <div className="glass-card overflow-hidden">
        <div className="p-8 flex flex-col sm:flex-row items-center gap-6 border-b border-emerald-900/10 relative">
          <div className="w-24 h-24 rounded-full bg-emerald-700 flex items-center justify-center text-4xl font-bold text-stone-900 shadow-2xl shadow-emerald-900/30 z-10">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          
          <div className="text-center sm:text-left z-10">
            <h2 className="text-2xl font-bold text-stone-900 flex items-center gap-3 justify-center sm:justify-start">
              {user?.name}
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-600/20 text-emerald-700 border border-emerald-600/30 uppercase tracking-widest">
                {user?.role}
              </span>
            </h2>
            <p className="text-stone-600 mt-1">Joined DisasterGuard Network</p>
          </div>

          <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-700/10 rounded-full blur-[80px]"></div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-white/60 rounded-xl border border-emerald-900/5 flex items-start gap-4">
              <div className="p-3 bg-emerald-900/5 rounded-lg text-stone-600"><Mail size={20} /></div>
              <div>
                <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Email Address</p>
                <p className="text-stone-900 font-medium mt-1">{user?.email}</p>
              </div>
            </div>
            
            <div className="p-4 bg-white/60 rounded-xl border border-emerald-900/5 flex items-start gap-4">
              <div className="p-3 bg-emerald-900/5 rounded-lg text-stone-600"><Phone size={20} /></div>
              <div>
                <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Phone Number</p>
                <p className="text-stone-900 font-medium mt-1">{user?.phone || 'Not provided'}</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-emerald-900/10 flex justify-between items-center">
            <p className="text-sm text-stone-600">To update your details, please contact support.</p>
            <button 
              onClick={logout}
              className="px-6 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 hover:border-red-500/50 rounded-lg font-medium transition flex items-center gap-2"
            >
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
