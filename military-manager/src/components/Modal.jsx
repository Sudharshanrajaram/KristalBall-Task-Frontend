import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Modal = ({ title, children, onClose }) => {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 shadow-2xl relative"
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-4 text-gray-400 hover:text-black text-2xl"
            aria-label="Close Modal"
          >
            &times;
          </button>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
          <div className="max-h-[70vh] overflow-y-auto pr-1">
            {children}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default Modal;
