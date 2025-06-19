import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const demoUsers = [
  { label: 'Admin', email: 'admin@gmail.com', password: 'admin123' },
  { label: 'BaseCommander', email: 'commander1@example.com', password: 'password123' },
  { label: 'Logistic Officer', email: 'logi1@example.com', password: 'test123' }
];

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) navigate('/');
  }, [navigate]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleUserSelect = (e) => {
    const selected = demoUsers.find(user => user.email === e.target.value);
    if (selected) {
      setFormData({ email: selected.email, password: selected.password });
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      window.location.href = '/';
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white w-full max-w-md p-8 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 text-center">🔐 Login to Your Account</h2>

        <select
          onChange={handleUserSelect}
          className="w-full p-2 mb-4 border rounded text-sm bg-gray-50"
          defaultValue=""
        >
          <option value="" disabled>
            Select a role here
          </option>
          {demoUsers.map((user) => (
            <option key={user.email} value={user.email}>
              {user.label} ({user.email})
            </option>
          ))}
        </select>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm"
          >
            {error}
          </motion.div>
        )}

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoComplete="current-password"
        />

        <motion.button
          type="submit"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full bg-blue-600 text-white py-3 rounded transition-colors duration-200 hover:bg-blue-700"
        >
          Login
        </motion.button>
      </motion.form>
    </div>
  );
};

export default Login;
