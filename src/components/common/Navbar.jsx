import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from "react-icons/fa"; // Import the logout icon
import { MdOutlineIntegrationInstructions } from "react-icons/md";

const Navbar = ({ currentView, setCurrentView, onLogout }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-800 text-white">
      <div className={`max-w-[1700px] mx-auto px-4 flex justify-between items-center h-16`}>
        <div className="text-xl font-bold">Monitoring System</div>

        <div className="hidden md:flex items-center space-x-4 md:mr-[190px] mr-0">
          <button
            className={`px-3 py-2 rounded ${currentView === "table" ? "bg-gray-600" : "hover:bg-gray-700"}`}
            onClick={() => {navigate("table");setCurrentView("table")}}
          >
            Hardware Inventory
          </button>
          <button
            className={`px-3 py-2 rounded ${currentView === "paymentTable" ? "bg-gray-600" : "hover:bg-gray-700"}`}
            onClick={() => {setCurrentView("paymentTable"); navigate("paymentTable")}}
          >
            Payments
          </button>
          <button
            className={`px-3 py-2 rounded ${currentView === "upload" ? "bg-gray-600" : "hover:bg-gray-700"}`}
            onClick={() => {navigate("upload"); setCurrentView("upload")}}
          >
            ORsChecker
          </button>
        </div>

        <div className="relative hidden md:flex">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 cursor-pointer hover:text-yellow-200"
            onClick={toggleMenu}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
          {isOpen && (
            <div className="absolute right-[0px] top-10 mt-2 w-48 bg-gray-700 rounded-md shadow-lg z-20">
              <button
                className="flex items-center w-full px-4 py-2 hover:bg-gray-600"
                onClick={() => { window.location.href = "/instruction.html"; }}
              >
                <MdOutlineIntegrationInstructions className="mr-2" />
                Instructions
              </button>
              <button
                className="flex items-center w-full px-4 py-2 hover:bg-gray-600"
                onClick={onLogout}
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>

        <div className="md:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 cursor-pointer"
            onClick={toggleMenu}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} bg-gray-800 p-4`}>
        <button
          className={`block w-full px-4 py-2 rounded ${currentView === "table" ? "bg-gray-600" : "hover:bg-gray-700"}`}
          onClick={() => { setCurrentView("table"); navigate("table"); setIsOpen(false); }}
        >
          Hardware Inventory
        </button>
        <button
          className={`block w-full px-4 py-2 rounded ${currentView === "paymentTable" ? "bg-gray-600" : "hover:bg-gray-700"}`}
          onClick={() => { setCurrentView("paymentTable"); navigate("paymentTable"); setIsOpen(false); }}
        >
          Payments
        </button>
        <button
          className={`block w-full px-4 py-2 rounded ${currentView === "upload" ? "bg-gray-600" : "hover:bg-gray-700"}`}
          onClick={() => { setCurrentView("upload"); navigate("upload"); setIsOpen(false); }}
        >
          ORsChecker
        </button>
        <button
          className="flex items-center justify-center w-full px-4 py-2 rounded hover:bg-gray-700"
          onClick={() => { window.location.href = "/instruction.html"; }}
        >
          <MdOutlineIntegrationInstructions className="mr-2" />
          Instructions
        </button>
        <button
          className="flex items-center justify-center w-full px-4 py-2 rounded hover:bg-gray-700"
          onClick={onLogout}
        >
          <FaSignOutAlt className="mr-2" />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;