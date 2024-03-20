const { executeQuery } = require('../conf/Database');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 120 }); // Кэш на 1 час и проверка каждые 2 минуты

const getIntroSection = async () => {
  const cacheKey = 'intro_section';
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    console.log('Returning cached data for intro_section');
    return cachedData; // Возвращаем данные из кэша, если они там есть
  }

  try {
    const queryText = 'SELECT * FROM intro_sections LIMIT 1';
    const rows = await executeQuery(queryText); // Используем унифицированную функцию для выполнения запроса
    if (rows.length === 0) {
      console.log('No intro_section data found');
      return null; // Возвращаем null, если данных нет
    }
    const introSection = rows[0];

    // Безопасное преобразование JSON-строк в объекты
    try {
      introSection.paragraphs = introSection.paragraphs ? JSON.parse(introSection.paragraphs) : null;
      introSection.images = introSection.images ? JSON.parse(introSection.images) : null;
    } catch (parseError) {
      console.error('Error parsing introSection data', parseError);
      // Возможно, здесь стоит решить, что делать дальше: прервать выполнение или вернуть частичные данные
    }

    cache.set(cacheKey, introSection); // Кэшируем результат без дополнительного указания времени жизни, т.к. указали при создании кэша
    console.log('Data for intro_section cached successfully');
    return introSection;
  } catch (error) {
    console.error('Error executing query', error);
    throw error; // Передаем ошибку дальше
  }
};

module.exports = {
  getIntroSection,
};
