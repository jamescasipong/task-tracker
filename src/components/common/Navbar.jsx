import { FaSignOutAlt } from "react-icons/fa"; // Import the logout icon
import { MdOutlineIntegrationInstructions } from "react-icons/md";



const Navbar = ({ currentView, setCurrentView, onLogout }) => {
  return (
    <nav className="bg-gray-800 p-4 w-full relative">
      <div className="container mx-[100px] flex justify-between items-center">
        <div className="flex">
          <button
            className={`text-white px-4 py-2 rounded-md transition-colors duration-300 ease-in-out focus:outline-none ${
              currentView === "table"
                ? "bg-blue-500"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
            onClick={() => setCurrentView("table")}
          >
            Hardware Inventory
          </button>
          {/*<button
            className={`text-white px-4 py-2 rounded-md mx-2 transition-colors duration-300 ease-in-out focus:outline-none ${currentView === 'excelToJson' ? 'bg-blue-500' : 'bg-gray-700 hover:bg-gray-600'}`}
            onClick={() => setCurrentView('excelToJson')}
          >
            Excel to JSON
          </button>*/}
          <button
            className={`ml-3 text-white px-4 py-2 rounded-md transition-colors duration-300 ease-in-out focus:outline-none ${
              currentView === "paymentTable"
                ? "bg-blue-500"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
            onClick={() => setCurrentView("paymentTable")}
          >
            Payments
          </button>
        </div>

        <div className="absolute right-[7%] flex gap-5">
          <button className="sm:flex hidden items-center bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition-colors duration-300 ease-in-out gap-2">
            <MdOutlineIntegrationInstructions className="w-7 h-7" />
            Instructions
          </button>
          <button
            onClick={onLogout}
            className="flex items-center bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-300 ease-in-out "
          >
            <FaSignOutAlt className="mr-2" /> {/* Add the icon here */}
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
