import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp,
  type DocumentData
} from 'firebase/firestore';
import { db } from './firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {}, // In a real app, populate with auth.currentUser info
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const getLatestWeight = async (userId: string, exerciseId: string) => {
  if (!db) return null;
  const path = `users/${userId}/weights/${exerciseId}`;
  try {
    const docRef = doc(db, path);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
};

export const saveWeight = async (userId: string, exerciseId: string, weight: number, reps: number) => {
  if (!db) return;
  const path = `users/${userId}/weights/${exerciseId}`;
  try {
    await setDoc(doc(db, path), {
      exerciseId,
      weight,
      reps,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const saveSession = async (userId: string, sessionData: any) => {
  if (!db) return;
  const path = `users/${userId}/sessions`;
  try {
    const sessionRef = doc(collection(db, path));
    await setDoc(sessionRef, {
      ...sessionData,
      userId,
      date: serverTimestamp()
    });
    
    // Also update user's last trained info
    const userProfPath = `users/${userId}/public/prof`;
    await setDoc(doc(db, userProfPath), {
      userId,
      displayName: sessionData.userName || 'User',
      lastWorkoutId: sessionData.workoutId,
      lastWorkoutDate: serverTimestamp()
    }, { merge: true });
    
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const getUserProfile = async (userId: string) => {
  if (!db) return null;
  const path = `users/${userId}/public/prof`;
  try {
    const docSnap = await getDoc(doc(db, path));
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
};

export const getSessions = async (userId: string) => {
  if (!db) return [];
  const path = `users/${userId}/sessions`;
  try {
    const q = query(collection(db, path), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    const sessions: any[] = [];
    querySnapshot.forEach((doc) => {
      sessions.push({ id: doc.id, ...doc.data() });
    });
    return sessions;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
};

export const getCustomWorkouts = async (userId: string) => {
  if (!db) return null;
  const path = `users/${userId}/config/workouts`;
  try {
    const docSnap = await getDoc(doc(db, path));
    return docSnap.exists() ? docSnap.data().workouts : null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
};

export const saveCustomWorkouts = async (userId: string, workouts: any[]) => {
  if (!db) return;
  const path = `users/${userId}/config/workouts`;
  try {
    await setDoc(doc(db, path), {
      workouts,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};
