import { collection, addDoc, Timestamp, getDocs, query, orderBy, where, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './config';

export interface PurchaseOrder {
  poNumber: string;
  projectRef: string;
  orderDate: Date;
  deliveryDate: Date;
  supplier: string;
  lineItems: Array<{
    type: string;
    description: string;
    quantity: number;
    unitPrice: number;
    taxPercent: number;
    totalPrice: number;
  }>;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  status: 'Draft' | 'Sent' | 'Received' | 'Pending' | 'Closed';
  createdAt: Date;
}

export async function createPurchaseOrder(data: Omit<PurchaseOrder, 'createdAt'>) {
  try {
    const purchaseOrderData = {
      ...data,
      createdAt: Timestamp.fromDate(new Date()),
      orderDate: Timestamp.fromDate(data.orderDate),
      deliveryDate: Timestamp.fromDate(data.deliveryDate),
    };

    const docRef = await addDoc(collection(db, 'purchaseOrders'), purchaseOrderData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating purchase order:', error);
    throw error;
  }
}

export async function getPurchaseOrders(filters?: {
  status?: PurchaseOrder['status'];
  supplier?: string;
  itemType?: string;
}) {
  try {
    let q = query(collection(db, 'purchaseOrders'), orderBy('createdAt', 'desc'));

    // Apply filters if provided
    if (filters?.status) {
      q = query(q, where('status', '==', filters.status));
    }
    if (filters?.supplier) {
      q = query(q, where('supplier', '==', filters.supplier));
    }
    // Note: Filtering by item type would require a different data structure or array-contains query

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        orderDate: data.orderDate.toDate(),
        deliveryDate: data.deliveryDate.toDate(),
        createdAt: data.createdAt.toDate(),
      } as PurchaseOrder & { id: string };
    });
  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    throw error;
  }
}

export async function deletePurchaseOrder(id: string) {
  try {
    await deleteDoc(doc(db, 'purchaseOrders', id));
  } catch (error) {
    console.error('Error deleting purchase order:', error);
    throw error;
  }
}

export async function getPurchaseOrder(id: string): Promise<PurchaseOrder & { id: string }> {
  try {
    const docRef = doc(db, 'purchaseOrders', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('Purchase order not found');
    }

    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      orderDate: data.orderDate.toDate(),
      deliveryDate: data.deliveryDate.toDate(),
      createdAt: data.createdAt.toDate(),
    } as PurchaseOrder & { id: string };
  } catch (error) {
    console.error('Error fetching purchase order:', error);
    throw error;
  }
}

export async function updatePurchaseOrder(id: string, data: Omit<PurchaseOrder, 'createdAt'>) {
  try {
    const purchaseOrderData = {
      ...data,
      orderDate: Timestamp.fromDate(data.orderDate),
      deliveryDate: Timestamp.fromDate(data.deliveryDate),
    };

    await updateDoc(doc(db, 'purchaseOrders', id), purchaseOrderData);
  } catch (error) {
    console.error('Error updating purchase order:', error);
    throw error;
  }
} 