import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User as FirebaseUser,
  Auth
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp, Firestore } from 'firebase/firestore';
import { auth as firebaseAuth, db as firebaseDB } from './config';
import type { User } from '@/lib/types/auth';

// Ensure Firebase services are initialized
if (!firebaseAuth || !firebaseDB) {
  throw new Error('Firebase services not initialized');
}

// Assert types after initialization check
const auth = firebaseAuth as Auth;
const db = firebaseDB as Firestore;

export async function createUser(email: string, password: string, name: string, role: 'admin' | 'user' = 'user') {
  try {
    // Create the user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create the user document in Firestore with role and permissions
    const userData = {
      email,
      name,
      role,
      permissions: role === 'admin' ? {
        canManageUsers: true,
        canViewReports: true,
        canManageSettings: true
      } : {
        canManageUsers: false,
        canViewReports: false,
        canManageSettings: false
      },
      createdAt: serverTimestamp(),
    };

    await setDoc(doc(db, 'users', user.uid), userData);
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function createAdminUser(email: string, password: string, name: string) {
  return createUser(email, password, name, 'admin');
}

export async function signIn(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // Update permissions after successful sign in
    await updateUserPermissions(userCredential.user.uid);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
}

export async function signOut() {
  return firebaseSignOut(auth);
}

export async function getCurrentUserRole(userId: string): Promise<'admin' | 'user' | null> {
  console.log('Getting user role for:', userId);
  
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    console.log('User document exists:', userDoc.exists(), 'Data:', userDoc.data());
    
    if (!userDoc.exists()) {
      console.log('No user document found');
      return null;
    }
    
    const userData = userDoc.data();
    const role = userData.role as 'admin' | 'user';
    console.log('User role:', role);
    
    if (role !== 'admin' && role !== 'user') {
      console.warn('Invalid role found:', role);
      return 'user'; // Default to user if invalid role
    }
    
    return role;
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
}

export async function updateUserPermissions(userId: string) {
  console.log('Updating permissions for user:', userId);
  
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      console.log('No user document found');
      return;
    }

    const userData = userDoc.data();
    const role = userData.role;

    // Update the user document with permissions
    const permissions = role === 'admin' ? {
      canManageUsers: true,
      canViewReports: true,
      canManageSettings: true
    } : {
      canManageUsers: false,
      canViewReports: false,
      canManageSettings: false
    };

    await setDoc(doc(db, 'users', userId), {
      ...userData,
      permissions
    }, { merge: true });

    console.log('User permissions updated successfully');
  } catch (error) {
    console.error('Error updating user permissions:', error);
    throw error;
  }
} 