import React from "react";
import { Routes, Route } from "react-router-dom";
import { Header } from './components/Header';
import { Form } from './components/Form';
import { Profile } from './components/Profile';
import { CreateTask } from './components/CreateTask';
import { EditTask } from './components/EditTask';
import { ProtectedRoute } from './components/ProtectedRoute';
import { UserAuthContextProvider } from './contexts/UserAuthContext';
import { UserDocsContextProvider } from './contexts/UserDocsContext';
import './App.css';

function App() {
  /**
   * Возвращает цифру 1 или 2 для дальнейшей ее передачи в 
   * компоненту Form
   * @param {number} id - 1 или 2
   * @returns {number} - 1 или 2
   */
  const handleActionForm = (id) => {
    return id;
  }

  return (
    <div className='app'>
      <UserAuthContextProvider>
        <UserDocsContextProvider>
          <Header />
          <Routes>
            <Route
              path='/profile'
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
            <Route
              path='/profile/createTask'
              element={
                <ProtectedRoute>
                  <CreateTask />
                </ProtectedRoute>} />
            <Route
              path='/profile/editTask:id'
              element={
                <ProtectedRoute>
                  <EditTask />
                </ProtectedRoute>} />
            <Route
              path='/'
              element={
                <Form
                  title='Авторизация'
                  textBtn='Войти'
                  handleActionForm={() => handleActionForm(1)} />
              } />
            <Route
              path='/register'
              element={
                <Form
                  title='Регистрация'
                  textBtn='Зарегистрироваться'
                  handleActionForm={() => handleActionForm(2)} />
              } />
          </Routes>
        </UserDocsContextProvider>
      </UserAuthContextProvider>
    </div>
  );
}

export default App;
