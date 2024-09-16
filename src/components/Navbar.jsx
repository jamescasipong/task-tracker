import React from 'react';
import { FaSignOutAlt } from 'react-icons/fa'; // Import the logout icon

const Navbar = ({ currentView, setCurrentView, onLogout }) => {
  return (
    <nav className='bg-gray-800 p-4 w-full'>
      <div className='container mx-[0px] flex justify-between items-center'>
        <div className='flex'>
          <button
            className={`text-white px-4 py-2 rounded-md focus:outline-none ${currentView === 'table' ? 'bg-blue-500' : 'bg-gray-700'}`}
            onClick={() => setCurrentView('table')}
          >
            Table
          </button>
          {/*<button
            className={`text-white px-4 py-2 rounded-md mx-2 focus:outline-none ${currentView === 'excelToJson' ? 'bg-blue-500' : 'bg-gray-700'}`}
            onClick={() => setCurrentView('excelToJson')}
          >
            Excel to JSON
          </button>*/}
          <button
            className={`ml-3 text-white px-4 py-2 rounded-md focus:outline-none ${currentView === 'paymentTable' ? 'bg-blue-500' : 'bg-gray-700'}`}
            onClick={() => setCurrentView('paymentTable')}
          >
            Payment Table
          </button>
        </div>
        <button
          onClick={onLogout}
          className='flex items-end bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors'
        >
          <FaSignOutAlt className='mr-2' /> {/* Add the icon here */}
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
