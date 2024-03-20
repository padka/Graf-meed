import React, { useContext, useEffect, useState } from 'react';
import  FurnitureContext from '../context/FurnitureContext';

const MaterialSelector = () => {
    const { materials, setMaterial } = useContext(FurnitureContext);
    const [selectedMaterial, setSelectedMaterial] = useState('');

    useEffect(() => {
        // Загрузка доступных материалов может быть выполнена здесь, если они не загружены глобально
    }, []);

    const handleChange = (event) => {
        const materialId = event.target.value;
        setSelectedMaterial(materialId);
        setMaterial(materialId);
    };

    return (
        <div className="material-selector">
            <label htmlFor="material-select">Материал:</label>
            <select id="material-select" value={selectedMaterial} onChange={handleChange}>
                <option value="">Выберите материал</option>
                {materials.map((material) => (
                    <option key={material.material_id} value={material.material_id}>
                        {material.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default MaterialSelector;
