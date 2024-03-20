import React from 'react';
import { useFurniture } from '../context/FurnitureContext';

const CustomizationSelector = () => {
    const { customizations, setCustomizations, availableCustomizations } = useFurniture();

    const handleChange = (e) => {
        const { name, checked } = e.target;
        setCustomizations(prev => ({ ...prev, [name]: checked }));
    };

    // Проверяем, загружены ли кастомизации
    if (!availableCustomizations) {
        return <div>Loading customizations...</div>; // Можно добавить индикатор загрузки
    }

    return (
        <div className="selector customization-selector">
            <h3>Выберите дополнительные опции</h3>
            {availableCustomizations.map(customization => (
                <label key={customization.customization_id}>
                    <input 
                        type="checkbox" 
                        name={customization.name} 
                        checked={!!customizations[customization.name]} 
                        onChange={handleChange} 
                    />
                    {customization.name}
                </label>
            ))}
        </div>
    );
};

export default CustomizationSelector;
