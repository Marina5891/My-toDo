import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserDocs } from '../contexts/UserDocsContext';

/** Компонента EditTask, которая отображает страницу создания 
 * новой задачи
 */

export const EditTask = () => {
  /**
   * функция updateTask - для обновления задачи,
   * функция getTask - для получения задачи из базы данных,
   * функция setEditTaskId - для обнуления значения id 
   * редактируемой задачи,
   * функция setEditTask - для обнуления значения редактируемой 
   * задачи,
   * функция setFileTask - для установки нового значения 
   * переменной fileTask,
   * функция setFileTaskURL - для установки нового значения 
   * переменной fileTaskURL,
   * функция setImage - для установки нового значения переменной 
   * image,
   * editTask - редактируемая задача (объект), 
   * editTaskId - id редактируемой задачи (строка),    
   * fileTaskURL - массив ссылок на изображения,    
   * image - массив тегов со ссылками на изображения 
   * (вида [<img src={}/>, <img src={}/>, ... ]),
   * полученные из UserDocsContextProvider
   */
  const {
    updateTask,
    getTask,
    setEditTaskId,
    setEditTask,
    setFileTask,
    setFileTaskURL,
    setImage,
    editTask,
    editTaskId,
    fileTaskURL,
    image } = useUserDocs();
  const navigate = useNavigate();
  /** Экземпляр класса FileReader для чтения ссылки на файл */
  const fileReader = new FileReader;

  /** Получение задачи для редактирования */
  useEffect(() => {
    getTask(editTaskId);
  }, [])

  /**
   * Возвращает на страницу профиля, обнуляя переменные editTaskId, 
   * editTask и image */
  const handleReturn = () => {
    setEditTaskId('');
    setEditTask(null);
    setImage([]);
    navigate('/profile');
  }
  /** Получает из поля выбора файлов ссылку на загружаемый файл */
  const handleOnChange = (event) => {
    let file = event.target.files[0]
    setFileTask(file);
    fileReader.readAsDataURL(file)
  }
  /** Загружает ссылки на файлы в массив fileTaskURL, 
   * загружает теги со ссылками на полученные изображения в массив image */
  fileReader.onload = () => {
    setFileTaskURL(prevVaule => [...prevVaule, fileReader.result]);
    setImage(prevImage => [...prevImage, <img src={fileReader.result} className='imageTask' title='Функционал удаления еще недоработан' />])
  }
  /** Отправляет отредактированную задачу на сервер */
  function handleSubmit(e) {
    e.preventDefault();
    const { target: { title, description, completionDate }
    } = e;
    /** старый массив ссылок на изображения
     * @type {string[] | null} */
    const fileOldTask = editTask?.file;
    /** новый объект задачи */
    const task = {
      title: title.value,
      description: description.value,
      file: [...fileOldTask, ...fileTaskURL],
      completionDate: completionDate.value,
    }
    try {
      updateTask(editTaskId, task);
      setEditTask(null);
      setEditTaskId('');
      setFileTaskURL([]);
      setFileTask(null);
      setImage([]);
      navigate('/profile');
    } catch (err) {
      console.log(err.message)
    }
  }

  return (
    <main>
      <h1 className='formTitle'>Редактировать задачу</h1>
      <button onClick={handleReturn} className='button returnButton'>Вернуться</button>
      <form className='form' method='post' onSubmit={handleSubmit}>
        <div className='formItem'>
          <input
            name='title'
            id='title'
            placeholder='Название'
            required
            autoFocus
            defaultValue={editTask?.title} />
        </div>
        <div className='formItem'>
          <textarea
            name='description'
            id='description'
            placeholder='Описание'
            required
            rows='5'
            defaultValue={editTask?.description}>
          </textarea>
        </div>
        <div className='formItem'>
          <input
            name='completionDate'
            id='completionDate'
            type='datetime-local'
            defaultValue={editTask?.completionDate}
          />
          <label htmlFor='completionDate'>Назначить дату завершения</label>
        </div>
        <div className='formItem'>
          <input
            type='file'
            name='file'
            id='file'
            multiple
            onChange={handleOnChange}
            accept='image/*, video/*, audio/*, text/*' />
        </div>
        <div className='formItem buttonsGroup'>
          <input
            type='submit'
            className='button'
            value='Сохранить'
          />
          <input
            type='reset'
            className='button'
            value='Очистить' />
        </div>
      </form>
      <div className='imageBlock'>
        {image}
      </div>
    </main>
  )
}
