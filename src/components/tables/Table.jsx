import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { FaRegFileExcel, FaRegSave, FaTrash } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import XLSX from "xlsx-js-style";
import LoadingTable from "../loading/LoadingTable";
import { dangerAlerts, successAlerts } from "../modals/alerts";

const Table = () => {
  const findRef = useRef(null);
  const [data, setData] = useState([]); // Store the fetched data
  const [loading, setLoading] = useState(true); // Loading state
  const [sortConfig, setSortConfig] = useState({ key: "No", direction: "asc" }); // Sorting configuration
  const [searchTerm, setSearchTerm] = useState(""); // Search term
  const [selectedBrand, setSelectedBrand] = useState("All"); // Selected brand filter
  const [error, setError] = useState(false); // Error state
  const [alerts, setAlerts] = useState(""); // Alert message
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
  ]); // New rows to add
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [pendingChanges, setPendingChanges] = useState({
    updates: [],
    additions: [],
  }); // Pending changes
  const [addLoading, setAddLoading] = useState(false); // Add loading state

  // Delete multiple rows
  const deleteRows = async () => {
    // Prompt the user to enter the range of rows to delete
    let rowRange;

    // Check if there is no data
    if (data == 0) {
      alert("Empty Row. Please Insert A Row");
      return;
    }

    // Get the length of the fetched data
    let fetchedLength = data.length;

    // Check if there are less than 10 rows
    if (fetchedLength < 10) {
      // If there are less than 10 rows, set the range to the last row
      rowRange = window.prompt(
        `Write No. that you want to delete starting first to last, eg. ${
          data[0].No + "-" + data[fetchedLength - 1].No
        }`,
        `${data[0].No + "-" + data[fetchedLength - 1].No}`
      );
    } else {
      // If there are more than 10 rows, set the range to the first and tenth row
      rowRange = window.prompt(
        `Write No. that you want to delete starting first to last, eg. ${
          data[0].No + "-" + data[10].No
        }`,
        `${data[0].No + "-" + data[10].No}`
      );
    }

    // If the user cancels the prompt, return early
    if (rowRange != null) {
      const arrayOfObject = [];

      // Split the string by the hyphen and trim any whitespace
      const numbers = rowRange.split("-").map((num) => num.trim());

      // Convert the string numbers to integers and store them
      const startNum = Number(numbers[0]);
      const endNum = Number(numbers[1]);

      // Check if the start number is greater than the end number
      for (let i = startNum; i <= endNum; i++) {
        arrayOfObject.push({ No: i }); // Push the numbers to the array
      }

      // Log the array of objects to the console
      console.log("delete", arrayOfObject);

      try {
        // Delete the rows
        await axios.delete("/dataRoute/delete", { data: arrayOfObject });

        // Fetch the data again
        const response = await axios.get("/dataRoute/");

        // Set the data to the fetched data
        setData(response.data);

        // Set the alert message
        setAlerts("Deleted Success!");

        // Set the error state to true
        setError(true);

        // Set the error state to false after 3 seconds
        setTimeout(() => setError(false), 3000);
      } catch (error) {
        setError(true);
        setTimeout(() => setError(false), 3000);

        if (error.response.status == 404) {
          //console.error(error.response.data.message);
          setAlerts("Not Found!");
          // Optionally, show a message to the user or handle it accordingly
        } else {
          //console.error("An error occurred:", error);
          // H
        }
      }
    }
  };

  // Example usage

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
      key === sortConfig.key && sortConfig.direction === "asc" ? "desc" : "asc";

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

  const handleInputChange = (index, key, event) => {
    const updatedData = [...sortedData]; // create an instance of sortedData
    const newValue = event.target.value;

    // Update data
    updatedData[index] = { ...updatedData[index], [key]: newValue };
    setData(updatedData);

    // Update pending changes
    setPendingChanges((prev) => {
      const updatedUpdates = prev.updates.map((update, i) => {
        if (i === index) {
          return {
            id: updatedData[index]._id,
            changes: {
              ...update.changes,
              [key]: newValue,
            },
          };
        }
        return update; // Keep existing updates for other indices
      });

      // Add a new entry if it doesn't exist
      if (!updatedUpdates[index]) {
        updatedUpdates[index] = {
          id: updatedData[index]._id,
          changes: { [key]: newValue },
        };
      }

      return { ...prev, updates: updatedUpdates };
    });
  };

  // Debounced function to handle saving changes
  const debouncedUpdate = async (update) => {
    try {
      setLoading(true);

      await axios.put(`/dataRoute/update-device/${update.id}`, update.changes);

      const response = await axios.get("/dataRoute/");
      setData(response.data);

      setLoading(false);

      setAlerts("Saved Success!");
      setError(true);

      setTimeout(() => setError(false), 3000);
    } catch (error) {
      console.error("Failed to update device");
    }
  }; // 500 ms delay before triggering the update

  const saveChanges = async () => {
    try {
      if (confirm("Are you sure you want to save this?")) {
        const validUpdates = pendingChanges.updates.filter(
          (update) => Object.keys(update.changes).length > 0
        );

        await Promise.all(
          validUpdates.map((update) => debouncedUpdate(update))
        );

        // Save new devices
        await Promise.all(
          pendingChanges.additions.map((row) =>
            axios.post("/dataRoute/add-device", row)
          )
        );

        // Clear pending changes
        setPendingChanges({ updates: [], additions: [] });

        console.log("Changes saved and data refreshed.");
      } else {
        alert("You didn't save it!");
      }
    } catch (error) {
      console.error("Failed to save changes");
    }
  };

  const addNewRows = async () => {
    try {
      setAddLoading(true);
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
      setAddLoading(false);
      closeModal(); // Close modal after adding the rows
    } catch (error) {
      console.error("Failed to add new devices:");
    }
  };

  const deleteDevice = async (id) => {
    try {
      if (confirm("Are you sure you want to delete this?")) {
        await axios.delete(`/dataRoute/delete-device/${id}`);

        setData(data.filter((device) => device._id !== id));

        setAlerts("Deleted Success!");
        setError(true);

        setTimeout(() => setError(false), 3000);
      }
    } catch (error) {
      console.error("Failed to delete device:");
    }
  };

  const deleteRow = (rowIndex) => {
    setNewRows(newRows.filter((_, index) => index !== rowIndex));
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const filteredData = React.useMemo(() => {
    const matchesSearchTerm = (item) => {
      const searchValue = searchTerm.toLowerCase();

      return Object.values(item).some((value) =>
        value.toString().toLowerCase().includes(searchValue)
      );
    };

    const matchesBrand = (item) => {
      return selectedBrand === "All" || item.Brand === selectedBrand;
    };

    return data.filter((item) => {
      return matchesSearchTerm(item) && matchesBrand(item);
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

  function compare(a, b) {
    if (a.last_nom < b.last_nom) {
      return -1;
    }
    if (a.last_nom > b.last_nom) {
      return 1;
    }
    return 0;
  }

  const exportToXlsx = async () => {
    try {
      if (confirm("You want to export it right?")) {
        // Fetch data from the backend
        const response = await axios.get("/dataRoute/export/excel", {
          responseType: "json",
        });

        // Convert the response to JSON
        const data = response.data;

        const sorted = data.toSorted((a, b) => {
          console.log(b.No - a.No);
          return b.No - a.No;
        });

        // Convert JSON data to worksheet
        const worksheet = XLSX.utils.json_to_sheet(sorted);

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
        const headers = Object.keys(sorted[0]);
        for (let colIndex = 0; colIndex < totalColumns; colIndex++) {
          const cellAddress = XLSX.utils.encode_cell({ r: 0, c: colIndex });

          console.log(cellAddress);
          const headerValue = headers[colIndex]; // Default header if undefined
          if (!worksheet[cellAddress]) {
            worksheet[cellAddress] = { v: headerValue };
          }
          worksheet[cellAddress].s = headerStyle; // Set style to header cell
        }

        // Apply styles to the rest of the rows
        sorted.forEach((row, rowIndex) => {
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
          sorted.forEach((row) => {
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

        setAlerts("Exported Success!");
        setError(true);

        setTimeout(() => setError(false), 3000);
      }
    } catch (error) {
      //console.error("Error exporting data:", error.message);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === "s") {
        event.preventDefault(); // Prevent the default browser save action
        saveChanges();
      } else if (event.ctrlKey && event.key === "f") {
        //
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [saveChanges]);

  const styleInput = (key) => {
    const style = {};
    switch (key) {
      case "No":
        style["width"] = "70px";
        style["textAlign"] = "center";

        break;
      default:
        break;
    }

    return style;
  };

  if (loading) {
    return (
      <div className="mt-5 w-[1700px]">
        <LoadingTable />{" "}
      </div>
    );
  }

  return (
    <div className="md:w-[1700px] overflow-x-auto p-4">
      {(error && alerts === "Not Found!" && dangerAlerts(alerts)) ||
        (error &&
          alerts === "Saved Success!" &&
          successAlerts("Saved Successfully!")) ||
        (error &&
          alerts === "Deleted Success!" &&
          successAlerts("Deleted Successfully!")) ||
        (error &&
          alerts === "Exported Success!" &&
          successAlerts("Exported Successfully!"))}
      <div className="flex lg:flex-row flex-col">
        <div className="mb-4 flex items-center sm:flex-row flex-col">
          <input
            type="text"
            ref={findRef}
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="border rounded-md border-gray-300 p-2 sm:mr-4 sm:w-[700px] w-full sm:m-0 m-4"
          />
          <select
            value={selectedBrand}
            onChange={handleBrandFilterChange}
            className="border border-gray-300 rounded-md sm:max-w-[125px] w-full p-2 items-center"
          >
            <option value="All">All Brands</option>
            <option value="APPLE">APPLE</option>
            <option value="HP">HP</option>
            <option value="ACER">ACER</option>
            <option value="ASUS">ASUS</option>
            <option value="WINDOWS">WINDOWS</option>
          </select>
        </div>
        <div className="xl:flex hidden md:flex-row mb-5 gap-2">
          <button
            onClick={openModal}
            className="ml-3 px-3 py-2 text-[14px] bg-blue-500 text-white rounded hover:bg-blue-600 transition-all  items-center duration-300 flex gap-2"
          >
            <IoMdAdd />
            Add
          </button>
          <button
            onClick={exportToXlsx}
            className=" px-3 py-2 text-[14px] bg-green-500 text-white rounded hover:bg-green-600 transition-all duration-300 flex gap-2 items-center"
          >
            <FaRegFileExcel />
            Export
          </button>

          <button
            onClick={saveChanges}
            className="bg-yellow-400 text-[14px] flex items-center gap-2 hover:bg-yellow-500 transition-all duration-300 text-white px-3 py-2 rounded"
          >
            <FaRegSave></FaRegSave>
            Save
          </button>

          <button
            onClick={deleteRows}
            className="bg-red-400 text-[14px] hover:bg-red-500 flex items-center gap-2 transition-all duration-300 text-white px-3 py-2 rounded"
          >
            <FaTrash></FaTrash>
            Delete
          </button>
        </div>

        <div className="lg:hidden flex md:flex-row gap-2 mb-5 w-full justify-center">
          <button
            onClick={openModal}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all  items-center duration-300 flex gap-1 "
          >
            <IoMdAdd className="" />
          </button>
          <button
            onClick={exportToXlsx}
            className=" px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-all duration-300 flex gap-2 items-center"
          >
            <FaRegFileExcel className="" />
          </button>

          <button
            onClick={saveChanges}
            className="bg-yellow-400 hover:bg-yellow-500 transition-all duration-300 text-white px-4 py-2 rounded "
          >
            <FaRegSave></FaRegSave>
          </button>

          <button
            onClick={deleteRows}
            className="bg-red-400 hover:bg-red-500 transition-all duration-300 text-white px-4 py-2 rounded "
          >
            <FaTrash></FaTrash>
          </button>
        </div>

        {/*pendingChanges.updates.length > 0 ||
        pendingChanges.additions.length > 0 ? (
          <button
            onClick={saveChanges}
            className="bg-yellow-400 hover:bg-yellow-500 transition-all duration-300 text-white px-4 py-2 rounded ml-4"
          >
            Save Changes
          </button>
        ) : null*/}
      </div>
      <div className={` ${isModalOpen ? "bg-gray-800 pointer-events-auto" : "pointer-events-none"} transition bg-opacity-50 top-0 left-0 items-center w-full h-full fixed justify-center`}>
        <div
          className={`transition-transform ${
            isModalOpen ? "translate-y-0" : "translate-y-100"
          } items-center  bg-opacity-50 w-full h-full fixed justify-center`}
        >
          <div className="bg-white p-6 rounded shadow-lg w-[90%] max-h-[90vh] overflow-y-auto">
            <div className="flex">
              <h2 className="text-lg font-semibold mb-4">Add New Devices</h2>
            </div>

            {newRows.map((row, rowIndex) => (
              <div key={rowIndex} className="mb-4bg-slate-100 p-5 rounded-md">
                <h3 className="text-md font-medium mb-2">
                  Device {rowIndex + 1}
                </h3>
                <div className="md:flex md:flex-wrap gap-4">
                  {Object.keys(row).map((key) => (
                    <div key={key} className="md:flex-1  grid md:grid-cols-1">
                      <label className="block text-sm font-medium text-gray-700">
                        {key}
                      </label>
                      <input
                        type="text"
                        value={row[key]}
                        onChange={(e) =>
                          handleRowInputChange(rowIndex, key, e.target.value)
                        }
                        className="border border-gray-300 p-2 mt-1 w-full rounded-md"
                      />
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => deleteRow(rowIndex)}
                  className="bg-red-500 hover:bg-red-600 transition-colors 0.2s ease-in-out text-white px-4 py-1 rounded mt-2"
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
              className="bg-green-500 hover:bg-green-600 transition-colors text-white px-4 py-2 rounded mt-4"
            >
              Add Row
            </button>
            <button
              onClick={addNewRows}
              className="bg-blue-500 hover:bg-blue-600 transition-colors text-white px-4 py-2 rounded mt-4 ml-2"
            >
              {addLoading ? (
                <div className="flex gap-2">
                  <div>Loading...</div>
                </div>
              ) : (
                <div>Save</div>
              )}
            </button>
            <button
              onClick={closeModal}
              className="bg-gray-500 hover:bg-gray-600 transition-colors text-white px-4 py-2 rounded mt-4 ml-2"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <div className="w-full overflow-x-auto border border-gray-300 rounded-md ">
        <table className="min-w-full bg-white border border-gray-200">
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
                "Action",
              ].map((header) => (
                <th
                  key={header}
                  className="px-2 py-5 border-b-2 border-gray-300 text-left text-sm font-semibold text-gray-700 cursor-pointer"
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
                    className="py-1 border-b border-gray-300 text-sm text-gray-700"
                  >
                    <input
                      type="text"
                      value={device[key] || ""}
                      onChange={(e) => handleInputChange(index, key, e)}
                      style={styleInput(key)}
                      className={`lg:w-full w-[200px] ${key} rounded p-2`}
                    />
                  </td>
                ))}
                <td className="px-6 border-b border-gray-300 text-sm text-gray-700">
                  <button
                    onClick={() => deleteDevice(device._id)}
                    className="  text-white px-2 py-1 rounded"
                  >
                    
                    <FaTrash className="w-6 h-6 text-red-500 hover:text-red-600 transition-all 0.2s ease-in-out" ></FaTrash>

                    
                  </button>
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;

/*return (
    <div className="md:w-[1500px] overflow-x-auto p-4 ">
      {(error && alerts === "Not Found!" && dangerAlerts(alerts)) ||
        (error && alerts === "Saved Success!" && successAlerts("Saved Successfully!")) ||
        (error && alerts === "Deleted Success!" && successAlerts("Deleted Successfully!")) ||
        (error && alerts === "Exported Success!" && successAlerts("Exported Successfully!"))}
  
      <div className="flex lg:flex-row flex-col">
        <div className="mb-4 flex items-center sm:flex-row flex-col">
          <input
            type="text"
            ref={findRef}
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="border border-gray-400 p-2 sm:mr-4 sm:w-[700px] w-full sm:m-0 m-4 rounded-md"
          />
          <select
            value={selectedBrand}
            onChange={handleBrandFilterChange}
            className="border border-gray-400 sm:max-w-[125px] w-full p-2 rounded-md"
          >
            <option value="All">All Brands</option>
            <option value="APPLE">APPLE</option>
            <option value="HP">HP</option>
            <option value="ACER">ACER</option>
            <option value="ASUS">ASUS</option>
            <option value="WINDOWS">WINDOWS</option>
          </select>
        </div>
  
        <div className="xl:flex hidden md:flex-row mb-5 gap-2">
          <button
            onClick={openModal}
            className="ml-3 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-all duration-300 flex items-center gap-2"
          >
            <IoMdAdd />
            Add devices
          </button>
          <button
            onClick={exportToXlsx}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-all duration-300 flex items-center gap-2"
          >
            <FaRegFileExcel />
            Export
          </button>
          <button
            onClick={saveChanges}
            className="bg-gray-400 flex items-center gap-2 hover:bg-gray-500 transition-all duration-300 text-white px-4 py-2 rounded"
          >
            <FaRegSave />
            Save Changes
          </button>
          <button
            onClick={deleteRows}
            className="bg-red-500 hover:bg-red-600 flex items-center gap-2 transition-all duration-300 text-white px-4 py-2 rounded"
          >
            <FaTrash />
            Delete Rows
          </button>
        </div>
  
        <div className="lg:hidden flex md:flex-row gap-2 mb-5 w-full ">
          <button
            onClick={openModal}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-all duration-300 flex items-center gap-1"
          >
            <IoMdAdd />
          </button>
          <button
            onClick={exportToXlsx}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-all duration-300 flex items-center gap-2"
          >
            <FaRegFileExcel />
          </button>
          <button
            onClick={saveChanges}
            className="bg-gray-400 hover:bg-gray-500 transition-all duration-300 text-white px-4 py-2 rounded"
          >
            <FaRegSave />
          </button>
          <button
            onClick={deleteRows}
            className="bg-red-500 hover:bg-red-600 transition-all duration-300 text-white px-4 py-2 rounded"
          >
            <FaTrash />
          </button>
        </div>
      </div>
  
      <div
        className={`transition-transform ${
          isModalOpen ? "translate-y-0" : "translate-y-100"
        } items-center bg-gray-800 bg-opacity-50 fixed w-full h-full flex justify-center items-center`}
      >
        <div className="bg-white p-6 rounded shadow-lg w-[90%] max-h-[90vh] overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Add New Devices</h2>
          {newRows.map((row, rowIndex) => (
            <div key={rowIndex} className="mb-4 bg-gray-100 p-5 rounded-md">
              <h3 className="text-md font-medium mb-2">Device {rowIndex + 1}</h3>
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
                      className="border border-gray-400 p-2 mt-1 w-full rounded-md"
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
              ])
            }
            className="bg-green-500 hover:bg-green-600 transition-colors text-white px-4 py-2 rounded mt-4"
          >
            Add Another Row
          </button>
          <button
            onClick={addNewRows}
            className="bg-blue-500 hover:bg-blue-600 transition-colors text-white px-4 py-2 rounded mt-4 ml-2"
          >
            {addLoading ? (
              <div className="flex gap-2">
                <div>Loading...</div>
              </div>
            ) : (
              <div>Add Rows</div>
            )}
          </button>
          <button
            onClick={closeModal}
            className="bg-gray-500 hover:bg-gray-600 transition-colors text-white px-4 py-2 rounded mt-4 ml-2"
          >
            Cancel
          </button>
        </div>
      </div>
  
      <table className="min-w-full bg-gray-200 border border-gray-300">
        <thead>
          <tr className="bg-gray-300">
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
              "Action",
            ].map((header) => (
              <th
                key={header}
                className="px-2 py-5 border-b-2 border-gray-400 text-left text-sm font-semibold text-gray-700 cursor-pointer"
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
            <tr key={device._id} className="hover:bg-gray-200">
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
                <td key={key} className="py-1 border-b border-gray-400 text-sm text-gray-700">
                  <input
                    type="text"
                    value={device[key] || ""}
                    onChange={(e) => handleInputChange(index, key, e)}
                    className="lg:w-full w-[200px] rounded p-2 border border-gray-400"
                  />
                </td>
              ))}
              <td className="px-6 border-b border-gray-400 text-sm text-gray-700">
                <button
                  onClick={() => deleteDevice(device._id)}
                  className="bg-red-500 text-white px-4 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}  

export default Table;*/
