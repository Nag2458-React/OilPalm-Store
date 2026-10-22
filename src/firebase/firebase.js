import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCk-3ddcIwleUG1uzQkgTJOWpRkTETP7JY",
  authDomain: "oilpalm-store.firebaseapp.com",
  projectId: "oilpalm-store",
  storageBucket: "oilpalm-store.firebasestorage.app",
  messagingSenderId: "576649033438",
  appId: "1:576649033438:web:e253ba0ac34929c2e7344f",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);