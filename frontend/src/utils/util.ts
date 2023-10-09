import * as XLSX from 'xlsx'; // You'll need to require XLSX if you haven't already


export function processDataFromExcel() {
    
    const algoValues =  [1, 12, 3, 10, 9, 4, 8, 35, 7, 3, 8, 5, 2, 22, 0, 14, 15, 18, 22, 18, 29, 54];
    const filename = '../db/rL.xlsx';
    const workbook = XLSX.readFile(filename);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);

    const zeroValues = [];
    const tenValues = [];
    const redValues = [];
    const yesValues = [];
    const noValues = [];

    for (const row of data as { [key: string]: any }[]) {
        if ('zero' in row) {
            zeroValues.push(parseFloat(String(row['zero'])));
        }
        if ('ten' in row) {
            tenValues.push(parseFloat(String(row['ten'])));
        }
        if ('red' in row) {
            redValues.push(parseFloat(String(row['red'])));
        }
        if ('yes' in row) {
            yesValues.push(parseFloat(String(row['yes'])));
        }
        if ('no' in row) {
            noValues.push(parseFloat(String(row['no'])));
        }
    }

    const part = 22;
    const accumulatedRows = [];

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

    return accumulatedRows;
}


