// Import the functions you need from the SDKs you need
import { deleteApp, getApp, getApps, initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, setPersistence, inMemoryPersistence,browserSessionPersistence } from 'firebase/auth'

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBQh5M3IigEMBdzuTO8zx6L7W3Gx5OfXDA",
    authDomain: "assignmentapi-bbfb3.firebaseapp.com",
    databaseURL: "https://assignmentapi-bbfb3-default-rtdb.firebaseio.com",
    projectId: "assignmentapi-bbfb3",
    storageBucket: "assignmentapi-bbfb3.appspot.com",
    messagingSenderId: "247967797269",
    appId: "1:247967797269:web:9816b522590f26f84d7e1c"
  };

// Initialize Firebase
let firebaseApp;
if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig)
} else {
    firebaseApp = getApp()
    deleteApp(firebaseApp)
    firebaseApp = initializeApp(firebaseConfig)
}

export const auth = getAuth(firebaseApp)
