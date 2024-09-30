import axios from "axios";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import FileUpload from "./components/FileUpload";
import SignIn from "./components/forms/SignIn";
import LoadingSignIn from "./components/loading/LoadingSignIn";
import NotFound from "./components/NotFound";
import PrivateRoute from "./components/PrivateRoute";
import PaymentTable from "./components/tables/PaymentTable";
import Table from "./components/tables/Table";
import "./index.css";

let isLocal = false;
axios.defaults.baseURL = isLocal
  ? "http://localhost:3002/api"
  : "https://tasktracker-server.vercel.app/api/";
axios.defaults.withCredentials = true;

function AppContent() {
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
  const [hasAccess, setAccess] = useState(false);
  const [loading404, setLoading404] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem("currentView", JSON.stringify(currentView));
  }, [currentView]);

  useEffect(() => {
    localStorage.setItem("isAuthenticated", JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchIp = async () => {
      try {
        setLoading404(true);
        const response = await axios.get("/dataRoute/ip");

        setLoading404(false);
        setAccess(true);
      } catch (error) {
        setLoading404(false);
        console.error("Error fetching IP:", error.response.data);
        if (error.response.data === "Access denied") {
          setAccess(false);
        }
      }
    };

    fetchIp();
  }, [hasAccess]);

  const handleSignIn = () => {
    setState("Logging in..");
    setLoading(true);
    setTimeout(() => {
      setIsAuthenticated(true);
      setLoading(false);
      setState("");
      navigate("/table"); // Redirect to /table after signing in
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
    setCurrentView(view);
  };

  useEffect(() => {
    if (location.pathname === "/" && isAuthenticated) {
      navigate("/table");
    }
  }, [location.pathname, isAuthenticated, navigate]);

  return (
    <>
      {loading404 ? (
        <LoadingSignIn message="processing" />
      ) : hasAccess ? (
        <div className="bg-primary w-full overflow-hidden">
          {loading ? (
            <LoadingSignIn message={state} />
          ) : (
            <>
              {location.pathname !== "/" && 
                (location.pathname === "/table" || location.pathname === "/paymentTable" || location.pathname === "/upload") &&
                (isAuthenticated ? (
                  <Navbar
                    currentView={currentView}
                    setCurrentView={handleViewChange}
                    onLogout={handleLogout}
                  />
                ) : null)
              }
              <div className="bg-primary flex justify-center items-start">
                <Routes>
                  <Route path="/" element={<SignIn onSignIn={handleSignIn} />} />
                  <Route
                    path="/table"
                    element={
                      <PrivateRoute isAuthenticated={isAuthenticated}>
                        <Table />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/upload"
                    element={
                      <PrivateRoute isAuthenticated={isAuthenticated}>
                        <FileUpload />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/paymentTable"
                    element={
                      <PrivateRoute isAuthenticated={isAuthenticated}>
                        <PaymentTable />
                      </PrivateRoute>
                    }
                  />
                  <Route path="*" element={<NotFound message="This page not exist :)"/>} />
                </Routes>
              </div>
            </>
          )}
        </div>
      ) : (
        <NotFound message="This site is only authorized to specific ISP. You have no access to this!"/>
      )}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;