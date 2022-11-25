import {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../firebase-config';

const userAuthContext = createContext();
/**  
 * Принимает параметром входящие компоненты, которые, при необходимости, смогут получить доступ к ее переменным и функциям
*/
export function UserAuthContextProvider({ children }) {
  /** 
  * переменные user, authId и функции setUser, setAuthId - 
  * устанавливающие новые значения данных переменных */
  const [user, setUser] = useState(null);
  const [authId, setAuthId] = useState(1);

  /**
   * Вызывает встроенную функцию firebase для регистрации 
   * нового пользователя
   * @param {string} email - электронная почта пользователя 
   * @param {string} password - пароль пользователя
   * @returns {Promise<UserCredential>} - экземпляр класса User
   */
  function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  /**
   * Вызывает встроенную функцию firebase для аутентификации
   * пользователя
   * @param {string} email - электронная почта пользователя
   * @param {string} password - пароль пользователя
   * @returns {Promise<UserCredential>} - экземпляр класса User
   */

  function logIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  /**
   * Вызывает встроенную функцию firebase для выхода из аккаунта
   * @returns {Promise<void>} 
   */

  function logOut() {
    setUser(null);
    return signOut(auth);
  }

  useEffect(() => {
    /** Устанавливает наблюдение за состоянием входа пользователя,
     * используя встроенный метод firebase
     */
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => { unsubscribe() }
  }, [])

  return (
    <userAuthContext.Provider value={{ user, signUp, logIn, logOut, authId, setAuthId }}>
      {children}
    </userAuthContext.Provider>
  )
}
/** Дает компонентам, в которых вызывается данная функция доступ
 * к переменным и функциям UserAuthContextProvider */
export function useUserAuth() {
  return useContext(userAuthContext);
}