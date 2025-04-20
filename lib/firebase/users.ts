import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "./config";

export type UserRole = "admin" | "user";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  createdAt: Date;
  lastLogin?: Date;
}

export const createUser = async (userData: Omit<User, "id" | "createdAt">) => {
  const userRef = doc(collection(db, "users"));
  const newUser: User = {
    ...userData,
    id: userRef.id,
    createdAt: new Date(),
  };
  await setDoc(userRef, newUser);
  return newUser;
};

export const getUsers = async (): Promise<User[]> => {
  const usersRef = collection(db, "users");
  const snapshot = await getDocs(usersRef);
  return snapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
    createdAt: doc.data().createdAt?.toDate(),
    lastLogin: doc.data().lastLogin?.toDate(),
  })) as User[];
};

export const updateUserRole = async (userId: string, role: UserRole) => {
  const userRef = doc(db, "users", userId);
  await setDoc(userRef, { role }, { merge: true });
};

export const deleteUser = async (userId: string) => {
  const userRef = doc(db, "users", userId);
  await deleteDoc(userRef);
};

export const getUserById = async (userId: string): Promise<User | null> => {
  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    return null;
  }

  return {
    ...userDoc.data(),
    id: userDoc.id,
    createdAt: userDoc.data().createdAt?.toDate(),
    lastLogin: userDoc.data().lastLogin?.toDate(),
  } as User;
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("email", "==", email));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];
  return {
    ...doc.data(),
    id: doc.id,
    createdAt: doc.data().createdAt?.toDate(),
    lastLogin: doc.data().lastLogin?.toDate(),
  } as User;
}; 