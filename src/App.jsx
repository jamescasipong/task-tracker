import axios from "axios";
import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import PaymentTable from "./components/PaymentTable";
import Table from "./components/Table";
import "./index.css";

axios.defaults.baseURL = "https://tasktracker-server.vercel.app";
//axios.defaults.baseURL = "http://localhost:3002";
axios.defaults.withCredentials = true;

function App() {
  // Initialize state from local storage or default to 'table'
  const [currentView, setCurrentView] = useState(() => {
    const savedView = localStorage.getItem('currentView');
    return savedView ? JSON.parse(savedView) : 'table';
  });

  // Update local storage whenever currentView changes
  useEffect(() => {
    localStorage.setItem('currentView', JSON.stringify(currentView));
  }, [currentView]);

  return (
    <div className="bg-primary w-full overflow-hidden">
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />
      <div className="bg-primary flex justify-center items-start">
        <div className="w-full">
          {currentView === 'table' && <Table />}
          {/*currentView === 'excelToJson' && <ExcelToJson />*/}
          {currentView === 'paymentTable' && <PaymentTable />}
          
          {/* Optionally, you can include other components or fallback content */}
        </div>
      </div>
    </div>
  );
}

export default App;
