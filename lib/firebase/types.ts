import { db } from './config';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';

export interface ItemType {
  id?: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function getTypes(): Promise<ItemType[]> {
  try {
    const typesCollection = collection(db, 'types');
    const snapshot = await getDocs(typesCollection);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as ItemType[];
  } catch (error) {
    console.error('Error fetching types:', error);
    throw error;
  }
}

export async function addType(type: Omit<ItemType, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const typesCollection = collection(db, 'types');
    const docRef = await addDoc(typesCollection, {
      ...type,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding type:', error);
    throw error;
  }
}

export async function updateType(id: string, type: Partial<Omit<ItemType, 'id' | 'createdAt'>>): Promise<void> {
  try {
    const typeRef = doc(db, 'types', id);
    await updateDoc(typeRef, {
      ...type,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error updating type:', error);
    throw error;
  }
}

export async function deleteType(id: string): Promise<void> {
  try {
    const typeRef = doc(db, 'types', id);
    await deleteDoc(typeRef);
  } catch (error) {
    console.error('Error deleting type:', error);
    throw error;
  }
} 