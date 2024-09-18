import axios from "axios";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { FaRegFileExcel } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import XLSX from "xlsx-js-style";
import LoadingTable from "./LoadingTable";

const Table = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: "No", direction: "asc" });
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedBrand, setSelectedBrand] = useState("All");
  const [newRows, setNewRows] = useState([
    {
      No: "",
      SerialNumber: "",
      Brand: "",
      Model: "",
      Owner: "",
      Department: "",
      Owner_1: "",
      Department_1: "",
      Owner_2: "",
      Department_2: "",
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/dataRoute/");
        const fetchedData = response.data;

        // Ensure No field is a number
        const maxNo = fetchedData.reduce(
          (max, item) => Math.max(max, Number(item.No) || 0),
          0
        );
        setData(fetchedData);

        // Set initial No for new rows based on existing data
        setNewRows((prevRows) =>
          prevRows.map((row) => ({ ...row, No: maxNo + 1 }))
        );

        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleBrandFilterChange = (e) => {
    setSelectedBrand(e.target.value);
  };

  const handleRowInputChange = (rowIndex, key, value) => {
    const updatedRows = [...newRows];
    updatedRows[rowIndex] = { ...updatedRows[rowIndex], [key]: value };
    setNewRows(updatedRows);
    setPendingChanges((prev) => ({
      ...prev,
      additions: [...prev.additions, updatedRows[rowIndex]],
    }));
  };

  const [pendingChanges, setPendingChanges] = useState({
    updates: [],
    additions: [],
  });

  const [values, setValuesz] = useState("");

  const handleInputChange = (index, key, event) => {
    const updatedData = [...data];
    let newValue = event.target.value;

    updatedData[index] = { ...updatedData[index], [key]: newValue };
    setData(updatedData);

    setPendingChanges((prev) => ({
      ...prev,
      updates: [
        ...prev.updates,
        { id: updatedData[index]._id, changes: { [key]: newValue } },
      ],
    }));
  };

  // Debounced function to handle saving changes
  const debouncedUpdate = _.debounce(async (update) => {
    console.log("Updating device with ID:", update.id);
    console.log("Changes:", update.changes);
    try {
      setLoading(true)

      await axios.put(`/dataRoute/update-device/${update.id}`, update.changes);

      const response = await axios.get("/dataRoute/");
      setData(response.data);

      setLoading(false)
      alert("Saved successfully!");
    } catch (error) {
      console.error("Failed to update device:", error);
    }
  }); // 500 ms delay before triggering the update

  const saveChanges = async () => {
    try {
      if (confirm("Are you sure you want to save this?")) {

        const validUpdates = pendingChanges.updates.filter(
          (update) => Object.keys(update.changes).length > 0
        );

        console.log("Valid updates:", validUpdates);

        // Save updated devices with debounced function
        await Promise.all(
          validUpdates.map((update) => debouncedUpdate(update))
        );

        // Save new devices
        await Promise.all(
          pendingChanges.additions.map((row) => {
            console.log("Adding new device:", row);
            return axios.post("/dataRoute/add-device", row);
          })
        );

        // Refresh data

        // Clear pending changes
        setPendingChanges({ updates: [], additions: [] });
        // Optional: Provide feedback to user
        console.log("Changes saved and data refreshed.");
        
      } else {
        alert("You didn't save it!");
      }
    } catch (error) {
      console.error("Failed to save changes:", error);
    }
  };

  const addNewRows = async () => {
    try {
      const responses = await Promise.all(
        newRows.map((row) => axios.post("/dataRoute/add-device", row))
      );
      setData([...data, ...responses.map((response) => response.data)]);

      setNewRows([
        {
          No: Math.max(...newRows.map((item) => Number(item.No) || 0), 0) + 1,
          SerialNumber: "",
          Brand: "",
          Model: "",
          Owner: "",
          Department: "",
          Owner_1: "",
          Department_1: "",
          Owner_2: "",
          Department_2: "",
        },
      ]);
      closeModal(); // Close modal after adding the rows
    } catch (error) {
      console.error("Failed to add new devices:", error);
    }
  };

  const deleteDevice = async (id) => {
    try {
      await axios.delete(`/dataRoute/delete-device/${id}`);
      setData(data.filter((device) => device._id !== id));
    } catch (error) {
      console.error("Failed to delete device:", error);
    }
  };

  const deleteRow = (rowIndex) => {
    setNewRows(newRows.filter((_, index) => index !== rowIndex));
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const filteredData = React.useMemo(() => {
    return data.filter((item) => {
      const searchMatch = Object.values(item).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
      const brandMatch =
        selectedBrand === "All" || item.Brand === selectedBrand;
      return searchMatch && brandMatch;
    });
  }, [data, searchTerm, selectedBrand]);

  const sortedData = React.useMemo(() => {
    let sortableData = [...filteredData];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        const aNo = isNaN(Number(a[sortConfig.key]))
          ? a[sortConfig.key]
          : Number(a[sortConfig.key]);
        const bNo = isNaN(Number(b[sortConfig.key]))
          ? b[sortConfig.key]
          : Number(b[sortConfig.key]);

        if (aNo < bNo) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aNo > bNo) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [filteredData, sortConfig]);

  const exportToXlsx = async () => {
    try {
      // Fetch data from the backend
      const response = await axios.get("/dataRoute/export/excel", {
        responseType: "json",
      });

      // Convert the response to JSON
      const data = response.data;

      // Convert JSON data to worksheet
      const worksheet = XLSX.utils.json_to_sheet(data);

      const headerStyle = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "4F81BD" } },
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } },
        },
        alignment: { horizontal: "center", vertical: "center" },
      };

      const bodyStyle = {
        font: { color: { rgb: "000000" } },
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } },
        },
        alignment: { horizontal: "left", vertical: "center" },
      };

      const totalColumns = 10;

      // Apply styles to the header row (row 1)
      const headers = Object.keys(data[0]);
      for (let colIndex = 0; colIndex < totalColumns; colIndex++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: colIndex });
        const headerValue = headers[colIndex] || `Column ${colIndex + 1}`; // Default header if undefined
        if (!worksheet[cellAddress]) {
          worksheet[cellAddress] = { v: headerValue };
        }
        worksheet[cellAddress].s = headerStyle; // Set style to header cell
      }

      // Apply styles to the rest of the rows
      data.forEach((row, rowIndex) => {
        for (let colIndex = 0; colIndex < totalColumns; colIndex++) {
          const cellAddress = XLSX.utils.encode_cell({
            r: rowIndex + 1,
            c: colIndex,
          });
          const cellValue = row[headers[colIndex]] || ""; // Default value if undefined
          if (!worksheet[cellAddress]) {
            worksheet[cellAddress] = { v: cellValue };
          }
          worksheet[cellAddress].s = bodyStyle; // Set style to body cells
        }
      });

      // Dynamically calculate the column widths based on content
      const colWidths = headers.map((header, colIndex) => {
        let maxLength = header.length; // Start with header length
        data.forEach((row) => {
          const cellValue = row[header] ? row[header].toString() : "";
          maxLength = Math.max(maxLength, cellValue.length); // Compare with each cell length
        });
        return { wch: maxLength + 2 }; // Add some padding (2 characters)
      });

      worksheet["!cols"] = colWidths; // Set the column widths

      // Create a new workbook and append the styled worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Device Inventory");

      // Export the workbook to a file
      XLSX.writeFile(workbook, "Device Inventory.xlsx");
    } catch (error) {
      console.error("Error exporting data:", error.message);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === "s") {
        event.preventDefault(); // Prevent the default browser save action
        saveChanges();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [saveChanges]);

  if (loading) {
    return <LoadingTable />;
  }

  return (
    <div className="overflow-x-auto p-4">
      <div className="mb-4 flex items-center">
        {/*<input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="border border-gray-300 p-2 mr-4 w-[700px]"
        />*/}
        <select
          value={selectedBrand}
          onChange={handleBrandFilterChange}
          className="border border-gray-300 p-2"
        >
          <option value="All">All Brands</option>
          <option value="APPLE">APPLE</option>
          <option value="HP">HP</option>
          <option value="ACER">ACER</option>
        </select>
        <button
          onClick={openModal}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all  items-center duration-300 flex gap-1 ml-4"
        >
          <IoMdAdd className="w-7 h-7" />
          Add devices
        </button>
        <button
          onClick={exportToXlsx}
          className="ml-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-all duration-300 flex gap-2 items-center"
        >
          <FaRegFileExcel className="w-7 h-7" />
          Export
        </button>

        {pendingChanges.updates.length > 0 ||
        pendingChanges.additions.length > 0 ? (
          <button
            onClick={saveChanges}
            className="bg-yellow-500 text-white px-4 py-2 rounded ml-4"
          >
            Save Changes
          </button>
        ) : null}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-[90%] max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Add New Devices</h2>
            {newRows.map((row, rowIndex) => (
              <div key={rowIndex} className="mb-4">
                <h3 className="text-md font-medium mb-2">
                  Device {rowIndex + 1}
                </h3>
                <div className="flex flex-wrap gap-4">
                  {Object.keys(row).map((key) => (
                    <div key={key} className="flex-1">
                      <label className="block text-sm font-medium text-gray-700">
                        {key}
                      </label>
                      <input
                        type="text"
                        value={row[key]}
                        onChange={(e) =>
                          handleRowInputChange(rowIndex, key, e.target.value)
                        }
                        className="border border-gray-300 p-2 mt-1 w-full"
                      />
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => deleteRow(rowIndex)}
                  className="bg-red-500 text-white px-4 py-1 rounded mt-2"
                >
                  Delete Row
                </button>
              </div>
            ))}
            <button
              onClick={() =>
                setNewRows([
                  ...newRows,
                  {
                    No:
                      Math.max(
                        ...newRows.map((item) => Number(item.No) || 0),
                        0
                      ) + 1,
                    SerialNumber: "",
                    Brand: "",
                    Model: "",
                    Owner: "",
                    Department: "",
                    Owner_1: "",
                    Department_1: "",
                    Owner_2: "",
                    Department_2: "",
                  },
                ])
              }
              className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
            >
              Add Another Row
            </button>
            <button
              onClick={addNewRows}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-4 ml-2"
            >
              Add Rows
            </button>
            <button
              onClick={closeModal}
              className="bg-gray-500 text-white px-4 py-2 rounded mt-4 ml-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <table className={`min-w-full bg-white border border-gray-300 `}>
        <thead>
          <tr className="bg-gray-200">
            {[
              "No",
              "SerialNumber",
              "Brand",
              "Model",
              "Owner",
              "Department",
              "Owner_1",
              "Department_1",
              "Owner_2",
              "Department_2",
            ].map((header) => (
              <th
                key={header}
                className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm font-semibold text-gray-700 cursor-pointer"
                onClick={() => handleSort(header)}
              >
                {header}{" "}
                {sortConfig.key === header
                  ? sortConfig.direction === "asc"
                    ? "▲"
                    : "▼"
                  : ""}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((device, index) => (
            <tr key={device._id} className="hover:bg-gray-100">
              {[
                "No",
                "SerialNumber",
                "Brand",
                "Model",
                "Owner",
                "Department",
                "Owner_1",
                "Department_1",
                "Owner_2",
                "Department_2",
              ].map((key) => (
                <td
                  key={key}
                  className="px-6 py-4 border-b border-gray-300 text-sm text-gray-700"
                >
                  <input
                    type="text"
                    value={device[key] || ""}
                    onChange={(e) => handleInputChange(index, key, e)}
                    className={`w-full ${key}`}
                  />
                </td>
              ))}
              {/*<td className="px-6 py-4 border-b border-gray-300 text-sm text-gray-700">
                <button
                  onClick={() => deleteDevice(device._id)}
                  className="bg-red-500 text-white px-4 py-1 rounded"
                >
                  Delete
                </button>
              </td>*/}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
