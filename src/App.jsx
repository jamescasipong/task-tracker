import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "./components/common/Navbar";
import SignIn from "./components/forms/SignIn";
import LoadingSignIn from "./components/loading/LoadingSignIn";
import PaymentTable from "./components/tables/PaymentTable";
import Table from "./components/tables/Table";
import "./index.css";

let isLocal = false;
axios.defaults.baseURL = isLocal ? "http://localhost:3002/api":"https://tasktracker-server.vercel.app/api/";
axios.defaults.withCredentials = true;

function App() {
  const [currentView, setCurrentView] = useState(() => {
    const savedView = localStorage.getItem("currentView");
    return savedView ? JSON.parse(savedView) : "table";
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const savedAuth = localStorage.getItem("isAuthenticated");
    return savedAuth ? JSON.parse(savedAuth) : false;
  });
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState("");

  useEffect(() => {
    localStorage.setItem("currentView", JSON.stringify(currentView));
  }, [currentView]);

  useEffect(() => {
    localStorage.setItem("isAuthenticated", JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  const handleSignIn = () => {
    setState("Logging in..");
    setLoading(true);
    setTimeout(() => {
      setIsAuthenticated(true);
      setLoading(false);
      setState("");
    }, 1000); // Simulate loading time
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      setState("Logging out..");
      setLoading(true);
      setTimeout(() => {
        setIsAuthenticated(false);
        localStorage.removeItem("userDetails"); // Optional: Clear saved user details
        setCurrentView("table"); // Optionally reset the view upon logout
        setLoading(false);
        setState("");
      }, 1000); // Simulate loading time
    }
  };

  const handleViewChange = (view) => {
    setTimeout(() => {
      setCurrentView(view);
    }, 500); // Simulate view change time
  };

  return (
    <div className="bg-primary w-full overflow-hidden">
      {loading ? (
        <LoadingSignIn message={state}></LoadingSignIn>
      ) : isAuthenticated ? (
        <>
          <Navbar
            currentView={currentView}
            setCurrentView={handleViewChange}
            onLogout={handleLogout}
          />
          <div className="bg-primary flex justify-center items-start">
            <div className="">
              {currentView === "table" && <Table />}
              {/*currentView === 'excelToJson' && <ExcelToJson />*/}
              {currentView === "paymentTable" && <PaymentTable />}
            </div>
          </div>
        </>
      ) : (
        <>
          <SignIn onSignIn={handleSignIn} />
        </>
      )}
    </div>
  );
}

export default App;
