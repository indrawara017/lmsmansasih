import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCXaSOqWrEx1cP5hTuxJI16MLEbvpdf-_k",
    authDomain: "lmsmansasih.firebaseapp.com",
    projectId: "lmsmansasih",
    storageBucket: "lmsmansasih.firebasestorage.app",
    messagingSenderId: "841886054031",
    appId: "1:841886054031:web:56a4939715d651c9bce2fa",
    measurementId: "G-YXYZH9R8K4"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword };