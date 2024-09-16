import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import PaymentTable from './components/PaymentTable';
import SignIn from './components/SignIn';
import Table from './components/Table';
import './index.css';

axios.defaults.baseURL = "https://tasktracker-server.vercel.app/api";
//axios.defaults.baseURL = `http://localhost:3002/api`;
axios.defaults.withCredentials = true;

function App() {
  const [currentView, setCurrentView] = useState(() => {
    const savedView = localStorage.getItem('currentView');
    return savedView ? JSON.parse(savedView) : 'table';
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const savedAuth = localStorage.getItem('isAuthenticated');
    return savedAuth ? JSON.parse(savedAuth) : false;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('currentView', JSON.stringify(currentView));
  }, [currentView]);

  useEffect(() => {
    localStorage.setItem('isAuthenticated', JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  const handleSignIn = () => {
    setLoading(true);
    setTimeout(() => {
      setIsAuthenticated(true);
      setLoading(false);
    }, 1000); // Simulate loading time
  };

  const handleLogout = () => {
    setTimeout(() => {
      setIsAuthenticated(false);
      localStorage.removeItem('userDetails'); // Optional: Clear saved user details
      setCurrentView('table'); // Optionally reset the view upon logout
      setLoading(false);
    }, 1000); // Simulate loading time
  };

  const handleViewChange = (view) => {
    setLoading(true);
    setTimeout(() => {
      setCurrentView(view);
      setLoading(false);
    }, 500); // Simulate view change time
  };

  return (
    <div className="bg-primary w-full overflow-hidden">
      {loading ? (
        <><Navbar
        currentView={currentView}
        setCurrentView={handleViewChange}
        onLogout={handleLogout}
      />
      <div className="flex items-center justify-center h-screen">
          <div className="loader"></div>
      </div></>
        
      ) : isAuthenticated ? (
        <>
          <Navbar
            currentView={currentView}
            setCurrentView={handleViewChange}
            onLogout={handleLogout}
          />
          <div className="bg-primary flex justify-center items-start">
            <div className="w-full">
              {currentView === 'table' && <Table />}
              {/*currentView === 'excelToJson' && <ExcelToJson />*/}
              {currentView === 'paymentTable' && <PaymentTable />}
            </div>
          </div>
        </>
      ) : (
        <SignIn onSignIn={handleSignIn} />
      )}
    </div>
  );
}

export default App;
