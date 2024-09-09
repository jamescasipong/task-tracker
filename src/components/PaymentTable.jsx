  import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaEdit, FaEye, FaEyeSlash, FaPlus, FaTrash } from "react-icons/fa"; // Import icons

  const PaymentTable = () => {
    const [tables, setTables] = useState([]);
    const [isTableVisible, setIsTableVisible] = useState({});
    const [newTableName, setNewTableName] = useState(""); // State for new table name
    const [editingTableIndex, setEditingTableIndex] = useState(null); // Index of the table being edited
    const [editedTableName, setEditedTableName] = useState(""); // New name for the table

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get("http://localhost:3002/api/payments/get");
          const data = response.data.tables || [];
          setTables(data);

          // Set visibility state for each table
          const visibility = {};
          data.forEach((_, index) => {
            visibility[index] = index === 0; // Show only the first table initially
          });
          setIsTableVisible(visibility);
        } catch (error) {
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
      updatedTables[tableIndex].rows.push({ months: newMonths, values: Array(12).fill("₱") });
      setTables(updatedTables);
    };

    const deleteRow = (tableIndex, rowIndex) => {
      const updatedTables = [...tables];
      updatedTables[tableIndex].rows = updatedTables[tableIndex].rows.filter((_, index) => index !== rowIndex);
      setTables(updatedTables);
    };

    const addTable = () => {
      if (!newTableName.trim()) {
        alert("Please enter a table name.");
        return;
      }

      const newTableIndex = tables.length + 1;
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

      setTables([...tables, { name: newTableName, rows: [{ months: newMonths, values: Array(12).fill("₱") }] }]);
      setNewTableName(""); // Clear the input field after adding

      // Show the newly added table by default
      setIsTableVisible(prevState => ({ ...prevState, [tables.length]: true }));
    };

    const removeTable = (tableIndex) => {
      const updatedTables = tables.filter((_, index) => index !== tableIndex);
      setTables(updatedTables);

      // Update visibility state to remove the table's visibility
      const updatedVisibility = { ...isTableVisible };
      delete updatedVisibility[tableIndex];
      setIsTableVisible(updatedVisibility);

      // Ensure at least one table is visible
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
        setEditingTableIndex(null); // Exit edit mode
        setEditedTableName(""); // Clear the input field
      } else {
        alert("Table name cannot be empty.");
      }
    };

    const saveData = async () => {
      try {
        console.log("Saving the following data:", tables);
        const response = await axios.post("http://localhost:3002/api/payments/save", { tables });
        alert(response.data.message);
      } catch (error) {
        console.error("Error saving data:", error);
      }
    };

    const toggleTableVisibility = (index) => {
      setIsTableVisible({
        ...isTableVisible,
        [index]: !isTableVisible[index],
      });
    };

    return (
      <div className="p-4">
        <div className="mb-4 flex items-center gap-2">
          <input
            type="text"
            value={newTableName}
            onChange={(e) => setNewTableName(e.target.value)}
            placeholder="Enter table name"
            className="px-4 py-2 border rounded"
          />
          <button
            onClick={addTable}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all duration-300"
          >
            Add Table
          </button>
          <button
            onClick={saveData}
            className="ml-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-all duration-300"
          >
            Save Data
          </button>
        </div>
        {tables.map((table, tableIndex) => (
          <div key={tableIndex} className="mb-4 overflow-hidden shadow-lg border rounded-lg">
            <table className="min-w-full bg-white border flex flex-col">
              <thead className="bg-blue-500 text-white w-full">
                <tr className="flex">
                  <th className=" py-3 px-4 flex justify-between items-center gap-5">
                    <div className="flex items-center">
                      {editingTableIndex === tableIndex ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editedTableName}
                            onChange={(e) => setEditedTableName(e.target.value)}
                            placeholder="Rename table"
                            className="px-4 py-2 border rounded text-black"
                          />
                          <button
                            onClick={() => renameTable(tableIndex)}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-all duration-300"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <span className="text-xl font-bold">{table.name}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {editingTableIndex === tableIndex ? (
                        <button
                          onClick={() => setEditingTableIndex(null)}
                          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-all duration-300"
                        >
                          Cancel
                        </button>
                      ) : (
                        <button
                          onClick={() => setEditingTableIndex(tableIndex)}
                          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded transition-all duration-300"
                        >
                          <FaEdit className="w-6 h-6" />
                        </button>
                      )}
                      <button
                        onClick={() => toggleTableVisibility(tableIndex)}
                        className="text-sm px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-all duration-300 ease-in-out transform hover:scale-105"
                      >
                        {isTableVisible[tableIndex] ? (
                          <FaEyeSlash className="w-6 h-6" /> // Eye slash icon when visible
                        ) : (
                          <FaEye className="w-6 h-6" /> // Eye icon when hidden
                        )}
                      </button>
                      <button
                        onClick={() => removeTable(tableIndex)}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-all duration-300"
                      >
                        <FaTrash className="w-6 h-6" /> 
                      </button>
                      <button
  onClick={() => addRow(tableIndex)}
  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all duration-300 flex items-center gap-2"
>
  <FaPlus className="w-5 h-5" />
  <span className="sr-only">Add Row</span>
</button>

                    </div>
                  </th>
                </tr>
              </thead>

              {isTableVisible[tableIndex] && (
                <tbody
                  className="transition-all duration-500 ease-in-out transform"
                  style={{
                    maxHeight: isTableVisible[tableIndex] ? "100%" : "0",
                    opacity: isTableVisible[tableIndex] ? 1 : 0,
                  }}
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
                      </tr>
                      <tr>
                        {row.values.map((value, monthIndex) => (
                          <td key={monthIndex} className="py-2 px-4 border">
                            <input
                              type="text"
                              placeholder={`Enter amount for ${row.months[monthIndex]}`}
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
                            Delete
                          </button>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              )}
            </table>
            
          </div>
        ))}
      </div>
    );
  };

  export default PaymentTable;
