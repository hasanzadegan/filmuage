// dbConfig.js
const dbConfig = {
    server: 'localhost',
    port: 1433,
    database: 'filmuageDb',
    user: 'flmj',
    password: 'flmj',
    options: {
        encrypt: true,
        trustServerCertificate: true,
        ssl: {
            rejectUnauthorized: false
        }
    }
};
module.exports = dbConfig;
