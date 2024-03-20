import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext/AuthContext';
import { useCart } from '../CartContext/CartContext';
import CartItem from './CartItem/CartItem';
import AuthForm from '../AuthForm/AuthForm';
import './Cart.css';

const Cart = () => {
  const { cartItems, removeItem, placeOrder, updateQuantity, orderStatus } = useCart();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (orderStatus === 'success') {
      navigate('/order-success');
    }
  }, [orderStatus, navigate]);

  const handlePlaceOrder = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (cartItems.length === 0) {
      alert('Ваша корзина пуста.');
      return;
    }

    placeOrder();
  };

  const totalCost = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="cart-container">
      <h2 className="cart-title">Ваша корзина</h2>
      {cartItems.length > 0 ? (
        <div className="cart-items-list">
          {cartItems.map(item => (
            <CartItem 
              key={item.id}
              item={item}
              updateQuantity={updateQuantity}
              removeItem={removeItem}
            />
          ))}
          <div className="cart-total">
            <strong>Общая стоимость:</strong> {`${totalCost.toFixed(2)} руб.`}
          </div>
          <button className="cart-checkout-button" onClick={handlePlaceOrder}>
            Оформить заказ
          </button>
        </div>
      ) : (
        <p className="cart-empty-message">Ваша корзина пуста</p>
      )}

      {showAuthModal && (
        <div className="modal">
          <div className="modal-content">
            <button onClick={() => setShowAuthModal(false)} className="close">&times;</button>
            <div className="auth-form-title">
              <h5>Для оформления заказа, пожалуйста, выполните вход в свой аккаунт</h5>
            </div>
            <div className="auth-form-wrapper">
              <AuthForm />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
