import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '../contexts/UserAuthContext';

/**
 * Компонента Form, которая отображает форму регистрации, 
 * либо форму авторизации, в зависимости от полученного ей id
 * @param {Object} props
 * @param {string} props.title - Заголовок формы
 * @param {string} props.textBtn - Название кнопки формы
 * @param {function} props.handleActionForm - Передает 
 * функцию handleActionForm из App.js для дальнейшего
 * использования в компоненте Form 
 */

export const Form = ({ title, textBtn, handleActionForm }) => {
  /** 
   * переменные email, password, error и функции setEmail, 
   * setPassword, setError - устанавливающие новые значения 
   * данных переменных */
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  /** 
   * функция signUp - для регистрации нового пользователя
   * функция logIn - для авторизации, 
   * переменная authId - может принимать значения 1 или 2,
   * функция setAuthId - для установки нового значения authId, 
   * полученные из UserAuthContextProvider
  */
  const { signUp, logIn, authId, setAuthId } = useUserAuth();
  const navigate = useNavigate();

  /**
   * Функция отправляет данные формы регистрации или авторизации
   * на сервер (в зависимости от id, где id === 1 - авторизация 
   * существующего пользователя, id === 2 - регистрация нового
   * пользователя)
   * @async
   * @param {Object} event - объект события, возникающий при
   * @returns {Promise}
   * отправке формы
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    const id = handleActionForm();
    setError('');
    try {
      if (id === 2) {
        await signUp(email, password);
        navigate('/');
      }
      if (id === 1) {
        await logIn(email, password);
        setAuthId(id);
        navigate('/profile')
      }
    } catch (err) {
      if (err.message === 'Firebase: Error (auth/wrong-password).') {
        setError('Вы ввели неверный пароль');
      } else if (err.message === 'Firebase: Error (auth/user-not-found).') {
        setError('Пользователь не найден')
      } else if (err.message === 'Firebase: Password should be at least 6 characters (auth/weak-password).') {
        setError('Пароль должен содержать не менее 6 символов');
      } else if (err.message === 'Firebase: Error (auth/invalid-email).') {
        setError('Введите адрес электронной почты и пароль')
      } else if (err.message === 'Firebase: Error (auth/email-already-in-use).') {
        setError('Такой пользователь уже существует')
      } else {
        setError(err.message)
      }
    }
  }

  /**
   * Функция, переключающая пользователя со страницы регистрации 
   * на страницу авторизации и обратно в зависимости от значения
   * authId, где authId === 1 - переход на форму регистрации, 
   * а authId === 2 - переход на форму авторизации.
   */

  const handleClick = () => {
    if (authId === 2) {
      setAuthId(1);
      setError('');
      navigate('/');
    } else if (authId === 1) {
      setAuthId(2);
      setError('')
      navigate('/register');
    }
  }

  return (
    <main>
      <h1 className='formTitle'>{title}</h1>
      {error && <div className='errorMessage'>{error}</div>}
      <form className='form' onSubmit={handleSubmit} >
        <div className='formItem'>
          <label htmlFor='email'>Введите email</label>
          <input
            type='email'
            name='email'
            id='email'
            placeholder='Ваш email'
            onChange={event => setEmail(event.target.value)} />
        </div>
        <div className='formItem'>
          <label htmlFor='password'>Введите пароль</label>
          <input
            type='password'
            name='password'
            id='password'
            placeholder='Ваш пароль'
            onChange={(event => setPassword(event.target.value))} />
        </div>
        <button
          type='submit'
          className='button'>{textBtn}</button>
      </form>
      {
        authId === 2 &&
        (<div className='authMessage'>
          Уже зарегистрированы?
          <a type='button' onClick={handleClick}>Войти</a>
        </div>)
      }
      {
        authId === 1 &&
        (<div className='authMessage'>
          Еще не зарегистрированы?
          <a type='button' onClick={handleClick}>Зарегистрироваться</a>
        </div>)
      }
    </main>
  )
}
