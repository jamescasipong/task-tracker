import React from "react";

const Documentation = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Table Component Documentation</h1>

      <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
      <p className="text-lg mb-6">
        This component is designed to manage a list of devices, allowing users
        to add, update, sort, and delete entries. It also supports exporting the
        data to an XLSX file format.
      </p>

      <h2 className="text-2xl font-semibold mb-4">How to Use</h2>

      <h3 className="text-xl font-semibold mb-2">1. Fetch Data</h3>
      <p className="text-lg mb-4">
        The component fetches data from an API endpoint <code>/dataRoute/</code>
        . Ensure your backend provides a valid API endpoint that returns device
        data in JSON format.
      </p>

      <h3 className="text-xl font-semibold mb-2">2. Add New Rows</h3>
      <p className="text-lg mb-4">
        To add new devices, click the "Add devices" button. A modal will appear,
        allowing you to enter multiple devices at once. Each new row will
        automatically generate a sequential "No" value.
      </p>

      <h3 className="text-xl font-semibold mb-2">3. Sorting</h3>
      <p className="text-lg mb-4">
        You can sort the table by clicking on the column headers. The sorting
        order (ascending/descending) will be toggled each time you click a
        header.
      </p>

      <h3 className="text-xl font-semibold mb-2">4. Filtering by Brand</h3>
      <p className="text-lg mb-4">
        Use the brand filter dropdown to display devices from a specific brand.
        The default option is set to display all brands.
      </p>

      <h3 className="text-xl font-semibold mb-2">5. Export to XLSX</h3>
      <p className="text-lg mb-4">
        Click the "Export" button to download the current table data as an Excel
        file. The data is styled with headers and borders for better
        readability.
      </p>

      <h3 className="text-xl font-semibold mb-2">6. Save Changes</h3>
      <p className="text-lg mb-4">
        After editing or adding new devices, click the "Save Changes" button to
        update the data. The changes will be sent to the API to update the
        backend database.
      </p>

      <h2 className="text-2xl font-semibold mb-4">Keyboard Shortcuts</h2>
      <p className="text-lg mb-6">
        You can press <code>Ctrl + S</code> to save your changes directly from
        the keyboard.
      </p>

      <h2 className="text-2xl font-semibold mb-4">Dependencies</h2>
      <p className="text-lg mb-4">The following libraries are used:</p>
      <ul className="list-disc pl-8 mb-6">
        <li>Axios: To fetch and send data to the backend.</li>
        <li>
          XLSX-js-style: To export the table data to Excel with custom styles.
        </li>
        <li>
          React Icons: Icons are used in buttons for adding rows and exporting.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mb-4">Backend API Endpoints</h2>
      <p className="text-lg mb-6">
        Ensure the following API endpoints are set up on your backend:
      </p>
      <ul className="list-disc pl-8 mb-6">
        <li>
          <code>GET /dataRoute/</code>: Fetch the device data.
        </li>
        <li>
          <code>POST /dataRoute/add-device</code>: Add a new device.
        </li>
        <li>
          <code>PUT /dataRoute/update-device/:id</code>: Update an existing
          device.
        </li>
        <li>
          <code>DELETE /dataRoute/delete-device/:id</code>: Delete a device.
        </li>
        <li>
          <code>GET /dataRoute/export/excel</code>: Export the table data to
          XLSX.
        </li>
      </ul>
    </div>
  );
};

export default Documentation;
