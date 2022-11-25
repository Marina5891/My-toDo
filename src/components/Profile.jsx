import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserDocs } from '../contexts/UserDocsContext';
import dayjs from 'dayjs';

/**
 * Компонента Profile, отрисовывающая главную станицу профиля пользователя
 */

export const Profile = () => {
  /**
   * tasks - массив задач, полученных из базы данных, 
   * doneTask - функция, меняющая статус задачи на true или false,
   * loadDocs - функция, получающая список задач из базы данных,
   * deleteTask - функция, удаляющая задачу, 
   * setEditTaskId - функция, устанавливающая id редактируемой задачи
   * для использования в компоненте EditTask,
   * полученные из UserDocsContextProvider
   */
  const {
    tasks,
    doneTask,
    loadDocs,
    deleteTask,
    setEditTaskId } = useUserDocs();
  /** Переменная, отображающая текущее время */
  const currentDate = dayjs();
  const navigate = useNavigate();

  /** Вызывает функцию загрузки списка задач */
  useEffect(() => {
    loadDocs();
  }, []);
  /** Удаляет задачу
   * @param {string} taskId
   */
  const handleRemoveTask = (taskId) => {
    deleteTask(taskId)
  }

  /** Переходит на страницу редактирования задачи
   * @param {string} taskId
   */

  const handleEditTask = (taskId) => {
    setEditTaskId(taskId);
    navigate(`editTask:${taskId}`);
  }
  /** Изменяет статус готовности задачи
   * @param {string} taskId
   * @param {boolean} status
   */
  const handleStatusTask = (taskId, status) => {
    doneTask(taskId, status);
  }

  return (
    <main>
      <h1 className='formTitle'>Мои задачи</h1>
      <Link type='button' to='createTask' className='createTask' />
      <div className='taskList'>
        {
          tasks && tasks.map(task => {
            const dateCompletion = dayjs(task.completionDate);

            return (
              <div className='taskItem' key={task.id}>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <div className='dateCompletionTask'>
                  <span>Статус: </span>
                  {
                    dateCompletion < currentDate &&
                    <span>Ну как так можно? А?</span>
                  }
                  {
                    dateCompletion >= currentDate &&
                    <span>Еще есть время все успеть</span>
                  }
                </div>
                <div className='statusButtons'>
                  <button
                    className={task.status ? 'done' : 'notDone'}
                    title='Готово'
                    onClick={(e) => handleStatusTask(task.id, task.status)} />
                  <button
                    className='edit'
                    title='Редактировать'
                    onClick={() => handleEditTask(task.id)} />
                  <button
                    className='remove'
                    title='Удалить'
                    onClick={() => handleRemoveTask(task.id)} />
                </div>
              </div>

            )
          })
        }
      </div>
    </main>
  )
}
