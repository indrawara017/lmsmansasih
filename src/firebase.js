import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC6Nn9rNIjTD2xnofZGkihPMaNlx0iSwk4",
  authDomain: "smaron-2024.firebaseapp.com",
  databaseURL: "https://smaron-2024-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smaron-2024",
  storageBucket: "smaron-2024.appspot.com",
  messagingSenderId: "949069361899",
  appId: "1:949069361899:web:87ac902bcf7408003f04ae"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, storage, provider, db, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword };