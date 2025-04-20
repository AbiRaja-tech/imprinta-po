'use server';

import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';

const firebaseAdminConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  // Remove quotes from the private key string and replace \\n with actual newlines
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/["\\]+/g, '').replace(/\\n/g, '\n'),
};

let auth: Auth;
let app: App;

// Only initialize if no apps exist
if (!getApps().length) {
  try {
    app = initializeApp({
      credential: cert(firebaseAdminConfig),
    });
    auth = getAuth(app);
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
    throw error;
  }
} else {
  auth = getAuth();
}

export { auth }; 