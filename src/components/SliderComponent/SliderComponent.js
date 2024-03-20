import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './SliderComponent.css'; 
import Plant1 from  '../../Image/1.png';
import Plant2 from '../../Image/kitchen.png' 
import Plant3 from '../../Image/bathroom.png' 
const SliderComponent = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "linear"
  };

  return (
    
    <div className="slider-container">
      <Slider {...settings}>
        <div className="slide">
          <img src={Plant1} alt="Plant 1" />
        </div>
        <div className="slide">
          <img src={Plant2} alt="Plant 2" />
        </div>
        <div className="slide">
          <img src={Plant3} alt="Plant 3" />
        </div>
      </Slider>
      
    </div>
  );
};

export default SliderComponent;


