import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext/AuthContext';
import AuthForm from '../AuthForm/AuthForm';
import AdminPanel from './AdminPanel';
import '../AuthForm/AuthForm.css';

const UserProfile = () => {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      setLoading(true);
      fetch('/api/orders/myOrders', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`Ошибка загрузки заказов: ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => {
          setOrders(data.orders); 
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching orders:', error);
          setError(`Ошибка загрузки заказов: ${error.message}`);
          setLoading(false);
        });
    }
  }, [user]);

  const cancelOrder = (orderId) => {
    fetch(`/api/orders/${orderId}/cancel`, { 
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(response => {
      if (response.ok) {
        setOrders(currentOrders => currentOrders.filter(order => order.id !== orderId));
      } else {
        response.json().then(data => {
          alert(`Ошибка при отмене заказа: ${data.message}`);
        });
      }
    })
    .catch(error => {
      console.error('Error canceling order:', error);
      alert(`Ошибка при отмене заказа: ${error.message}`);
    });
  };

  const renderOrders = () => (
    <div>
      {loading ? <p>Загрузка заказов...</p> : orders.length > 0 ? (
        orders.map(order => (
          <div key={order.id} className="order-card">
            <h4>Заказ №{order.id}</h4>
            {/* Здесь можно добавить детали заказа, если они доступны */}
            <button onClick={() => cancelOrder(order.id)} className="btn btn-warning">Отменить заказ</button>
          </div>
        ))
      ) : error ? <p>Ошибка: {error}</p> : <p>У вас пока нет заказов.</p>}
    </div>
  );

  const renderAdminContent = () => (
    <div className="admin-content">
      <h2>Административная панель</h2>
      <AdminPanel />
      <button onClick={logout} className="btn btn-danger">Выйти</button>
    </div>
  );

  const renderUserContent = () => (
    <div className="user-content">
      <h2>Привет, {user.username}</h2>
      <h3>Ваши заказы:</h3>
      {renderOrders()}
      <button onClick={logout} className="btn btn-danger">Выйти</button>
    </div>
  );

  return (
    <div className="user-profile">
      <h1>Личный кабинет</h1>
      {!user ? (
        <AuthForm />
      ) : user.role === 'admin' ? (
        renderAdminContent() // Отображаем админ-панель для администраторов
      ) : (
        renderUserContent() // Отображаем пользовательский контент для обычных пользователей
      )}
    </div>
  );
};

export default UserProfile;
