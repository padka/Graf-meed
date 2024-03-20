import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Footer.css'; 

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col xs={12} md={4} className="footer-column">
            <h5>Информация</h5>
            <ul className="footer-links">
              <li><a href="/about">О нас</a></li>
              <li><a href="/contacts">Контакты</a></li>
              <li><a href="/feedback">Обратная связь</a></li>
            </ul>
          </Col>
          <Col xs={12} md={4} className="footer-column">
            <h5>Покупателям</h5>
            <ul className="footer-links">
              <li><a href="/info">Полезная информация</a></li>
              <li><a href="/delivery">Доставка и оплата</a></li>
            </ul>
          </Col>
          <Col xs={12} md={4} className="footer-column">
            <h5>Связь с нами</h5>
            <ul className="footer-links">
              <li><a href="tel:+77777777777">+7(777)777-77-77</a></li>
              <li><a href="mailto:sampletext@gmail.com">sampletext@gmail.com</a></li>
            </ul>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
