import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '../contexts/UserAuthContext';
import heart from '../heartListTask.svg';
import { useUserDocs } from '../contexts/UserDocsContext';

/** Компонента Header используемая для выхода из аккаунта */

export const Header = () => {
  /**
   * переменная user - объект пользователя,
   * authId - переменная, принимающая значения 1 или 2
   * logOut - функция для выхода из аккаунта
   * полученные из UserAuthContextProvider
   */
  const { user, logOut, authId } = useUserAuth();
  const navigate = useNavigate();
  /** 
   * функция setTasks для обнуления списка задач при выходе 
   * из аккаунта, полученная из UserDocsContextProvider */
  const { setTasks } = useUserDocs();

  /** Осуществляет выход пользователя из аккаунта
   * @async
   */
  const handleLogOut = async () => {
    try {
      await logOut();
      setTasks([]);
      (navigate('/'))
    } catch (err) {
      console.log(err.message);
    }
  }

  return (
    <header className='header'>
      <img src={heart} className='logo' alt='Logo' />
      {user && authId === 1 &&
        <div className='login'>
          <h6 className='loginName'>{user && user.email}</h6>
          <button
            className='button logOutBtn'
            onClick={handleLogOut}>Выход</button>
        </div>
      }
    </header>
  );
}