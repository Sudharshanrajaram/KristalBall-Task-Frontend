import React from 'react';

const StatCard = ({ title, value, onClick, clickable }) => {
  return (
    <div
      onClick={clickable ? onClick : undefined}
      className={`p-6 rounded-lg shadow-md transition-all duration-200 bg-white border border-gray-200 hover:shadow-lg ${
        clickable ? 'cursor-pointer hover:ring-2 hover:ring-blue-500' : 'cursor-default'
      }`}
    >
      <div className="text-sm text-gray-500 uppercase tracking-wide">{title}</div>
      <div className="mt-2 text-3xl font-bold text-blue-600">{value}</div>
    </div>
  );
};

export default StatCard;
