import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  type Auth,
} from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

// In AI Studio, the config is automatically generated in firebase-applet-config.json after set_up_firebase
import firebaseConfig from '../../firebase-applet-config.json';

const isConfigValid = firebaseConfig && firebaseConfig.apiKey && firebaseConfig.apiKey !== "";

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

if (isConfigValid) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    // @ts-ignore
    db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
    auth = getAuth(app);
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
}

export { db, auth };
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
  if (!auth) {
    console.error("Firebase Auth not initialized. Please check your configuration.");
    return Promise.reject("Firebase Auth not initialized");
  }
  return signInWithPopup(auth, googleProvider);
};

export const signUpWithEmail = async (email: string, password: string, displayName: string) => {
  if (!auth) return Promise.reject("Firebase Auth not initialized");
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName });
  return credential;
};

export const signInWithEmail = (email: string, password: string) => {
  if (!auth) return Promise.reject("Firebase Auth not initialized");
  return signInWithEmailAndPassword(auth, email, password);
};
