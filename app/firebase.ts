import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA_LFUXZ9l6SYN2td5z9hZkkF6QGlTNhRc",
  authDomain: "sih0025.firebaseapp.com",
  projectId: "sih0025",
  storageBucket: "sih0025.appspot.com",
  messagingSenderId: "31546840310",
  appId: "1:31546840310:web:d4cbdc9205effd3a5988d7",
  measurementId: "G-PZ2MQE1FDB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);
