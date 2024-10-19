// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDe5qLDqaFCiHYiqMDgd4vbKM_pwcnIKbw",
  authDomain: "ezuru-646e1.firebaseapp.com",
  databaseURL: "https://ezuru-646e1-default-rtdb.firebaseio.com",
  projectId: "ezuru-646e1",
  storageBucket: "ezuru-646e1.appspot.com",
  messagingSenderId: "647443711045",
  appId: "1:647443711045:web:51623741b55562c955cf2c",
  measurementId: "G-Q06TZ5E4FM"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
