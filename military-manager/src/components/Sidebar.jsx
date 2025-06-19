import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  Repeat,
  ShoppingCart,
  DollarSign,
  ClipboardList,
  X,
} from 'lucide-react';
import useWindowWidth from '../hooks/useWindowWidth';

const navItems = [
  { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={18} /> },
  { name: 'Assets', path: '/assets', icon: <Package size={18} /> },
  { name: 'Transfers', path: '/transfers', icon: <Repeat size={18} /> },
  { name: 'Purchases', path: '/purchases', icon: <ShoppingCart size={18} /> },
  { name: 'Expenditures', path: '/expenditures', icon: <DollarSign size={18} /> },
  { name: 'Assignments', path: '/assignments', icon: <ClipboardList size={18} /> },
];

const Sidebar = ({ isOpen, onClose }) => {
  const width = useWindowWidth();
  const isMobile = width < 768;

  const shouldShowSidebar = !isMobile || isOpen;

  return (
    <>
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30"
          onClick={onClose}
        />
      )}

      <motion.aside
        initial={false}
        animate={{ x: shouldShowSidebar ? 0 : -300 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className={`fixed md:static z-40 w-64 h-full bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 shadow-lg`}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl font-bold text-blue-400 tracking-wide">🛡️ MAM System</h1>
          {isMobile && (
            <button onClick={onClose} className="text-white">
              <X size={22} />
            </button>
          )}
        </div>

        <nav className="flex flex-col gap-4">
          {navItems.map(({ name, path, icon }) => (
            <NavLink
              key={name}
              to={path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`
              }
            >
              {icon}
              <span>{name}</span>
            </NavLink>
          ))}
        </nav>
      </motion.aside>
    </>
  );
};

export default Sidebar;
