const { Pool } = require('pg');
const dbConfig = require('./dbConfig'); 
const logger = require('../logger'); 

const pool = new Pool({
    user: dbConfig.user,
    host: dbConfig.host,
    database: dbConfig.database,
    password: dbConfig.password,
    port: dbConfig.port,
   
});

async function executeQuery(query, params = []) {
    const client = await pool.connect();
    try {
        const { rows } = await client.query(query, params);
        logger.info(`Query executed: ${query}`);
        return rows;
    } catch (error) {
        logger.error(`Error executing query: ${error.message}`);
        throw error;
    } finally {
        client.release();
        logger.info('Database client released');
    }
}

module.exports = { 
    pool,
    executeQuery

};