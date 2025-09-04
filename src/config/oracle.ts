import dotenv from 'dotenv';
dotenv.config();
import oracledb from 'oracledb';
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.fetchAsBuffer = [ oracledb.BLOB ];
export const pool = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECTION_URI, // беремо повний TNS рядок з env
  poolMax: Number(process.env.DB_POOL_MAX) || 10,
  poolMin: Number(process.env.DB_POOL_MIN) || 0,
  poolIncrement: Number(process.env.DB_POOL_INCREMENT) || 1,
  poolTimeout: Number(process.env.DB_POOL_TIMEOUT) || 60,
};

async function getConnection() {
  try {

    const connection = await oracledb.getConnection(pool);

    connection.currentSchema = 'VELDAT';

    return connection;
  } catch (error) {
    console.error('❌ Oracle DB connection error:', error);
    throw error;
  }
}

export { getConnection };
