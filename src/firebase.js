import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAlZANh5l-FBsvA10tlmIDxkYkVqtLSA6M",
  authDomain: "tienda-digital-3d146.firebaseapp.com",
  projectId: "tienda-digital-3d146",
  storageBucket: "tienda-digital-3d146.firebasestorage.app",
  messagingSenderId: "242143350746",
  appId: "1:242143350746:web:5f0292a3f081fab604fae3"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
