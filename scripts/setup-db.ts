import sql from 'mssql';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const dbConfig = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'your_password',
  database: process.env.DB_NAME || 'hkcardking',
  server: process.env.DB_SERVER || 'localhost',
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: false, // for local development, often false
    trustServerCertificate: true // change to true for local dev / self-signed certs
  }
};

const createTablesSql = `
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='sys_seq_no' and xtype='U')
CREATE TABLE sys_seq_no
(
    sn_key  NVARCHAR(20) PRIMARY KEY,
    sn_seq_no INT NOT NULL DEFAULT 0
);

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='mSysUser' and xtype='U')
CREATE TABLE mSysUser
(
  su_id       NVARCHAR(20) NOT NULL PRIMARY KEY,
  su_name     NVARCHAR(500),
  su_login    NVARCHAR(500),
  su_password NVARCHAR(500),
  su_date     DATETIME,
  su_token    NVARCHAR(500)
);

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='mUser' and xtype='U')
CREATE TABLE mUser
(
  us_id       NVARCHAR(20) NOT NULL PRIMARY KEY,
  us_name     NVARCHAR(500),
  us_login    NVARCHAR(500),
  us_password NVARCHAR(500),
  us_date     DATETIME,
  us_email    NVARCHAR(200),
  us_addresss NVARCHAR(300),
  us_token    NVARCHAR(500)
);

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='sys_lang' and xtype='U')
CREATE TABLE sys_lang
(
   lg_id   INT NOT NULL IDENTITY(1,1),
   lg_lang NVARCHAR(100) NOT NULL,
   lg_key  NVARCHAR(100) NOT NULL,
   lg_value NVARCHAR(300) NOT NULL
);

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='eNews' and xtype='U')
CREATE TABLE eNews
(
  ns_id NVARCHAR(20) NOT NULL PRIMARY KEY,
  ns_content NVARCHAR(MAX) NOT NULL,
  ns_date  DATETIME NOT NULL DEFAULT GETDATE()
);

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ePostCard' and xtype='U')
CREATE TABLE ePostCard
(
  pc_id       NVARCHAR(20) NOT NULL PRIMARY KEY,
  pc_number    NVARCHAR(100) NOT NULL, 
  pc_name     NVARCHAR(100) NOT NULL,
  pc_desc     NVARCHAR(300) NOT NULL,
  pc_name_key   NVARCHAR(100) NOT NULL,
  pc_price      NUMERIC(20,4) NOT NULL DEFAULT 0,
  pc_date     DATETIME NOT NULL DEFAULT GETDATE(),
  pc_level    INT,
  pc_org      NVARCHAR(100) NOT NULL
);

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ePostCardName' and xtype='U')
CREATE TABLE ePostCardName
(
  pc_name_id    NVARCHAR(20) NOT NULL PRIMARY KEY,
  pc_name_key   NVARCHAR(100) NOT NULL, 
  pc_name_lang  NVARCHAR(20) NOT NULL 
);

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ePostCardImg' and xtype='U')
CREATE TABLE ePostCardImg
(
  pci_id    NVARCHAR(20) NOT NULL PRIMARY KEY, 
  pc_id     NVARCHAR(20) NOT NULL,
  pci_path  NVARCHAR(100) NOT NULL 
);

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ePostCardValidation' and xtype='U')
CREATE TABLE ePostCardValidation
(
  pcv_id      NVARCHAR(20) NOT NULL PRIMARY KEY,
  pcv_number    NVARCHAR(100) NOT NULL, 
  pcv_name     NVARCHAR(100) NOT NULL,
  pcv_desc     NVARCHAR(300) NOT NULL,
  pcv_name_key   NVARCHAR(100) NOT NULL,
  pcv_price      NUMERIC(20,4) NOT NULL DEFAULT 0,
  pcv_date     DATETIME NOT NULL DEFAULT GETDATE(),
  pcv_level    INT,
  pcv_org      NVARCHAR(100) NOT NULL,
  pcv_image1_path     NVARCHAR(100) NOT NULL,
  pcv_image2_path     NVARCHAR(100) NOT NULL,
  pcv_approve_date DATETIME,
  su_id       NVARCHAR(20) 
);

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='eAttachment' and xtype='U')
CREATE TABLE eAttachment
(
	atm_id	NVARCHAR(20) NOT NULL PRIMARY KEY,
	atm_name NVARCHAR(100) NOT NULL,
	atm_key NVARCHAR(100) NOT NULL,
	atm_path NVARCHAR(100) NOT NULL
);

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='eCardStatistics' and xtype='U')
CREATE TABLE eCardStatistics
(
  cs_id       NVARCHAR(20) NOT NULL PRIMARY KEY,
  pc_name_key   NVARCHAR(100) NOT NULL,
  cs_YYYYMMDD   NVARCHAR(10) NOT NULL,
  cs_price_low  NUMERIC(20,4) NOT NULL DEFAULT 0,
  cs_price_high NUMERIC(20,4) NOT NULL DEFAULT 0,
  cs_date       DATETIME
);

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='mCardType' and xtype='U')
CREATE TABLE mCardType
(
  ct_id         NVARCHAR(20) NOT NULL PRIMARY KEY,
  ct_name       NVARCHAR(20) NOT NULL,
  ct_name_en    NVARCHAR(20) NOT NULL,
  ct_name_jp    NVARCHAR(20) NOT NULL
);
`;

async function setupDatabase() {
  try {
    console.log('Connecting to database...');
    // Connect to the master database first to create the database if it doesn't exist
    const masterConfig = { ...dbConfig, database: 'master' };
    let pool = await sql.connect(masterConfig);
    
    // Check if database exists
    const checkDb = await pool.request().query(`
      SELECT * FROM sys.databases WHERE name = '${dbConfig.database}'
    `);

    if (checkDb.recordset.length === 0) {
      console.log(`Database '${dbConfig.database}' does not exist. Creating...`);
      await pool.request().query(`CREATE DATABASE ${dbConfig.database}`);
      console.log('Database created successfully.');
    } else {
      console.log(`Database '${dbConfig.database}' already exists.`);
    }

    await pool.close();

    // Now connect to the actual database to create tables
    console.log(`Connecting to '${dbConfig.database}' database...`);
    pool = await sql.connect(dbConfig);
    
    console.log('Creating tables...');
    await pool.request().batch(createTablesSql);
    
    console.log('All tables created successfully!');
    await pool.close();
  } catch (err) {
    console.error('Error setting up database:', err);
  }
}

setupDatabase();