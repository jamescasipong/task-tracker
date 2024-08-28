import React, { useState, useEffect } from "react";
import axios from "axios";

const PaymentTable = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/payments/get");
        const data = response.data.rows; // Adjusting based on the response data structure
        setRows(data || []); // Handle cases where `data` might be undefined
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (rowIndex, monthIndex, event) => {
    const values = [...rows];
    values[rowIndex].values[monthIndex] = event.target.value;
    setRows(values);
  };

  const addRow = () => {
    let newYear;

    if (rows.length === 0) {
      // Start with January 2024 if no rows exist
      newYear = 2024;
    } else {
      // Get the year of the last row and increment
      const lastYear = parseInt(
        rows[rows.length - 1].months[0].split(" ")[1],
        10
      );
      newYear = lastYear + 1;
    }

    // Check if a row for the new year already exists
    const existingYearRow = rows.find((row) =>
      row.months[0].includes(newYear.toString())
    );

    if (existingYearRow) {
      // If a row for the new year already exists, prevent adding another one
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

    // Add only the new year's months and corresponding values
    setRows([...rows, { months: newMonths, values: Array(12).fill("") }]);
  };

  const saveData = async () => {
    try {
      console.log("Saving the following data:", rows);
      const response = await axios.post("/api/payments/save", { rows });
      alert(response.data.message);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <div className="p-4">
      <div className="text-center text-2xl font-bold mb-4">Monthly Payment</div>
      <table className="min-w-full bg-white border">
        <thead></thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              <tr>
                {row.values.map((value, monthIndex) => (
                  <td key={monthIndex} className="py-2 px-4 border">
                    <input
                      type="text"
                      placeholder={`Enter amount for ${row.months[monthIndex]}`}
                      value={value}
                      onChange={(event) =>
                        handleInputChange(rowIndex, monthIndex, event)
                      }
                      className="w-full px-2 py-1 border rounded"
                    />
                  </td>
                ))}
              </tr>
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
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <button
        onClick={addRow}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add Row
      </button>
      <button
        onClick={saveData}
        className="mt-4 ml-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Save Data
      </button>
    </div>
  );
};

export default PaymentTable;
