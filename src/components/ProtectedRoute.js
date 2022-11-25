import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserAuth } from '../contexts/UserAuthContext';

/** Функция защищает от входа в приложение неавторизованного 
 * пользователя. Используется в App.js */

export const ProtectedRoute = ({ children }) => {
  /** переменная user, полученная из UserAuthContextProvider 
   * после аутентификации */

  let { user } = useUserAuth();
  if (!user) {
    return <Navigate to='/' />
  }
  return children;
}
