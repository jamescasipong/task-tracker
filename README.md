# Employee Data Management System

A web application built with the MERN stack (MongoDB, Express, React, Node.js) for managing employee data. It allows you to convert Excel files to JSON, view and edit data, update the database, and download the data as Excel files.

## Features

- **Excel to JSON Conversion**: Upload and convert Excel files to JSON.
- **Data Management**: View and edit data in a table.
- **Database Updates**: Save changes to the database.
- **Excel Export**: Download the updated data as an Excel file.
- **Secure Access**: Access controlled by a password.

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **File Conversion**: ExcelJS

## Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/employee-data-management-system.git
    cd employee-data-management-system
    ```

2. **Install Backend Dependencies:**

    ```bash
    cd server
    npm install
    ```

3. **Install Frontend Dependencies:**

    ```bash
    cd ../client
    npm install
    ```

4. **Setup Environment Variables:**

    Create a `.env` file in the `server` directory with:

    ```plaintext
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```

5. **Start the Servers:**

    - **Backend:**

      ```bash
      cd server
      npm start
      ```

    - **Frontend:**

      ```bash
      cd ../client
      npm start
      ```

## Usage

1. **Upload an Excel File**: Use the upload feature to convert an Excel file to JSON.
2. **View and Edit Data**: Modify data in the table.
3. **Update Database**: Save changes to update the database.
4. **Download Data**: Export the data as an Excel file.
5. **Authentication**: Use the set password to access the system.

## API Endpoints

- **POST /api/upload**: Upload an Excel file.
- **GET /api/data**: Fetch data from the database.
- **PUT /api/data**: Update data in the database.
- **GET /api/download**: Download data as an Excel file.

## Contributing

To contribute:

1. Fork the repository.
2. Create a new branch.
3. Make changes and commit them.
4. Open a pull request.

## License

MIT License. See [LICENSE](LICENSE) for details.

## Contact

For questions, contact:

- **Your Name** - [your-email@example.com](mailto:your-email@example.com)
- **Repository**: [https://github.com/your-username/employee-data-management-system](https://github.com/your-username/employee-data-management-system)
