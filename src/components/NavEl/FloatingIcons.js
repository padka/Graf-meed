import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalculator } from '@fortawesome/free-solid-svg-icons';
import { faTelegramPlane } from '@fortawesome/free-brands-svg-icons';
import '../NavEl/Style/FloatingIcons.css';
import FurnitureConstructor from './components/FurnitureConstructor'; 

const FloatingIcons = () => {
  const [showConstructor, setShowConstructor] = useState(false);

  const handleCalculatorClick = () => {
    setShowConstructor(true);
  };

  const handleClose = () => {
    setShowConstructor(false);
  };

  return (
    <div className="floating-icons">
      <button className="icon-button" onClick={handleCalculatorClick}>
        <FontAwesomeIcon icon={faCalculator} size="2x" />
      </button>
      <a href="https://t.me/yourusername" target="_blank" rel="noopener noreferrer" className="icon-button">
        <FontAwesomeIcon icon={faTelegramPlane} size="2x" />
      </a>

      {showConstructor && (
        <div className="constructor-modal">
          <div className="modal-content">
            <button className="close-button" onClick={handleClose}>Закрыть</button>
            <FurnitureConstructor />
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingIcons;
