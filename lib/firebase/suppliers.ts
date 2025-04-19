import { collection, addDoc, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from './config';

export interface Supplier {
  id?: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  category: string;
  status: 'Active' | 'Inactive';
  createdAt: Date;
}

export async function createSupplier(data: Omit<Supplier, 'createdAt' | 'id'>) {
  try {
    const supplierData = {
      ...data,
      createdAt: Timestamp.fromDate(new Date()),
    };

    const docRef = await addDoc(collection(db, 'suppliers'), supplierData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating supplier:', error);
    throw error;
  }
}

export async function getSuppliers(filters?: {
  status?: Supplier['status'];
  category?: string;
}) {
  try {
    // Create a basic query without ordering
    let q = query(collection(db, 'suppliers'));

    // Add filters if provided
    if (filters?.status) {
      q = query(q, where('status', '==', filters.status));
    }
    if (filters?.category) {
      q = query(q, where('category', '==', filters.category));
    }

    const querySnapshot = await getDocs(q);
    const suppliers = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
    })) as (Supplier & { id: string })[];

    // Sort on the client side
    return suppliers.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    throw error;
  }
} 