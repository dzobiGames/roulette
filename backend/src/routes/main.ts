import express, { Request, Response } from 'express';
import XLSX from 'xlsx';
import fs from 'fs';
import pool from '../db/connexion';

const routes = express.Router();
let outBook = XLSX.utils.book_new();
let outSheet = XLSX.utils.json_to_sheet([]);
XLSX.utils.book_append_sheet(outBook, outSheet, 'rouletteCode');
interface DataRow {
    zero?: number;
    ten?: number;
    red?: number;
    yes?: number;
    no?: number;
}

routes.get('/start', (req: Request, res: Response) => {
    res.send('Roll nd roll; wait... Stop!');
});

routes.post('/rundb', async (req: Request, res: Response) => {
    const client = await pool.connect();
    try {
        const workbook = XLSX.readFile('src/data/accumulatedRollAlgo.xlsx');
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data: { index: string, zero: number, ten: number, red: number, last: number, win: number }[] = XLSX.utils.sheet_to_json(worksheet);

        // Définissez la taille du lot
        const batchSize = 5000;

        for (let i = 0; i < data.length; i += batchSize) {
            const batch = data.slice(i, i + batchSize);

            // Créez un tableau pour stocker les valeurs du lot à insérer
            const valuesToInsert = batch.map((row) => {
                //console.log(row.zero);
                return [row.index, row.zero, row.ten, row.red, row.last, row.win];
            });

            const placeholders = valuesToInsert.map((_, index) => `($${6 * index + 1}, $${6 * index + 2}, $${6 * index + 3}, $${6 * index + 4}, $${6 * index + 5}, $${6 * index + 6})`).join(', ');
            const queryText = `INSERT INTO algoroll("index", "zero", "ten", "red", "last", "win") VALUES ${placeholders}`;
            const queryValues = valuesToInsert.flat();

            client.query(queryText, queryValues, (err) => {
                if (err) {
                    console.error('Query error: ', err);
                }
            });
        }
        res.status(200).send('Done');

    } catch (error) {
        console.error('Error inserting data ', error);
        res.status(500).send(error);
    }
    client.release();
});

routes.post('/insertAlgo', async (req: Request, res: Response) => {
    const client = await pool.connect();
    try {
        const workbook = XLSX.readFile('src/data/rL.xlsx');
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(worksheet);
        const filteredData = data.map((row: any) => row['algo']);
        console.log('filteredData', filteredData);
        const batchSize = 5000;
        for (let i = 0; i < filteredData.length; i += batchSize) {
            const batch = filteredData.slice(i, i + batchSize);
            const valuesToInsert = batch.map((row) => {
                return [row];
            });
            const placeholders = valuesToInsert.map((_, index) => `($${index + 1})`).join(', ');
            const queryText = `INSERT INTO algo("algovalue") VALUES ${placeholders}`;
            const queryValues = valuesToInsert.flat();

            client.query(queryText, queryValues, (err) => {
                if (err) {
                    console.error('Query error: ', err);
                }
            });
        }
        res.status(200).send('Done');
    } catch (error) {
        console.error('Error inserting data ', error);
        res.status(500).send(error);
    }
})

