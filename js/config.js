import { initializeApp } from "firebase/app";
import { browserLocalPersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDo2S69P9Cl4RkSfPF_oQw2rJCf4XVNXOc",
  authDomain: "travellingapp-6f33a.firebaseapp.com",
  projectId: "travellingapp-6f33a",
  storageBucket: "travellingapp-6f33a.firebasestorage.app",
  messagingSenderId: "600684936495",
  appId: "1:600684936495:web:0c4fbd4c51b68e51f8f5da",
};
// Khởi tạo Firebase App
const app = initializeApp(firebaseConfig);

// Khởi tạo Auth với persistence AsyncStorage fallback
const auth = initializeAuth(app, {
  persistence: browserLocalPersistence, // React Native sẽ fallback vào local storage
});

// Khởi tạo Firestore
const db = getFirestore(app);

export { auth, db };
