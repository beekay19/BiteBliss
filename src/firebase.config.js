// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore'


const firebaseConfig = {
  apiKey: "AIzaSyDaK6oq696ErTvYVDxeUPAq-W_0Nlipd-4",
  authDomain: "food-agency-1eed6.firebaseapp.com",
  projectId: "food-agency-1eed6",
  storageBucket: "food-agency-1eed6.appspot.com",
  messagingSenderId: "900591459008",
  appId: "1:900591459008:web:0b788e47f99ef334ce6b25",
  measurementId: "G-V08GC07V69"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore()