import React from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { useUserDocs } from '../contexts/UserDocsContext';

/** Компонента CreateTask, которая отображает страницу создания 
 * новой задачи
 */

export const CreateTask = () => {
  const navigate = useNavigate();
  /**
   * addTask - функция, добавляющая новую задачу на сервер,
   * функция setFileTask - для установки нового значения 
   * переменной fileTask,
   * функция setFileTaskURL - для установки нового значения 
   * переменной fileTaskURL,
   * функция setImage - для установки нового значения переменной image,
   * fileTaskURL - массив ссылок на изображения,    
   * image - массив тегов со ссылками на изображения 
   * (вида [<img src={}/>, <img src={}/>, ... ]),
   * полученные из UserDocsContextProvider
   */
  const {
    addTask,
    setFileTask,
    setFileTaskURL,
    setImage,
    fileTaskURL,
    image
  } = useUserDocs();
  /** Экземпляр класса FileReader для чтения ссылки на файл */
  const fileReader = new FileReader;
  const currentDate = dayjs().format('YYYY-MM-DD HH:mm');

  /**
   * Возвращает на страницу профиля, обнуляя переменные fileTask, 
   * fileTaskURL и image */
  const handleReturn = () => {
    setFileTask(null);
    setFileTaskURL([]);
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
  /** Отправляет созданную задачу на сервер */
  function handleSubmit(e) {
    e.preventDefault();
    const { target: { title, description, completionDate }
    } = e;
    const now = dayjs();
    const task = {
      title: title.value,
      description: description.value,
      createdAt: now.$d,
      file: fileTaskURL,
      completionDate: completionDate.value,
      status: false
    }
    try {
      addTask(task);
      setFileTask(null);
      setFileTaskURL([]);
      setImage([]);
      navigate('/profile');
    } catch (err) {
      console.log(err.message)
    }
  }

  return (
    <main>
      <h1 className='formTitle'>Создать задачу</h1>
      <button className='button returnButton' onClick={handleReturn}>Вернуться</button>
      <form className='form' method='post' onSubmit={handleSubmit}>
        <div className='formItem'>
          <input
            name='title'
            id='title'
            placeholder='Название'
            required
            autoFocus />
        </div>
        <div className='formItem'>
          <textarea
            name='description'
            id='description'
            placeholder='Описание'
            required
            rows='5'>
          </textarea>
        </div>
        <div className='formItem'>
          <input
            name='completionDate'
            id='completionDate'
            type='datetime-local'
            defaultValue={currentDate} />
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
            value='Создать' />
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
