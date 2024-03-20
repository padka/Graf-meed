import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>404 - Страница не найдена</h1>
      <p>Извините, запрашиваемая вами страница не существует.</p>
      <Link to="/">Вернуться на главную страницу</Link>
    </div>
  );
};

export default NotFoundPage;
