import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const LoadingSignIn = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="flex items-center mb-4">
        <FaSpinner className="animate-spin h-12 w-12 text-blue-500" />
      </div>
      <p className="text-lg text-gray-700">{message || 'Processing...'}</p>
    </div>
  );
};

export default LoadingSignIn;
