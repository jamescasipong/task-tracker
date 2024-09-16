import axios from "axios";
import React, { useEffect, useState } from "react";
import { CiViewTable } from "react-icons/ci";
import { FaEdit, FaEye, FaEyeSlash, FaPlus, FaRegSave, FaTrash } from "react-icons/fa";
import { MdFileDownload } from "react-icons/md";
import XLSX from "xlsx-js-style"; // Import xlsx



const PaymentTable = () => {
  const [tables, setTables] = useState([]);
  const [isTableVisible, setIsTableVisible] = useState({});
  const [newTableName, setNewTableName] = useState("");
  const [editingTableIndex, setEditingTableIndex] = useState(null);
  const [editedTableName, setEditedTableName] = useState("");
  const [loading, setLoading] = useState(true);

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
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (tableIndex, rowIndex, monthIndex, event) => {
    const updatedTables = [...tables];
    updatedTables[tableIndex].rows[rowIndex].values[monthIndex] = event.target.value;
    setTables(updatedTables);
  };

  const exportToXLSX = async () => {
    try {
      const response = await axios.get("/payments/get", { responseType: "json" });
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
    } catch (error) {
      console.error("Error exporting data:", error.message);
    }
  };

  const addRow = (tableIndex) => {
    let newYear;

    if (tables[tableIndex].rows.length === 0) {
      newYear = 2024;
    } else {
      const lastYear = parseInt(
        tables[tableIndex].rows[tables[tableIndex].rows.length - 1].months[0].split(" ")[1],
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

    const newMonths = [
      `January ${newYear}`, `February ${newYear}`, `March ${newYear}`, `April ${newYear}`,
      `May ${newYear}`, `June ${newYear}`, `July ${newYear}`, `August ${newYear}`,
      `September ${newYear}`, `October ${newYear}`, `November ${newYear}`, `December ${newYear}`,
    ];

    const updatedTables = [...tables];
    updatedTables[tableIndex].rows.push({
      months: newMonths,
      values: Array(12).fill(""),
    });
    setTables(updatedTables);

    enableTable(tableIndex);
  };

  const deleteRow = (tableIndex, rowIndex) => {
    const updatedTables = [...tables];
    updatedTables[tableIndex].rows = updatedTables[tableIndex].rows.filter(
      (_, index) => index !== rowIndex
    );
    setTables(updatedTables);
  };

  const addTable = () => {
    if (!newTableName.trim()) {
      alert("Please enter a table name.");
      return;
    }

    const newTableIndex = tables.length;
    const newMonths = [
      `January ${2024}`, `February ${2024}`, `March ${2024}`, `April ${2024}`,
      `May ${2024}`, `June ${2024}`, `July ${2024}`, `August ${2024}`,
      `September ${2024}`, `October ${2024}`, `November ${2024}`, `December ${2024}`,
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
      const firstTableIndex = Math.min(...Object.keys(updatedVisibility).map(Number));
      setIsTableVisible({ [firstTableIndex]: true });
    }
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
      console.log("Saving the following data:", tables);
      const response = await axios.post("/payments/save", { tables });

      alert(response.data.message);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const enableTable = (index) => {
    setIsTableVisible({
      ...isTableVisible,
      [index]: true,
    });
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen gap-2">
        <div>Loading... </div>
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-4 flex gap-2 items-center">
        <input
          type="text"
          placeholder="New table name"
          value={newTableName}
          onChange={(e) => setNewTableName(e.target.value)}
          className="px-2 py-1 border rounded"
        />
        <button
          onClick={addTable}
          className="ml-2 px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 flex gap-2 items-center"
        >
          Add Table
          <CiViewTable />
        </button>
        <button
          onClick={exportToXLSX}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex gap-2 items-center"
        >
          <MdFileDownload />
          Export
        </button>
        <button
          onClick={saveData}
          className=" px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex gap-2 items-center"
        >
          Save
          <FaRegSave />

        </button>
      </div>
      {tables.map((table, tableIndex) => (
        <div
          key={tableIndex}
          className="mb-4 overflow-hidden shadow-lg border rounded-lg"
        >
          <table className="min-w-full bg-white border flex flex-col overflow-x-auto">
            <thead className="bg-blue-500 text-white w-full">
              <tr className="flex">
                <th className="py-3 px-4 flex justify-between items-center gap-5">
                  <span className="text-[22px]">{table.name}</span>
                  <div className="flex items-center gap-2">
                    {editingTableIndex === tableIndex ? (
                      <>
                        <input
                          type="text"
                          value={editedTableName}
                          onChange={(e) => setEditedTableName(e.target.value)}
                          className="px-2 py-1 border rounded"
                        />
                        <button
                          onClick={() => renameTable(tableIndex)}
                          className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          <FaRegSave />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setEditingTableIndex(tableIndex)}
                          className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        >
                          
                          <FaEdit className="w-6 h-6"/>
                        </button>
                        <button
                          onClick={() => removeTable(tableIndex)}
                          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          <FaTrash className="w-6 h-6"/>
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => toggleTableVisibility(tableIndex)}
                      className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      {isTableVisible[tableIndex] ? <FaEyeSlash className="w-6 h-6"/> : <FaEye className="w-6 h-6"/>}
                    </button>
                    <button
                    onClick={() => addRow(tableIndex)}
                    className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 "
                  >
                    <FaPlus className="w-6 h-6"/>
                  </button>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody
              style={getTableBodyStyle(tableIndex)}
              className="transition-all duration-500 ease-in-out"
            >
              {table.rows.map((row, rowIndex) => (
                <React.Fragment key={rowIndex}>
                  <tr>
                    {row.months.map((month, monthIndex) => (
                      <th
                        key={monthIndex}
                        className="py-2 px-4 border text-center bg-gray-200"
                      >
                        {month}
                      </th>
                    ))}
                    <th className="py-2 px-4 border text-center bg-gray-200">Actions</th>
                  </tr>
                  <tr>
                    {row.values.map((value, monthIndex) => (
                      <td key={monthIndex} className="py-2 px-4 border">
                        <input
                          type="text"
                          placeholder={`Amount`}
                          value={value}
                          onChange={(event) =>
                            handleInputChange(tableIndex, rowIndex, monthIndex, event)
                          }
                          className="w-full px-2 py-1 border rounded"
                        />
                      </td>
                    ))}
                    <td className="py-2 px-4 border text-center">
                      <button
                        onClick={() => deleteRow(tableIndex, rowIndex)}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        <FaTrash className="w-5 h-5"/>
                      </button>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      ))}
      
    </div>
  );
};

export default PaymentTable;
