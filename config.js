import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyC_T1zEUFM4ZKB4eDvpCHJqfGm6ZddcAzs",
    authDomain: "cook-book-f8ae4.firebaseapp.com",
    projectId: "cook-book-f8ae4",
    storageBucket: "cook-book-f8ae4.appspot.com",
    messagingSenderId: "244902452338",
    appId: "1:244902452338:web:96fd2f601937f21d26f6eb"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
