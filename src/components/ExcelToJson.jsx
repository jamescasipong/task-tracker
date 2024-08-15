import React, { useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

const ExcelToJson = () => {
  const [jsonData, setJsonData] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convert sheet to JSON
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      // Set JSON data to state
      setJsonData(jsonData);
    };

    reader.readAsArrayBuffer(file);
  };

  const downloadJson = () => {
    if (!jsonData) return;

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'output.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const copyJson = () => {
    if (!jsonData) return;

    navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2))
      .then(() => alert('JSON copied to clipboard!'))
      .catch((error) => alert('Failed to copy JSON: ' + error));
  };

  const sendToDatabase = () => {
    if (!jsonData) return;

    axios.post('http://localhost:5000/api/data', jsonData)
      .then(() => alert('Data successfully sent to the database!'))
      .catch((error) => alert('Failed to send data: ' + error));
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md border border-gray-300">
      <h2 className="text-lg font-semibold mb-4">Excel to JSON Converter</h2>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileChange}
        className="mb-4 p-2 border border-gray-300 rounded-md w-full"
      />
      {jsonData && (
        <div className="mb-4">
          <div className="flex gap-4 mb-4">
            <button
              onClick={downloadJson}
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
            >
              Download JSON
            </button>
            <button
              onClick={copyJson}
              className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition"
            >
              Copy JSON
            </button>
            <button
              onClick={sendToDatabase}
              className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition"
            >
              Send to Database
            </button>
          </div>
          <pre className="p-4 bg-gray-100 border border-gray-300 rounded-md overflow-x-auto">
            {JSON.stringify(jsonData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ExcelToJson;
