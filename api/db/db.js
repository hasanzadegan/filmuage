const sql = require('mssql');
const dbConfig = require('./dbConfig');

// Create a connection pool
const pool = new sql.ConnectionPool(dbConfig);
const poolConnect = pool.connect();

// Function to execute SQL queries
const executeQuery = async (query) => {
    await poolConnect;
    try {
        const request = pool.request();
        const result = await request.query(query);
        return result.recordset;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    executeQuery,
};
