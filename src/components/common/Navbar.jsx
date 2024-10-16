import axios from "axios";
import { useEffect, useState } from "react";
import { FaSignOutAlt } from "react-icons/fa"; // Import the logout icon
import { IoIosSettings } from "react-icons/io";
import { MdOutlineIntegrationInstructions } from "react-icons/md";
import { RiCloseFill } from "react-icons/ri";

import { useNavigate } from "react-router-dom";

const Navbar = ({ currentView, setCurrentView, onLogout }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    console.log("Toggling menu. Current state:", isOpen);
    setIsOpen(!isOpen);
  };

  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getIp = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/dataRoute/ip");

        const getIpData = await axios.get(`/dataRoute/ip/${response.data.ip}`);

        setInfo({ city: getIpData.data.city, ip: response.data.ip });

        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    getIp();
  }, []);

  return (
    <nav className="bg-gray-800 text-white">
      <div
        className={`max-w-[1700px] mx-auto px-4 flex justify-between items-center h-16`}
      >
        <div className="flex items-center gap-3">
          <img src="/monitor360.png" className="w-10 h-10" alt="logo" />
          <div className="text-xl font-bold">
            Monitor<span className="text-blue-300">360</span>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-4  mr-0">
          {" "}
          {/* mr-0 is added to remove the margin-right */} {/*md:mr-[190px] */}
          <button
            className={`px-3 font-medium py-2 rounded ${
              currentView === "table" ? "bg-gray-700" : "hover:bg-gray-700"
            }`}
            onClick={() => {
              navigate("table");
              setCurrentView("table");
            }}
          >
            Hardware Inventory
          </button>
          <button
            className={`px-3 font-medium py-2 rounded ${
              currentView === "paymentTable"
                ? "bg-gray-700"
                : "hover:bg-gray-700"
            }`}
            onClick={() => {
              setCurrentView("paymentTable");
              navigate("paymentTable");
            }}
          >
            Payments
          </button>
          <button
            className={`px-3 font-medium py-2 rounded ${
              currentView === "upload" ? "bg-gray-700" : "hover:bg-gray-700"
            }`}
            onClick={() => {
              navigate("upload");
              setCurrentView("upload");
            }}
          >
            ORsChecker
          </button>
        </div>

        <div className="relative font-medium hidden md:flex gap-5">
          {loading ? (
            "Loading..."
          ) : (
            <p className="lg:block hidden">
              {info.city} - {info.ip}
            </p>
          )}
          {!isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 cursor-pointer hover:text-gray-400"
              onClick={toggleMenu}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          ) : (
            <RiCloseFill
              onClick={toggleMenu}
              className="w-6 h-6 cursor-pointer hover:text-gray-400"
            ></RiCloseFill>
          )}

          <div
            className={`${
              isOpen
                ? "scale-100 visible translate-y-[0px] opacity-100"
                : "scale-90 invisible translate-y-[-20px] opacity-0"
            } transition duration-100 ease-out absolute right-[0px] top-10 mt-2 w-48 bg-gray-700 rounded-md shadow-lg z-20`}
          >
            <button
              className="flex items-center w-full px-4 py-2 hover:bg-gray-600"
              onClick={() => {
                window.location.href = "/instruction.html";
              }}
            >
              <MdOutlineIntegrationInstructions className="mr-2" />
              Instructions
            </button>
            <button
              className="flex items-center w-full px-4 py-2 hover:bg-gray-600"
              onClick={() => {
                window.location.href = "/settings";
              }}
            >
              <IoIosSettings className="mr-2" />
              Settings
            </button>
            <button
              className="flex items-center w-full px-4 py-2 hover:bg-gray-600"
              onClick={onLogout}
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
          </div>
        </div>

        <div className="md:hidden">
          {isOpen ? (
            <RiCloseFill
              onClick={toggleMenu}
              className="w-6 h-6 cursor-pointer hover:text-gray-400"
            ></RiCloseFill>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 cursor-pointer"
              onClick={toggleMenu}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed left-0 right-0 top-16 z-40 md:hidden ${
          isOpen ? " " : "invisible -translate-y-10 opacity-0"
        } transition-all duration-100 ease-out bg-gray-800 p-4`}
      >
        <button
          className={`block  w-full px-4 py-2 rounded ${
            currentView === "table" ? "bg-gray-600" : "hover:bg-gray-700"
          }`}
          onClick={() => {
            setCurrentView("table");
            navigate("table");
            setIsOpen(false);
          }}
        >
          Hardware Inventory
        </button>
        <button
          className={`block w-full px-4 py-2 rounded ${
            currentView === "paymentTable" ? "bg-gray-600" : "hover:bg-gray-700"
          }`}
          onClick={() => {
            setCurrentView("paymentTable");
            navigate("paymentTable");
            setIsOpen(false);
          }}
        >
          Payments
        </button>
        <button
          className={`block w-full px-4 py-2 rounded ${
            currentView === "upload" ? "bg-gray-600" : "hover:bg-gray-700"
          }`}
          onClick={() => {
            setCurrentView("upload");
            navigate("upload");
            setIsOpen(false);
          }}
        >
          ORsChecker
        </button>
        <button
          className="flex items-center justify-center w-full px-4 py-2 rounded hover:bg-gray-700"
          onClick={() => {
            window.location.href = "/instruction.html";
          }}
        >
          <MdOutlineIntegrationInstructions className="mr-2" />
          Instructions
        </button>
        <button
          className="flex items-center justify-center w-full px-4 py-2 rounded hover:bg-gray-700"
          onClick={() => {
            window.location.href = "/settings";
          }}
        >
          <IoIosSettings className="mr-2" />
          Settings
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
