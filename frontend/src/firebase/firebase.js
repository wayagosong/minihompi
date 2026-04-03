import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB3U04WPfu94TzP_3axnbI1rPKyRi48mFc",
  authDomain: "minihompi.firebaseapp.com",
  projectId: "minihompi",
  storageBucket: "minihompi.firebasestorage.app",
  messagingSenderId: "659567272405",
  appId: "1:659567272405:web:995546d0a007798de01d5c",
  measurementId: "G-WTERFFJN61"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
// const analytics = getAnalytics(app); // Optional for this app

export { db, storage };
