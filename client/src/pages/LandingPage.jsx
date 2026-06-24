import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, AlertTriangle, Map, Users, HeartPulse, Navigation } from 'lucide-react';
import SOSButton from '../components/sos/SOSButton';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Navbar for Landing */}
      <nav className="glass-card fixed top-0 w-full z-50 rounded-none border-t-0 border-l-0 border-r-0 px-6 py-4 flex justify-between items-center bg-white/80">
        <div className="flex items-center gap-2">
          <Shield size={24} className="text-emerald-700" />
          <span className="text-xl font-bold text-emerald-900">DisasterGuard</span>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="px-4 py-2 font-medium text-stone-600 hover:text-emerald-700 transition">Login</Link>
          <Link to="/register" className="px-4 py-2 font-medium bg-emerald-700 hover:bg-emerald-600 rounded-lg text-white transition shadow-md shadow-emerald-900/20">Register</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden flex flex-col items-center justify-center min-h-[85vh]">
        {/* Background effects */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-yellow-600/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 border border-red-200 text-red-600 mb-8 font-medium text-xs tracking-wide">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
            </span>
            Real-Time Emergency Response Network
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-stone-900 mb-6 leading-tight tracking-tight">
            Emergency Response When <span className="text-emerald-700 block mt-2">Every Second Counts</span>
          </h1>
          
          <p className="text-lg text-stone-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            A comprehensive disaster management platform providing real-time SOS alerts, safe shelter discovery, and coordinated volunteer rescue operations.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link 
              to="/register" 
              className="w-full sm:w-auto px-8 py-3.5 bg-emerald-700 hover:bg-emerald-600 rounded-xl font-bold text-white transition shadow-lg shadow-emerald-900/20 text-md flex items-center justify-center gap-2"
            >
              Join the Network <Users size={18} />
            </Link>
            <div className="w-full sm:w-auto">
              <SOSButton />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-white/50 border-t border-stone-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-stone-900 mb-3">Comprehensive Response Tools</h2>
            <p className="text-stone-600 max-w-2xl mx-auto">Everything you need to stay safe and help others during a crisis.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Real-Time Map", desc: "Live view of safe zones, shelters, and danger areas.", icon: Map, color: "text-blue-600", bg: "bg-blue-50" },
              { title: "One-Tap SOS", desc: "Instantly broadcast your location to nearby volunteers.", icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
              { title: "Shelter Finder", desc: "Locate verified relief camps with real-time capacity.", icon: Shield, color: "text-emerald-600", bg: "bg-emerald-50" },
              { title: "Rescue Coordination", desc: "Efficiently dispatch and track rescue operations.", icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
              { title: "Medical Support", desc: "Find emergency medical assistance and supplies.", icon: HeartPulse, color: "text-pink-600", bg: "bg-pink-50" },
              { title: "Live Updates", desc: "Receive critical government and community alerts.", icon: Navigation, color: "text-amber-600", bg: "bg-amber-50" },
            ].map((feature, i) => (
              <div key={i} className="glass-card p-6 hover:-translate-y-1 transition duration-300 bg-white">
                <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-5 border border-black/5 ${feature.color}`}>
                  <feature.icon size={22} />
                </div>
                <h3 className="text-lg font-bold text-stone-900 mb-2">{feature.title}</h3>
                <p className="text-stone-600 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-stone-500 border-t border-stone-200 text-sm">
        <p>© 2026 DisasterGuard. Built for social impact.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
