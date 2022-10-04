const mysql =require('mysql2')
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

// create the connection to database
const pool = mysql.createPool({
    host: process.env.HOST,
    database: process.env.DATABASE,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    port :process.env.DATABASE_PORT,
    connectionLimit:10
});

module.exports = pool;

/* 
CREATE TABLE clients (
    username VARCHAR(255),
    email VARCHAR(255) PRIMARY KEY,
    registerToken VARCHAR(255),
    password VARCHAR(255),
    connected BOOLEAN DEFAULT(0),
    resetPasswordToken VARCHAR(255),
    resetPasswordExpires TIME
);
*/