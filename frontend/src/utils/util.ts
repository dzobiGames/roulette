import { read, utils } from "xlsx";

interface Item {
  index: string;
  zero: number;
  ten: number;
  red: number;
  last: number;
  win: number;
}
const fileURL = new URL("../db/rL.xlsx", import.meta.url).href;
const algoroll = new URL("../db/algoroll.json", import.meta.url).href;
const algoURL = new URL("../db/algo.json", import.meta.url).href;

export async function processDataFromExcel(algoValuesP: number[]) {
  try {
    const response = await fetch(fileURL);
    const algoValues = algoValuesP;
    const algorollJson = await fetch(algoroll);
    const algorollData = await algorollJson.json();
    if (!response.ok) {
      throw new Error("Failed to fetch file.");
    }
    const fileData = await response.arrayBuffer();
    const workbook = read(new Uint8Array(fileData));
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = utils.sheet_to_json(worksheet);
    //const algoValues = [1, 12, 3, 10, 9, 4, 8, 35, 7, 3, 8, 5, 2, 22, 0, 14, 15, 18, 22, 18, 29, 54];
    const zeroValues = [];
    const tenValues = [];
    const redValues = [];
    const yesValues = [];
    const noValues = [];

    for (const row of data as { [key: string]: any }[]) {
      if ("zero" in row) {
        zeroValues.push(parseFloat(String(row["zero"])));
      }
      if ("ten" in row) {
        tenValues.push(parseFloat(String(row["ten"])));
      }
      if ("red" in row) {
        redValues.push(parseFloat(String(row["red"])));
      }
      if ("yes" in row) {
        yesValues.push(parseFloat(String(row["yes"])));
      }
      if ("no" in row) {
        noValues.push(parseFloat(String(row["no"])));
      }
    }

    const part = 22;
    const accumulatedRows: any[] = [];

    for (let start = 0; start <= algoValues.length - part; start++) {
      let subTab = algoValues.slice(start, start + part);
      let last = algoValues[start + part - 1];
      let sumZero = 0;
      let sumTen = 0;
      let sumRed = 0;

      for (let i = 0; i < subTab.length; i++) {
        if (zeroValues.includes(subTab[i])) {
          sumZero += yesValues[i]; // Assuming you want to count occurrences of zero
        } else {
          sumZero += noValues[i]; // Assuming you want to count occurrences of zero
        }
        if (tenValues.includes(subTab[i])) {
          sumTen += yesValues[i]; // Assuming you want to count occurrences of ten
        } else {
          sumTen += noValues[i];
        }
        if (redValues.includes(subTab[i])) {
          sumRed += yesValues[i];
        } else {
          sumRed += noValues[i];
        }
      }

      sumZero = sumZero / part;
      sumTen = sumTen / part;
      sumRed = sumRed / part;
      sumZero = parseFloat(sumZero.toFixed(1));
      sumTen = parseFloat(sumTen.toFixed(1));
      sumRed = parseFloat(sumRed.toFixed(1));

      accumulatedRows.push({
        zero: sumZero,
        ten: sumTen,
        red: sumRed,
        last: last,
      });
    }
    /* console.log("accumulatedRows", accumulatedRows);
    console.log("algorollData", algorollData); */
    const filteredData = algorollData.filter((item: Item) =>
      item.zero === accumulatedRows[0].zero &&
      item.ten === accumulatedRows[0].ten &&
      item.red === accumulatedRows[0].red
    );
    //console.log("filteredData", filteredData);
    const matchValuesObject = {
      "matchValues": filteredData
    };
    accumulatedRows.push(matchValuesObject);
    console.log("accumulatedRows", accumulatedRows);

    return accumulatedRows;
  } catch (error) {
    console.error("Error reading the file:", error);
  }
}

export async function searchAlgoValues(inputArray: string[]) {
  try {
    //const inputArray = ["64230-64251", "64270-64290"];

    const algoJSON = await fetch(algoURL);
    const algo = await algoJSON.json();
    const tabElements: { id: number; algovalue: number }[] = [];
    for (const input of inputArray) {
      const parts = input.split('-');
      if (parts.length === 2) {
        const idToCompare = parseInt(parts[1], 10);
        const result = algo.filter((item: { id: number; algovalue: number }) => item.id > idToCompare).slice(0, 10);
        tabElements.push(...result);
      }
    }

    const algovalueArray = tabElements.map((element) => element.algovalue);

    const algoValueArrayFreq: { [key: string]: number } = {};
    for (let i = 0; i <= 36; i++) {
      algoValueArrayFreq[i.toString()] = 0;
    }

    for (const algovalue of algovalueArray) {
      if (algovalue in algoValueArrayFreq) {
        algoValueArrayFreq[algovalue.toString()]++;
      }
    }

    const algoValueArrayFreqToSort = Object.entries(algoValueArrayFreq).map(([key, value]) => ({ key, value }));
    algoValueArrayFreqToSort.sort((a, b) => b.value - a.value);
    console.log("algoValueArrayFreqToSort", algoValueArrayFreqToSort);
    return algoValueArrayFreqToSort;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}