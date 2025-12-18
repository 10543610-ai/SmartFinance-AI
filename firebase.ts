
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const getFirebaseConfig = () => {
  const configStr = process.env.FIREBASE_CONFIG;
  if (!configStr) return null;
  try {
    return JSON.parse(configStr);
  } catch (e) {
    console.error("Firebase Config Parsing Error", e);
    return null;
  }
};

const config = getFirebaseConfig();

// 如果沒有配置，則返回 null 讓 App 進入展示模式
export const app = config ? initializeApp(config) : null;
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;

export const isFirebaseActive = () => !!app;
