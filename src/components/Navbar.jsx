import React from 'react';

const Navbar = ({ currentView, setCurrentView }) => {
  return (
    <nav className='bg-gray-800 p-4'>
      <div className='container mx-auto flex justify-center'>
        <button
          className={`text-white px-4 py-2 rounded-md focus:outline-none ${currentView === 'table' ? 'bg-blue-500' : 'bg-gray-700'}`}
          onClick={() => setCurrentView('table')}
        >
          Table
        </button>
        <button
          className={`text-white px-4 py-2 rounded-md mx-2 focus:outline-none ${currentView === 'excelToJson' ? 'bg-blue-500' : 'bg-gray-700'}`}
          onClick={() => setCurrentView('excelToJson')}
        >
          Excel to JSON
        </button>
        <button
          className={`text-white px-4 py-2 rounded-md focus:outline-none ${currentView === 'paymentTable' ? 'bg-blue-500' : 'bg-gray-700'}`}
          onClick={() => setCurrentView('paymentTable')}
        >
          Payment Table
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
