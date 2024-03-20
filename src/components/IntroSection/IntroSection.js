import React, { useState, useEffect } from 'react';
import './IntroSection.css';

function IntroSection() {
    const [introData, setIntroData] = useState({
        title: '',
        sections: [],
        images: [] // Инициализируем как пустой массив
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/introSection');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();

                setIntroData({
                    title: data.paragraphs.title,
                    sections: data.paragraphs.sections ? data.paragraphs.sections : [],
                    images: data.images.images ? data.images.images : [],
                });
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.message);
            }
        };

        fetchData();
    }, []);

    if (error) {
        return <div>Error loading Intro Section: {error}</div>;
    }

    return (
        <section className="intro-section">
            <h2>{introData.title}</h2>
            {introData.sections.map(( index) => (
                <div key={index}>
                  
                </div>
            ))}
            <div className="gallery">
                {introData.images.map((img, index) => (
                    <div className="image-container" key={index}>
                        <img src={img} alt={`Gallery item ${index + 1}`} loading="lazy" />
                        <div className="image-text">
                            {introData.sections[index] ? introData.sections[index].header : "Описание недоступно"}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default IntroSection;
