// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "the-kopi.firebaseapp.com",
    projectId: "the-kopi",
    storageBucket: "mern-blog-1f8c6.appspot.com",
    messagingSenderId: "277324026914",
    appId: "1:277324026914:web:b4f8910d13d62db157e67b"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);