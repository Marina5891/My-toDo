import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyADNSoB49gqAeDj-dKni4NPRaRYAnVYnEA",
  authDomain: "my-todo-e3b08.firebaseapp.com",
  projectId: "my-todo-e3b08",
  storageBucket: "my-todo-e3b08.appspot.com",
  messagingSenderId: "1001377881006",
  appId: "1:1001377881006:web:d08e0c70c13fd895d8063f"
};

/* export function getFirebaseConfig() {
  if (!firebaseConfig || !firebaseConfig.apiKey) {
    throw new Error('No Firebase configuration object provided.' + '\n' +
      'Add your web app\'s configuration object to firebase-config.js');
  } else {
    return firebaseConfig;
  } 
}*/
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
