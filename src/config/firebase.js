// Firebase 配置文件
// 请替换为您的 Firebase 项目配置
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "simple-x-social.firebaseapp.com",
    projectId: "simple-x-social",
    storageBucket: "simple-x-social.firebasestorage.app",
    messagingSenderId: "172030826775",
    appId: "1:172030826775:web:8030f6943e67541859ff52",
    measurementId: "G-YN5M1ESJMW"
  };
  

// 初始化 Firebase
const app = initializeApp(firebaseConfig);

// 初始化服务
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
