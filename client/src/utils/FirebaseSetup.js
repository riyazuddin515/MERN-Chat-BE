// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCCmS3bjwRh-_Ws8UX6XIJc-Georfik8Hs",
    authDomain: "mern-chat-r515.firebaseapp.com",
    projectId: "mern-chat-r515",
    storageBucket: "mern-chat-r515.appspot.com",
    messagingSenderId: "984032072025",
    appId: "1:984032072025:web:e3d75f410625137e817c48"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);