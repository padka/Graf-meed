import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../AuthContext/AuthContext';
import AuthForm from '../AuthForm/AuthForm';
import { useCart } from '../CartContext/CartContext';
import './PlaceOrder.css';
import { useNavigate } from 'react-router-dom'; // Добавляем useNavigate для программного перенаправления

const PlaceOrderComponent = () => {
  const { cartItems, placeOrder, orderStatus, setOrderStatus } = useCart();
  const { user } = useContext(AuthContext);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate(); // Используем useNavigate для перенаправления пользователя

  useEffect(() => {
    if (orderStatus === 'success') {
      // Если заказ успешно оформлен, перенаправляем пользователя на страницу подтверждения заказа
      navigate('/order-success'); // Предполагаем, что у вас есть такой маршрут
    }
  }, [orderStatus, navigate]);

  const handlePlaceOrder = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (cartItems.length === 0) {
      setShowEmptyCartMessage(true);
      setTimeout(() => {
        setShowEmptyCartMessage(false);
      }, 3000);
      return;
    }

    placeOrder();
  };

  return (
    <div>
      <button className="place-order-button" onClick={handlePlaceOrder}>Оформить заказ</button>

      {showAuthModal && (
        <div className="auth-modal active">
          <div className="auth-modal-content">
            <div className="auth-modal-header">
              <h5>Для оформления заказа, пожалуйста, выполните вход в свой аккаунт</h5>
              <button onClick={() => setShowAuthModal(false)} className="close">&times;</button>
            </div>
            <div className="auth-modal-body">
              <AuthForm />
            </div>
          </div>
        </div>
      )}

      {showEmptyCartMessage && (
        <div className="empty-cart-message">
          Ваша корзина пуста. Пожалуйста, добавьте товары, прежде чем оформлять заказ.
        </div>
      )}
    </div>
  );
};

export default PlaceOrderComponent;
