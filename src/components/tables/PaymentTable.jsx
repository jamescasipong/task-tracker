import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FaEdit,
  FaEye,
  FaEyeSlash,
  FaPlus,
  FaRegSave,
  FaTrash,
} from "react-icons/fa";
import { FaFilePdf } from "react-icons/fa6";


import { MdCancelPresentation, MdFileDownload } from "react-icons/md";
import XLSX from "xlsx-js-style"; // Import xlsx
import LoadingTable from "../loading/LoadingTable";

const PaymentTable = () => {
  const [tables, setTables] = useState([]);
  const [isTableVisible, setIsTableVisible] = useState({});
  const [newTableName, setNewTableName] = useState("");
  const [editingTableIndex, setEditingTableIndex] = useState(null);
  const [editedTableName, setEditedTableName] = useState("");
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark" ? true : false
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/payments/get");
        const data = response.data.tables || [];
        setTables(data);

        // Set visibility state for each table
        const visibility = {};
        data.forEach((_, index) => {
          visibility[index] = index === 0; // Show only the first table initially
        });
        setIsTableVisible(visibility);

        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching data:");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleInputChange = (tableIndex, rowIndex, monthIndex, event) => {
    const updatedTables = [...tables];
    updatedTables[tableIndex].rows[rowIndex].values[monthIndex] =
      event.target.value;
    setTables(updatedTables);
  };

  const exportToXLSX = async () => {
    try {
      if (confirm("Are you sure you want to export this data?")) {
      const response = await axios.get("/payments/get", {
        responseType: "json",
      });
      const tablesData = response.data.tables;
      const exportData = [];
      const merges = [];

      let rowIndex = 0;

      tablesData.forEach((table) => {
        exportData.push(Array(12).fill(""));
        exportData[rowIndex][0] = table.name;

        merges.push({
          s: { r: rowIndex, c: 0 },
          e: { r: rowIndex, c: 11 },
        });

        rowIndex += 1;

        table.rows.forEach((row) => {
          exportData.push(row.months);
          exportData.push(row.values);
          rowIndex += 2;
        });

        exportData.push(Array(12).fill(""));
        rowIndex += 1;
      });

      const worksheet = XLSX.utils.aoa_to_sheet(exportData);

      const headerStyle = {
        font: { bold: true, sz: 14 },
        fill: { fgColor: { rgb: "FFFF00" } },
        alignment: { horizontal: "center", vertical: "center" },
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } },
        },
      };

      const cellStyle = {
        font: { sz: 12 },
        alignment: { horizontal: "center", vertical: "center" },
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } },
        },
      };

      const keys = Object.keys(worksheet);
      keys.forEach((key) => {
        if (key[0] === "!") return;
        const cell = worksheet[key];
        cell.s = cellStyle;
      });

      worksheet["!merges"] = merges;

      const columnWidths = exportData.reduce((widths, row) => {
        row.forEach((cell, colIndex) => {
          if (cell) {
            const cellLength = cell.toString().length;
            widths[colIndex] = Math.max(widths[colIndex] || 0, cellLength);
          }
        });
        return widths;
      }, []);

      worksheet["!cols"] = columnWidths.map((width) => ({
        wch: width + 2,
      }));

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Payment Data");
      XLSX.writeFile(workbook, "Payment Data.xlsx");
    }
    } catch (error) {
      //console.error("Error exporting data:", error.message);
    }
  };

  const addRow = (tableIndex) => {
    let newYear;

    if (confirm("Add specific year or no?")) {
      newYear = Number(prompt("Please enter a year:", ""));
    } else {
      if (tables[tableIndex].rows.length === 0) {
        newYear = 2024;
      } else {
        const lastYear = parseInt(
          tables[tableIndex].rows[
            tables[tableIndex].rows.length - 1
          ].months[0].split(" ")[1],
          10
        );
        newYear = lastYear + 1;
      }

      const existingYearRow = tables[tableIndex].rows.find((row) =>
        row.months[0].includes(newYear.toString())
      );

      if (existingYearRow) {
        return;
      }
    }

    const newMonths = [
      `January ${newYear}`,
      `February ${newYear}`,
      `March ${newYear}`,
      `April ${newYear}`,
      `May ${newYear}`,
      `June ${newYear}`,
      `July ${newYear}`,
      `August ${newYear}`,
      `September ${newYear}`,
      `October ${newYear}`,
      `November ${newYear}`,
      `December ${newYear}`,
    ];

    const updatedTables = [...tables];
    updatedTables[tableIndex].rows.push({
      months: newMonths,
      values: Array(12).fill(""),
    });
    setTables(updatedTables);

    setIsTableVisible((prevState) => ({ ...prevState, [tableIndex]: true }));
  };

  const deleteRow = (tableIndex, rowIndex) => {
    if (confirm("Are you sure you want to delete ?")) {
      const updatedTables = [...tables];
      updatedTables[tableIndex].rows = updatedTables[tableIndex].rows.filter(
        (_, index) => index !== rowIndex
      );
      setTables(updatedTables);
    }
  };

  const addTable = () => {
    if (!newTableName.trim()) {
      alert("Please enter a table name.");
      return;
    }

    const newTableIndex = tables.length;
    const newMonths = [
      `January ${2024}`,
      `February ${2024}`,
      `March ${2024}`,
      `April ${2024}`,
      `May ${2024}`,
      `June ${2024}`,
      `July ${2024}`,
      `August ${2024}`,
      `September ${2024}`,
      `October ${2024}`,
      `November ${2024}`,
      `December ${2024}`,
    ];

    setTables([
      ...tables,
      {
        name: newTableName,
        rows: [{ months: newMonths, values: Array(12).fill("") }],
      },
    ]);
    setNewTableName("");

    setIsTableVisible((prevState) => ({ ...prevState, [newTableIndex]: true }));
  };

  const removeTable = (tableIndex) => {
    const updatedTables = tables.filter((_, index) => index !== tableIndex);
    setTables(updatedTables);

    const updatedVisibility = { ...isTableVisible };
    delete updatedVisibility[tableIndex];
    setIsTableVisible(updatedVisibility);

    if (updatedTables.length > 0) {
      const firstTableIndex = Math.min(
        ...Object.keys(updatedVisibility).map(Number)
      );
      setIsTableVisible({ [firstTableIndex]: true });
    }
  };

  const toggleTableVisibility = (index) => {
    setIsTableVisible({
      ...isTableVisible,
      [index]: !isTableVisible[index],
    });
  };

  const getTableBodyStyle = (tableIndex) => {
    return {
      maxHeight: isTableVisible[tableIndex] ? "500px" : "0", // Adjust maxHeight as needed
      opacity: isTableVisible[tableIndex] ? 1 : 0,
      transition: "max-height 0.5s ease-in-out, opacity 0.5s ease-in-out",
    };
  };

  const renameTable = (tableIndex) => {
    if (editedTableName.trim()) {
      const updatedTables = [...tables];
      updatedTables[tableIndex].name = editedTableName;
      setTables(updatedTables);
      setEditingTableIndex(null);
      setEditedTableName("");
    } else {
      alert("Table name cannot be empty.");
    }
  };

  const saveData = async () => {
    try {
      if (confirm("Are you sure you want to save this?")) {
        console.log("Saving the following data:", tables);

        setLoading(true);
        const response = await axios.post("/payments/save", { tables });

        setLoading(false);
        alert(response.data.message);
      } else {
        alert("You didn't save it!");
      }
    } catch (error) {
      console.error("Error saving data:");
    }
  };

  return (
    <div
      className={`clg:w-[1700px] w-full min-h-screen p-4 ${
        darkMode ? "dark bg-gray-800 text-white" : "light bg-white text-black"
      }`}
    >
      <div className="flex justify-between items-center">
        {/*<button
          className="px-4 py-2 bg-indigo-500 text-white rounded-md"
          onClick={() => setDarkMode(!darkMode)}
        >
          Toggle {darkMode ? "Light" : "Dark"} Mode
        </button>*/}
      </div>

      {loading ? (
        <LoadingTable />
      ) : (
        <>
          <div className="sm:block hidden">
            <input
              type="text"
              value={newTableName}
              onChange={(e) => setNewTableName(e.target.value)}
              placeholder="Enter new table name"
              className={`border rounded-md p-2 mr-2 w-full md:w-[250px] ${
                darkMode
                  ? "dark:bg-gray-800 dark:text-white dark:border-gray-600"
                  : "text-black"
              }`}
            />
            <button
              onClick={addTable}
              className="bg-blue-500 hover:bg-blue-600 transition-colors duration-300 text-[14px] text-white px-3 py-2 rounded-md"
            >
              <FaPlus className="inline-block mr-2" />
              Add
            </button>

            <button
              onClick={exportToXLSX}
              className="px-3 py-2 bg-green-500 hover:bg-green-600 transition-colors text-[14px] duration-300 text-white rounded-md mb-4 ml-2"
            >
              <MdFileDownload className="inline-block mr-2" />
              Export
            </button>

            <button
              onClick={saveData}
              className="bg-red-500 hover:bg-red-600 transition-colors duration-300 text-[14px] text-white px-3 py-2 rounded-md mt-4 ml-2"
            >
              <FaRegSave className="inline-block mr-2" />
              Save
            </button>
          </div>

          <div className="flex sm:hidden flex-col gap-4 p-2 max-w-md mx-auto">
            <input
              type="text"
              value={newTableName}
              onChange={(e) => setNewTableName(e.target.value)}
              placeholder="Enter new table name"
              className={`border rounded-md p-2 w-full ${
                darkMode
                  ? "dark:bg-gray-800 dark:text-white dark:border-gray-600"
                  : "text-black border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />

            <div className="flex flex-row sm:flex-row justify-center sm:justify-between gap-2">
              <button
                onClick={addTable}
                className="bg-blue-500 hover:bg-blue-600 transition-colors duration-300 text-white px-4 py-2 rounded-md flex items-center justify-center"
              >
                <FaPlus className="" />
                
              </button>

              <button
                onClick={exportToXLSX}
                className="bg-green-500 hover:bg-green-600 transition-colors duration-300 text-white px-4 py-2 rounded-md flex items-center justify-center"
              >
                <MdFileDownload className="" />
                
              </button>

              <button
                onClick={saveData}
                className="bg-red-500 hover:bg-red-600 transition-colors duration-300 text-white px-4 py-2 rounded-md flex items-center justify-center"
              >
                <FaRegSave className="" />
                
              </button>
            </div>
          </div>

          {tables.map((table, tableIndex) => (
            <div
              key={tableIndex}
              className="mt-4 border p-4 rounded-md overflow-auto"
            >
              <div className={`flex gap-5 items-center  ${editingTableIndex === tableIndex ? "sm:flex-row flex-col ": ""} `}>
                {editingTableIndex === tableIndex ? (
                  <>
                    <input
                      type="text"
                      value={editedTableName}
                      placeholder="Enter a new name"
                      onChange={(e) => setEditedTableName(e.target.value)}
                      className={`border p-2 ${
                        darkMode
                          ? "dark:bg-gray-800 dark:text-white border-gray-600"
                          : "text-black "
                      }`}
                    />
                    <div>
                      <button
                        onClick={() => renameTable(tableIndex)}
                        className="bg-green-500 hover:bg-green-600 transition-colors duration-300 text-white px-3 py-2 rounded-md mr-2"
                      >
                        <FaRegSave />
                      </button>
                      <button
                        onClick={() => setEditingTableIndex(null)}
                        className="bg-red-500 hover:bg-red-600 transition-colors duration-300  text-white px-3 py-2 rounded-md"
                      >
                        <MdCancelPresentation />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-[18px] font-bold">{table.name}</h2>
                    <div>
                      <button
                        onClick={() => setEditingTableIndex(tableIndex)}
                        className="bg-yellow-500 text-white px-3 py-2 hover:bg-yellow-600 transition-colors duration-300 ease-in-out rounded-md mr-2"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => removeTable(tableIndex)}
                        className="bg-red-500 hover:bg-red-600 transition-colors duration-300 text-white px-3 py-2 rounded-md"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={() => toggleTableVisibility(tableIndex)}
                className="bg-indigo-500 hover:bg-indigo-600 transition-colors duration-300 text-white px-3 py-2 rounded-md mb-4 text-[14px]"
              >
                {isTableVisible[tableIndex] ? (
                  <>
                    <FaEyeSlash className="inline-block mr-2" />
                    Hide Table
                  </>
                ) : (
                  <>
                    <FaEye className="inline-block mr-2" />
                    Show Table
                  </>
                )}
              </button>

              <button
                onClick={() => addRow(tableIndex)}
                className="bg-blue-500 hover:bg-blue-600 transition-colors duration-300 text-white px-3 py-2 rounded-md mt-4 ml-2 text-[14px]"
              >
                <FaPlus className="inline-block mr-2" />
                Add Row
              </button>

              <div className={`${isTableVisible[tableIndex] ? "overflow-x-auto" : "overflow-x-hidden"}`}>
                <table className="min-w-full border flex flex-col">
                  <tbody
                    style={getTableBodyStyle(tableIndex)}
                    className="transition-all duration-500 ease-in-out"
                  >
                    {table.rows
                      .sort((a, b) => {
                        const yearA = parseInt(a.months[0].split(" ")[1], 10);
                        const yearB = parseInt(b.months[0].split(" ")[1], 10);
                        return yearA - yearB;
                      })
                      .map((row, rowIndex) => (
                        <React.Fragment key={rowIndex}>
                          <tr>
                            {row.months.map((month, monthIndex) => (
                              <th
                                key={monthIndex}
                                className={`py-2 px-4 border min-w-[100px] text-center ${
                                  darkMode
                                    ? "dark:bg-gray-700 dark:text-white"
                                    : "bg-gray-200 text-[13px]"
                                }`}
                              >
                                {month}
                              </th>
                            ))}
                            <th
                              className={`py-2 px-4 border text-center ${
                                darkMode
                                  ? "dark:bg-gray-700 dark:text-white"
                                  : "bg-gray-200 text-[13px]"
                              }`}
                            >
                              Actions
                            </th>
                          </tr>
                          <tr>
                            {row.values.map((value, monthIndex) => (
                              <td
                                key={monthIndex}
                                className={`py-2 px-2 border text-[13px] ${
                                  darkMode
                                    ? "dark:border-gray-600"
                                    : "border-gray-200"
                                }`}
                              >
                               <div className="flex flex-row gap-2 items-center">
                                <input
                                  type="text"
                                  placeholder={`Amount`}
                                  value={value}
                                  onChange={(event) =>
                                    handleInputChange(
                                      tableIndex,
                                      rowIndex,
                                      monthIndex,
                                      event
                                    )
                                  }
                                  className={`w-full px-2 py-2 text-center border rounded ${
                                    darkMode
                                      ? "dark:bg-gray-800 dark:text-white dark:border-gray-600"
                                      : "text-black"
                                  }`}
                                />
                                <div className=" h-full rounde-lg "><FaFilePdf onClick={() => {location.href="#"}} className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-600"></FaFilePdf></div>
                                
                                </div> 
                              </td>
                            ))}
                            <td className="py-2 px-4 border text-center">
                              <button
                                onClick={() => deleteRow(tableIndex, rowIndex)}
                                className="px-2 py-1  "
                              >
                                <FaTrash className="w-5 h-5 text-red-500 hover:text-red-600" />
                              </button>
                            </td>
                          </tr>
                        </React.Fragment>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default PaymentTable;