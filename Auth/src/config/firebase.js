import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  browserLocalPersistence,
  getReactNativePersistence,
} from "firebase/auth";
import { getDatabase } from "firebase/database";
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
 
const firebaseConfig = {
  apiKey: "AIzaSyCq35TJcLzEkKaKX_x9oTOhZwn_6WdLm_c",
  authDomain: "teste-deaee.firebaseapp.com",
  projectId: "teste-deaee",
  storageBucket: "teste-deaee.firebasestorage.app",
  messagingSenderId: "171092506362",
  appId: "1:171092506362:web:7cbb85edbf7dbb8e1cfb43"
};
 
const app = initializeApp(firebaseConfig);
 
const persistence =
  Platform.OS === 'web'
    ? browserLocalPersistence
    : getReactNativePersistence(AsyncStorage);
 
const auth = initializeAuth(app, { persistence });
const database = getDatabase(app);
 
export { auth, database };