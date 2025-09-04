import { Pool } from 'pg';
import pg from 'pg';
const { types } = pg;
const NUMERIC_OID = 1700;
// PostgreSQL OID для int8 (bigint) — це 20
types.setTypeParser(20, val => parseInt(val, 10));
types.setTypeParser(NUMERIC_OID, (val) => val === null ? null : parseFloat(val));
import dotenv from 'dotenv';
dotenv.config();

export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});