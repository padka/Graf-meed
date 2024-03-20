const { pool } = require('../conf/Database');
const logger = require('../logger'); // Убедитесь, что этот путь верен

class ProductModel {
    // Добавление новой кастомизации
    static async addCustomization(name, description) {
        try {
            // Проверяем наличие кастомизации с таким же именем
            const existRes = await pool.query('SELECT * FROM customizations WHERE name = $1;', [name]);
            if (existRes.rowCount > 0) {
                throw new Error('Customization already exists');
            }

            const insertRes = await pool.query(
                'INSERT INTO customizations (name, description) VALUES ($1, $2) RETURNING *;',
                [name, description]
            );
            logger.info(`Customization added successfully: ${name}`);
            return insertRes.rows[0];
        } catch (error) {
            logger.error(`Error in addCustomization: ${error.message}`, {
                context: 'addCustomization',
                name,
                description,
                errorStack: error.stack
            });
            throw error;
        }
    }

    // Добавление нового размера
    static async addDimension(width, height, depth, productId) {
        try {
            const insertRes = await pool.query(
                'INSERT INTO dimensions (width, height, depth, product_id) VALUES ($1, $2, $3, $4) RETURNING *;',
                [width, height, depth, productId]
            );
            logger.info(`Dimension added successfully: ${width}x${height}x${depth} for product ${productId}`);
            return insertRes.rows[0];
        } catch (error) {
            logger.error(`Error in addDimension: ${error.message}`, {
                context: 'addDimension',
                width,
                height,
                depth,
                productId,
                errorStack: error.stack
            });
            throw error;
        }
    }

    // Получение всех материалов
    static async getAllMaterials() {
        try {
            const res = await pool.query('SELECT * FROM materials;');
            logger.info('Materials retrieved successfully');
            return res.rows;
        } catch (error) {
            logger.error(`Error in getAllMaterials: ${error.message}`, {
                context: 'getAllMaterials',
                errorStack: error.stack
            });
            throw error;
        }
    }

    // Добавление нового материала
    static async addMaterial(name, description) {
        try {
            // Проверяем наличие материала с таким же именем
            const existRes = await pool.query('SELECT * FROM materials WHERE name = $1;', [name]);
            if (existRes.rowCount > 0) {
                throw new Error('Material already exists');
            }

            const insertRes = await pool.query(
                'INSERT INTO materials (name, description) VALUES ($1, $2) RETURNING *;',
                [name, description]
            );
            logger.info(`Material added successfully: ${name}`);
            return insertRes.rows[0];
        } catch (error) {
            logger.error(`Error in addMaterial: ${error.message}`, {
                context: 'addMaterial',
                name,
                description,
                errorStack: error.stack
            });
            throw error;
        }
    }
}

module.exports = ProductModel;
