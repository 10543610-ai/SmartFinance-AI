
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/**
 * 請在此處貼上您的 Firebase 專案設定物件。
 * 您可以從 Firebase Console -> 專案設定 -> 一般 -> 您的應用程式中取得。
 * 這裡不使用環境變數是為了確保 GitHub Pages 佈署後能直接讀取，避免 Secret 設定錯誤導致的白色畫面。
 */
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// 檢查是否已填寫有效的 API Key (非預設佔位符)
const isValidConfig = firebaseConfig.apiKey !== "YOUR_API_KEY";

export const app = isValidConfig ? initializeApp(firebaseConfig) : null;
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;

export const isFirebaseActive = () => !!app;
