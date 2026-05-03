import sql from 'mssql';

const dbConfig = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'P@ssw0rd',
  database: process.env.DB_NAME || 'hkcardking',
  server: process.env.DB_SERVER || 'localhost',
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: true, // for azure
    trustServerCertificate: true // change to true for local dev / self-signed certs
  }
};

let poolPromise: Promise<sql.ConnectionPool>;

export const getDbConnection = async () => {
  if (!poolPromise) {
    poolPromise = sql.connect(dbConfig);
  }
  return poolPromise;
};

export const execSPSys = async (payload: any) => {
  try {
    const pool = await getDbConnection();
    const request = pool.request();
    
    // Add input parameter
    request.input('paraIn', sql.NVarChar(sql.MAX), JSON.stringify(payload));
    
    // Add output parameter
    request.output('paraOut', sql.NVarChar(sql.MAX));
    
    // Execute SP
    const result = await request.execute('SP_SYS');
    
    // Parse the output JSON if it exists
    const outData = result.output.paraOut;
    if (outData) {
      return JSON.parse(outData);
    }
    
    return { success: true };
  } catch (err) {
    console.error('Database Error:', err);
    throw err;
  }
};