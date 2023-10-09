import { fileURLToPath } from "url";
import { dirname } from "path";
import XLSX from "xlsx";
import path from "path";
import { readFile } from "fs/promises";

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Construct the file path relative to the current module
const filePath = path.join(__dirname, "../db/file1.xlsx");

// Read the file using the fs/promises module
try {
  const fileData = await readFile(filePath);

  // Use XLSX with the file data
  const workbook = XLSX.read(fileData);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName]
  const data = XLSX.utils.sheet_to_json(worksheet)

  console.log(sheetName);
  console.log(data)
} catch (error) {
  console.error("Error reading the file:", error);
}



//typescript code

// import { fileURLToPath } from 'url';
// import { dirname } from 'path';
// import XLSX from 'xlsx';
// import path from 'path';
// import { readFile } from 'fs/promises';

// // Get the directory of the current module
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// // Construct the file path relative to the current module
// const filePath = path.join(__dirname, '../db/file1.xlsx');

// async function readExcelFile() {
//   try {
//     const fileData = await readFile(filePath);

//     // Use XLSX with the file data
//     const workbook = XLSX.read(fileData);
//     const sheetName = workbook.SheetNames[0];
//     const worksheet = workbook.Sheets[sheetName];
//     const data = XLSX.utils.sheet_to_json(worksheet);

//     console.log(sheetName);
//     console.log(data);
//   } catch (error) {
//     console.error('Error reading the file:', error);
//   }
// }

// readExcelFile();
