import { collection, addDoc, Timestamp } from 'firebase/firestore';
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
  status: 'Draft' | 'Sent';
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