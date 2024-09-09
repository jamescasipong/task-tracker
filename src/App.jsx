import axios from "axios";
import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import PaymentTable from "./components/PaymentTable";
import Table from "./components/Table";
import "./index.css";

axios.defaults.baseURL = "https://tasktracker-server.vercel.app";
// axios.defaults.baseURL = "http://localhost:3002";
axios.defaults.withCredentials = true;

function App() {
  const [currentView, setCurrentView] = useState(() => {
    const savedView = localStorage.getItem('currentView');
    return savedView ? JSON.parse(savedView) : 'table';
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('currentView', JSON.stringify(currentView));
  }, [currentView]);

  useEffect(() => {
    // Simulate loading delay
    const loadView = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate a delay
      setLoading(false);
    };

    loadView();
  }, [currentView]);

  return (
    <div className="bg-primary w-full overflow-hidden">
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />
      <div className="bg-primary flex justify-center items-start">
        <div className="w-full">
          {loading ? (
            <div className="flex justify-center items-center h-screen">
              <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-solid border-primary rounded-full"></div>
            </div>
          ) : (
            <>
              {currentView === 'table' && <Table />}
              {/*currentView === 'excelToJson' && <ExcelToJson />*/}
              {currentView === 'paymentTable' && <PaymentTable />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
