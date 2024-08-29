import React, { useState } from "react";
import "./index.css";
import Dashboard from "./components/Dashboard";
import ExcelToJson from "./components/ExcelToJson";
import Table from "./components/Table";
import TaskTracker from "./components/TaskTracker";
import axios from "axios";
import PaymentTable from "./components/PaymentTable";
import Navbar from "./components/Navbar";

axios.defaults.baseURL = "https://tasktracker-server.vercel.app";
axios.defaults.withCredentials = true;

function App() {
  const [currentView, setCurrentView] = useState('table'); // Default view

  return (
    <div className="bg-primary w-full overflow-hidden">
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />
      <div className="bg-primary flex justify-center items-start">
        <div className="w-full">
          {currentView === 'table' && <Table />}
          {currentView === 'excelToJson' && <ExcelToJson />}
          {currentView === 'paymentTable' && <PaymentTable />}
          {/* Optionally, you can include other components or fallback content */}
        </div>
      </div>
    </div>
  );
}

export default App;
