import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';

const Navbar = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role || 'Officer';

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="bg-white shadow-md h-16 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button
          className="md:hidden text-gray-700"
          onClick={onToggleSidebar}
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Military Asset Management</h1>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600 hidden sm:block">Welcome, {role}</span>
        <button
          onClick={handleLogout}
          className="text-sm text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
