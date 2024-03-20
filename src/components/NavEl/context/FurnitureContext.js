import React, { createContext, useContext, useState, useEffect } from 'react';

// Функции для взаимодействия с API
async function fetchMaterials() {
    const response = await fetch('/api/materials');
    if (!response.ok) {
        throw new Error('Could not fetch materials');
    }
    return response.json();
}

async function fetchCustomizations() {
    const response = await fetch('/api/customizations');
    if (!response.ok) {
        throw new Error('Could not fetch customizations');
    }
    return response.json();
}

async function fetchDimensions() {
    const response = await fetch('/api/dimensions');
    if (!response.ok) {
        throw new Error('Could not fetch dimensions');
    }
    return response.json();
}

// Создание контекста
const FurnitureContext = createContext();

// Создание хука для использования контекста
export function useFurniture() {
    return useContext(FurnitureContext);
}

// Провайдер контекста
export function FurnitureProvider({ children }) {
    const [materials, setMaterials] = useState([]);
    const [customizations, setCustomizations] = useState([]);
    const [dimensions, setDimensions] = useState([]);
    const [selectedMaterial, setSelectedMaterial] = useState('');
    const [selectedSize, setSelectedSize] = useState({ width: 0, height: 0, depth: 0 });
    const [selectedCustomizations, setSelectedCustomizations] = useState({});
    const [image, setImage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        async function loadData() {
            try {
                const loadedMaterials = await fetchMaterials();
                const loadedCustomizations = await fetchCustomizations();
                const loadedDimensions = await fetchDimensions();
                setMaterials(loadedMaterials);
                setCustomizations(loadedCustomizations);
                setDimensions(loadedDimensions);
            } catch (error) {
                console.error("Error loading furniture data:", error);
                setError(error.message);
            }
        }
        loadData();
    }, []);

    const value = {
        materials, setMaterials,
        customizations, setCustomizations,
        dimensions, setDimensions,
        selectedMaterial, setSelectedMaterial,
        selectedSize, setSelectedSize,
        selectedCustomizations, setSelectedCustomizations,
        image, setImage,
        error, setError,
    };

    return (
        <FurnitureContext.Provider value={value}>
            {children}
        </FurnitureContext.Provider>
    );
}

export default FurnitureContext;
