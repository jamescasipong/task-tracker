import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';

// Use URL import.meta.url to get the current directory

// Path to your Excel file
const excelFilePath = path.join('src', 'data', 'Harware Inventory.xlsx');
const outputFilePath = path.join('public', 'output.json');

try {
  // Log paths to verify
  console.log('Excel file path:', excelFilePath);
  console.log('Output file path:', outputFilePath);

  // Read the Excel file
  const workbook = xlsx.readFile(excelFilePath);
  console.log('Excel file read successfully.');

  // Log available sheet names
  console.log('Available sheet names:', workbook.SheetNames);

  // Convert the first sheet to JSON, starting from the third row
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const jsonData = xlsx.utils.sheet_to_json(sheet, { range: 2});

  // Log first few rows of JSON data
  console.log('First few rows of JSON data:', jsonData.slice(0, 5));

  // Write JSON data to a file in the public directory
  fs.writeFileSync(outputFilePath, JSON.stringify(jsonData, null, 2));
  console.log('Conversion complete. JSON file created.');
} catch (error) {
  console.error('Error during conversion:', error.message);
}
