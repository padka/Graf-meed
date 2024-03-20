const { executeQuery } = require('../conf/Database');

// Функция для получения продуктов с возможными параметрами фильтрации и пагинации
const getProducts = async (filters = {}, page = 1, limit = 10) => {
  // Создаем базовый запрос
  let query = 'SELECT * FROM products';

  // Добавляем условия фильтрации
  const conditions = [];
  const params = [];

  if (filters.title) {
    conditions.push('title ILIKE $' + (params.length + 1)); // Используем ILIKE для поиска без учета регистра
    params.push(`%${filters.title}%`);
  }

  if (filters.minPrice) {
    conditions.push('price >= $' + (params.length + 1));
    params.push(filters.minPrice);
  }

  if (filters.maxPrice) {
    conditions.push('price <= $' + (params.length + 1));
    params.push(filters.maxPrice);
  }

  // Добавляем условия фильтрации в запрос, если они существуют
  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  // Добавляем сортировку (можно изменить на нужное поле)
  query += ' ORDER BY title';

  // Добавляем пагинацию
  const offset = (page - 1) * limit;
  query += ' LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
  params.push(limit, offset);

  // Выполняем запрос
  return await executeQuery(query, params);
};

module.exports = {
  getProducts,
};
