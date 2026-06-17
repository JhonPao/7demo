// Firebase Configuration
// ⚠️ IMPORTANTE: Reemplaza estos valores con los de tu proyecto en Firebase Console
// Ve a: Firebase Console > Tu proyecto > Configuración > General > Tus apps > Configuración del SDK
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAdPgVPYv_fGzqWjr5XTr1xDMlgn8Zt-t0",
  authDomain: "strenghtdemo.firebaseapp.com",
  projectId: "strenghtdemo",
  storageBucket: "strenghtdemo.firebasestorage.app",
  messagingSenderId: "380484924073",
  appId: "1:380484924073:web:45f9952dbaaaf214f9efb8",
  measurementId: "G-YRM3B1XMFL"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
