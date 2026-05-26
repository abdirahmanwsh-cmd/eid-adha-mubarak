import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCdnGCIsVodzQs2vC2IE4gtLKTB2yjoxBc",
  authDomain: "eid-adha-mubarak.firebaseapp.com",
  projectId: "eid-adha-mubarak",
  storageBucket: "eid-adha-mubarak.firebasestorage.app",
  messagingSenderId: "874924262038",
  appId: "1:874924262038:web:6fe174dec66a440fd3b8b7",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
