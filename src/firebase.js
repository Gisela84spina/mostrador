// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCOX3PIh6kTcL9OMCHMiL6PclMLNFDyVys",
  authDomain: "tienda-sucule66.firebaseapp.com",
  projectId: "tienda-sucule66",
  storageBucket: "tienda-sucule66.firebasestorage.app",
  messagingSenderId: "721444935008",
  appId: "1:721444935008:web:9a85ccdce56d4261bf3a05"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
