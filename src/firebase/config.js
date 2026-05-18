import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// FAKE CONFIGURATION to bypass build errors
const firebaseConfig = {
  apiKey: "AIzaSyFakeKeyThatWillPassTheBuildError",
  authDomain: "fake-project.firebaseapp.com",
  projectId: "fake-project-123",
  storageBucket: "fake-project-123.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:1234567890abcdef"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;