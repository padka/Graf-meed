import React from 'react';
import Header from './Header';
import SliderComponent from './SliderComponent';
import Catalog from './Catalog';
import Footer from './Footer';
import IntroSection from '../IntroSection/IntroSection';

const IndexPage = () => {
  return (
    <div>
      <Header />
      <SliderComponent />
      <Catalog isHomePage={true} />
      <IntroSection />
      <Footer />
    </div>
  );
};

export default IndexPage;
