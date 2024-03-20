import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext/AuthContext'; // Импортируем хук для использования контекста аутентификации

const AuthForm = () => {
  const navigate = useNavigate(); // Хук для программного перенаправления
  const [formType, setFormType] = useState('login'); // Состояние для отслеживания типа формы: вход, регистрация, сброс пароля
  const [credentials, setCredentials] = useState({ username: '', password: '', email: '', newPassword: '' }); // Состояние для учетных данных пользователя
  const { login, register, isLoading, error } = useAuth(); // Используем функции из контекста аутентификации

  // Обработчик изменений в полях формы
  const handleChange = (e) => {
    const { name, value } = e.target; // Получаем имя поля и его значение
    setCredentials(prevCredentials => ({ ...prevCredentials, [name]: value })); // Обновляем состояние с учетными данными пользователя
  };

  // Обработчик отправки формы
  const handleSubmit = async (event) => {
    event.preventDefault(); // Предотвращаем стандартную отправку формы
    if (isLoading) return; // Если идет загрузка, не выполняем действие

    try {
      if (formType === 'login') {
        // Выполняем вход и получаем данные пользователя
        await login(credentials.username, credentials.password);
        // После успешного входа перенаправляем пользователя
        // Перенаправление будет осуществлено в useEffect в AuthContext, если вход успешный
      } else if (formType === 'register') {
        // Выполняем регистрацию и получаем данные пользователя
        await register(credentials.username, credentials.password, credentials.email);
        // После успешной регистрации показываем сообщение и перенаправляем
        alert('Вы успешно зарегистрированы на сайте!');
        // Перенаправление будет осуществлено в useEffect в AuthContext, если регистрация успешная
      } else if (formType === 'reset') {
        // Пропускаем логику для сброса пароля, так как она зависит от вашей реализации
      }
    } catch (error) {
      // Если произошла ошибка, показываем ее сообщение
      alert(`Произошла ошибка: ${error.message}`);
    }
  };

  return (
    <div className="auth-form-wrapper">
      <div className="auth-form-container">
        <h2 className="auth-form-title">
          {formType === 'login' ? 'Вход в систему' : formType === 'register' ? 'Регистрация' : 'Сброс пароля'}
        </h2>
        <form onSubmit={handleSubmit}>
          {formType === 'register' && (
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                required={formType === 'register'}
                disabled={isLoading}
              />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="username">Имя пользователя</label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
          {formType !== 'reset' && (
            <div className="form-group">
              <label htmlFor="password">Пароль</label>
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
          )}
          {formType === 'reset' && (
            <div className="form-group">
              <label htmlFor="newPassword">Новый пароль</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={credentials.newPassword}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
          )}
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
          <button type="submit" className="gradient-button">
            {isLoading ? 'Загрузка...' : formType === 'login' ? 'Войти' : formType === 'register' ? 'Зарегистрироваться' : 'Сбросить пароль'}
          </button>
          <button type="button" className="toggle-button" onClick={() => setFormType(formType === 'login' ? 'register' : 'login')}>
            {formType === 'login' ? 'Зарегистрироваться' : 'Войти'}
          </button>
          {formType !== 'reset' && (
            <button type="button" className="toggle-button" onClick={() => setFormType('reset')}>
              Забыли пароль?
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default AuthForm;