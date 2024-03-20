import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

// Функция для извлечения userId из токена JWT
const getUserIdFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId;
  } catch (error) {
    console.error("Ошибка при обработке токена:", error);
    return null;
  }
};

export const CartProvider = ({ children }) => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(getUserIdFromToken());
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(!!userId);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Обработка изменения пользователя
    const handleUserChange = () => {
      const newUserId = getUserIdFromToken();
      setIsUserAuthenticated(!!newUserId);
      setUserId(newUserId);
      const savedCart = localStorage.getItem(`cart-${newUserId || 'anonymous'}`);
      setCartItems(savedCart ? JSON.parse(savedCart) : []);
    };

    handleUserChange(); // Инициализация при загрузке

    window.addEventListener('storage', handleUserChange); // Слушаем изменения localStorage
    return () => window.removeEventListener('storage', handleUserChange); // Очистка при размонтировании
  }, []);

  useEffect(() => {
    // Сохраняем корзину в localStorage при изменении
    if (userId) {
      localStorage.setItem(`cart-${userId}`, JSON.stringify(cartItems));
    }
  }, [userId, cartItems]);

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const itemIndex = prevItems.findIndex(item => item.id === product.id);
      if (itemIndex !== -1) {
        // Если продукт уже есть в корзине, увеличиваем его количество
        const updatedItems = [...prevItems];
        updatedItems[itemIndex].quantity += 1;
        return updatedItems;
      }
      // Иначе добавляем новый продукт
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, quantity) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item // Предотвращаем отрицательное количество
      )
    );
  };

  const removeItem = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId)); // Удаляем товар из корзины
  };

  const placeOrder = async () => {
    if (!isUserAuthenticated) {
      navigate('/login'); // Переадресация на страницу входа, если пользователь не авторизован
      return;
    }

    if (cartItems.length === 0) {
      alert('Ваша корзина пуста.'); // Предупреждение, если корзина пуста
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/orders/placeOrder', {
        method: 'POST',
        body: JSON.stringify({ cartItems }), // Отправляем товары корзины
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error(`Ошибка: ${response.statusText}`);
      }

      setCartItems([]); // Очищаем корзину после успешного оформления заказа
      alert('Заказ успешно оформлен!');
      navigate('/order-success'); // Переадресация на страницу успешного оформления заказа
    } catch (error) {
      console.error('Ошибка при оформлении заказа:', error);
      alert('Ошибка при оформлении заказа.');
    }
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      updateQuantity,
      removeItem,
      placeOrder,
      isUserAuthenticated,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
