
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/**
 * 請在此處貼上您的 Firebase 專案設定物件。
 * 您可以從 Firebase Console -> 專案設定 -> 一般 -> 您的應用程式中取得。
 * 這裡不使用環境變數是為了確保 GitHub Pages 佈署後能直接讀取，避免 Secret 設定錯誤導致的白色畫面。
 */
const firebaseConfig = {
  apiKey: "AIzaSyAY-G8wPNEv637KDyHcD4SZt0OC-wDiIJU",
  authDomain: "smartfinance-ai-6159b.firebaseapp.com",
  projectId: "smartfinance-ai-6159b",
  storageBucket: "smartfinance-ai-6159b.firebasestorage.app",
  messagingSenderId: "1075455477926",
  appId: "1:1075455477926:web:a74bbe2471f7b9f5834c67"
};

// 檢查是否已填寫有效的 API Key (非預設佔位符)
const isValidConfig = firebaseConfig.apiKey !== "YOUR_API_KEY";

export const app = isValidConfig ? initializeApp(firebaseConfig) : null;
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;

export const isFirebaseActive = () => !!app;