routes.get('/fill', (req: Request, res: Response) => {
    const filename = 'src/data/rL.xlsx';
    const workbook = XLSX.readFile(filename);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data: DataRow[] = XLSX.utils.sheet_to_json(worksheet);

    const algoValues: number[] = [];
    const zeroValues = [];
    const tenValues = [];
    const redValues = [];
    const yesValues = [];
    const noValues = [];
    interface DataRow {
        algo?: number;
        zero?: number;
        ten?: number;
        red?: number;
        yes?: number;
        no?: number;
    }

    for (let row of data) {
        if ('algo' in row) {
            algoValues.push(parseFloat(String(row['algo'])));
        }
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
    const accumulatedRows: any[] = [];
    for (let start = 0; start <= (algoValues.length - part); start++) {
        let subTab = algoValues.slice(start, (start + part));
        let last = algoValues[(start + part) - 1];
        let win = algoValues[(start + part)];
        let index = '' + (start + 1) + '-' + (start + part);

        if (win) {
            let sumZero = 0;
            let sumTen = 0;
            let sumRed = 0;
            for (let i = 0; i < subTab.length; i++) {
                if (zeroValues.includes(subTab[i])) {
                    sumZero += yesValues[i];
                    //console.log('yes', yesValues[i]);
                } else {
                    sumZero += noValues[i];
                    //console.log('no', noValues[i]);
                }
                if (tenValues.includes(subTab[i])) {
                    sumTen += yesValues[i];
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
            //writeLine(index, sumZero, sumTen, sumRed, last, win);
            accumulatedRows.push({
                index: index,
                zero: sumZero,
                ten: sumTen,
                red: sumRed,
                last: last,
                win: win,
            });

        }
        console.log(start + 1);
    }
    const accumulatedWorkbook = XLSX.utils.book_new();
    const accumulatedSheet = XLSX.utils.json_to_sheet(accumulatedRows);
    XLSX.utils.book_append_sheet(accumulatedWorkbook, accumulatedSheet, 'rollAlgo');
    XLSX.writeFile(accumulatedWorkbook, 'src/data/accumulatedRollAlgo.xlsx');

    res.send('Done');
});

routes.post('/process', async (req: Request, res: Response) => {
    const algoValues = req.body.values; // Assuming the array is sent in the request body
    const filename = 'src/data/rL.xlsx';
    const workbook = XLSX.readFile(filename);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data: DataRow[] = XLSX.utils.sheet_to_json(worksheet);
    const zeroValues = [];
    const tenValues = [];
    const redValues = [];
    const yesValues = [];
    const noValues = [];

    for (let row of data) {
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

    const client = await pool.connect();
    try {
        const matchValuesQuery = `
            SELECT * FROM algoroll
            WHERE zero = $1 AND ten = $2 AND red = $3
        `;
        const values = [accumulatedRows[0].zero, accumulatedRows[0].ten, accumulatedRows[0].red];
        const { rows } = await client.query(matchValuesQuery, values);
        const matchValues = rows.map(row => ({
            index: row.index,
            zero: row.zero,
            ten: row.ten,
            red: row.red,
            last: row.last,
            win: row.win,
        }));
        console.log('matchValues', matchValues);
        const matchValuesObject = {
            "matchValues": matchValues
        };
        accumulatedRows.push(matchValuesObject);
    } catch (error) {
        console.error('Error inserting data ', error);
        res.status(500).send(error);
    }
    client.release();
    res.status(200).send(accumulatedRows);
});

routes.post('/search', async (req: Request, res: Response) => {
    try {
        const client = await pool.connect();
        const inputArray = req.body.values;
        if (!inputArray || inputArray.length === 0) {
            return res.status(200).json('No result found');
        }

        const tabElements: { id: number, algovalue: number }[] = [];
        for (const input of inputArray) {
            const parts = input.split('-');
            if (parts.length === 2) {
                const idToCompare = parseInt(parts[1], 10);
                //console.log(idToCompare);
                const query = `
                SELECT * FROM algo
                WHERE id > $1
                LIMIT 10
            `;
                const result = await client.query(query, [idToCompare]);
                tabElements.push(...result.rows);
            }
        }
        const algovalueArray = tabElements.map((element) => element.algovalue);
        //console.log(algovalueArray);
        // o,o initialize
        const algoValueArrayFreq: { [key: string]: number } = {};
        for (let i = 0; i <= 36; i++) {
            algoValueArrayFreq[i.toString()] = 0;
        }
        //console.log(algoValueArrayFreq);
        for (const algovalue of algovalueArray) {
            if (algovalue in algoValueArrayFreq) {
                algoValueArrayFreq[algovalue.toString()]++;
            }
        }
        //console.log(algoValueArrayFreq);
        res.status(200).json(algoValueArrayFreq);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json(error);
    }
});






export default routes;