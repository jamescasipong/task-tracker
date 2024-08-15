import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

const Table = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'No', direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [newRows, setNewRows] = useState([
    {
      No: '', // This will be set later based on existing data
      SerialNumber: '',
      Brand: '',
      Model: '',
      Owner: '',
      Department: '',
      Owner_1: '',
      Department_1: '',
      Owner_2: '',
      Department_2: ''
    }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/");
        const fetchedData = response.data;


        // Ensure No field is a number
        const maxNo = fetchedData.reduce((max, item) => Math.max(max, Number(item.No) || 0), 0);
        setData(fetchedData);

        // Set initial No for new rows based on existing data
        setNewRows(prevRows => prevRows.map(row => ({ ...row, No: maxNo + 1 })));

        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSort = (key) => {
    const direction = (sortConfig.key === key && sortConfig.direction === 'asc') ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleBrandFilterChange = (e) => {
    setSelectedBrand(e.target.value);
  };

  const handleInputChange = (index, key, value) => {
    const updatedData = [...data];
    updatedData[index] = { ...updatedData[index], [key]: value };
    setData(updatedData);
    updateDevice(updatedData[index]._id, { [key]: value });
  };

  const handleRowInputChange = (rowIndex, key, value) => {
    const updatedRows = [...newRows];
    updatedRows[rowIndex] = { ...updatedRows[rowIndex], [key]: value };
    setNewRows(updatedRows);
  };

  const updateDevice = async (id, updatedData) => {
    try {
      await axios.put(`http://localhost:5000/update-device/${id}`, updatedData);
    } catch (error) {
      console.error('Failed to update device:', error);
    }
  };

  const addNewRows = async () => {
    try {
      const responses = await Promise.all(newRows.map(row => axios.post('http://localhost:5000/add-device', row)));
      setData([...data, ...responses.map(response => response.data)]);
      
      setNewRows([
        {
          No: Math.max(...newRows.map(item => Number(item.No) || 0), 0) + 1,
          SerialNumber: '',
          Brand: '',
          Model: '',
          Owner: '',
          Department: '',
          Owner_1: '',
          Department_1: '',
          Owner_2: '',
          Department_2: ''
        }
      ]);
      closeModal(); // Close modal after adding the rows
    } catch (error) {
      console.error('Failed to add new devices:', error);
    }
  };

  const deleteDevice = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/delete-device/${id}`);
      setData(data.filter(device => device._id !== id));
    } catch (error) {
      console.error('Failed to delete device:', error);
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
      const brandMatch = selectedBrand === 'All' || item.Brand === selectedBrand;
      return searchMatch && brandMatch;
    });
  }, [data, searchTerm, selectedBrand]);

  const sortedData = React.useMemo(() => {
    let sortableData = [...filteredData];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        const aNo = isNaN(Number(a[sortConfig.key])) ? a[sortConfig.key] : Number(a[sortConfig.key]);
        const bNo = isNaN(Number(b[sortConfig.key])) ? b[sortConfig.key] : Number(b[sortConfig.key]);

        if (aNo < bNo) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aNo > bNo) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [filteredData, sortConfig]);

  const exportToXlsx = () => {
    // Remove _id and __v from each item
    const filteredData = sortedData.map(({ _id, __v, ...rest }) => rest);
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Devices');
    XLSX.writeFile(workbook, 'devices_data.xlsx');
  };

  if (loading) {
    return (
      <div className="flex w-full justify-center">
        <div role="status" className="w-full animate-pulse">
          <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
          <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700  mb-2.5"></div>
          <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
          <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
          <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700  mb-2.5"></div>
          <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 "></div>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto p-4">
      <div className="mb-4 flex items-center">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="border border-gray-300 p-2 mr-4 w-[700px]"
        />
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
          className="bg-blue-500 text-white px-4 py-2 rounded ml-4"
        >
          Add New Devices
        </button>
        <button
          onClick={exportToXlsx}
          className="bg-green-500 text-white px-4 py-2 rounded ml-4"
        >
          Export to XLSX
        </button>
      </div>

      {isModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
    <div className="bg-white p-6 rounded shadow-lg w-[90%] max-h-[90vh] overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Add New Devices</h2>
      {newRows.map((row, rowIndex) => (
        <div key={rowIndex} className="mb-4">
          <h3 className="text-md font-medium mb-2">Device {rowIndex + 1}</h3>
          <div className="flex flex-wrap gap-4">
            {Object.keys(row).map((key) => (
              <div key={key} className="flex-1">
                <label className="block text-sm font-medium text-gray-700">{key}</label>
                <input
                  type="text"
                  value={row[key]}
                  onChange={(e) => handleRowInputChange(rowIndex, key, e.target.value)}
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
        onClick={() => setNewRows([...newRows, {
          No: Math.max(...newRows.map(item => Number(item.No) || 0), 0) + 1,
          SerialNumber: '', 
          Brand: '',
          Model: '',
          Owner: '',
          Department: '',
          Owner_1: '',
          Department_1: '',
          Owner_2: '',
          Department_2: ''
        }])}
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


      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            {['No', 'SerialNumber', 'Brand', 'Model', 'Owner', 'Department', 'Owner_1', 'Department_1', 'Owner_2', 'Department_2'].map((header) => (
              <th
                key={header}
                className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm font-semibold text-gray-700 cursor-pointer"
                onClick={() => handleSort(header)}
              >
                {header} {sortConfig.key === header ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
              </th>
            ))}
            <th className="px-6 py-3 border-b-2 border-gray-300"></th> {/* For delete button */}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((device, index) => (
            <tr key={device._id} className="hover:bg-gray-100">
              {['No', 'SerialNumber', 'Brand', 'Model', 'Owner', 'Department', 'Owner_1', 'Department_1', 'Owner_2', 'Department_2'].map((key) => (
                <td key={key} className="px-6 py-4 border-b border-gray-300 text-sm text-gray-700">
                  <input
                    type="text"
                    value={device[key] || ''}
                    onChange={(e) => handleInputChange(index, key, e.target.value)}
                    className="w-full"
                  />

                </td>
              ))}
              <td className="px-6 py-4 border-b border-gray-300 text-sm text-gray-700">
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
};

export default Table;
