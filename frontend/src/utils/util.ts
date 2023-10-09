import { read, utils } from "xlsx";

// // Function to extract the directory path from import.meta.url
// function getDirname(url:string) {
//   const urlParts = url.split("/");
//   urlParts.pop(); // Remove the file name
//   return urlParts.join("/");
// }

// const __filename = import.meta.url;
// const __dirname = getDirname(__filename);

// Construct the file URL relative to the current module
const fileURL = new URL("../db/file1.xlsx", import.meta.url).href;

async function readExcelFile() {
  try {
    // Use the fetch API to retrieve the file data asynchronously
    const response = await fetch(fileURL);
    if (!response.ok) {
      throw new Error("Failed to fetch file.");
    }

    // Read the response body as an ArrayBuffer
    const fileData = await response.arrayBuffer();

    // Use XLSX with the file data
    const workbook = read(new Uint8Array(fileData));
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = utils.sheet_to_json(worksheet);

    console.log(data);
  } catch (error) {
    console.error("Error reading the file:", error);
  }
}

console.log("working");

export default readExcelFile;




// function processDataFromExcel() {
//   const algoValues = [
//     1, 12, 3, 10, 9, 4, 8, 35, 7, 3, 8, 5, 2, 22, 0, 14, 15, 18, 22, 18, 29, 54,
//   ];
//   const filename = "../db/rL.xlsx";
//   const workbook = XLSX.readFile(filename);
//   const worksheet = workbook.Sheets[workbook.SheetNames[0]];
//   const data = XLSX.utils.sheet_to_json(worksheet);

//   const zeroValues = [];
//   const tenValues = [];
//   const redValues = [];
//   const yesValues = [];
//   const noValues = [];

//   for (const row of data as { [key: string]: any }[]) {
//     if ("zero" in row) {
//       zeroValues.push(parseFloat(String(row["zero"])));
//     }
//     if ("ten" in row) {
//       tenValues.push(parseFloat(String(row["ten"])));
//     }
//     if ("red" in row) {
//       redValues.push(parseFloat(String(row["red"])));
//     }
//     if ("yes" in row) {
//       yesValues.push(parseFloat(String(row["yes"])));
//     }
//     if ("no" in row) {
//       noValues.push(parseFloat(String(row["no"])));
//     }
//   }

//   const part = 22;
//   const accumulatedRows = [];

//   for (let start = 0; start <= algoValues.length - part; start++) {
//     let subTab = algoValues.slice(start, start + part);
//     let last = algoValues[start + part - 1];
//     let sumZero = 0;
//     let sumTen = 0;
//     let sumRed = 0;

//     for (let i = 0; i < subTab.length; i++) {
//       if (zeroValues.includes(subTab[i])) {
//         sumZero += yesValues[i]; // Assuming you want to count occurrences of zero
//       } else {
//         sumZero += noValues[i]; // Assuming you want to count occurrences of zero
//       }
//       if (tenValues.includes(subTab[i])) {
//         sumTen += yesValues[i]; // Assuming you want to count occurrences of ten
//       } else {
//         sumTen += noValues[i];
//       }
//       if (redValues.includes(subTab[i])) {
//         sumRed += yesValues[i];
//       } else {
//         sumRed += noValues[i];
//       }
//     }

//     sumZero = sumZero / part;
//     sumTen = sumTen / part;
//     sumRed = sumRed / part;
//     sumZero = parseFloat(sumZero.toFixed(1));
//     sumTen = parseFloat(sumTen.toFixed(1));
//     sumRed = parseFloat(sumRed.toFixed(1));

//     accumulatedRows.push({
//       zero: sumZero,
//       ten: sumTen,
//       red: sumRed,
//       last: last,
//     });
//   }

//   return accumulatedRows;
// }