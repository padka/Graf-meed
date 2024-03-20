import React from 'react';
import './Adventage.css'; // Убедитесь, что вы создали соответствующий CSS файл

const AdvantagesComponent = () => {
  return (
    <>
     <h2 className='advantage-text'>Наши преимущества</h2>
    <div className="advantages-container">
      <div className="advantage-item">
        <h3>Используем редкие породы дерева и европейскую фурнитуру.</h3>
        <a href="/production">Производство →</a>
      </div>
      <div className="advantage-item">
        <h3>Гарантия до 24 месяцев.</h3>
        <a href="/certificates">Сертификаты →</a>
      </div>
      <div className="advantage-item">
        <h3>Индивидуальный дизайн, доставка и сборка.</h3>
        <a href="/services">Наши услуги →</a>
      </div>
      <div className="advantage-item">
        <h3>Изготовим мебель любой сложности.</h3>
        <a href="/catalog">Каталог →</a>
      </div>
    </div>
    </>
  );
};

export default AdvantagesComponent;
