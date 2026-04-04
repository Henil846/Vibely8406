import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCpDLBTT0yogkPXZihvOVmNrdIJ7Zlchoo",
  authDomain: "vibely-90c57.firebaseapp.com",
  projectId: "vibely-90c57",
  storageBucket: "vibely-90c57.appspot.com",
  messagingSenderId: "184488130455",
  appId: "1:184488130455:web:1920869b844a2c3a5a76d2"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
