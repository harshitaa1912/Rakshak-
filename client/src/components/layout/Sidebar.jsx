import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LayoutDashboard, Map, Radio, Home, MessageSquare, User, Settings, Users } from 'lucide-react';

const Sidebar = ({ isOpen, setOpen }) => {
  const { user } = useAuth();
  
  if (!user) return null;

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['user', 'volunteer', 'admin'] },
    { name: 'Map View', path: '/map', icon: Map, roles: ['user', 'volunteer', 'admin'] },
    { name: 'SOS Requests', path: '/sos', icon: Radio, roles: ['user', 'volunteer', 'admin'] },
    { name: 'Shelters', path: '/shelters', icon: Home, roles: ['user', 'volunteer', 'admin'] },
    { name: 'Reports', path: '/reports', icon: MessageSquare, roles: ['user', 'volunteer', 'admin'] },
    { name: 'Volunteer Area', path: '/volunteer', icon: Users, roles: ['volunteer', 'admin'] },
    { name: 'Admin Panel', path: '/admin', icon: Settings, roles: ['admin'] },
    { name: 'My Profile', path: '/profile', icon: User, roles: ['user', 'volunteer', 'admin'] },
  ];

  const allowedLinks = links.filter(link => link.roles.includes(user.role));

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden" 
          onClick={() => setOpen(false)}
        />
      )}
      
      <aside className={`fixed md:sticky top-0 md:top-[61px] left-0 h-[100vh] md:h-[calc(100vh-61px)] w-64 glass-card rounded-none border-l-0 border-t-0 border-b-0 z-40 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-4 space-y-2 overflow-y-auto h-full">
          {allowedLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-emerald-700/20 text-emerald-700 border border-emerald-600/30' 
                      : 'text-stone-600 hover:text-stone-900 hover:bg-emerald-900/5'
                  }`
                }
              >
                <Icon size={20} />
                <span className="font-medium">{link.name}</span>
              </NavLink>
            );
          })}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
