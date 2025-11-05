// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDo2S69P9Cl4RkSfPF_oQw2rJCf4XVNXOc",
  authDomain: "travellingapp-6f33a.firebaseapp.com",
  projectId: "travellingapp-6f33a",
  storageBucket: "travellingapp-6f33a.firebasestorage.app",
  messagingSenderId: "600684936495",
  appId: "1:600684936495:web:0c4fbd4c51b68e51f8f5da",
  measurementId: "G-B021P1LCCQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);