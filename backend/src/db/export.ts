import * as fs from 'fs';
import { IMain, IDatabase } from 'pg-promise';
import pgPromise = require('pg-promise');

// Configuration de la connexion à la base de données PostgreSQL
const pgp: IMain = pgPromise();
const db: IDatabase<any> = pgp('postgres://postgres:Dj@bir122002@localhost:5432/roulette');

async function exportTableToJson(tableName: string): Promise<void> {
    try {
        const data = await db.many(`SELECT * FROM ${tableName}`);
        const jsonFileName = `${tableName}.json`;
        fs.writeFileSync(jsonFileName, JSON.stringify(data, null, 2));
        console.log(`Données de la table ${tableName} exportées avec succès vers ${jsonFileName}`);
    } catch (error) {
        console.error(`Erreur lors de l'export des données de la table ${tableName}: ${error}`);
    }
}

async function main() {
    await exportTableToJson('algoroll');
    await exportTableToJson('algo');
    pgp.end();
}

main();
