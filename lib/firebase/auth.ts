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
  console.log('[Auth] Starting sign in process for:', email);
  try {
    console.log('[Auth] Attempting Firebase authentication...');
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('[Auth] Firebase authentication successful:', userCredential.user.uid);
    
    // Get user document
    console.log('[Auth] Fetching user document...');
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    console.log('[Auth] User document exists:', userDoc.exists(), 'Data:', userDoc.data());
    
    // Update permissions
    console.log('[Auth] Updating user permissions...');
    await updateUserPermissions(userCredential.user.uid);
    console.log('[Auth] Sign in process completed successfully');
    
    return userCredential.user;
  } catch (error: any) {
    console.error('[Auth] Error during sign in:', error.code, error.message);
    // Enhance error messages for users
    switch (error.code) {
      case 'auth/invalid-email':
        throw new Error('Invalid email address format.');
      case 'auth/user-disabled':
        throw new Error('This account has been disabled.');
      case 'auth/user-not-found':
        throw new Error('No account found with this email.');
      case 'auth/wrong-password':
        throw new Error('Incorrect password.');
      default:
        throw new Error('Failed to sign in. Please try again.');
    }
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