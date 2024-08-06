// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAg13lmRinUhGvir1qSO7LNjrc7K75MN9o",
  authDomain: "pantry-tracker-d1266.firebaseapp.com",
  projectId: "pantry-tracker-d1266",
  storageBucket: "pantry-tracker-d1266.appspot.com",
  messagingSenderId: "390835543487",
  appId: "1:390835543487:web:e2bda37e49779b98c1150a",
  measurementId: "G-4VR551MJQQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore};