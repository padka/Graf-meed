import React, { useState } from 'react';
import '../Style/FurnitureConstructor.css'; // Проверьте, что этот путь верный

// Предположим, что у вас есть следующее изображение для мебели
import defaultFurnitureImage from '../../../Image/2.png';

const FurnitureConstructor = () => {
  const [dimensions, setDimensions] = useState({ width: 1660, height: 2780, depth: 240 });
  const [material, setMaterial] = useState('Бежевый, ЛДСП 16мм');

  const handleDimensionChange = (dimension, value) => {
    setDimensions({ ...dimensions, [dimension]: value });
  };

  return (
    <div className="furniture-constructor">
      <h2>Конструктор мебели</h2>
      <div className="constructor-layout">
        <div className="product-image">
          <img src={defaultFurnitureImage} alt="Мебель" />
        </div>
        <div className="settings">
          <div className="dimension-sliders">
          <div className="dimension-sliders">
  <div className="slider">
    <label htmlFor="width-slider">Ширина: {dimensions.width} мм</label>
    <input 
      type="range" 
      id="width-slider" 
      min="1000" 
      max="2000" 
      value={dimensions.width} 
      onChange={(e) => handleDimensionChange('width', parseInt(e.target.value))} 
    />
  </div>
  <div className="slider">
    <label htmlFor="height-slider">Высота: {dimensions.height} мм</label>
    <input 
      type="range" 
      id="height-slider" 
      min="2000" 
      max="3000" 
      value={dimensions.height} 
      onChange={(e) => handleDimensionChange('height', parseInt(e.target.value))} 
    />
  </div>
  <div className="slider">
    <label htmlFor="depth-slider">Глубина: {dimensions.depth} мм</label>
    <input 
      type="range" 
      id="depth-slider" 
      min="200" 
      max="500" 
      value={dimensions.depth} 
      onChange={(e) => handleDimensionChange('depth', parseInt(e.target.value))} 
    />
  </div>
</div>
          </div>
          <div className="material-selector">
         

<div className="material-selector">
  <label htmlFor="material-select">Материал:</label>
  <select 
    id="material-select" 
    value={material} 
    onChange={(e) => setMaterial(e.target.value)}
  >
    <option value="Бежевый, ЛДСП 16мм">Бежевый, ЛДСП 16мм</option>
    <option value="Белый, ЛДСП 16мм">Белый, ЛДСП 16мм</option>
    <option value="Черный, ЛДСП 16мм">Черный, ЛДСП 16мм</option>
    <option value="Дуб, ЛДСП 16мм">Дуб, ЛДСП 16мм</option>
    <option value="Венге, ЛДСП 16мм">Венге, ЛДСП 16мм</option>
 
  </select>
</div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default FurnitureConstructor;
