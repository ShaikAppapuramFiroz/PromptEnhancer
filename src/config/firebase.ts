// Firebase configuration for PromptCrafterAI
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBzUpTyu2gvuNM21fcikfUllcelByf6Qqc",
  authDomain: "promptcraft-2c4fa.firebaseapp.com",
  projectId: "promptcraft-2c4fa",
  storageBucket: "promptcraft-2c4fa.firebasestorage.app",
  messagingSenderId: "815923372110",
  appId: "1:815923372110:web:31e66bccaba7d97af5231f",
  measurementId: "G-SNP65QZ59S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
export default app;