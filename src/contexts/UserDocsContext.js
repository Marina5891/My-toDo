import { createContext, useContext, useState } from 'react';
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  getDoc,
  doc,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase-config';

const userDocsContext = createContext();

/**  
 * Принимает параметром входящие компоненты, которые, при необходимости, смогут получить доступ к ее переменным и функциям
*/

export function UserDocsContextProvider({ children }) {
  /** переменные tasks, statusTask, editTaskId, editTask, fileTask,
   * fileTaskURL, image и функции setTasks, setStatusTask,
   * setEditTaskId, setEditTask, setFileTask, setFileTaskURL, setImage,
   * устанавливающие новые значения данных переменных
   */
  const [tasks, setTasks] = useState([]);
  const [statusTask, setStatusTask] = useState(false);
  const [editTaskId, setEditTaskId] = useState('');
  const [editTask, setEditTask] = useState(null);
  const [fileTask, setFileTask] = useState(null);
  const [fileTaskURL, setFileTaskURL] = useState([]);
  const [image, setImage] = useState([]);

  /**
   * Получает из базы данных весь список задач пользователя
   */
  const loadDocs = () => {
    onSnapshot(collection(db, 'tasks'),
      (snapshot) => {
        const newDocs = snapshot.docs.map(
          (doc) => ({ ...doc.data(), id: doc.id })
        )
        setTasks(newDocs);
      },
      (error) => {
        console.log('Error: ', error);
      }
    );
  }
  /**
   * Вызывает встроенную функцию firebase для добавления
   * новой задачи в базу данных
   */
  function addTask(task) {
    return addDoc(collection(db, 'tasks'), {
      title: task.title,
      description: task.description,
      createdAt: task.createdAt,
      file: task.file,
      completionDate: task.completionDate,
      status: false
    });
  }

  /**
   * Вызывает встроенную функцию firebase для получения выбранной
   * задачи для дальнейшего ее редактирования
   * @param {string} taskId 
   */

  const getTask = async (taskId) => {
    const task = doc(db, 'tasks', taskId);
    try {
      const editDoc = await getDoc(task);
      setEditTask(editDoc.data());
      setImage(editDoc.data().file.map((imgElem, i) =>
        <img key={i} src={imgElem} className='imageTask' title='Функционал удаления еще недоработан' />
      ))
    } catch (err) {
      console.log(err.message)
    }
  }
  /**
    * Вызывает встроенную функцию firebase для обновления
    * отредактированной задачи
    * @param {string} taskId 
    * @param {Object} newTask  
    */
  const updateTask = async (taskId, newTask) => {
    const editDoc = doc(db, 'tasks', taskId);
    return await updateDoc(editDoc, {
      title: newTask.title,
      description: newTask.description,
      completionDate: newTask.completionDate,
      file: [...newTask.file]
    })
  }

  /**
   * Вызывает встроенную функцию firebase для обновления статуса задачи
   * @param {string} taskId 
   * @param {boolean} status  
   */

  const doneTask = async (taskId, status) => {
    const editDoc = doc(db, 'tasks', taskId);
    return await updateDoc(editDoc, {
      status: !status
    })
  }
  /**
   * Вызывает встроенную функцию firebase для удаления задачи
   * @param {string} docId  
   */
  const deleteTask = async (docId) => {
    return await deleteDoc(doc(db, 'tasks', docId))
  }

  return (
    <userDocsContext.Provider value={{ addTask, tasks, setTasks, loadDocs, deleteTask, updateTask, editTask, setEditTask, editTaskId, setEditTaskId, getTask, fileTask, setFileTask, fileTaskURL, setFileTaskURL, doneTask, statusTask, setStatusTask, image, setImage }}>
      {children}
    </userDocsContext.Provider>
  )
}

/** Дает компонентам, в которых вызывается данная функция доступ
 * к переменным и функциям UserDocsContextProvider */

export function useUserDocs() {
  return useContext(userDocsContext);
}