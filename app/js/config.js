// js/config.js
// Import các hàm cần thiết từ Firebase SDK
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Cấu hình Firebase app của bạn
const firebaseConfig = {
  apiKey: "AIzaSyDo2S69P9Cl4RkSfPF_oQw2rJCf4XVNXOc",
  authDomain: "travellingapp-6f33a.firebaseapp.com",
  projectId: "travellingapp-6f33a",
  storageBucket: "travellingapp-6f33a.firebasestorage.app",
  messagingSenderId: "600684936495",
  appId: "1:600684936495:web:0c4fbd4c51b68e51f8f5da",
  measurementId: "G-B021P1LCCQ",
};

// Khởi tạo Firebase app
const app = initializeApp(firebaseConfig);

// Khởi tạo Firestore và export để dùng trong các màn hình khác
export const db = getFirestore(app);
