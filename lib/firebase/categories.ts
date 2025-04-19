import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { db } from './config'

export interface Category {
  id: string
  name: string
}

export async function getCategories() {
  const categoriesRef = collection(db, 'categories')
  const snapshot = await getDocs(categoriesRef)
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Category[]
}

export async function createCategory(category: Omit<Category, 'id'>) {
  const categoriesRef = collection(db, 'categories')
  const docRef = await addDoc(categoriesRef, category)
  return {
    id: docRef.id,
    ...category
  }
}

export async function updateCategory(id: string, category: Partial<Category>) {
  const categoryRef = doc(db, 'categories', id)
  await updateDoc(categoryRef, category)
}

export async function deleteCategory(id: string) {
  const categoryRef = doc(db, 'categories', id)
  await deleteDoc(categoryRef)
} 