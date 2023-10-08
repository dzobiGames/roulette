import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'roulette',
  password: 'Dj@bir122002',
  port: 5432,
});

export default pool;
