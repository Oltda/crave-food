// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp} from "firebase/app";
import {getFirestore } from "firebase/firestore";
import {getStorage } from "firebase/storage";
import {getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAoae8SdrJ-7QTSVETybCuVB8ZVkiX_Kc8",
  authDomain: "tuyen-web-5a994.firebaseapp.com",
  projectId: "tuyen-web-5a994",
  storageBucket: "tuyen-web-5a994.appspot.com",
  messagingSenderId: "998920602681",
  appId: "1:998920602681:web:d8a7493c4cfd71856f39e8"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();
const auth = getAuth();

export  {app, db, storage, auth}