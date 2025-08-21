import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAlBLcon5dC-FxJKIWoZmZh7YQYmGNBuAE",
  authDomain: "mihribancagatay-d5d82.firebaseapp.com",
  projectId: "mihribancagatay-d5d82",
  storageBucket: "mihribancagatay-d5d82.appspot.com",
  messagingSenderId: "265751622576",
  appId: "1:265751622576:web:e0dd66c17be725d6b1dc75",
  measurementId: "G-Y2YQL01NQP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore Database
export const db = getFirestore(app);

// Initialize Firebase Storage
export const storage = getStorage(app);

// Initialize Analytics
export const analytics = getAnalytics(app);

export default app;
