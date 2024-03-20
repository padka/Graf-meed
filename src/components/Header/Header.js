import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Используем компонент Link для навигации
import logo from '../../Image/logo.png'; 
import basket from '../../Image/icons/emailIcon.svg'; 
import "./Header.css";

const MainHeader = () => {
  return (
    <Navbar className="bg-white" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img src={logo} alt='Logo' className="icon-placeholder-logo"/>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/catalog">Каталог</Nav.Link>
            <Nav.Link as={Link} to="/about">Портфолио</Nav.Link>
            <Nav.Link as={Link} to="/profile">Личный кабинет</Nav.Link> {/* Исправленный путь */}
          </Nav>
          <Nav>
            <Nav.Link as={Link} to="/cart">
              Корзина <img src={basket} alt='Корзина' className="icon-placeholder"/>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

const Header = () => {
  return <MainHeader />;
};

export default Header;
