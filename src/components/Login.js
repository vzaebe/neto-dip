import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiService.login(formData.email, formData.password);
      
      if (response.success) {
        // Сохраняем токен или другую информацию о сессии
        localStorage.setItem('authToken', response.token || 'authenticated');
        navigate('/admin');
      } else {
        setError(response.error || 'Ошибка авторизации');
      }
    } catch (error) {
      setError('Ошибка подключения к серверу');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container admin">
      <header className="admin-header">
        <a href="/" className="logo-link">
          <h1 className="admin-header__logo logo">
            идём<span className="logo-letter">в</span>кино
          </h1>
        </a>
        <p className="admin-header__text">Администраторррская</p>
      </header>
      
      <section className="login">
        <header className="login__header">
          <h2 className="login__title">Авторизация</h2>
        </header>
        
        <form className="login__form" onSubmit={handleSubmit}>
          <label className="login__label-email" htmlFor="email">
            E-mail
          </label>
          <input
            className="login__input-email"
            type="email"
            name="email"
            id="email"
            placeholder="example@domain.xyz"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          
          <label className="login__label-password" htmlFor="password">
            Пароль
          </label>
          <input
            className="login__input-password"
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          
          {error && <div className="login__error">{error}</div>}
          
          <button 
            className="login__button button" 
            type="submit"
            disabled={loading}
          >
            {loading ? 'Авторизация...' : 'Авторизоваться'}
          </button>
        </form>
      </section>
    </div>
  );
};

export default Login; 