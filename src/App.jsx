// App.jsx
import React from "react";
import "./index.css"; // Adjust the path if necessary
import Dashboard from "./components/Dashboard";
import ExcelToJson from "./components/ExcelToJson";
import Table from "./components/Table";
import TaskTracker from "./components/TaskTracker";
import axios from "axios";
import PaymentTable from "./components/PaymentTable";
//axios.defaults.baseURL = "https://tasktracker-server.vercel.app";
axios.defaults.baseURL = "http://localhost:3002";
axios.defaults.withCredentials = true;

function App() {
  return (
    <div className="bg-primary w-full overflow-hidden">
      <div className="bg-primary flex justify-center items-start">
        <div className="w-full">
          {/*<Dashboard />*/}
          {/*<TaskTracker></TaskTracker>*/}
          <Table></Table>
          <ExcelToJson></ExcelToJson>
          <PaymentTable></PaymentTable>
          {/*<Table></Table>*/}
        </div>
      </div>
    </div>
  );
}

export default App;
