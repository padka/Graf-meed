require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet'); // Включено для продакшена
const morgan = require('morgan');
const compression = require('compression');
const path = require('path');
const logger = require('./logger');

const app = express();
const port = process.env.PORT || 3000;

// Настройка CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
  credentials: true,
};
app.use(cors(corsOptions));

// Безопасность, сжатие и логгирование
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(morgan(process.env.NODE_ENV !== 'production' ? 'dev' : 'combined', { stream: { write: message => logger.info(message.trim()) } }));

// Роуты
const userRoutes = require('./routes/UserRoutes');
const introSectionRoutes = require('./routes/IntroSection');
const productsRoutes = require('./routes/products');
const ordersRoutes = require('./routes/orders');
const furnitureRoutes = require('./routes/furnitureRoutes');
app.use('/api/users', userRoutes);
app.use('/api/introSection', introSectionRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api', furnitureRoutes);


// Статические файлы и SPA роутинг
app.use(express.static(path.join(__dirname, '../build')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../build/index.html')));

// Обработка ошибок
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(port, () => logger.info(`Server running at http://localhost:${port}`));
