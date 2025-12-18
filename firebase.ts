import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/**
 * 直接填寫 Firebase 配置以確保佈署後環境一致。
 */
const firebaseConfig = {
  apiKey: "AIzaSyAY-G8wPNEv637KDyHcD4SZt0OC-wDiIJU",
  authDomain: "smartfinance-ai-6159b.firebaseapp.com",
  projectId: "smartfinance-ai-6159b",
  storageBucket: "smartfinance-ai-6159b.firebasestorage.app",
  messagingSenderId: "1075455477926",
  appId: "1:1075455477926:web:a74bbe2471f7b9f5834c67"
};

const initFirebase = () => {
  try {
    // 檢查 API Key 是否為佔位符
    if (firebaseConfig.apiKey.includes("YOUR_")) {
      return { app: null, auth: null, db: null };
    }
    const app = initializeApp(firebaseConfig);
    return {
      app,
      auth: getAuth(app),
      db: getFirestore(app)
    };
  } catch (error) {
    console.error("Firebase Initialization Error:", error);
    return { app: null, auth: null, db: null };
  }
};

const { app, auth, db } = initFirebase();

export { app, auth, db };
export const isFirebaseActive = () => !!app;