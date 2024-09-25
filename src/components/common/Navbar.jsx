import { FaSignOutAlt } from "react-icons/fa"; // Import the logout icon
import { IoMdMenu } from "react-icons/io";
import { MdOutlineIntegrationInstructions } from "react-icons/md";



const Navbar = ({ currentView, setCurrentView, onLogout }) => {
  return (
    <nav className="bg-gray-800 p-4 w-full relative">
      <div className="container lg:mx-[100px] lg:flex justify-end lg:justify-between items-end">
        <div className="lg:flex">
          <button
            className={`text-white px-4 py-2 lg:block hidden rounded-md transition-colors duration-300 ease-in-out focus:outline-none ${
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
            className={`ml-3 lg:block hidden text-white px-4 py-2 rounded-md transition-colors duration-300 ease-in-out focus:outline-none ${
              currentView === "paymentTable"
                ? "bg-blue-500"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
            onClick={() => setCurrentView("paymentTable")}
          >
            Payments
          </button>

          <button
            className={`ml-3 lg:block hidden text-white px-4 py-2 rounded-md transition-colors duration-300 ease-in-out focus:outline-none ${
              currentView === "upload"
                ? "bg-blue-500"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
            onClick={() => setCurrentView("upload")}
          >
            ORsChecker
          </button>
          
          {/*<button
            className={` lg:hidden flex text-white w-full px-4 py-2 rounded-md transition-colors duration-300 ease-in-out focus:outline-none ${
              currentView === "upload"
                ? "bg-blue-500"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
            onClick={() => setCurrentView("upload")}
          >
            <CiMenuFries />

          </button>*/}
  
          <IoMdMenu className="lg:hidden items-end flex w-7 h-7 my-2 text-yellow-100 hover:text-yellow-200 cursor-pointer transition-colors 0.5s ease-in-out"/>

        </div>

        <div className="absolute hidden right-[7%] lg:flex gap-5">
          <button onClick={() => {window.location.href = "/instruction.html"}} className="lg:flex hidden items-center bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition-colors duration-300 ease-in-out gap-2">
            <MdOutlineIntegrationInstructions className="w-7 h-7" />
            Instructions
          </button>
          <button
            onClick={onLogout}
            className="flex  items-center bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-300 ease-in-out "
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
