import React, { createContext, useContext, useReducer, useEffect } from 'react';

export const AuthContext = createContext(); // Создаем контекст аутентификации

const initialState = {
  isAuthenticated: false,
  user: null,
  token: localStorage.getItem('token'), // Получаем токен из localStorage
  isLoading: false,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'REQUEST':
      return { ...state, isLoading: true, error: null };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      localStorage.setItem('token', action.payload.token); // Сохраняем токен в localStorage
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
        error: null,
      };
    case 'LOGOUT':
      localStorage.removeItem('token'); // Удаляем токен из localStorage
      return { ...state, isAuthenticated: false, user: null, token: null, error: null };
    case 'ERROR':
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token'); // Изменено для использования значения напрямую из localStorage
      if (token) {
        try {
          const response = await fetch('/api/users/validateToken', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
          });
          if (!response.ok) {
            throw new Error('Token validation failed');
          }
          const { user } = await response.json();
          dispatch({ type: 'LOGIN_SUCCESS', payload: { token, user } });
        } catch (error) {
          localStorage.removeItem('token');
          dispatch({ type: 'LOGOUT' });
        }
      }
    };
    initializeAuth();
  }, []); // Оставляем массив зависимостей пустым, чтобы эффект выполнялся только при монтировании компонента

  const login = async (username, password) => {
    dispatch({ type: 'REQUEST' });
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
      const { token, user } = await response.json();
      localStorage.setItem('token', token);
      dispatch({ type: 'LOGIN_SUCCESS', payload: { token, user } });
    } catch (error) {
      dispatch({ type: 'ERROR', payload: error.toString() });
    }
  };

  const register = async (username, password, email) => {
    dispatch({ type: 'REQUEST' });
    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email }),
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
      const { token, user } = await response.json();
      localStorage.setItem('token', token);
      dispatch({ type: 'REGISTER_SUCCESS', payload: { token, user } });
    } catch (error) {
      dispatch({ type: 'ERROR', payload: error.toString() });
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
