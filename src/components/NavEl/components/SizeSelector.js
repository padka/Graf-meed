import React from 'react';
import { useFurniture } from '../context/FurnitureContext';

const SizeSelector = () => {
    const { selectedSize, setSelectedSize } = useFurniture();

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Убедимся, что value преобразуется в число, если оно не пустое
        setSelectedSize(prevSize => ({
            ...prevSize,
            [name]: value ? Number(value) : ''
        }));
    };

    return (
        <div className="selector size-selector">
            <h3>Выберите размеры</h3>
            <label>
                Ширина:
                <input type="number" name="width" value={selectedSize.width || ''} onChange={handleChange} className="size-input" />
            </label>
            <label>
                Высота:
                <input type="number" name="height" value={selectedSize.height || ''} onChange={handleChange} className="size-input" />
            </label>
            <label>
                Глубина:
                <input type="number" name="depth" value={selectedSize.depth || ''} onChange={handleChange} className="size-input" />
            </label>
        </div>
    );
};

export default SizeSelector;
