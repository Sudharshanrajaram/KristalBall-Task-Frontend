import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Assets from './pages/Assets';
import Transfer from './pages/Tranfers';
import Purchase from './pages/Purchase';
import Expenditure from './pages/Expenditure';
import Assignment from './pages/Assignment';
import Login from './pages/Login';
import './App.css';

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <div className="flex h-screen overflow-hidden">
        {isLoggedIn && <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />}
        <div className="flex-1 flex flex-col">
          {isLoggedIn && <Navbar onToggleSidebar={toggleSidebar} />}
          <div className="flex-1 bg-gray-100 overflow-y-auto">
            <Routes>
              <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Login />} />
              <Route path="/" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
              <Route path="/assets" element={isLoggedIn ? <Assets /> : <Navigate to="/login" />} />
              <Route path="/transfers" element={isLoggedIn ? <Transfer /> : <Navigate to="/login" />} />
              <Route path="/purchases" element={isLoggedIn ? <Purchase /> : <Navigate to="/login" />} />
              <Route path="/expenditures" element={isLoggedIn ? <Expenditure /> : <Navigate to="/login" />} />
              <Route path="/assignments" element={isLoggedIn ? <Assignment /> : <Navigate to="/login" />} />
              <Route path="*" element={<Navigate to={isLoggedIn ? '/' : '/login'} />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
