import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import firebaseConfigData from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: firebaseConfigData.apiKey,
  authDomain: firebaseConfigData.authDomain,
  projectId: firebaseConfigData.projectId,
  storageBucket: firebaseConfigData.storageBucket,
  messagingSenderId: firebaseConfigData.messagingSenderId,
  appId: firebaseConfigData.appId,
};

// Initialize Firebase App
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const customDatabaseId = firebaseConfigData.firestoreDatabaseId && firebaseConfigData.firestoreDatabaseId !== '(default)'
  ? firebaseConfigData.firestoreDatabaseId
  : undefined;

// Initialize Firestore with forced long-polling to prevent 10-second WebChannel stream timeouts in iframe/proxy environments
export const db: Firestore = initializeFirestore(
  app,
  {
    experimentalForceLongPolling: true,
  },
  customDatabaseId
);

// Initialize Firebase Auth
export const auth: Auth = getAuth(app);
